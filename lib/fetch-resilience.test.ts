import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { safeFetchJson } from './logger';
import {
  filterContextualGlossary,
  materializeBlocksToChapter,
  splitRawIntoBlocks,
} from './block-engine';
import { GlossaryEntry } from './types';
import {
  buildInteractionGenerationConfig,
  extractInteractionText,
  resolveModelSafeThinkingLevel,
} from './gemini-server';
import {
  DEFAULT_EDITORIAL_INSTRUCTION_ID,
  DEFAULT_INSTRUCTION_ID,
  DEFAULT_INSTRUCTION_PROFILES,
} from './seed-data';

test('safeFetchJson recovers when res.text() throws Failed to fetch mid-stream during heartbeat streaming', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;

  globalThis.fetch = (async () => {
    callCount += 1;
    if (callCount < 3) {
      // Simulate withHeartbeatStream returning 200 OK headers at 0s, then dropping mid-stream during res.text()
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => {
          throw new TypeError('Failed to fetch');
        },
      } as unknown as Response;
    }

    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () =>
        '   \n' +
        JSON.stringify({
          titleTranslated: 'Chương 1: Khởi Đầu',
          translatedContent: 'Đoạn 1 đã dịch.\n\nĐoạn 2 đã dịch.',
          __mhcHttpStatus: 200,
        }),
    } as unknown as Response;
  }) as typeof fetch;

  try {
    const result = await safeFetchJson<{
      titleTranslated: string;
      translatedContent: string;
    }>(
      '/api/translate',
      {
        method: 'POST',
        body: JSON.stringify({ chapterNumber: 1 }),
      },
      {
        scope: 'TRANSLATE',
        label: 'Test Chapter #0001',
        silentSuccessLog: true,
      }
    );

    assert.equal(callCount, 3);
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);
    assert.equal(result.data.titleTranslated, 'Chương 1: Khởi Đầu');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('safeFetchJson immediately stops without retrying when AbortSignal is triggered', async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  const controller = new AbortController();

  globalThis.fetch = (async () => {
    callCount += 1;
    controller.abort();
    const abortErr = new Error('The operation was aborted.');
    abortErr.name = 'AbortError';
    throw abortErr;
  }) as typeof fetch;

  try {
    await assert.rejects(
      async () => {
        await safeFetchJson(
          '/api/translate',
          {
            method: 'POST',
            signal: controller.signal,
          },
          {
            scope: 'TRANSLATE',
            label: 'Test Aborted Chapter',
            silentSuccessLog: true,
          }
        );
      },
      (err: Error) => err.name === 'AbortError'
    );
    assert.equal(callCount, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('1-request-1-chapter block engine keeps all blocks intact without splitting and pre-filters glossary', () => {
  const rawParagraphs = Array.from(
    { length: 90 },
    (_, i) => `第${i + 1}段：韩立在青云宗修炼长生诀。`
  ).join('\n\n');

  const rawBlocks = splitRawIntoBlocks('第一章 青云宗', rawParagraphs);
  assert.equal(rawBlocks.length, 91); // TITLE + P0001..P0090 in a single request

  const returnedBlocks = rawBlocks.map((b) => ({
    id: b.id,
    translation:
      b.id === 'TITLE'
        ? 'Chương 1: Thanh Vân Tông'
        : `Đoạn ${b.id}: Hàn Lập tu luyện Trường Sinh Quyết tại Thanh Vân Tông.`,
  }));

  const materialized = materializeBlocksToChapter(returnedBlocks, rawBlocks, 1);
  assert.equal(materialized.alignment.isAligned, true);
  assert.equal(materialized.alignment.rawBlockCount, 90);
  assert.equal(materialized.alignment.translatedBlockCount, 90);
  assert.equal(materialized.missingIds.length, 0);

  const glossary: GlossaryEntry[] = [
    {
      id: 'g1',
      novelId: 'n1',
      sourceTerm: '韩立',
      targetTerm: 'Hàn Lập',
      category: 'character',
      enabled: true,
    },
    {
      id: 'g2',
      novelId: 'n1',
      sourceTerm: '无关词汇',
      targetTerm: 'Từ Không Xuất Hiện',
      category: 'other',
      enabled: true,
    },
  ];

  const filtered = filterContextualGlossary(
    glossary,
    `第一章 青云宗\n${rawParagraphs}`,
    '',
    1
  );
  assert.equal(filtered.matchedEntries.length, 1);
  assert.equal(filtered.matchedEntries[0].targetTerm, 'Hàn Lập');
});

test('Structured Output config & extractor strictly follow official @google/genai v2.31.0 rules', () => {
  // 1. 'minimal' is promoted to 'low' on non-lite models (e.g. gemini-3.8-flash / gemini-4-argon) to avoid 400 error
  assert.equal(resolveModelSafeThinkingLevel('minimal', 'gemini-3.8-flash'), 'low');
  assert.equal(resolveModelSafeThinkingLevel('minimal', 'gemini-flash-latest'), 'low');
  assert.equal(resolveModelSafeThinkingLevel('minimal', 'gemini-3.1-flash-lite'), 'minimal');
  assert.equal(resolveModelSafeThinkingLevel('high', 'gemini-3.8-flash'), 'high');

  // 2. Deprecated sampling params (temperature, top_p) are stripped from generation_config
  const genConfig = buildInteractionGenerationConfig(
    'minimal',
    { temperature: 0.3, top_p: 0.9 },
    'gemini-3.8-flash'
  );
  assert.equal(genConfig.thinking_level, 'low');
  assert.equal(genConfig.max_output_tokens, 65536);
  assert.equal('temperature' in genConfig, false);
  assert.equal('top_p' in genConfig, false);

  // 3. extractInteractionText supports output_text, steps, and outputs
  assert.equal(
    extractInteractionText({ output_text: '{"blocks":[{"id":"TITLE","translation":"Chương 1"}]}' }),
    '{"blocks":[{"id":"TITLE","translation":"Chương 1"}]}'
  );
  assert.equal(
    extractInteractionText({
      steps: [
        {
          type: 'model_output',
          content: [{ type: 'text', text: '{"blocks":[]}' }],
        },
      ],
    }),
    '{"blocks":[]}'
  );
  assert.equal(
    extractInteractionText({
      outputs: [{ type: 'text', text: '{"terms":[]}' }],
    }),
    '{"terms":[]}'
  );
});

test('Presets v1.14.1 and v1.14.0 match official Markdown reference files verbatim and enforce exact output contracts', () => {
  const presetMap = new Map(DEFAULT_INSTRUCTION_PROFILES.map((p) => [p.id, p]));

  const trans1141 = presetMap.get(DEFAULT_INSTRUCTION_ID);
  const trans1140 = presetMap.get('inst-dich-flash-full-1140');
  const edit1141 = presetMap.get(DEFAULT_EDITORIAL_INSTRUCTION_ID);
  const edit1140 = presetMap.get('inst-bientap-flash-full-1140');

  assert.ok(trans1141, '1.14.1 Translation preset exists');
  assert.ok(trans1140, '1.14.0 Translation preset exists');
  assert.ok(edit1141, '1.14.1 Editorial preset exists');
  assert.ok(edit1140, '1.14.0 Editorial preset exists');

  const refDir = path.join(process.cwd(), 'public', 'assets', 'aistudio');
  const normalizeEol = (s: string) => s.replace(/\r\n/g, '\n').trim();

  assert.equal(
    normalizeEol(trans1141!.systemInstruction),
    normalizeEol(
      fs.readFileSync(
        path.join(refDir, 'D_ch_Trung_Vi_t___Flash__a_th__lo_i_79b6b8ee.md'),
        'utf8'
      )
    )
  );
  assert.equal(
    normalizeEol(trans1140!.systemInstruction),
    normalizeEol(
      fs.readFileSync(
        path.join(refDir, 'dich-truyen-flash-1.14.0_5d14a378.md'),
        'utf8'
      )
    )
  );
  assert.equal(
    normalizeEol(edit1141!.systemInstruction),
    normalizeEol(
      fs.readFileSync(
        path.join(
          refDir,
          'Bi_n_t_p_Trung_Vi_t___Flash__a_th__lo_i-bien-tap_33ab96c6.md'
        ),
        'utf8'
      )
    )
  );
  assert.equal(
    normalizeEol(edit1140!.systemInstruction),
    normalizeEol(
      fs.readFileSync(
        path.join(refDir, 'bien-tap-ai-flash-1.14.0_b36076ad.md'),
        'utf8'
      )
    )
  );

  // Verify character budgets per PLAN.md (< 10,000 for 1.14.1 translation, < 12,000 for 1.14.1 editorial)
  assert.ok(trans1141!.systemInstruction.length < 8000);
  assert.ok(edit1141!.systemInstruction.length < 10000);

  // Verify internal single newline (\n) is preserved inside a single block while accidental \n\n inside a block is collapsed to \n
  const rawBlocks = splitRawIntoBlocks('第1章 诗与系统', '第一段诗词\n\n第二段面板');
  const materialized = materializeBlocksToChapter(
    [
      { id: 'TITLE', translation: 'Chương 1: Thơ và Hệ thống' },
      { id: 'P0001', translation: 'Câu thơ thứ nhất\nCâu thơ thứ hai' },
      { id: 'P0002', translation: '【Cảnh giới: Trúc Cơ】\n\n【Linh lực: 100】' },
    ],
    rawBlocks,
    1
  );
  assert.equal(materialized.alignment.isAligned, true);
  assert.equal(
    materialized.translatedContent,
    'Câu thơ thứ nhất\nCâu thơ thứ hai\n\n【Cảnh giới: Trúc Cơ】\n【Linh lực: 100】'
  );
});


