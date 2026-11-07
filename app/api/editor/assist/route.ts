import { NextRequest, NextResponse } from 'next/server';
import {
  buildInteractionGenerationConfig,
  extractInteractionText,
  geminiKeyPool,
  normalizeThinkingLevel,
  safeParseInteractionJson,
  withHeartbeatStream,
} from '@/lib/gemini-server';
import {
  createRequestId,
  KeyAttemptTrace,
  logger,
  ServerDebugTrace,
} from '@/lib/logger';
import { GlossaryEntry } from '@/lib/types';
import {
  buildContextualGlossaryPromptSection,
  materializeBlocksToChapter,
  splitRawIntoBlocks,
  splitTranslatedBodyIntoParagraphs,
} from '@/lib/block-engine';
import { normalizeVietnameseText } from '@/lib/storage';
import {
  DEFAULT_EDITORIAL_INSTRUCTION_ID,
  DEFAULT_INSTRUCTION_PROFILES,
} from '@/lib/seed-data';

const FALLBACK_EDITORIAL_SYSTEM_PROMPT =
  DEFAULT_INSTRUCTION_PROFILES.find(
    (p) => p.id === DEFAULT_EDITORIAL_INSTRUCTION_ID
  )?.systemInstruction || '';

interface DirtyBlockTarget {
  id: string;
  source: string;
  translation: string;
  contextBefore?: string;
  contextAfter?: string;
}

type AssistAction =
  | 'polish'
  | 'fix_pronouns'
  | 'fix_qa'
  | 'alternatives'
  | 'translate_title'
  | 'block_cleanup'
  | 'realign_chapter'
  | 'custom';

export async function POST(req: NextRequest) {
  return withHeartbeatStream(req, async () => {
    const reqId =
      req.headers.get('x-mhc-request-id') || createRequestId('ai_editor');
    const routeStartMs = Date.now();
    let selectedModel = 'gemini-flash-latest';
    let cleanFallbackModel: string | undefined;
    let resolvedThinkingLevel = normalizeThinkingLevel('high');
    let actionForTrace: string = 'polish';

    try {
      geminiKeyPool.syncFromRequest(req);
      const body = await req.json();
    const {
      action = 'polish',
      selectedText = '',
      surroundingContext = '',
      rawReference = '',
      titleRaw = '',
      rawContent = '',
      titleTranslated = '',
      translatedContent = '',
      pronounRule = '',
      systemInstruction = '',
      customPrompt = '',
      includeGlossary = false,
      glossary = [],
      targets = [],
      chapterNumber,
      model,
      fallbackModel,
      thinkingLevel,
    } = body as {
      action: AssistAction;
      selectedText?: string;
      surroundingContext?: string;
      rawReference?: string;
      titleRaw?: string;
      rawContent?: string;
      titleTranslated?: string;
      translatedContent?: string;
      pronounRule?: string;
      systemInstruction?: string;
      customPrompt?: string;
      includeGlossary?: boolean;
      glossary?: GlossaryEntry[];
      targets?: DirtyBlockTarget[];
      chapterNumber?: number;
      model?: string;
      fallbackModel?: string;
      thinkingLevel?: string;
    };

    actionForTrace = action;
    resolvedThinkingLevel = normalizeThinkingLevel(thinkingLevel);

    selectedModel =
      typeof model === 'string' && model.trim()
        ? model.trim()
        : 'gemini-flash-latest';

    cleanFallbackModel =
      typeof fallbackModel === 'string' && fallbackModel.trim()
        ? fallbackModel.trim()
        : undefined;

    logger.info(
      'AI_EDITOR',
      `▶ Bắt đầu AI Editor (action=${action}, model=${selectedModel}, thinkingLevel=${resolvedThinkingLevel}, targets=${targets?.length || 0}, selectedTextChars=${selectedText.length || translatedContent.length})`,
      {
        reqId,
        action,
        chapterNumber,
        targetsCount: targets?.length || 0,
        selectedTextChars: selectedText.length || translatedContent.length,
        includeGlossary,
        selectedModel,
        fallbackModel: cleanFallbackModel,
        thinkingLevel: resolvedThinkingLevel,
      },
      reqId
    );

    const isBlockTargetMode =
      Array.isArray(targets) &&
      targets.length > 0 &&
      (action === 'block_cleanup' ||
        action === 'polish' ||
        action === 'fix_pronouns' ||
        action === 'custom');

    let glossaryNote = '';
    if (includeGlossary && Array.isArray(glossary) && glossary.length > 0) {
      const combinedSource = isBlockTargetMode
        ? targets.map((t) => t.source || '').join('\n')
        : action === 'realign_chapter'
          ? `${titleRaw}\n${rawContent}`
          : `${rawReference}\n${selectedText}`;
      const combinedTranslated = isBlockTargetMode
        ? targets
            .map(
              (t) =>
                `${t.contextBefore || ''} ${t.translation || ''} ${t.contextAfter || ''}`
            )
            .join('\n')
        : action === 'realign_chapter'
          ? `${titleTranslated}\n${translatedContent}`
          : `${selectedText}\n${surroundingContext}`;
      const contextual = buildContextualGlossaryPromptSection(
        glossary,
        combinedSource,
        combinedTranslated,
        chapterNumber
      );
      glossaryNote = contextual.promptSection;
    }

    const baseEditorialInstruction = systemInstruction.trim()
      ? systemInstruction.trim()
      : FALLBACK_EDITORIAL_SYSTEM_PROMPT;

    const pronounNote = pronounRule.trim()
      ? `\n\n[QUY TẮC XƯNG HÔ BỔ SUNG CỦA BỘ TRUYỆN]: ${pronounRule.trim()}`
      : '';

    const systemPrompt = `${baseEditorialInstruction}${pronounNote}${glossaryNote}`;

    // MODE 0: Full-Chapter Re-Alignment & Editorial (`realign_chapter` — uses `{ updates: [{ id, translation }] }` per Mode B of 1.14.1 & 1.14.0 Editorial Presets)
    if (action === 'realign_chapter') {
      if (!rawContent || !rawContent.trim()) {
        return NextResponse.json(
          { error: 'Chương thiếu nguyên bản tiếng Trung (rawContent) để căn chỉnh lại đoạn 1:1.' },
          { status: 400 }
        );
      }

      const rawBlocks = splitRawIntoBlocks(titleRaw, rawContent);
      const expectedBlockIds = rawBlocks.map((b) => b.id);
      const rawBodyCount = Math.max(0, rawBlocks.length - 1);
      const draftParagraphs = splitTranslatedBodyIntoParagraphs(
        translatedContent,
        rawBodyCount,
        'auto'
      );

      const fullChapterTargets = rawBlocks.map((b, idx) => {
        if (b.id === 'TITLE') {
          return {
            id: 'TITLE',
            source: b.source,
            translation: titleTranslated || '',
          };
        }
        const bodyIdx = idx - 1;
        return {
          id: b.id,
          source: b.source,
          translation: draftParagraphs[bodyIdx] || '',
        };
      });

      const fullRealignSystemPrompt = `${systemPrompt}

[GIAO THỨC CẬP NHẬT BLOCK TOÀN CHƯƠNG]:
Đối chiếu toàn bộ danh sách \`targets\` (từ "TITLE", "P0001" đến "P${String(rawBodyCount).padStart(4, '0')}") với bản dịch hiện tại (\`existingVietnameseDraft\`). Tận dụng tối đa câu chữ đã dịch tốt nhưng phân bổ lại (tách đoạn bị gộp, gộp đoạn bị tách thừa, dịch bù phần thiếu, dọn sạch chữ Hán và lỗi "But") để trả về đúng schema \`{"updates":[{"id":"TITLE","translation":"Chương ${chapterNumber || 1}: ..."},{"id":"P0001","translation":"..."}]}\` khớp 100% mọi \`id\` trong \`targets\` theo đúng thứ tự.`;

      const wirePayload = JSON.stringify(
        {
          protocol: 'GIAO THỨC CẬP NHẬT BLOCK',
          chapterNumber: chapterNumber || 1,
          targets: fullChapterTargets,
          existingVietnameseDraft: {
            title: titleTranslated || '',
            paragraphs: draftParagraphs,
          },
        },
        null,
        2
      );

      const idPropertySchema: Record<string, unknown> = {
        type: 'string',
        description:
          'Mã định danh block nguyên gốc (TITLE, P0001, P0002...). Phải khớp 1:1 với targets.',
      };
      if (expectedBlockIds.length <= 64) {
        idPropertySchema.enum = expectedBlockIds;
      }

      const {
        result: rawJson,
        keyIndexUsed,
        totalKeys,
        modelUsed,
        didFallback,
        attempts,
      } = await geminiKeyPool.executeWithKeyRotation(
        async (ai, slotInfo) => {
          const interaction = await ai.interactions.create({
            model: slotInfo.activeModel,
            store: false,
            system_instruction: fullRealignSystemPrompt,
            input: wirePayload,
            generation_config: buildInteractionGenerationConfig(
              resolvedThinkingLevel,
              undefined,
              slotInfo.activeModel
            ),
            response_format: {
              type: 'object',
              properties: {
                updates: {
                  type: 'array',
                  description:
                    'Danh sách đầy đủ các block đã biên tập và căn chỉnh 1:1 theo đúng thứ tự targets (bắt đầu bằng TITLE, tiếp theo là P0001, P0002...).',
                  items: {
                    type: 'object',
                    properties: {
                      id: idPropertySchema,
                      translation: {
                        type: 'string',
                        description:
                          'Toàn bộ nội dung tiếng Việt đã biên tập và căn chỉnh của block cùng ID.',
                      },
                    },
                    required: ['id', 'translation'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['updates'],
              additionalProperties: false,
            },
          });

          const parsed = safeParseInteractionJson<{
            updates?: Array<{ id: string; translation: string }>;
            blocks?: Array<{ id: string; translation: string }>;
          }>(extractInteractionText(interaction), `RealignChapter[${reqId}]`);

          const list = Array.isArray(parsed.updates)
            ? parsed.updates
            : Array.isArray(parsed.blocks)
              ? parsed.blocks
              : [];

          if (list.length === 0) {
            throw new Error(
              '[RETRYABLE_MODEL_OUTPUT] Model trả về mảng updates rỗng khi biên tập chương.'
            );
          }
          return list;
        },
        selectedModel,
        cleanFallbackModel,
        {
          reqId,
          endpoint: '/api/editor/assist',
          label: `realign_chapter #${chapterNumber || 1} (${rawBlocks.length} blocks • draft=${draftParagraphs.length} • thinking=${resolvedThinkingLevel})`,
          signal: req.signal,
        }
      );

      const cleanedBlocks = (rawJson || []).map((b) => {
        const cleanId = String(b.id || '').trim();
        const rawTr = normalizeVietnameseText(String(b.translation || ''));
        return {
          id: cleanId,
          translation:
            cleanId === 'TITLE'
              ? rawTr.replace(/\r?\n+/g, ' ').trim()
              : rawTr
                  .replace(/\r\n/g, '\n')
                  .replace(/\n[ \t]*\n+/g, '\n')
                  .trim(),
        };
      });

      const materialized = materializeBlocksToChapter(
        cleanedBlocks,
        rawBlocks,
        chapterNumber || 1
      );

      const routeDurationMs = Date.now() - routeStartMs;
      const debugTrace: ServerDebugTrace = {
        reqId,
        endpoint: '/api/editor/assist',
        startedAt: new Date(routeStartMs).toISOString(),
        totalDurationMs: routeDurationMs,
        requestedModel: selectedModel,
        fallbackModel: cleanFallbackModel,
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyIndexUsed,
        totalPoolKeys: totalKeys,
        inputSummary: {
          action,
          chapterNumber,
          rawBlocks: rawBlocks.length,
          draftParagraphs: draftParagraphs.length,
          thinkingLevel: resolvedThinkingLevel,
        },
        outputSummary: {
          returnedBlocks: cleanedBlocks.length,
          isAligned: materialized.alignment.isAligned,
          missingIdsCount: materialized.missingIds.length,
        },
        attempts,
      };

      logger.info(
        'AI_EDITOR',
        `✔ Hoàn tất Biên tập & Căn chỉnh toàn Chương #${chapterNumber || 1}: ${materialized.alignment.translatedBlockCount}/${materialized.alignment.rawBlockCount} đoạn (aligned=${materialized.alignment.isAligned}) sau ${(routeDurationMs / 1000).toFixed(2)}s`,
        {
          reqId,
          chapterNumber,
          isAligned: materialized.alignment.isAligned,
          modelUsed,
          thinkingLevel: resolvedThinkingLevel,
        },
        reqId,
        routeDurationMs
      );

      return NextResponse.json({
        titleTranslated: materialized.titleTranslated,
        translatedContent: materialized.translatedContent,
        alignment: materialized.alignment,
        missingIds: materialized.missingIds,
        emptyIds: materialized.emptyIds,
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyUsed: keyIndexUsed,
        totalKeys,
        debugTrace,
      });
    }

    // MODE 1: Targeted Block-ID AI Assist (`block_cleanup`, `polish`, `fix_pronouns`, `custom` with `targets` — Chế độ B của Preset Biên tập 1.14.1 & 1.14.0: returns `{ updates: [{ id, translation }] }`)
    if (isBlockTargetMode || action === 'block_cleanup') {
      if (!Array.isArray(targets) || targets.length === 0) {
        return NextResponse.json(
          { error: 'Không có Block ID nào cần biên tập.' },
          { status: 400 }
        );
      }

      const targetIds = targets.map((t) => t.id);

      const normalizedTargets = targets.map((t) => ({
        id: t.id,
        source: t.source || '',
        translation: t.translation || '',
        ...(t.contextBefore ? { contextBefore: t.contextBefore } : {}),
        ...(t.contextAfter ? { contextAfter: t.contextAfter } : {}),
      }));

      let blockGoal =
        'Dọn chữ Hán hoặc “But” theo block ID: chỉ cập nhật các ID trong targets và trả về {"updates":[{"id":"...","translation":"..."}]}.';
      if (action === 'polish') {
        blockGoal =
          'Trôi chảy (Làm câu mượt hơn) theo block ID: đối chiếu nguyên văn (source) và ngữ cảnh (contextBefore/contextAfter), chuốt lại câu chữ tiếng Việt của target cho tự nhiên, sáng rõ, giàu nhịp điệu nhưng giữ nguyên 100% nghĩa, rồi trả về {"updates":[{"id":"...","translation":"..."}]}.';
      } else if (action === 'fix_pronouns') {
        blockGoal = `Thuật ngữ & Xưng hô theo block ID: đối chiếu nguyên văn (source), ngữ cảnh xung quanh (contextBefore/contextAfter) và quy tắc xưng hô (${pronounRule || 'theo vai vế, quan hệ'}) để đồng bộ lại đại từ xưng hô trong target, rồi trả về {"updates":[{"id":"...","translation":"..."}]}.`;
      } else if (action === 'custom') {
        blockGoal = `Tùy chỉnh theo block ID (${customPrompt.trim() || 'Sửa câu văn tự nhiên, chuẩn xác theo nguyên văn'}): chỉ cập nhật các ID trong targets và trả về {"updates":[{"id":"...","translation":"..."}]}.`;
      }

      const wirePayload = JSON.stringify(
        {
          protocol: 'GIAO THỨC CẬP NHẬT BLOCK',
          goal: blockGoal,
          targets: normalizedTargets,
        },
        null,
        2
      );

      const idPropertySchema: Record<string, unknown> = {
        type: 'string',
        description: 'Mã Block ID trong targets (TITLE, P0001, P0002...).',
      };
      if (targetIds.length <= 64) {
        idPropertySchema.enum = targetIds;
      }

      const {
        result: rawJson,
        keyIndexUsed,
        totalKeys,
        modelUsed,
        didFallback,
        attempts,
      } = await geminiKeyPool.executeWithKeyRotation(
        async (ai, slotInfo) => {
          const interaction = await ai.interactions.create({
            model: slotInfo.activeModel,
            store: false,
            system_instruction: systemPrompt,
            input: wirePayload,
            generation_config: buildInteractionGenerationConfig(
              resolvedThinkingLevel,
              undefined,
              slotInfo.activeModel
            ),
            response_format: {
              type: 'object',
              properties: {
                updates: {
                  type: 'array',
                  description:
                    'Danh sách các block đã được sửa tương ứng 1:1 với mọi target ID trong targets.',
                  items: {
                    type: 'object',
                    properties: {
                      id: idPropertySchema,
                      translation: {
                        type: 'string',
                        description:
                          'Toàn bộ nội dung đã sửa của block này (sạch chữ Hán sót và lỗi But/tiếng Anh thừa).',
                      },
                    },
                    required: ['id', 'translation'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['updates'],
              additionalProperties: false,
            },
          });

          const parsed = safeParseInteractionJson<{
            updates?: Array<{ id: string; translation: string }>;
          }>(extractInteractionText(interaction), `BlockAssist:${action}[${reqId}]`);
          if (!Array.isArray(parsed.updates) || parsed.updates.length === 0) {
            throw new Error(
              '[RETRYABLE_MODEL_OUTPUT] Model trả về mảng updates rỗng khi biên tập block.'
            );
          }
          return parsed;
        },
        selectedModel,
        cleanFallbackModel,
        {
          reqId,
          endpoint: '/api/editor/assist',
          label: `${action}_blocks (${targets.length} blocks • thinking=${resolvedThinkingLevel})`,
          signal: req.signal,
        }
      );
      const cleanedUpdates = (rawJson.updates || []).map((u) => {
        const cleanId = String(u.id || '').trim();
        const rawTr = normalizeVietnameseText(String(u.translation || ''));
        return {
          id: cleanId,
          translation:
            cleanId === 'TITLE'
              ? rawTr.replace(/\r?\n+/g, ' ').trim()
              : rawTr
                  .replace(/\r\n/g, '\n')
                  .replace(/\n[ \t]*\n+/g, '\n')
                  .trim(),
        };
      });

      const routeDurationMs = Date.now() - routeStartMs;
      const debugTrace: ServerDebugTrace = {
        reqId,
        endpoint: '/api/editor/assist',
        startedAt: new Date(routeStartMs).toISOString(),
        totalDurationMs: routeDurationMs,
        requestedModel: selectedModel,
        fallbackModel: cleanFallbackModel,
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyIndexUsed,
        totalPoolKeys: totalKeys,
        inputSummary: {
          action,
          targetsCount: targets.length,
          thinkingLevel: resolvedThinkingLevel,
        },
        outputSummary: { updatesCount: cleanedUpdates.length },
        attempts,
      };

      return NextResponse.json({
        updates: cleanedUpdates,
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyUsed: keyIndexUsed,
        totalKeys,
        debugTrace,
      });
    }

    if (!selectedText.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng chọn hoặc nhập đoạn văn cần biên tập.' },
        { status: 400 }
      );
    }

    // MODE 2: 3 Alternative Phrasings
    if (action === 'alternatives') {
      const promptText = `Hãy đưa ra 3 phương án diễn đạt tiếng Việt khác nhau (1: Giàu chất cổ phong/tiên hiệp; 2: Tự nhiên, gãy gọn, hiện đại dễ đọc; 3: Giàu cảm xúc, nhấn mạnh khí thế/nội tâm) cho đoạn văn sau:

[ĐOẠN VĂN CẦN GỢI Ý]:
${selectedText}

${rawReference ? `[NGUYÊN BẢN TIẾNG TRUNG THAM CHIẾU]:\n${rawReference}\n` : ''}
${surroundingContext ? `[NGỮ CẢNH XUNG QUANH]:\n${surroundingContext}` : ''}`;

      const {
        result: parsed,
        keyIndexUsed,
        totalKeys,
        modelUsed,
        didFallback,
        attempts,
      } = await geminiKeyPool.executeWithKeyRotation(
        async (ai, slotInfo) => {
          const interaction = await ai.interactions.create({
            model: slotInfo.activeModel,
            store: false,
            system_instruction: systemPrompt,
            input: promptText,
            generation_config: buildInteractionGenerationConfig(
              resolvedThinkingLevel,
              undefined,
              slotInfo.activeModel
            ),
            response_format: {
              type: 'object',
              properties: {
                alternatives: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '3 phương án viết lại đoạn văn.',
                },
              },
              required: ['alternatives'],
              additionalProperties: false,
            },
          });
          return safeParseInteractionJson<{
            alternatives?: string[];
          }>(extractInteractionText(interaction), `Alternatives[${reqId}]`);
        },
        selectedModel,
        cleanFallbackModel,
        {
          reqId,
          endpoint: '/api/editor/assist',
          label: `alternatives (thinking=${resolvedThinkingLevel})`,
          signal: req.signal,
        }
      );
      const routeDurationMs = Date.now() - routeStartMs;
      return NextResponse.json({
        alternatives: (parsed.alternatives || []).map((s) =>
          normalizeVietnameseText(s)
        ),
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyUsed: keyIndexUsed,
        totalKeys,
        debugTrace: {
          reqId,
          endpoint: '/api/editor/assist',
          startedAt: new Date(routeStartMs).toISOString(),
          totalDurationMs: routeDurationMs,
          requestedModel: selectedModel,
          fallbackModel: cleanFallbackModel,
          modelUsed,
          thinkingLevelUsed: resolvedThinkingLevel,
          didFallback,
          keyIndexUsed,
          totalPoolKeys: totalKeys,
          attempts,
        } satisfies ServerDebugTrace,
      });
    }

    // MODE 3: Chế độ A của Preset Biên tập 1.14.1 (Mục 2A) & 1.14.0 (Mục 14A):
    // Không có `targets` -> trả về đúng `{"translation": "..."}`
    let taskInstruction = '';
    if (action === 'polish') {
      taskInstruction =
        'Mục tiêu biên tập: Làm câu mượt hơn (Trôi chảy) — biên tập, chuốt lại câu chữ tiếng Việt dưới đây cho thật mượt mà, thoát ý, giàu nhạc điệu văn học mà vẫn giữ nguyên 100% ý nghĩa và số đoạn văn.';
    } else if (action === 'fix_pronouns') {
      taskInstruction = `Mục tiêu biên tập: Đồng bộ thuật ngữ và xưng hô — kiểm tra và đồng bộ lại toàn bộ đại từ xưng hô trong đoạn văn dưới đây theo chuẩn "${
        pronounRule || 'Ta - Ngươi / Huynh - Đệ'
      }" phù hợp ngữ cảnh nhân vật.`;
    } else if (action === 'fix_qa') {
      taskInstruction =
        'Mục tiêu biên tập: Xử lý cảnh báo Hán / "But" — quét và dịch sạch toàn bộ các chữ Hán còn sót hoặc các câu/từ tiếng Anh bị lọt (như "But", "and", "however") trong văn bản dưới đây sang tiếng Việt tự nhiên. Giữ nguyên số dòng/đoạn.';
    } else if (action === 'translate_title') {
      taskInstruction =
        'Mục tiêu biên tập: Tiêu đề chương — dịch/biên tập tiêu đề chương này sang tiếng Việt thật hay, chuẩn định dạng "Chương N: Tên chương tiếng Việt".';
    } else {
      taskInstruction =
        customPrompt.trim() ||
        'Mục tiêu biên tập: Sửa chính tả, ngữ pháp và làm câu văn mượt mà hơn.';
    }

    const promptText = `${taskInstruction}

[BẢN DỊCH ACTIVE CẦN BIÊN TẬP]:
${selectedText}

${rawReference ? `[NGUYÊN VĂN TIẾNG TRUNG ĐỐI CHIẾU]:\n${rawReference}\n` : ''}
${surroundingContext ? `[NGỮ CẢNH XUNG QUANH]:\n${surroundingContext}` : ''}`;

    const {
      result: parsed,
      keyIndexUsed,
      totalKeys,
      modelUsed,
      didFallback,
      attempts,
    } = await geminiKeyPool.executeWithKeyRotation(
      async (ai, slotInfo) => {
        const interaction = await ai.interactions.create({
          model: slotInfo.activeModel,
          store: false,
          system_instruction: systemPrompt,
          input: promptText,
          generation_config: buildInteractionGenerationConfig(
            resolvedThinkingLevel,
            undefined,
            slotInfo.activeModel
          ),
          response_format: {
            type: 'object',
            properties: {
              translation: {
                type: 'string',
                description:
                  'Toàn bộ bản tiếng Việt sau biên tập theo đúng Chế độ A của Preset Biên tập.',
              },
            },
            required: ['translation'],
            additionalProperties: false,
          },
        });
        return safeParseInteractionJson<{
          translation?: string;
          editedText?: string;
        }>(extractInteractionText(interaction), `Assist:${action}[${reqId}]`);
      },
      selectedModel,
      cleanFallbackModel,
      {
        reqId,
        endpoint: '/api/editor/assist',
        label: `assist:${action} (thinking=${resolvedThinkingLevel})`,
        signal: req.signal,
      }
    );

    const routeDurationMs = Date.now() - routeStartMs;
    const finalEditedText = normalizeVietnameseText(
      parsed.translation || parsed.editedText || selectedText
    );
    return NextResponse.json({
      translation: finalEditedText,
      resultText: finalEditedText,
      modelUsed,
      thinkingLevelUsed: resolvedThinkingLevel,
      didFallback,
      keyUsed: keyIndexUsed,
      totalKeys,
      debugTrace: {
        reqId,
        endpoint: '/api/editor/assist',
        startedAt: new Date(routeStartMs).toISOString(),
        totalDurationMs: routeDurationMs,
        requestedModel: selectedModel,
        fallbackModel: cleanFallbackModel,
        modelUsed,
        thinkingLevelUsed: resolvedThinkingLevel,
        didFallback,
        keyIndexUsed,
        totalPoolKeys: totalKeys,
        attempts,
      } satisfies ServerDebugTrace,
    });
  } catch (err) {
    const routeDurationMs = Date.now() - routeStartMs;
    const message =
      err instanceof Error ? err.message : 'Lỗi khi gọi trợ lý biên tập AI.';
    const isPoolExhausted = message.includes('[POOL_EXHAUSTED_429]');
    const isRetryableFreshPipe =
      Boolean((err as { retryableFreshPipe?: boolean }).retryableFreshPipe) ||
      message.includes('[CLIENT_RETRY_FRESH_PIPE]');
    const errWithTrace = err as Error & {
      attempts?: KeyAttemptTrace[];
    };

    const debugTrace: ServerDebugTrace = {
      reqId,
      endpoint: '/api/editor/assist',
      startedAt: new Date(routeStartMs).toISOString(),
      totalDurationMs: routeDurationMs,
      requestedModel: selectedModel,
      fallbackModel: cleanFallbackModel,
      thinkingLevelUsed: resolvedThinkingLevel,
      totalPoolKeys: geminiKeyPool.getPoolStatus(selectedModel).totalConfiguredKeys,
      inputSummary: { action: actionForTrace },
      attempts: errWithTrace?.attempts || [],
      errorDetail: {
        name: err instanceof Error ? err.name : 'Error',
        message,
        stackPreview:
          err instanceof Error && err.stack
            ? err.stack.split('\n').slice(0, 5).join('\n')
            : undefined,
      },
    };

    logger.error(
      'AI_EDITOR',
      `✖ Lỗi tại /api/editor/assist (${actionForTrace}) sau ${(routeDurationMs / 1000).toFixed(2)}s: ${message}`,
      {
        reqId,
        action: actionForTrace,
        isPoolExhausted,
        isRetryableFreshPipe,
        debugTrace,
      },
      reqId,
      routeDurationMs
    );

    return NextResponse.json(
      {
        error: message
          .replace('[POOL_EXHAUSTED_429] ', '')
          .replace('[CLIENT_RETRY_FRESH_PIPE] ', ''),
        poolExhausted429: isPoolExhausted,
        retryableFreshPipe: isRetryableFreshPipe,
        debugTrace,
      },
      { status: isPoolExhausted ? 429 : isRetryableFreshPipe ? 503 : 500 }
    );
  }
  });
}

