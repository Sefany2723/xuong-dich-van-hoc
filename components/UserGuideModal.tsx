'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Download,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  Terminal,
  BookMarked,
  Sliders,
  FileSpreadsheet,
  FolderArchive,
  Keyboard,
  CheckCircle2,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideSection {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  badge?: string;
  summary: string;
  items: Array<{
    heading: string;
    bullets: string[];
    tip?: string;
  }>;
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'overview',
    title: '1. Tổng Quan Hệ Thống & Dự Án Mẫu Xích Tâm Tuần Thiên',
    shortTitle: '1. Tổng quan & Bố cục',
    icon: <Layers className="h-4 w-4" />,
    badge: 'Cốt lõi',
    summary:
      'Mặc Hiên Các (AI Translation Studio) là bàn làm việc Dịch thuật, Biên tập đối chiếu 1:1 theo Block ID, Kiểm định QA 8 tiêu chí & Xuất bản Ebook chuyên nghiệp dành cho tiểu thuyết Trung–Việt.',
    items: [
      {
        heading: 'Dự án mẫu tích hợp sẵn (Xích Tâm Tuần Thiên — Tình Hà Dĩ Thậm)',
        bullets: [
          'Khởi tạo sẵn bộ truyện mẫu "Xích Tâm Tuần Thiên" (赤心巡天) trong IndexedDB với 6 chương thực tế (0000 – 0005) đã có nguyên tác tiếng Trung và bản dịch đối chiếu 1:1.',
          'Đi kèm 20 thuật ngữ Glossary mẫu (Khương Vọng, Tả Quang Liệt, Công Dương Bạch, Mặc Kinh Vũ, Lý Nhất, Đỗ Như Hối, Phong Lâm Thành, Thái Hư Huyễn Cảnh, Động Chân Khư, Thông Thiên Cung...) để thử nghiệm ngay lập tức.',
        ],
      },
      {
        heading: 'Bố cục 3 vùng làm việc chính trên màn hình',
        bullets: [
          'Thanh Công Cụ Đỉnh (Top Bar): Gồm nút mở "Thư Viện", nút bật/tắt nhanh "Glossary: TẮT / BẬT" (mặc định TẮT), bộ chuyển đổi "Biên tập bản dịch" ↔ "Đọc", cùng cụm nút "Nhập Chương", "Preset & Model", "Giao Diện Đọc", "Terminal", "Hướng Dẫn", và "EPUB & Backup".',
          'Cột Trái (Sidebar Quản lý Chương & Hàng đợi): Thống kê tiến độ, Bộ lọc QA 8 tiêu chí, Tìm kiếm theo "#Mã" hoặc "Toàn văn", chọn hàng loạt ("Chỉ chọn kết quả lọc", "Bỏ chọn", "Đảo", "Khoảng..."), chọn nhanh "Thinking: minimal | low | medium | high" và cụm nút "Dịch (N)" / "Biên tập AI (N)".',
          'Không Gian Trung Tâm: Chuyển đổi tức thì giữa Bàn Biên Tập Bản Dịch Đối Chiếu 1:1 (TITLE, P0001..Pxxxx) và Chế Độ Đọc Sách (Reader Mode). Có nút "Phóng lớn / Thu nhỏ" để ẩn Cột Trái khi cần tập trung biên tập 2 cột.',
        ],
        tip: 'Mọi dữ liệu Chương, Glossary, Preset, Giao diện đọc và Highlight đều được lưu tự động vào IndexedDB ngay trên trình duyệt, không sợ mất dữ liệu khi tải lại trang.',
      },
    ],
  },
  {
    id: 'library-import',
    title: '2. Quản Lý Đa Dự Án (Thư Viện) & 6 Phương Thức Nhập Chương',
    shortTitle: '2. Thư viện & Nhập chương',
    icon: <BookOpen className="h-4 w-4" />,
    summary:
      'Quản lý nhiều bộ truyện độc lập trong Thư Viện Truyện và nạp chương mới từ 6 nguồn linh hoạt với bộ giải mã bảng mã tự động (UTF-8 / GB18030 / GBK / UTF-16).',
    items: [
      {
        heading: 'Quản lý Đa Dự Án trong "Thư Viện"',
        bullets: [
          'Tạo mới không giới hạn số lượng bộ truyện (Tên truyện tiếng Việt, Tên Hán tự gốc, Tác giả, Mô tả, Preset Dịch & Preset Biên tập riêng).',
          'Chuyển đổi giữa các bộ truyện trong 1 cú click; mỗi dự án có danh sách chương, bảng Glossary, vị trí đọc Bookmark và Highlight hoàn toàn độc lập.',
        ],
      },
      {
        heading: '6 Phương thức Nhập Chương & Nhập Bản Dịch Có Sẵn',
        bullets: [
          '1. Nhiều tệp .txt lẻ: Kéo thả hàng trăm file .txt cùng lúc; tự động nhận diện số chương từ tên file hoặc dòng đầu tiên và tự động giải mã UTF-8, GB18030/GBK, UTF-16 chống lỗi chữ Hán biến thành ký tự lạ.',
          '2. 1 tệp .txt gộp lớn (Auto-Split Regex): Tự động cắt file truyện dài hàng nghìn chương theo tiêu đề Hán ngữ (第...章/节/回/卷/集, 楔子, 序章) hoặc tiếng Việt (Chương/Hồi/Quyển...).',
          '3. Gói nén .zip: Giải nén trực tiếp trên trình duyệt, lọc các file .txt và sắp xếp theo đúng thứ tự chương.',
          '4. Dán văn bản trực tiếp (Paste Raw): Dán nhanh 1 chương hoặc nhiều chương từ clipboard.',
          '5. Tải từ URL Web (Web Scraper): Nhập danh sách URL chương để tải nội dung văn bản thô về dự án.',
          '6. Nhập Bản Dịch Có Sẵn (nút "Nhập bản dịch" ở chân Cột Trái): Khớp nối tự động các file .txt/.zip đã dịch bên ngoài vào đúng các chương tiếng Trung gốc theo mã chương để kiểm định QA hoặc chạy Biên tập AI.',
        ],
      },
    ],
  },
  {
    id: 'presets-models-keys',
    title: '3. Bộ 4 Preset Chuẩn (v1.14.1 & v1.14.0), Model Gemini & Pool 50 API Key',
    shortTitle: '3. Preset, Model & 50 Key',
    icon: <Sliders className="h-4 w-4" />,
    badge: 'v1.14.1 & SDK 2.31',
    summary:
      'Tích hợp sẵn 4 bộ Chỉ dẫn Dịch thuật & Biên tập chuẩn khóa đoạn 1:1 Block-ID, cơ chế tự tương thích SDK @google/genai v2.31.0 và Pool 50 API Key cô lập hoàn toàn.',
    items: [
      {
        heading: '4 Preset Chỉ dẫn Dịch thuật & Biên tập tích hợp sẵn',
        bullets: [
          '1. Dịch Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1 — Mặc định Dịch): Gồm 8 mục tinh gọn (~4.900 ký tự) tối ưu tốc độ và độ tuân thủ khóa đoạn 1:1 cho dòng Gemini Flash / Flash-Lite.',
          '2. Dịch Truyện Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 15 Mục 1.14.0): Bản quy tắc chi tiết 15 mục (~9.400 ký tự) kiểm soát sâu thành ngữ, thơ phú và khẩu ngữ.',
          '3. Biên Tập Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1 — Mặc định Biên tập): Gồm 9 mục tinh gọn (~6.900 ký tự) chuyên quét sạch chữ Hán sót, xử lý từ tiếng Anh lọt, chuẩn hóa đại từ nhân xưng và chuốt văn mượt mà theo nguyên tác 1:1.',
          '4. Biên Tập AI Truyện Dịch Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 13 Mục 1.14.0): Bản quy tắc hậu kỳ đầy đủ 13 mục (~10.500 ký tự).',
          'Bảo toàn ngắt dòng đơn (\\n) trong cùng 1 Block cho thơ ca, câu đối, bảng hệ thống (System Panel) và tự động thu gọn dòng trống thừa (\\n\\n+) bên trong 1 block về \\n đơn để giữ khóa đoạn 1:1 tuyệt đối.',
        ],
      },
      {
        heading: 'Cấu hình Model Gemini & Tự động chuẩn hóa Thinking Level (SDK v2.31.0)',
        bullets: [
          'Hỗ trợ gemini-3.1-flash-lite-preview (mặc định tốc độ cao), gemini-3-flash-preview, gemini-flash-latest, gemini-3.1-pro-preview và nút cập nhật danh sách Model trực tiếp từ Google API.',
          '4 mức Thinking Level: minimal | low | medium | high. Khi chọn "minimal" trên các model không hỗ trợ minimal (như gemini-flash-latest, gemini-3-flash-preview, gemini-3.1-pro-preview), hệ thống tự động nâng lên "low" (resolveModelSafeThinkingLevel) để tránh lỗi HTTP 400, đồng thời giữ nguyên "minimal" trên gemini-3.1-flash-lite.',
          'Tuân thủ nghiêm ngặt Interactions API (@google/genai v2.31.0): đặt max_output_tokens = 65536 và loại bỏ các tham số lấy mẫu lỗi thời (temperature, top_p).',
        ],
      },
      {
        heading: 'Pool 50 API Key Độc Lập & Cô Lập Key Tuyệt Đối (Zero-Built-In-Key Isolation)',
        bullets: [
          'Hệ thống chỉ sử dụng duy nhất các Gemini API Key do bạn nhập vào (tối đa 50 Key), lưu trong trình duyệt và đồng bộ qua header X-MHC-User-Keys / /api/models — tuyệt đối không dùng ngầm bất kỳ key môi trường nào của máy chủ.',
          'Tự động xoay vòng chia tải Round-Robin qua các Key khỏe mạnh; khi 1 Key gặp lỗi 429 Rate Limit, hệ thống tự động đặt Cooldown cho Key đó và chuyển sang Key kế tiếp.',
          'Trang bị nút "Xóa sạch Key" (1-Click Purge) để xóa toàn bộ API Key khỏi trình duyệt và bộ nhớ phiên Server trước khi bạn chia sẻ hoặc Publish ứng dụng.',
        ],
        tip: 'Bạn có thể điều chỉnh Số Luồng Song Song (Concurrency từ 1 đến 10) tương ứng với số lượng API Key đang hoạt động trong Pool.',
      },
    ],
  },
  {
    id: 'batch-heartbeat',
    title: '4. Dịch Hàng Loạt Đa Luồng, Heartbeat Streaming 5s & Tự Phục Hồi Mạng',
    shortTitle: '4. Dịch hàng loạt & Heartbeat',
    icon: <Sparkles className="h-4 w-4" />,
    badge: 'Chống Timeout 300s',
    summary:
      'Vận hành hàng đợi dịch thuật & biên tập AI hàng trăm chương với điều khiển Tạm dừng / Tiếp tục / Dừng hẳn và cơ chế giữ kết nối Heartbeat mỗi 5 giây.',
    items: [
      {
        heading: 'Vận hành Hàng đợi Dịch (N) & Biên tập AI (N)',
        bullets: [
          'Chọn nhanh chương bằng Shift + Click, "Chỉ chọn kết quả lọc", "Đảo" hoặc "Khoảng..." (từ chương X đến chương Y).',
          'Hỗ trợ "Tạm dừng" (Pause), "Tiếp tục" (Resume) ngay tại vị trí đang chạy, hoặc "Dừng hẳn" (Hard Stop) để hủy tức thì các request đang chạy và khôi phục trạng thái gốc cho toàn bộ chương đang chờ.',
          'Nếu toàn bộ API Key trong Pool đều chạm giới hạn 429, hàng đợi tự động Tạm dừng an toàn để bạn thêm Key hoặc chờ hết Cooldown rồi bấm Tiếp tục.',
        ],
      },
      {
        heading: 'Heartbeat Streaming 5 giây & Tự động thử lại khi rớt mạng',
        bullets: [
          'Các API /api/translate, /api/editor/assist và /api/glossary/extract sử dụng luồng HTTP 200 Heartbeat (withHeartbeatStream) gửi tín hiệu giữ kết nối mỗi 5 giây, loại bỏ hoàn toàn lỗi 504 Gateway Timeout 300s khi dịch chương dài hoặc bật Thinking cao.',
          'Khi gặp lỗi mạng tạm thời (Failed to fetch, 502/503/504), safeFetchJson tự động thử lại và hàng đợi tự động xếp chương đó vào cuối hàng đợi để dịch lại tối đa 2 lần.',
        ],
      },
    ],
  },
  {
    id: 'qa-scanner',
    title: '5. Kiểm Định Chất Lượng QA 8 Tiêu Chí & Lọc Từ Đồng Hình Tiếng Việt',
    shortTitle: '5. Kiểm định QA 8 tiêu chí',
    icon: <ShieldCheck className="h-4 w-4" />,
    badge: 'Chống báo giả',
    summary:
      'Tự động quét và phân loại chương lỗi theo 8 tiêu chí chuyên biệt ngay sau khi dịch hoặc khi bấm nút "Quét QA" ở Cột Trái.',
    items: [
      {
        heading: '8 Tiêu chí Kiểm định QA tự động',
        bullets: [
          '1. Sót Hán tự (chinese_residual): Phát hiện mọi ký tự chữ Hán còn sót trong tiêu đề hoặc nội dung bản dịch.',
          '2. Lọt từ tiếng Anh (english_leak) kèm Whitelist Từ Đồng Hình Tiếng Việt (VIETNAMESE_HOMOGRAPH_WORDS): Phát hiện chính xác từ tiếng Anh bị trượt ngôn ngữ (however, suddenly, system, level, but...) nhưng tự động bỏ qua hơn 200 âm tiết tiếng Việt không dấu trùng mặt chữ với tiếng Anh (in, then, than, the, to, do, so, no, an, my, long, song, trang, linh, tinh, minh, sinh, kinh, ban, tan, van, nam, tam, cam, lam, son, lon, con, non, don, hon, bon, mon, bun, mun...), chống báo lỗi giả 100%.',
          '3. Chưa dịch Tiêu đề (untranslated_title): Cảnh báo khi tiêu đề trống, còn chữ Hán hoặc thiếu định dạng Chương X.',
          '4. Lệch đoạn Block 1:1 (block_mismatch): Cảnh báo khi tổng số đoạn văn bản dịch không khớp 1:1 với tổng số đoạn nguyên tác tiếng Trung.',
          '5. Lệch tỷ lệ độ dài (length_ratio): Phát hiện chương có tỷ lệ ký tự Việt/Trung quá ngắn (nghi cắt xén) hoặc quá dài (nghi lặp đoạn).',
          '6. Lặp đoạn bất thường (repeated_paragraph): Phát hiện các đoạn văn trùng lặp nội dung trong cùng một chương.',
          '7. Lẫn Code Fence / Lời dẫn AI & Ngắt cụt cuối chương (code_fence / abrupt_ending): Phát hiện thẻ ``` , lời bình của AI hoặc câu cuối chương bị đứt ngang thiếu dấu kết câu.',
          '8. Vi phạm Từ điển / Từ cấm (glossary_violation): Cảnh báo khi xuất hiện từ nằm trong danh sách Từ cấm hoặc dịch sai thuật ngữ đã bật trong Glossary.',
        ],
      },
    ],
  },
  {
    id: 'block-editor',
    title: '6. Bàn Biên Tập Bản Dịch Đối Chiếu 1:1 Theo Block ID (TITLE, P0001..Pxxxx)',
    shortTitle: '6. Bàn biên tập 1:1 Block-ID',
    icon: <FileSpreadsheet className="h-4 w-4" />,
    badge: 'Khóa đoạn 1:1',
    summary:
      'Môi trường biên tập song ngữ khóa cứng từng cặp đoạn (TITLE, P0001..Pxxxx) với thanh công cụ ghim cố định và bộ công cụ vi chỉnh AI / thủ công trên từng dòng.',
    items: [
      {
        heading: 'Thanh Công Cụ Ghim Cố Định (Pinned Editor Toolbar)',
        bullets: [
          'Điều hướng & Hiển thị: Chuyển chương Trước/Sau, tìm nhanh chương trong danh sách thả xuống (hỗ trợ >3.000 chương), nút "Phóng lớn / Thu nhỏ" ẩn Cột Trái, nút "TXT active" tải nhanh chương đang mở, nút chuyển nhanh sang chế độ "Đọc".',
          'AI biên tập (Smart Block-ID Cleanup): Nếu chương đang bị lệch số đoạn 1:1 (block_mismatch) hoặc khi chương đã sạch lỗi, hệ thống gửi toàn chương (realign_chapter) để AI căn chỉnh lại 1:1. Nếu chương đã khớp đoạn và chỉ có vài Block dính lỗi, hệ thống chỉ gửi đúng các Block lỗi (block_cleanup) để sửa tức thì.',
          'Thao tác toàn chương: "Dịch lại..." (cho phép đổi Model, đổi Thinking và nhập Yêu cầu bổ sung riêng), "Lưu revision" (Ctrl + S), "Duyệt", "Undo / Redo" (40 bước), "Copy / Cut / Paste", "Khôi phục active", "Nhập bản dịch cả chương", "Chuẩn hóa câu", bộ lọc "Tất cả / Block lỗi", "Tìm & Thay" cục bộ trong chương và chế độ "Sửa raw" (sửa trực tiếp nguyên tác tiếng Trung).',
        ],
      },
      {
        heading: '10 Công cụ Vi chỉnh trên từng dòng Block (5 nút AI + 5 nút Cấu trúc)',
        bullets: [
          '5 Nút AI từng đoạn: "AI Dịch Block" (dịch lại đúng đoạn đó), "Chuốt mượt" (viết lại mượt mà hơn), "Sửa xưng hô" (chuẩn hóa đại từ theo ngữ cảnh), "3 Gợi ý" (sinh 3 phương án diễn đạt để chọn 1-click), và "Lệnh AI..." (nhập yêu cầu riêng cho đoạn đó).',
          '5 Nút Cấu trúc khớp đoạn 1:1: "Gộp ↓" (gộp với đoạn dưới), "Tách ↵" (tách làm 2 đoạn ngay tại vị trí con trỏ), "Đẩy ↓" (chèn ô trống đẩy các đoạn dưới xuống 1 bậc), "Kéo ↑" (xóa ô trống kéo các đoạn dưới lên 1 bậc), và "Xóa Hán" (xóa sạch chữ Hán sót trong đoạn).',
        ],
        tip: 'Mỗi dòng Block bị lỗi đều gắn nhãn trực quan ("Sót Hán", "Lọt Anh", "Chưa dịch") để bạn nhận diện và xử lý ngay trong 1 giây.',
      },
    ],
  },
  {
    id: 'glossary-search',
    title: '7. Từ Điển Thuật Ngữ (Glossary) & Tìm Kiếm Thay Thế Toàn Văn',
    shortTitle: '7. Glossary & Tìm thay thế',
    icon: <Search className="h-4 w-4" />,
    summary:
      'Đồng bộ hóa tên riêng, cảnh giới, đại từ nhân xưng xuyên suốt bộ truyện và tìm kiếm/thay thế hàng loạt với chế độ Xem trước trực quan (Live Diff).',
    items: [
      {
        heading: 'Quản lý Từ Điển Thuật Ngữ (Glossary) & Lọc Ngữ Cảnh Thông Minh',
        bullets: [
          'Công tắc "Glossary: TẮT / BẬT" ngay trên thanh đỉnh (mặc định TẮT để AI dịch tự nhiên, tiết kiệm token).',
          'Khi BẬT, thuật toán filterContextualGlossary tự động lọc ra đúng các thuật ngữ thực sự xuất hiện trong chương đang dịch (kèm nhân vật cốt lõi) để đưa vào Prompt.',
          'Hỗ trợ "Quét Thuật Ngữ Tự Động Bằng AI" từ các chương tiếng Trung gốc và Nhập/Xuất từ điển định dạng .CSV / .JSON.',
        ],
      },
      {
        heading: 'Tìm Kiếm & Thay Thế Toàn Văn (Full-Text Search & Replace)',
        bullets: [
          'Bấm nút "Toàn văn" ở ô tìm kiếm Cột Trái để mở cửa sổ Tìm & Thay thế trên toàn bộ truyện (hoặc các chương đang chọn/lọc).',
          'Hỗ trợ tìm trong Nội dung dịch, Tiêu đề dịch hoặc Văn bản gốc (Raw) với các tùy chọn Phân biệt HOA/thường (Aa), Khớp nguyên từ (Whole Word) và Biểu thức chính quy (Regex).',
          'Xem trước trực quan từng câu thay đổi trước khi bấm Thay thế từng chương hoặc Thay thế tất cả.',
        ],
      },
    ],
  },
  {
    id: 'reader-appearance',
    title: '8. Chế Độ Đọc Sách (Reader Mode), 6 Chủ Đề, 9 Phông Chữ & Highlight 3 Màu',
    shortTitle: '8. Đọc sách & Giao diện',
    icon: <BookMarked className="h-4 w-4" />,
    summary:
      'Không gian đọc tiểu thuyết thư thái như sách giấy với 6 chủ đề màu sắc, 9 phông chữ tiếng Việt, nạp phông cá nhân và bộ công cụ Highlight 3 màu.',
    items: [
      {
        heading: '6 Chủ Đề Màu Sắc Văn Học & 9 Phông Chữ Tiếng Việt ("Giao Diện Đọc")',
        bullets: [
          '6 Chủ đề dựng sẵn: Giấy Tuyên Chỉ (#FBF8F1), Vàng Cổ Điển (#F4ECD8), Đậu Lục Dịu Mắt (#E8F0E6), Trắng Tinh Khiết (#FFFFFF), Xám Khói Chiều (#26282B) và Đêm Huyền Mặc (#141413), kèm bảng chọn màu HEX/RGB tùy ý.',
          '9 Phông chữ tiếng Việt tích hợp: Noto Serif, Literata, Lora, Merriweather, Source Serif 4, Be Vietnam Pro, Plus Jakarta Sans, Inter, Roboto — cùng tính năng Tải phông chữ (.ttf, .otf, .woff, .woff2) trực tiếp từ máy tính.',
          'Tùy chỉnh chi tiết cỡ chữ (14px–32px), giãn dòng (1.4–2.4), khoảng cách đoạn, độ rộng trang đọc và căn đều hai bên.',
        ],
      },
      {
        heading: 'Đánh Dấu Vị Trí Đọc (Bookmark), Song Ngữ & Highlight 3 Màu',
        bullets: [
          'Nút "Đánh dấu vị trí đọc" lưu chính xác chương và tỷ lệ cuộn trang hiện tại; bấm "Đọc tiếp vị trí đã lưu" để nhảy về đúng dòng đang đọc dở.',
          'Nút "Ẩn/Hiện chữ Hán gốc" giúp bật/tắt dòng nguyên tác tiếng Trung ngay phía trên từng đoạn tiếng Việt.',
          'Bôi đen đoạn văn bất kỳ trong trang đọc để tạo Highlight với 3 màu cổ điển: Vàng Hổ Phách (amber), Xanh Ngọc Bích (jade), Xanh Thanh Thiên (blue) kèm ghi chú cá nhân.',
        ],
      },
    ],
  },
  {
    id: 'export-backup-terminal',
    title: '9. Xuất Bản EPUB 3.0, Sao Lưu Google Drive, Terminal & Phím Tắt',
    shortTitle: '9. EPUB, Drive & Phím tắt',
    icon: <FolderArchive className="h-4 w-4" />,
    badge: 'EPUB & OAuth Drive',
    summary:
      'Đóng gói Ebook .EPUB chuẩn xuất bản có ảnh bìa & mục lục, xuất gói .ZIP/.TXT, đồng bộ đám mây Google Drive và theo dõi System Terminal.',
    items: [
      {
        heading: '4 Chế độ Xuất bản & Sao lưu ("EPUB & Backup")',
        bullets: [
          '1. Xuất Ebook .EPUB chuẩn 3.0: Tùy chỉnh Tên sách, Tác giả, Dịch giả, Nhà xuất bản, tải Ảnh bìa (.jpg/.png/.webp), chọn Chỉ bản dịch hoặc Song ngữ Việt–Trung, tự động tạo Mục lục (TOC) đọc mượt trên Kindle, Apple Books, Google Play Books, Kobo, Moon+ Reader.',
          '2. Xuất gói nén .ZIP (nhiều file .txt lẻ theo từng chương) hoặc 1 file .TXT gộp toàn bộ truyện.',
          '3. Sao lưu & Khôi phục toàn bộ dự án ra tệp .JSON (Full Snapshot Backup & Restore).',
          '4. Đồng bộ đám mây Google Drive (OAuth 2.0): Tải trực tiếp bản sao lưu dự án lên Google Drive hoặc khôi phục từ Google Drive về máy.',
        ],
      },
      {
        heading: 'System Terminal & Bảng Phím Tắt Toàn Cục',
        bullets: [
          'Ctrl + ` (hoặc bấm nút "Terminal"): Mở/Đóng bảng nhật ký thời gian thực ghi lại mọi request Gemini API, Model, Thinking Level, Key # trong Pool, độ trễ (ms) và trạng thái khớp đoạn 1:1.',
          'Ctrl + S (hoặc Cmd + S): Lưu ngay chương đang mở và quét lại QA (hoạt động toàn cục ở mọi nơi trên trang).',
          'Alt + ← / Alt + →: Chuyển nhanh về Chương trước / Chương tiếp theo (hoạt động toàn cục cả khi Đọc sách và Biên tập).',
          'Ctrl + Z / Ctrl + Y: Hoàn tác (Undo) / Làm lại (Redo) trong Bàn Biên Tập.',
          'Shift + Click: Tick chọn hàng loạt cả một dải chương liên tiếp ở Cột Trái.',
        ],
      },
    ],
  },
];

export const FULL_MARKDOWN_CONTENT = `# 🏛️ CẨM NANG HƯỚNG DẪN SỬ DỤNG TOÀN DIỆN — MẶC HIÊN CÁC (AI TRANSLATION STUDIO)

Chào mừng bạn đến với **Mặc Hiên Các (AI Translation Studio)** — Bàn làm việc Dịch thuật, Biên tập 1:1 Block-ID, Kiểm định QA 8 Tiêu chí, Quản lý Đa Dự Án & Xuất bản Ebook chuyên nghiệp dành cho tiểu thuyết Trung–Việt (Tiên hiệp, Huyền huyễn, Khoa huyễn, Võng du, Đô thị, Ngôn tình, Lịch sử, Đồng nhân...).

Tài liệu này mô tả chi tiết **100% tính năng thực tế** đang hoạt động trong hệ thống, từ bước nạp dữ liệu đầu vào, cấu hình 4 Preset Dịch/Biên tập chuẩn \`v1.14.1\` & \`v1.14.0\`, cơ chế xoay vòng Pool 50 Gemini API Key độc lập, Heartbeat Streaming chống đứt kết nối 300s, Bàn Biên Tập Đối Chiếu 1:1 Block-ID, Bộ Quét Lỗi QA 8 Tiêu Chí, cho đến đóng gói EPUB chuẩn xuất bản và lưu trữ đám mây Google Drive.

---

## 1. BỐ CỤC TỔNG THỂ & DỰ ÁN MẪU XÍCH TÂM TUẦN THIÊN
- **Truyện mẫu tích hợp sẵn**: **Xích Tâm Tuần Thiên (\`赤心巡天\` — Tình Hà Dĩ Thậm)** gồm 6 chương thực tế (\`0000\`–\`0005\`) và 20 thuật ngữ Glossary mẫu (*Khương Vọng, Tả Quang Liệt, Công Dương Bạch, Mặc Kinh Vũ, Lý Nhất, Đỗ Như Hối, Phong Lâm Thành, Trang Quốc, Thái Hư Huyễn Cảnh, Động Chân Khư, Thông Thiên Cung, Du Mạch, Chu Thiên Tinh Đấu Trận, Trường Tương Tư...*).
- **Thanh Công Cụ Đỉnh (Top Bar)**: \`Thư Viện\`, \`Glossary: TẮT / BẬT\`, \`Biên tập bản dịch\` ↔ \`Đọc\`, \`Nhập Chương\`, \`Preset & Model\`, \`Giao Diện Đọc\`, \`Terminal\`, \`Hướng Dẫn\`, \`EPUB & Backup\`.
- **Cột Trái (Sidebar Quản lý Chương & Hàng đợi)**: Bộ lọc QA 8 tiêu chí, tìm kiếm \`#Mã\` / \`Toàn văn\`, chọn chương (\`Chỉ chọn kết quả lọc\`, \`Bỏ chọn\`, \`Đảo\`, \`Khoảng...\`), chọn \`Thinking: minimal | low | medium | high\`, nút \`Dịch (N)\` và \`Biên tập AI (N)\`.

## 2. QUẢN LÝ ĐA DỰ ÁN & 6 PHƯƠNG THỨC NHẬP CHƯƠNG
1. **Tải nhiều tệp .txt lẻ**: Tự động nhận diện số thứ tự chương và giải mã \`UTF-8\`, \`GB18030 / GBK\`, \`UTF-16LE/BE\`.
2. **Tải 1 tệp .txt gộp lớn (Auto-Split Regex)**: Tự động tách hàng nghìn chương theo tiêu đề Hán ngữ (\`第...章/节/回/卷/集\`) hoặc tiếng Việt (\`Chương/Hồi/Quyển...\`).
3. **Tải gói nén .zip**: Giải nén và sắp xếp chương tự động ngay trên trình duyệt.
4. **Dán văn bản trực tiếp (Paste Raw)**.
5. **Tải từ URL Web (Web Scraper)**.
6. **Nhập Bản Dịch Có Sẵn (\`Nhập bản dịch\`)**: Khớp nối tự động các file bản dịch có sẵn với chương tiếng Trung gốc.

## 3. BỘ 4 PRESET CHUẨN (v1.14.1 & v1.14.0), MODEL GEMINI & POOL 50 API KEY
- **4 Preset tích hợp sẵn**:
  1. \`Dịch Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1)\` (8 mục tinh gọn — Mặc định Dịch thuật)
  2. \`Dịch Truyện Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 15 Mục 1.14.0)\`
  3. \`Biên Tập Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1)\` (9 mục tinh gọn — Mặc định Biên tập AI)
  4. \`Biên Tập AI Truyện Dịch Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 13 Mục 1.14.0)\`
- **Bảo toàn ngắt dòng đơn (\`\\n\`) nội bộ**: Giữ nguyên \`\\n\` trong cùng 1 Block cho thơ ca, câu đối, bảng hệ thống (System Panel) và tự động thu gọn \`\\n\\n+\` thừa bên trong block về \`\\n\` đơn để bảo toàn khóa đoạn \`1:1\`.
- **Tương thích SDK \`@google/genai\` v2.31.0 (\`resolveModelSafeThinkingLevel\`)**: Tự động nâng \`minimal\` lên \`low\` trên các model không hỗ trợ \`minimal\` (\`gemini-flash-latest\`, \`gemini-3-flash-preview\`, \`gemini-3.1-pro-preview\`) để tránh lỗi HTTP 400, giữ nguyên \`minimal\` trên \`gemini-3.1-flash-lite-preview\`, đặt \`max_output_tokens: 65536\`.
- **Pool 50 API Key & Cô Lập Key Tuyệt Đối**: Chỉ sử dụng danh sách API Key do người dùng nhập (đồng bộ qua \`X-MHC-User-Keys\`), tự động xoay vòng Round-Robin & Cooldown khi gặp lỗi 429, kèm nút \`Xóa sạch Key\`.

## 4. DỊCH HÀNG LOẠT ĐA LUỒNG, HEARTBEAT STREAMING 5 GIÂY & TỰ PHỤC HỒI MẠNG
- Hỗ trợ \`Tạm dừng\`, \`Tiếp tục\`, \`Dừng hẳn\` (khôi phục trạng thái gốc cho các chương đang chờ) và tự động tạm dừng khi toàn bộ Pool Key chạm giới hạn 429.
- **Heartbeat Streaming 5s (\`withHeartbeatStream\`)**: Giữ kết nối HTTP 200 luôn sống, chống đứt kết nối 300s Gateway Timeout.
- **Tự động thử lại (\`safeFetchJson\` + Re-queue 2 lần)** khi gặp lỗi mạng tạm thời (\`Failed to fetch\`, \`502/503/504\`).

## 5. HỆ THỐNG KIỂM ĐỊNH QA 8 TIÊU CHÍ & DANH SÁCH TRẮNG TỪ ĐỒNG HÌNH TIẾNG VIỆT
1. **Sót Hán tự (\`chinese_residual\`)**
2. **Lọt từ tiếng Anh (\`english_leak\`)** — tích hợp \`VIETNAMESE_HOMOGRAPH_WORDS\` (hơn 200 âm tiết tiếng Việt không dấu như *in, then, than, the, to, do, so, no, an, my, long, song, trang, linh, tinh, minh, sinh, kinh, ban, tan, van, nam, tam, cam, lam, son, lon, con, non, don, hon, bon, mon, bun, mun...*) để không bao giờ báo lỗi giả.
3. **Chưa dịch Tiêu đề (\`untranslated_title\`)**
4. **Lệch đoạn Block 1:1 (\`block_mismatch\`)**
5. **Lệch tỷ lệ độ dài (\`length_ratio\`)**
6. **Lặp đoạn bất thường (\`repeated_paragraph\`)**
7. **Lẫn Code Fence / Lời dẫn AI & Ngắt cụt cuối chương (\`code_fence\` / \`abrupt_ending\`)**
8. **Vi phạm Từ điển / Từ cấm (\`glossary_violation\`)**

## 6. BÀN BIÊN TẬP ĐỐI CHIẾU 1:1 THEO BLOCK ID (\`TITLE\`, \`P0001..Pxxxx\`)
- **Thanh công cụ ghim cố định**: \`Phóng lớn / Thu nhỏ\`, \`TXT active\`, \`Đọc / Biên tập\`, \`AI biên tập\` (tự động chọn \`realign_chapter\` hoặc \`block_cleanup\`), \`Dịch lại...\`, \`Lưu revision\`, \`Duyệt\`, \`Undo / Redo\`, \`Copy / Cut / Paste\`, \`Khôi phục active\`, \`Nhập bản dịch cả chương\`, \`Chuẩn hóa câu\`, \`Tất cả / Block lỗi\`, \`Tìm & Thay\`, \`Sửa raw\`.
- **5 Nút AI từng Block**: \`AI Dịch Block\`, \`Chuốt mượt\`, \`Sửa xưng hô\`, \`3 Gợi ý\`, \`Lệnh AI...\`.
- **5 Nút Cấu trúc khớp đoạn 1:1**: \`Gộp ↓\`, \`Tách ↵\`, \`Đẩy ↓\`, \`Kéo ↑\`, \`Xóa Hán\`.

## 7. CHẾ ĐỘ ĐỌC SÁCH, 6 CHỦ ĐỀ, 9 PHÔNG CHỮ & HIGHLIGHT 3 MÀU
- **6 Chủ đề**: *Giấy Tuyên Chỉ, Vàng Cổ Điển, Đậu Lục Dịu Mắt, Trắng Tinh Khiết, Xám Khói Chiều, Đêm Huyền Mặc* + bảng chọn màu HEX/RGB.
- **9 Phông chữ tiếng Việt tích hợp** + tải phông chữ cá nhân (\`.ttf, .otf, .woff, .woff2\`).
- **3 Màu Highlight cổ điển**: *Vàng Hổ Phách (\`amber\`), Xanh Ngọc Bích (\`jade\`), Xanh Thanh Thiên (\`blue\`)*.

## 8. ĐÓNG GÓI EPUB 3.0, SAO LƯU GOOGLE DRIVE, TERMINAL & PHÍM TẮT
- Xuất Ebook \`.EPUB\` chuẩn 3.0 (có ảnh bìa & mục lục tự động), xuất \`.ZIP\` / \`.TXT\`, sao lưu \`.JSON\` và đồng bộ **Google Drive (OAuth 2.0)**.
- **Phím tắt toàn cục**: \`Ctrl + S\` (Lưu chương), \`Alt + ←\` / \`Alt + →\` (Chương trước / Chương sau), \`Ctrl + \\\`\` (Bật/Tắt System Terminal), \`Ctrl + Z\` / \`Ctrl + Y\` (Undo/Redo), \`Shift + Click\` (Chọn dải chương).
`;

export default function UserGuideModal({
  isOpen,
  onClose,
}: UserGuideModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GUIDE_SECTIONS;
    return GUIDE_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.items.some(
          (item) =>
            item.heading.toLowerCase().includes(q) ||
            item.bullets.some((b) => b.toLowerCase().includes(q)) ||
            (item.tip && item.tip.toLowerCase().includes(q))
        )
    );
  }, [searchQuery]);

  const currentSection = useMemo(() => {
    return (
      filteredSections.find((s) => s.id === activeSectionId) ||
      filteredSections[0] ||
      GUIDE_SECTIONS[0]
    );
  }, [filteredSections, activeSectionId]);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    const blob = new Blob([FULL_MARKDOWN_CONTENT], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HUONG_DAN_SU_DUNG_MAC_HIEN_CAC.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(FULL_MARKDOWN_CONTENT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs">
      <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#D8D0C0] bg-[#FBF8F1] text-[#1E1B18] shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DEC9] bg-[#F4EFE6] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8C2D19] text-[#FBF8F1] shadow-xs">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold tracking-tight text-[#1E1B18]">
                  Cẩm Nang Hướng Dẫn Sử Dụng — Mặc Hiên Các
                </h2>
                <span className="rounded-md border border-[#8C2D19]/30 bg-[#8C2D19]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#8C2D19]">
                  Preset v1.14.1 • SDK v2.31.0
                </span>
              </div>
              <p className="text-xs text-[#6E675F]">
                Tài liệu hướng dẫn toàn diện 100% tính năng Dịch thuật, Biên tập 1:1 Block-ID, Kiểm định QA 8 tiêu chí & Xuất bản EPUB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 rounded-md border border-[#D8D0C0] bg-white px-3 py-1.5 text-xs font-medium text-[#4A453F] transition hover:bg-[#EFEAE0]"
              title="Sao chép toàn bộ nội dung tài liệu Markdown"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                  <span className="text-emerald-700">Đã sao chép MD</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 rounded-md bg-[#8C2D19] px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#722211]"
              title="Tải tệp HUONG_DAN_SU_DUNG_MAC_HIEN_CAC.md về máy"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải file .MD</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#6E675F] transition hover:bg-[#E5DEC9] hover:text-[#1E1B18]"
              title="Đóng cửa sổ Hướng dẫn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Left TOC Sidebar + Right Detailed Guide */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="flex w-72 shrink-0 flex-col border-r border-[#E5DEC9] bg-[#F4EFE6]/70">
            <div className="border-b border-[#E5DEC9] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8C8479]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tính năng, phím tắt, QA..."
                  className="w-full rounded-md border border-[#D8D0C0] bg-white py-1.5 pr-7 pl-8 text-xs text-[#1E1B18] placeholder-[#9C9488] focus:border-[#8C2D19] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-[#8C8479] hover:text-[#1E1B18]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2.5">
              {filteredSections.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#8C8479]">
                  Không tìm thấy mục hướng dẫn nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                filteredSections.map((sec) => {
                  const isActive = currentSection.id === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        isActive
                          ? 'bg-[#8C2D19] font-semibold text-white shadow-xs'
                          : 'text-[#3D3833] hover:bg-[#E5DEC9]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={
                            isActive ? 'text-white' : 'text-[#8C2D19]'
                          }
                        >
                          {sec.icon}
                        </span>
                        <span className="truncate">{sec.shortTitle}</span>
                      </div>
                      {sec.badge && (
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#8C2D19]/10 text-[#8C2D19]'
                          }`}
                        >
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Keyboard Shortcuts Summary Card */}
            <div className="border-t border-[#E5DEC9] bg-[#EFEAE0]/70 p-3 text-[11px] text-[#5C554D]">
              <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-[#1E1B18]">
                <Keyboard className="h-3.5 w-3.5 text-[#8C2D19]" />
                <span>Phím tắt Toàn cục Nhanh</span>
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span>Lưu chương & Quét QA:</span>
                  <kbd className="rounded border border-[#D8D0C0] bg-white px-1">
                    Ctrl + S
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Chương Trước / Sau:</span>
                  <kbd className="rounded border border-[#D8D0C0] bg-white px-1">
                    Alt + ← / →
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>System Terminal:</span>
                  <kbd className="rounded border border-[#D8D0C0] bg-white px-1">
                    Ctrl + `
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Hoàn tác / Làm lại:</span>
                  <kbd className="rounded border border-[#D8D0C0] bg-white px-1">
                    Ctrl + Z / Y
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Section Header Banner */}
              <div className="rounded-xl border border-[#E5DEC9] bg-[#F4EFE6] p-5">
                <div className="flex items-center gap-2.5 text-[#8C2D19]">
                  {currentSection.icon}
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase">
                    Mục Hướng Dẫn Chi Tiết
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-xl font-bold text-[#1E1B18]">
                  {currentSection.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A453F]">
                  {currentSection.summary}
                </p>
              </div>

              {/* Detailed Cards */}
              <div className="space-y-4">
                {currentSection.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E5DEC9] bg-white p-5 shadow-2xs"
                  >
                    <h4 className="flex items-center gap-2 font-serif text-base font-bold text-[#1E1B18]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#8C2D19]" />
                      <span>{item.heading}</span>
                    </h4>

                    <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#3D3833]">
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C2D19]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {item.tip && (
                      <div className="mt-4 rounded-lg border border-amber-300/70 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-900">
                        <strong className="font-semibold">💡 Mẹo thực chiến: </strong>
                        {item.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Prev / Next Section Navigation */}
              <div className="flex items-center justify-between border-t border-[#E5DEC9] pt-4">
                {(() => {
                  const currIdx = GUIDE_SECTIONS.findIndex(
                    (s) => s.id === currentSection.id
                  );
                  const prevSec = currIdx > 0 ? GUIDE_SECTIONS[currIdx - 1] : null;
                  const nextSec =
                    currIdx >= 0 && currIdx < GUIDE_SECTIONS.length - 1
                      ? GUIDE_SECTIONS[currIdx + 1]
                      : null;

                  return (
                    <>
                      {prevSec ? (
                        <button
                          type="button"
                          onClick={() => setActiveSectionId(prevSec.id)}
                          className="rounded-lg border border-[#D8D0C0] bg-white px-3.5 py-2 text-xs font-medium text-[#3D3833] transition hover:bg-[#F4EFE6]"
                        >
                          ← {prevSec.shortTitle}
                        </button>
                      ) : (
                        <div />
                      )}

                      {nextSec ? (
                        <button
                          type="button"
                          onClick={() => setActiveSectionId(nextSec.id)}
                          className="rounded-lg bg-[#8C2D19] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#722211]"
                        >
                          Tiếp theo: {nextSec.shortTitle} →
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-800"
                        >
                          Hoàn tất & Bắt đầu làm việc ✓
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
