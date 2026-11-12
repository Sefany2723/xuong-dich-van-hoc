# 🏛️ CẨM NANG HƯỚNG DẪN SỬ DỤNG TOÀN DIỆN — MẶC HIÊN CÁC (AI TRANSLATION STUDIO)

Chào mừng bạn đến với **Mặc Hiên Các (AI Translation Studio)** — Bàn làm việc Dịch thuật, Biên tập 1:1 Block-ID, Kiểm định QA 8 Tiêu chí, Quản lý Đa Dự Án & Xuất bản Ebook chuyên nghiệp dành cho tiểu thuyết Trung–Việt (Tiên hiệp, Huyền huyễn, Khoa huyễn, Võng du, Đô thị, Ngôn tình, Lịch sử, Đồng nhân...).

Tài liệu này mô tả chi tiết **100% tính năng thực tế** đang hoạt động trong hệ thống, từ bước nạp dữ liệu đầu vào, cấu hình 4 Preset Dịch/Biên tập chuẩn `v1.14.1` & `v1.14.0`, cơ chế xoay vòng Pool 50 Gemini API Key độc lập, Heartbeat Streaming chống đứt kết nối 300s, Bàn Biên Tập Đối Chiếu 1:1 Block-ID, Bộ Quét Lỗi QA 8 Tiêu Chí, cho đến đóng gói EPUB chuẩn xuất bản và lưu trữ đám mây Google Drive.

---

## MỤC LỤC NHANH
1. [Bố cục Tổng thể & Dự án mẫu Xích Tâm Tuần Thiên](#1-bố-cục-tổng-thể--dự-án-mẫu-xích-tâm-tuần-thiên)
2. [Quản lý Đa Dự Án (Thư Viện Truyện) & Nhập Dữ Liệu Đầu Vào](#2-quản-lý-đa-dự-án-thư-viện-truyện--nhập-dữ-liệu-đầu-vào)
3. [Cấu hình 4 Preset Dịch/Biên tập (v1.14.1 & v1.14.0), Model Gemini & Pool 50 API Key](#3-cấu-hình-4-preset-dịchbiên-tập-v1141--v1140-model-gemini--pool-50-api-key)
4. [Dịch Hàng Loạt Đa Luồng, Heartbeat Streaming & Tự Phục Hồi Lỗi Mạng](#4-dịch-hàng-loạt-đa-luồng-heartbeat-streaming--tự-phục-hồi-lỗi-mạng)
5. [Hệ thống Kiểm Định Chất Lượng QA 8 Tiêu Chí & Lọc Từ Đồng Hình Tiếng Việt](#5-hệ-thống-kiểm-định-chất-lượng-qa-8-tiêu-chí--lọc-từ-đồng-hình-tiếng-việt)
6. [Bàn Biên Tập Bản Dịch Đối Chiếu 1:1 Theo Block ID (TITLE, P0001..Pxxxx)](#6-bàn-biên-tập-bản-dịch-đối-chiếu-11-theo-block-id-title-p0001pxxxx)
7. [Từ Điển Thuật Ngữ (Glossary) & Quét AI Tự Động](#7-từ-điển-thuật-ngữ-glossary--quét-ai-tự-động)
8. [Tìm Kiếm & Thay Thế Toàn Văn (Full-Text Search & Replace)](#8-tìm-kiếm--thay-thế-toàn-văn-full-text-search--replace)
9. [Chế Độ Đọc Sách (Reader Mode), 6 Chủ Đề, 9 Phông Chữ & Highlight 3 Màu](#9-chế-độ-đọc-sách-reader-mode-6-chủ-đề-9-phông-chữ--highlight-3-màu)
10. [Đóng Gói Ebook EPUB Chuẩn Xuất Bản, Xuất ZIP & Đồng Bộ Google Drive](#10-đóng-gói-ebook-epub-chuẩn-xuất-bản-xuất-zip--đồng-bộ-google-drive)
11. [System Terminal (Nhật Ký Thời Gian Thực) & Bảng Phím Tắt Toàn Cục](#11-system-terminal-nhật-ký-thời-gian-thực--bảng-phím-tắt-toàn-cục)

---

## 1. BỐ CỤC TỔNG THỂ & DỰ ÁN MẪU XÍCH TÂM TUẦN THIÊN

### 1.1. Dự án mẫu tích hợp sẵn (`Xích Tâm Tuần Thiên`)
Ngay khi khởi chạy lần đầu, hệ thống tự động khởi tạo trong **IndexedDB** của trình duyệt bộ dữ liệu mẫu:
- **Truyện mẫu**: **Xích Tâm Tuần Thiên (`赤心巡天` — Tình Hà Dĩ Thậm)**.
- **6 chương thực tế (`0000`–`0005`)**: Bao gồm chương dẫn và 5 chương đầu tiên đã có bản dịch đối chiếu 1:1 để bạn thử nghiệm ngay các công cụ Biên tập Block-ID, Quét QA, Đọc sách và Xuất EPUB.
- **20 thuật ngữ Glossary mẫu**: Gồm nhân vật, địa danh, cảnh giới và pháp bảo tiêu biểu (*Khương Vọng, Tả Quang Liệt, Công Dương Bạch, Mặc Kinh Vũ, Lý Nhất, Đỗ Như Hối, Phong Lâm Thành, Trang Quốc, Thái Hư Huyễn Cảnh, Động Chân Khư, Thông Thiên Cung, Du Mạch, Chu Thiên Tinh Đấu Trận, Trường Tương Tư...*).

### 1.2. Ba vùng làm việc chính
Giao diện **Mặc Hiên Các** được thiết kế theo phong cách thư phòng cổ điển ấm áp (*Warm Literary Studio*), giảm mỏi mắt khi làm việc liên tục nhiều giờ:
- **Thanh Công Cụ Đỉnh (Top Header Bar)**:
  - **Cụm Trái**: Nút mở **Thư Viện** (hiển thị tên bộ truyện đang mở, tổng số chương và số mục Glossary), nút bật/tắt nhanh **Glossary: TẮT / BẬT** (mặc định **TẮT** để AI chủ động dịch linh hoạt theo ngữ cảnh), và bộ chuyển đổi 2 chế độ trung tâm: **Biên tập bản dịch** ↔ **Đọc**.
  - **Cụm Phải**:
    - **Nhập Chương**: Nhập chương mới từ 6 nguồn linh hoạt.
    - **Preset & Model**: Quản lý 4 Preset Dịch/Biên tập chuẩn, cấu hình Model Gemini, Pool 50 API Key, Quy tắc QA và Từ điển Glossary.
    - **Giao Diện Đọc**: Tùy chỉnh sâu màu sắc nền/chữ (6 chủ đề + bảng chọn HEX/RGB) và bộ phông chữ tiếng Việt (9 phông tích hợp + tải phông `.ttf/.otf/.woff2` từ máy).
    - **Terminal**: Mở bảng nhật ký hệ thống thời gian thực (**System Terminal**, phím tắt `Ctrl + \``).
    - **Hướng Dẫn**: Mở cẩm nang hướng dẫn sử dụng tương tác ngay trong ứng dụng.
    - **EPUB & Backup**: Xuất Ebook `.epub`, xuất gói `.zip`, sao lưu `.json` hoặc đồng bộ đám mây **Google Drive**.
- **Cột Trái (Sidebar Quản lý Chương & Hàng đợi Dịch)**:
  - Có thể thu gọn/mở rộng hoặc bấm nút **Phóng lớn** ở thanh công cụ biên tập để ẩn cột trái và tập trung 100% không gian cho bàn biên tập 2 cột.
  - Bao gồm: Thống kê trạng thái chương (`Chưa dịch`, `Đã dịch`, `Đã duyệt`, `Lỗi`), Bộ lọc QA 8 tiêu chí, Ô tìm kiếm theo `#Mã` hoặc `Toàn văn`, Thanh công cụ chọn chương hàng loạt (`Chỉ chọn kết quả lọc`, `Bỏ chọn`, `Đảo`, `Khoảng...`), Bộ chọn mức suy luận `Thinking: minimal | low | medium | high`, và cụm nút **Dịch (N)** / **Biên tập AI (N)**.
- **Không Gian Trung Tâm (Main Workspace)**:
  - Chuyển đổi mượt mà giữa **Bàn Biên Tập Bản Dịch Đối Chiếu 1:1 Theo Block ID** và **Trang Đọc Sách (Reader Mode)**.

---

## 2. QUẢN LÝ ĐA DỰ ÁN (THƯ VIỆN TRUYỆN) & NHẬP DỮ LIỆU ĐẦU VÀO

### 2.1. Thư Viện Truyện (`Thư Viện`)
Bấm vào thẻ tên truyện ở góc trên bên trái để mở **Thư Viện Truyện**:
- **Tạo truyện mới**: Nhập Tên truyện tiếng Việt, Tên Hán tự gốc, Tác giả, Mô tả tóm tắt và chọn sẵn Preset Dịch thuật + Preset Biên tập riêng cho bộ truyện đó.
- **Chuyển đổi dự án tức thì**: Mỗi bộ truyện có danh sách Chương, Từ điển Glossary, Đánh dấu trang (Bookmark) và Ghi chú Highlight tách biệt hoàn toàn trong IndexedDB.
- **Sửa thông tin & Xóa dự án**: Cập nhật thông tin metadata hoặc xóa sạch một bộ truyện cùng toàn bộ chương liên quan.

### 2.2. Nhập Chương Đầu Vào (`Nhập Chương` — 6 Phương Thức)
1. **Tải nhiều tệp `.txt` lẻ**:
   - Hỗ trợ kéo thả hàng trăm tệp `.txt` cùng lúc.
   - Tự động nhận diện số thứ tự chương từ tên tệp (ví dụ `0001_第1章...txt`, `Chương 12.txt`) hoặc dòng tiêu đề đầu tiên, cấp mã định danh 4 chữ số (`0001`, `0002`...).
   - **Tự động giải mã bảng mã (Auto-Encoding Detection)**: Tự động phát hiện và chuyển đổi chính xác cả `UTF-8`, `GB18030 / GBK` (phổ biến ở nguồn truyện Trung Quốc) và `UTF-16LE/BE`, chống lỗi chữ Hán biến thành ký tự lạ (`???` / Mojibake).
2. **Tải 1 tệp `.txt` gộp lớn (Auto-Split Regex)**:
   - Dành cho tệp nguyên bản chứa toàn bộ 500 – 3.000 chương trong một file `.txt` duy nhất.
   - Bộ cắt chương tự động nhận diện tiêu đề Hán ngữ (`第...章/节/回/卷/集`, `楔子`, `序章`) và tiêu đề tiếng Việt (`Chương/Hồi/Quyển...`), tách thành từng chương độc lập chỉ trong vài giây.
3. **Tải gói nén `.zip`**:
   - Giải nén trực tiếp trên trình duyệt, lọc các tệp `.txt` bên trong, tự động sắp xếp theo thứ tự số chương và kiểm tra trùng lặp.
4. **Dán văn bản trực tiếp (Paste Raw)**:
   - Dán nhanh 1 chương (hoặc nhiều chương để tự tách) trực tiếp từ clipboard.
5. **Tải từ URL Web (Web Scraper)**:
   - Dán danh sách URL chương truyện để máy chủ tải nội dung văn bản thô về dự án.
6. **Nhập Bản Dịch Có Sẵn (`Nhập bản dịch` ở chân Cột Trái)**:
   - Cho phép nạp các tệp `.txt` hoặc `.zip` đã dịch sẵn từ bên ngoài để khớp nối tự động với các chương tiếng Trung gốc trong dự án (theo số chương hoặc mã `orderPrefix`), phục vụ quy trình kiểm định QA và biên tập lại bằng AI.

---

## 3. CẤU HÌNH 4 PRESET DỊCH/BIÊN TẬP (v1.14.1 & v1.14.0), MODEL GEMINI & POOL 50 API KEY

Bấm nút **Preset & Model** trên thanh công cụ đỉnh để mở trung tâm điều khiển AI gồm 3 tab chuyên sâu:

### 3.1. Tab 1 — Chỉ Dẫn Dịch Thuật & Biên Tập (4 Preset Chuẩn Tích Hợp Sẵn)
Hệ thống tích hợp sẵn **4 bộ Chỉ dẫn hệ thống (System Instruction)** đã được chuẩn hóa cho giao thức khóa đoạn `1:1 Block-ID`:

1. **Dịch Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1)** *(Mặc định Dịch thuật)*:
   - Cấu trúc **8 mục tinh gọn (~4.900 ký tự)** tối ưu tốc độ và độ tuân thủ cho dòng Gemini Flash / Flash-Lite: (1) Vai trò & Mục tiêu cốt lõi, (2) Nguyên tắc trung thành tuyệt đối với nguyên tác, (3) Xử lý từ vựng, thuật ngữ & tên riêng, (4) Đại từ nhân xưng & giọng điệu nhân vật, (5) Văn phong & câu cú tiếng Việt, (6) Xử lý các yếu tố đặc thù theo ngữ cảnh, (7) Bố cục, định dạng & trình bày (khóa 1:1 Block-ID), (8) Kiểm soát chất lượng trước khi xuất.
2. **Dịch Truyện Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 15 Mục 1.14.0)**:
   - Bản quy tắc chi tiết 15 mục (~9.400 ký tự) dành cho người dùng muốn kiểm soát sâu từng trường hợp tu từ, thành ngữ, thơ phú và khẩu ngữ.
3. **Biên Tập Trung–Việt — Flash Đa Thể Loại (Bản Chuẩn 1.14.1)** *(Mặc định Biên tập AI)*:
   - Cấu trúc **9 mục tinh gọn (~6.900 ký tự)** chuyên trách hậu kỳ bản dịch đối chiếu với nguyên tác tiếng Trung: Quét sạch chữ Hán sót, xử lý từ tiếng Anh lọt và lỗi dịch máy (Convert/QT), chuẩn hóa đại từ nhân xưng theo quan hệ & tâm lý, chuốt mượt câu văn tiếng Việt tự nhiên mà vẫn giữ khóa đoạn 1:1 tuyệt đối.
4. **Biên Tập AI Truyện Dịch Trung–Việt — Flash / Flash-Lite (Bản Đầy Đủ 13 Mục 1.14.0)**:
   - Bản quy tắc biên tập mở rộng 13 mục (~10.500 ký tự) dành cho quy trình biên tập sâu toàn chương.

> **Lưu ý quan trọng về bảo toàn cấu trúc 1:1 và ngắt dòng nội bộ (`\n`)**:
> - Hệ thống giữ nguyên **ngắt dòng đơn (`\n`)** bên trong cùng một Block cho **thơ ca, câu đối, bảng thuộc tính hệ thống (System Panel), thư từ**, đồng thời tự động gộp các dòng trống thừa (`\n\n+`) bên trong một block về `\n` đơn để không bao giờ làm lệch số đoạn `1:1` giữa bản Trung và bản Việt.
> - Theo nguyên tắc trung thành 1:1 của Preset `1.14.1`, nếu văn bản gốc có dòng chú thích của tác giả (PS, cầu nguyệt phiếu...) nằm thành đoạn riêng, AI vẫn dịch và giữ đúng Block ID đó; nếu bạn muốn xóa hẳn đoạn thừa trong nguyên tác, hãy dùng chế độ **Sửa raw** trong Bàn Biên Tập.

Bạn cũng có thể bấm **+ Tạo mới**, **Nhân bản**, **Nhập .md/.txt** hoặc **Xuất .md** để quản lý kho Preset cá nhân hóa.

### 3.2. Tab 2 — Cấu hình Model Gemini, Thinking Level, Quy tắc QA & Pool 50 API Key
- **Danh sách Model Gemini hỗ trợ**:
  - `gemini-3.1-flash-lite-preview` *(Mặc định — Tốc độ cực nhanh, tối ưu dịch hàng loạt)*
  - `gemini-3-flash-preview` *(Cân bằng tốc độ và chiều sâu văn phong)*
  - `gemini-flash-latest` *(Bản Flash ổn định)*
  - `gemini-3.1-pro-preview` *(Chất lượng suy luận cao nhất cho chương khó, nhiều thơ cổ)*
  - Hỗ trợ nút **Cập nhật Model mới từ Google API** để lấy danh sách model khả dụng trực tiếp từ tài khoản API Key của bạn.
- **Mức độ suy luận (`Thinking Level`: `minimal` | `low` | `medium` | `high`) & Cơ chế Tự Tương Thích SDK `@google/genai` v2.31.0**:
  - Có thể chỉnh nhanh ngay tại thanh chọn `Thinking` ở Cột Trái hoặc trong Modal Cấu hình.
  - **Tự động nâng cấp an toàn (`resolveModelSafeThinkingLevel`)**: Dòng `gemini-3.1-flash-lite` hỗ trợ đầy đủ 4 mức `minimal / low / medium / high`. Với các dòng model không hỗ trợ `minimal` (`gemini-flash-latest`, `gemini-3-flash-preview`, `gemini-3.1-pro-preview`), máy chủ tự động nâng `minimal` lên `low` để tránh tuyệt đối lỗi `HTTP 400 Invalid thinking_level`, đồng thời khóa `max_output_tokens: 65536` và loại bỏ các tham số lấy mẫu lỗi thời (`temperature`, `top_p`) theo chuẩn Interactions API mới nhất.
- **Pool tối đa 50 Gemini API Key & Cơ chế Cô Lập Key Tuyệt Đối (Zero-Built-In-Key Isolation)**:
  - Hệ thống **chỉ sử dụng duy nhất danh sách API Key do bạn nhập vào** (tối đa 50 Key), được lưu cục bộ trên trình duyệt (`localStorage`) và đồng bộ tức thì sang bộ nhớ phiên của Server qua header `X-MHC-User-Keys` / `/api/models`.
  - **Không bao giờ dùng trộm hoặc fallback sang biến môi trường của máy chủ**, đảm bảo tính riêng tư tuyệt đối khi chia sẻ ứng dụng.
  - Khi chạy dịch đa luồng, hệ thống tự động chia tải **Round-Robin** qua các Key khỏe mạnh; nếu một Key chạm hạn mức `429 Rate Limit / Quota`, Key đó được đưa vào trạng thái **Cooldown** và luồng dịch tự động nhảy sang Key tiếp theo.
  - Nút **Xóa sạch Key**: Xóa toàn bộ API Key khỏi cả trình duyệt và bộ nhớ Server chỉ với 1 cú nhấp chuột trước khi bạn Publish hoặc chia sẻ dự án.
- **Cấu hình Số Luồng Song Song (`Concurrency`: `1` – `10`)**:
  - Điều chỉnh số chương xử lý đồng thời theo số lượng API Key bạn đang có.
- **Tùy chỉnh Quy tắc Quét QA & Từ Cấm**:
  - Bật/tắt từng quy tắc kiểm định QA, điều chỉnh ngưỡng tỷ lệ độ dài (`minLengthRatio` – `maxLengthRatio`) và danh sách từ cấm / đại từ không mong muốn.

### 3.3. Tab 3 — Từ Điển Thuật Ngữ & Xưng Hô (Glossary)
Xem chi tiết tại [Mục 7](#7-từ-điển-thuật-ngữ-glossary--quét-ai-tự-động).

---

## 4. DỊCH HÀNG LOẠT ĐA LUỒNG, HEARTBEAT STREAMING & TỰ PHỤC HỒI LỖI MẠNG

### 4.1. Chọn chương và Khởi chạy Hàng đợi
1. Tại Cột Trái, tick chọn các chương cần xử lý (hỗ trợ giữ phím **`Shift + Click`** để chọn cả dải chương, hoặc dùng các nút `Chỉ chọn kết quả lọc`, `Đảo`, `Khoảng...` để chọn từ chương X đến chương Y).
2. Chọn mức `Thinking` mong muốn ngay trên thanh điều khiển Cột Trái.
3. Bấm **Dịch (N)** để dịch mới từ nguyên tác tiếng Trung, hoặc bấm **Biên tập AI (N)** để AI hậu kỳ, sửa lỗi QA và căn chỉnh lại 1:1 cho các chương đã có bản dịch.

### 4.2. Điều khiển Tiến trình Hàng đợi (Pause / Resume / Hard Stop)
- **Tạm dừng (`Tạm dừng`) & Tiếp tục (`Tiếp tục`)**: Tạm ngưng nhận chương mới bất kỳ lúc nào và bấm Tiếp tục ngay tại vị trí đang dở.
- **Dừng hẳn (`Dừng hẳn`)**: Hủy ngay lập tức các kết nối mạng đang chạy (`AbortController`) và tự động khôi phục trạng thái gốc (`Chưa dịch` / `Đã dịch`) cho toàn bộ các chương đang xếp hàng, không bao giờ để chương bị kẹt ở trạng thái `Đang chờ`.
- **Tự động Tạm dừng Thông minh khi hết sạch Quota (`429 Pool Exhausted`)**: Nếu toàn bộ API Key trong Pool đều chạm giới hạn `429`, hàng đợi tự động chuyển sang trạng thái **Tạm dừng an toàn** kèm thông báo rõ ràng để bạn nạp thêm Key hoặc đợi hết Cooldown rồi bấm **Tiếp tục**.

### 4.3. Heartbeat Streaming 5 Giây & Tự Động Thử Lại (`Auto-Retry`)
- **Chống đứt kết nối 300s (`withHeartbeatStream`)**: Các chương dài hoặc dùng mức suy luận `high` trên `gemini-3.1-pro-preview` có thể mất hơn 60–180 giây để suy nghĩ. Máy chủ tự động mở luồng `HTTP 200` và gửi nhịp tim (`heartbeat whitespace`) mỗi **5 giây** về trình duyệt, giữ kết nối luôn sống và loại bỏ hoàn toàn lỗi `504 Gateway Timeout` của proxy đám mây.
- **Tự động phục hồi lỗi mạng (`safeFetchJson` + Hàng đợi thử lại 2 lần)**: Nếu mạng chập chờn gây lỗi `Failed to fetch` hoặc `502/503/504`, client tự động backoff và thử lại; nếu vẫn lỗi tạm thời trong hàng đợi, chương đó được tự động xếp vào cuối hàng đợi để dịch lại tối đa **2 lần** trước khi đánh dấu lỗi.

---

## 5. HỆ THỐNG KIỂM ĐỊNH CHẤT LƯỢNG QA 8 TIÊU CHÍ & LỌC TỪ ĐỒNG HÌNH TIẾNG VIỆT

Mỗi khi một chương được dịch xong, lưu biên tập, hoặc khi bạn bấm nút **Quét QA** ở Cột Trái, hệ thống tự động kiểm định chất lượng chương đó qua **8 tiêu chí chuyên sâu** và hiển thị bộ lọc trực quan ngay trên Cột Trái:

1. **Sót Hán tự (`chinese_residual`)**: Phát hiện mọi ký tự chữ Hán (`\u4e00-\u9fff`) còn sót lại trong tiêu đề hoặc nội dung bản dịch.
2. **Lọt từ tiếng Anh (`english_leak`) — Kèm Bộ Lọc Từ Đồng Hình Tiếng Việt Không Dấu (`VIETNAMESE_HOMOGRAPH_WORDS`)**:
   - Bắt chính xác các từ tiếng Anh do AI trượt ngôn ngữ (*the, and, with, from, into, however, suddenly, system, level, chapter...*) hoặc từ nối xuất hiện ngay sau dấu phẩy/dấu chấm.
   - **Đặc biệt**: Tích hợp danh sách trắng **hơn 200 âm tiết tiếng Việt đồng hình với tiếng Anh** (*in, then, than, the, to, do, so, no, an, my, long, song, trang, linh, tinh, minh, sinh, kinh, dinh, vinh, ban, tan, van, man, lan, can, dan, han, san, nam, tam, cam, lam, sam, dam, ham, sen, men, len, ken, hen, son, lon, con, non, don, hon, bon, mon, bun, mun, lun, sun, phun,ngon...*). Nhờ đó, văn bản tiếng Việt hoặc lời dẫn không dấu hợp lệ không bao giờ bị báo lỗi nhầm là tiếng Anh, trừ khi đi thành cụm tiếng Anh thực sự (ví dụ `in the`, `to the`, `do not`).
3. **Chưa dịch Tiêu đề (`untranslated_title`)**: Cảnh báo khi tiêu đề chương còn trống, còn chữ Hán hoặc thiếu tiền tố `Chương X:`.
4. **Lệch đoạn Block 1:1 (`block_mismatch`)**: Cảnh báo ngay lập tức nếu tổng số đoạn văn bản dịch (`P0001..Pxxxx`) không khớp 1:1 với tổng số đoạn văn nguyên tác tiếng Trung.
5. **Lệch tỷ lệ độ dài (`length_ratio`)**: Cảnh báo khi độ dài tiếng Việt/tiếng Trung thấp bất thường (nghi ngờ AI tóm tắt/bỏ sót đoạn) hoặc cao bất thường (nghi ngờ lặp văn bản).
6. **Lặp đoạn bất thường (`repeated_paragraph`)**: Phát hiện các đoạn văn có nội dung giống hệt nhau bị AI sinh lặp lại trong cùng một chương.
7. **Lẫn Code Fence / Lời dẫn AI & Ngắt cụt cuối chương (`code_fence` / `abrupt_ending`)**: Phát hiện thẻ ```` ``` ````, nhãn JSON rác, câu mở đầu kiểu *"Dưới đây là bản dịch..."*, hoặc câu cuối chương bị đứt ngang không có dấu kết câu hợp lệ.
8. **Vi phạm Từ điển / Từ cấm (`glossary_violation`)**: Phát hiện các từ nằm trong danh sách Từ cấm hoặc các thuật ngữ chữ Hán có trong Glossary của chương nhưng bản dịch lại không xuất hiện từ tiếng Việt chuẩn tương ứng.

---

## 6. BÀN BIÊN TẬP BẢN DỊCH ĐỐI CHIẾU 1:1 THEO BLOCK ID (`TITLE`, `P0001..Pxxxx`)

Khi ở chế độ **Biên tập bản dịch**, mỗi chương được tách thành các cặp đoạn khóa cứng `1:1` từ `TITLE` đến `P0001`, `P0002`, ..., `Pxxxx` (trái: Nguyên tác tiếng Trung — phải: Bản dịch tiếng Việt):

### 6.1. Thanh Tiêu Đề Phụ & Thanh Công Cụ Ghim Cố Định (Pinned Editor Toolbar)
- **Điều hướng Chương**: Nút `◀` (Chương trước), Danh sách thả xuống chọn chương tức thì có ô tìm kiếm (mượt mà ngay cả với bộ truyện >3.000 chương), nút `▶` (Chương sau).
- **Nút chế độ & thao tác toàn chương**:
  - **Phóng lớn / Thu nhỏ**: Ẩn Cột Trái để mở rộng toàn màn hình cho bàn biên tập 2 cột.
  - **TXT active**: Tải xuống ngay chương đang mở thành tệp `.txt` sạch đẹp.
  - **Đọc / Biên tập**: Chuyển nhanh sang giao diện Đọc sách của chương hiện tại.
  - **AI biên tập (Smart Block-ID Cleanup)**:
    - Nếu chương đang bị **Lệch đoạn 1:1 (`block_mismatch`)**, hoặc khi bạn bấm vào chương đã sạch để chuốt văn toàn bộ, hệ thống tự động gửi toàn chương theo giao thức **`realign_chapter`** để AI căn chỉnh lại chính xác từng đoạn `1:1` với nguyên tác tiếng Trung.
    - Nếu chương đã khớp số đoạn 1:1 và chỉ có một vài đoạn dính lỗi (sót chữ Hán, lọt tiếng Anh, đoạn trống), hệ thống chỉ gửi đúng **các Block lỗi (`block_cleanup`)** kèm ngữ cảnh đoạn trước/sau để sửa siêu tốc trong vài giây.
  - **Dịch lại...**: Mở hộp thoại dịch lại chương hiện tại với tùy chọn đổi Model, đổi mức `Thinking` và nhập **Yêu cầu bổ sung riêng** (ví dụ: *"Đổi xưng hô sang Ta - Ngươi, dịch hào sảng hơn"*).
  - **Lưu revision** (`Ctrl + S`) & **Duyệt**: Lưu bản sửa vào IndexedDB, quét lại QA tức thì và đánh dấu chương sang trạng thái `Đã duyệt`.
- **Thanh công cụ chỉnh sửa đoạn**:
  - **Undo (`Ctrl + Z`) / Redo (`Ctrl + Y`)**: Hoàn tác và làm lại tối đa 40 bước chỉnh sửa trong chương.
  - **Copy / Cut / Paste**: Sao chép, cắt, dán văn bản ngay trong ô Block đang đặt con trỏ.
  - **Khôi phục active**: Đưa toàn bộ nội dung chương về lại bản lưu gần nhất trong cơ sở dữ liệu.
  - **Nhập bản dịch cả chương**: Mở cửa sổ dán toàn bộ văn bản tiếng Việt từ ngoài vào chương hiện tại (kèm bộ đếm đối chiếu số đoạn thực tế so với số đoạn tiếng Trung gốc).
  - **Chuẩn hóa câu**: Tự động dọn khoảng trắng thừa, chuẩn hóa dấu câu tiếng Việt, xóa khoảng trắng trước dấu phẩy/chấm và viết hoa chữ cái đầu câu cho toàn bộ các Block trong chương.
  - **Tất cả / Block lỗi**: Bật bộ lọc chỉ hiển thị các dòng Block đang có cảnh báo lỗi QA để rà soát cực nhanh.
  - **Tìm & Thay / Thu gọn**: Mở thanh Tìm kiếm & Thay thế cục bộ ngay trong chương đang mở (hỗ trợ phân biệt hoa/thường, nguyên từ, Regex).
  - **Sửa raw**: Bật chế độ cho phép sửa trực tiếp tiêu đề và nội dung tiếng Trung gốc (`titleRaw`, `rawContent`) ngay tại chỗ nếu nguồn truyện bị dính rác quảng cáo hoặc gộp nhầm đoạn.

### 6.2. Công Cụ Vi Chỉnh Trên Từng Dòng Block (`TITLE`, `P0001..Pxxxx`)
Mỗi dòng đoạn văn trong bảng 1:1 đều có cụm công cụ riêng:
- **Nhãn cảnh báo trực quan trên từng Block**: Tự động gắn thẻ `Sót Hán`, `Lọt Anh`, `Chưa dịch` ngay trên dòng bị lỗi.
- **5 Nút AI Vi Chỉnh Từng Đoạn**:
  1. **AI Dịch Block**: Dịch lại đúng 1 đoạn văn đó từ tiếng Trung gốc (kèm ngữ cảnh đoạn liền kề).
  2. **Chuốt mượt**: Yêu cầu AI viết lại đoạn văn cho mượt mà, giàu nhịp điệu văn học hơn.
  3. **Sửa xưng hô**: Tự động rà soát và đồng bộ lại đại từ nhân xưng trong đoạn theo ngữ cảnh.
  4. **3 Gợi ý**: Sinh ra 3 phương án diễn đạt tiếng Việt khác nhau cho đoạn đó để bạn bấm chọn thay thế chỉ với 1 cú click.
  5. **Lệnh AI...**: Mở ô nhập yêu cầu tùy ý cho riêng đoạn văn đang chọn.
- **5 Nút Thao Tác Cấu Trúc Đoạn Thủ Công (Khắc phục lệch đoạn 1:1 trong tích tắc)**:
  1. **Gộp ↓**: Gộp nội dung dịch của đoạn hiện tại với đoạn ngay bên dưới.
  2. **Tách ↵**: Tách đoạn dịch hiện tại thành 2 đoạn ngay tại vị trí con trỏ chuột đang đứng (hoặc tại điểm giữa câu nếu chưa đặt con trỏ).
  3. **Đẩy ↓**: Chèn 1 ô trống tại vị trí hiện tại và đẩy các đoạn dịch bên dưới xuống 1 bậc để khớp với dòng tiếng Trung.
  4. **Kéo ↑**: Xóa ô trống hiện tại và kéo toàn bộ các đoạn dịch bên dưới dịch lên 1 bậc.
  5. **Xóa Hán**: Quét và xóa sạch ngay các ký tự chữ Hán còn lẫn trong đoạn đó.

---

## 7. TỪ ĐIỂN THUẬT NGỮ (GLOSSARY) & QUÉT AI TỰ ĐỘNG

Mở **Preset & Model** → chọn **Tab 3: Từ Điển Thuật Ngữ & Xưng Hô (Glossary)**:
- **Bật / Tắt gửi Glossary theo từng bộ truyện (`Glossary: TẮT / BẬT`)**:
  - Mặc định hệ thống để **TẮT** để tiết kiệm token và để AI dịch tự nhiên theo ngữ cảnh.
  - Khi bạn bật **Glossary: BẬT**, hệ thống sử dụng thuật toán **Lọc Glossary Thông Minh Theo Ngữ Cảnh (`filterContextualGlossary`)**: Chỉ trích xuất đúng những thuật ngữ thực sự xuất hiện trong chương đang dịch (kèm các nhân vật cốt lõi) để đính kèm vào Prompt, giúp AI dịch chuẩn 100% tên riêng mà không làm tràn bộ nhớ ngữ cảnh.
- **AI Quét Tự Động Từ Các Chương Truyện**:
  - Chọn số lượng chương muốn quét và bấm **Quét Thuật Ngữ Tự Động Bằng AI**. AI sẽ đọc nguyên tác tiếng Trung và trích xuất danh sách Tên nhân vật (`character`), Địa danh (`location`), Cảnh giới (`realm`), Chiêu thức/Pháp bảo (`skill`), Tổ chức/Tông môn (`organization`) kèm Hán Việt, Bản dịch đề xuất và Quy tắc xưng hô.
- **Nhập / Xuất CSV & Quản lý Thủ Công**:
  - Hỗ trợ tìm kiếm, lọc theo phân loại, bật/tắt từng mục thuật ngữ, thêm mới thủ công hoặc Nhập/Xuất tệp `.csv` / `.json` để dùng chung giữa các thiết bị.

---

## 8. TÌM KIẾM & THAY THẾ TOÀN VĂN (FULL-TEXT SEARCH & REPLACE)

Tại Cột Trái, chuyển chế độ tìm kiếm từ `#Mã` sang **`Toàn văn`** và nhập từ khóa (hoặc bấm biểu tượng kính lúp mở rộng) để mở **Trung Tâm Tìm Kiếm & Thay Thế Toàn Bộ Truyện**:
- **Phạm vi linh hoạt**: Tìm và thay thế trên **Tất cả chương**, **Các chương đang lọc**, hoặc **Chỉ các chương đang tick chọn**.
- **Trường dữ liệu**: Chọn tìm trong **Nội dung bản dịch**, **Tiêu đề bản dịch**, hoặc cả **Văn bản tiếng Trung gốc (Raw)**.
- **Chế độ khớp nâng cao**: Hỗ trợ **Phân biệt chữ HOA/thường (`Aa`)**, **Khớp nguyên từ (`Whole Word`)**, và **Biểu thức chính quy (`Regex`)**.
- **Xem trước trực quan (Live Preview Diff)**: Hiển thị danh sách từng chương và từng câu có chứa từ khóa kèm tô sáng phần thay thế; bạn có thể thay thế từng chương hoặc bấm **Thay thế tất cả** chỉ trong 1 giây, hệ thống tự động lưu vào IndexedDB và quét lại QA cho các chương vừa sửa.

---

## 9. CHẾ ĐỘ ĐỌC SÁCH (READER MODE), 6 CHỦ ĐỀ, 9 PHÔNG CHỮ & HIGHLIGHT 3 MÀU

Bấm nút **Đọc** trên thanh công cụ đỉnh (hoặc nút **Đọc** trong thanh tiêu đề chương) để bước vào không gian thưởng thức tác phẩm:

### 9.1. Tùy Chỉnh Giao Diện Đọc (`Giao Diện Đọc`)
- **6 Chủ Đề Màu Sắc Văn Học & Bảng Chọn Màu Tùy Ý (`HEX / RGB`)**:
  1. **Giấy Tuyên Chỉ** (`#FBF8F1` — Mặc định ấm áp)
  2. **Vàng Cổ Điển** (`#F4ECD8` — Phong cách sách cổ)
  3. **Đậu Lục Dịu Mắt** (`#E8F0E6` — Chống mỏi mắt ban ngày)
  4. **Trắng Tinh Khiết** (`#FFFFFF` — Sắc nét hiện đại)
  5. **Xám Khói Chiều** (`#26282B` — Dịu mắt ban đêm)
  6. **Đêm Huyền Mặc** (`#141413` — OLED Dark Mode)
  - Bạn cũng có thể tự chọn màu nền, màu chữ, màu khung nội dung bất kỳ bằng bảng chọn màu trực tiếp.
- **9 Phông Chữ Tiếng Việt Tích Hợp & Nạp Phông Chữ Từ Máy (`.ttf, .otf, .woff, .woff2`)**:
  - 6 phông Serif văn học: *Noto Serif, Literata, Lora, Merriweather, Source Serif 4, Be Vietnam Pro*.
  - 3 phông Sans-serif hiện đại: *Plus Jakarta Sans, Inter, Roboto*.
  - Hỗ trợ **Tải phông chữ cá nhân từ máy tính** (lưu vĩnh viễn vào IndexedDB) và điều chỉnh Cỡ chữ (`14px – 32px`), Giãn dòng (`1.4 – 2.4`), Khoảng cách đoạn, Chiều rộng trang đọc và Căn đều hai bên (`Justify`).

### 9.2. Đánh Dấu Trang (Bookmark), Xem Song Ngữ & Highlight 3 Màu
- **Đánh dấu vị trí đọc (`Đánh dấu vị trí đọc` / `Đọc tiếp vị trí đã lưu`)**: Lưu chính xác chương và tỷ lệ phần trăm cuộn trang (`scrollRatio`) cho từng bộ truyện.
- **Bật/Tắt Song Ngữ (`Ẩn/Hiện chữ Hán gốc`)**: Cho phép hiển thị dòng nguyên tác tiếng Trung mờ phía trên từng đoạn tiếng Việt ngay trong trang đọc để vừa đọc vừa đối chiếu.
- **Tô Sáng (Highlight) 3 Màu & Ghi Chú Cá Nhân**:
  - Bôi đen bất kỳ câu chữ tâm đắc nào trong trang đọc để mở thanh tạo Highlight với **3 màu sắc cổ điển**:
    1. **Vàng Hổ Phách (`amber`)**
    2. **Xanh Ngọc Bích (`jade`)**
    3. **Xanh Thanh Thiên (`blue`)**
  - Đính kèm ghi chú cảm nhận và quản lý toàn bộ danh sách trích dẫn trong ngăn **Danh sách Highlight** ngay bên cạnh trang đọc.

---

## 10. ĐÓNG GÓI EBOOK EPUB CHUẨN XUẤT BẢN, XUẤT ZIP & ĐỒNG BỘ GOOGLE DRIVE

Bấm nút **EPUB & Backup** ở góc trên bên phải để mở trung tâm xuất bản và sao lưu:

### 10.1. Tab 1 — Đóng Gói Ebook `.EPUB` (Chuẩn EPUB 3.0)
- **Tùy chỉnh Thông tin Sách & Ảnh Bìa**: Nhập Tên sách, Tác giả, Dịch giả, Nhà xuất bản, Ngôn ngữ, Mô tả giới thiệu và tải lên **Ảnh bìa (`.jpg/.png/.webp`)** có khung xem trước trực tiếp.
- **Tùy chọn Nội dung**:
  - Xuất **Chỉ bản dịch tiếng Việt** hoặc **Song ngữ Việt – Trung** (tiếng Việt trước, tiếng Trung in nghiêng phía dưới từng đoạn).
  - Chọn xuất toàn bộ chương đã dịch hoặc chỉ các chương đang chọn.
- **Tương thích hoàn hảo**: Tệp `.epub` xuất ra có Mục lục tự động (TOC NCX + Nav), định dạng CSS chương mục chuẩn, đọc mượt trên **Apple Books, Google Play Books, Kindle (Send-to-Kindle), Kobo, Moon+ Reader, Lithium...**

### 10.2. Tab 2 — Xuất Gói `.ZIP` / `.TXT` Gộp
- **Xuất `.ZIP` nhiều file `.txt` lẻ**: Mỗi chương là một tệp `.txt` đặt tên theo chuẩn `0001_Chương-1-...txt`, có thể chọn xuất Bản dịch, Nguyên tác tiếng Trung hoặc Song ngữ.
- **Xuất 1 file `.TXT` gộp toàn truyện**: Nối toàn bộ các chương thành một tệp `.txt` duy nhất có dải phân cách rõ ràng.

### 10.3. Tab 3 — Sao Lưu Dự Án `.JSON` (Full Snapshot Backup & Restore)
- **Xuất bản sao lưu `.json`**: Đóng gói toàn bộ Thông tin truyện, Danh sách chương (cả bản gốc + bản dịch + báo cáo QA), Từ điển Glossary, Cấu hình Preset và Highlight ra một tệp `.json` duy nhất.
- **Khôi phục từ tệp `.json`**: Nạp lại tệp `.json` để khôi phục 100% trạng thái dự án sang máy tính hoặc trình duyệt khác.

### 10.4. Tab 4 — Đồng Bộ Đám Mây Google Drive (OAuth 2.0 Trực Tiếp)
- Kết nối tài khoản Google để **Tải bản sao lưu dự án lên Google Drive** hoặc **Tải danh sách các bản sao lưu từ Google Drive về máy** chỉ với 1 cú nhấp chuột.

---

## 11. SYSTEM TERMINAL (NHẬT KÝ THỜI GIAN THỰC) & BẢNG PHÍM TẮT TOÀN CỤC

### 11.1. System Terminal (`Terminal` hoặc `Ctrl + \``)
- Ghi lại minh bạch theo thời gian thực mọi hoạt động của cả **Client** và **Server** (đồng bộ log server về trình duyệt mỗi 2.5 giây):
  - Chi tiết từng Request gọi Gemini API: Model nào được gọi (`gemini-3.1-flash-lite-preview`...), mức `Thinking` đã chuẩn hóa, Key số mấy trong Pool được chọn (`Key #1`..`Key #50`), thời gian phản hồi (`latencyMs`), trạng thái khớp đoạn `1:1` (`Aligned` / `Misaligned`), hay lý do xoay vòng Key khi gặp `429`.
- Hỗ trợ lọc theo mức độ (`ALL`, `ERROR`, `WARN`, `INFO`, `TRACE`), tìm kiếm từ khóa log, bật/tắt tự cuộn (`Auto-scroll`) và tải toàn bộ nhật ký ra tệp `.json` để chẩn đoán kỹ thuật.

### 11.2. Bảng Phím Tắt Toàn Cục & Trong Bàn Biên Tập

| Tổ hợp phím | Chức năng thực thi | Phạm vi áp dụng |
| :--- | :--- | :--- |
| **`Ctrl + S`** *(hoặc `Cmd + S`)* | Lưu ngay các thay đổi của chương đang mở vào cơ sở dữ liệu & quét lại QA | Toàn cục & Trong Bàn Biên Tập |
| **`Alt + ←`** *(Alt + Mũi tên Trái)* | Chuyển nhanh về **Chương trước** trong danh sách lọc hiện tại | Toàn cục (Biên tập & Đọc sách) |
| **`Alt + →`** *(Alt + Mũi tên Phải)* | Chuyển nhanh sang **Chương tiếp theo** trong danh sách lọc hiện tại | Toàn cục (Biên tập & Đọc sách) |
| **`Ctrl + \``** *(hoặc `Cmd + \``)* | Bật / Tắt ngăn kéo **System Terminal** (Nhật ký hệ thống) | Toàn cục |
| **`Ctrl + Z`** *(hoặc `Cmd + Z`)* | Hoàn tác (Undo) thao tác sửa văn bản trong chương đang mở | Trong ô nhập liệu Bàn Biên Tập |
| **`Ctrl + Y`** *(hoặc `Cmd + Shift + Z`)* | Làm lại (Redo) thao tác vừa hoàn tác trong chương đang mở | Trong ô nhập liệu Bàn Biên Tập |
| **`Shift + Click`** | Chọn hàng loạt cả một dải chương liên tiếp từ chương vừa tick trước đó | Danh sách chương ở Cột Trái |

---
*Tài liệu được đồng bộ hóa 100% với kiến trúc Mặc Hiên Các (AI Translation Studio) — Phiên bản Preset chuẩn v1.14.1 & SDK `@google/genai` v2.31.0.*
