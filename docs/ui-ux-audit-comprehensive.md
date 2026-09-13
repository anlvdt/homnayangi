# Audit UI/UX toàn diện — Hôm Nay Ăn Gì?

**Ngày:** 13/09/2026  
**Mục tiêu người dùng:** mở ứng dụng vào bất kỳ thời điểm nào và nhanh chóng biết nên nấu gì, ăn gì hoặc nhậu món gì.  
**Phạm vi:** ứng dụng web/PWA hiện tại: màn chọn buổi và khẩu vị, các phương pháp random, kết quả món, đặt món ngoài ứng dụng, nhiều người, cài đặt, tính năng phụ, lịch sử, món tự thêm, offline, responsive và bàn phím.

## Design language

- **Surface đã audit:** một ứng dụng web vanilla gồm `index.html`, `styles.css`, `app.js`.
- **Nguồn thiết kế ràng buộc:** [MASTER.md](../design-system/homnayangi/MASTER.md) và [dining.md](../design-system/homnayangi/pages/dining.md).
- **Định hướng:** sân quê Việt ấm, vui, địa phương; trang trí hỗ trợ nhiệm vụ chọn món và không làm giảm khả năng đọc.
- **Quy tắc đã ghi:** Be Vietnam Pro tự host; nền đất/nâu, bề mặt giấy kem; hành động chính xanh lá/vàng; focus rõ; vùng chạm tối thiểu 44px; modal cuộn nội bộ, đóng bằng Escape, khôi phục focus; “Gợi ý theo giờ” là ưu tiên có trọng số, bộ lọc bữa ăn rõ ràng mới là lọc xác định; đặt món mở tìm kiếm bên ngoài và không giả lập đơn thành công.
- **Ngoại lệ:** không có ngoại lệ được tài liệu hóa.

## Bản đồ trải nghiệm cần phục vụ

| Giai đoạn | Câu hỏi của người dùng | Thành phần hiện có | Mức hoàn thiện |
|---|---|---|---|
| Vào app | “Giờ này ăn gì?” | Lời chào, tab Sáng/Trưa/Xế/Tối/Khuya, món gợi ý bữa này | Có nền tảng tốt; cần làm rõ một lựa chọn mặc định |
| Thu hẹp | “Tôi muốn món nước/cơm/rẻ/thanh đạm/nhậu” | Chip khẩu vị, loại món, vùng miền, thành phố, yêu thích, số người | Nhiều khả năng nhưng phân tán và một phần bị giấu |
| Quyết định | “Cho tôi một món ngay” | Quick pick, 8 phương pháp, bốc bài, món của ngày | Có nhiều cách hơn nhu cầu; nguy cơ quá tải lựa chọn |
| Xác nhận | “Món này là gì, ăn kèm gì, giá khoảng bao nhiêu?” | Ảnh, tên, pairing, tag, kết quả | Có tên/pairing; giá không hiển thị dù dữ liệu có sẵn |
| Hành động | “Nấu hay đặt ở đâu?” | CTA đặt món, provider links, chia sẻ, món khác | Có luồng; cần phân biệt rõ “nấu tại nhà” và “đặt ngoài” |
| Quay lại | “Đổi món nhưng giữ ý thích” | Về phương pháp, reset, lịch sử/yêu thích | Có nền tảng; cần bảo toàn ngữ cảnh hiển thị |

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
|---|---|---|---|---|---|
| 1 | Luồng chính vẫn đặt quá nhiều quyết định cạnh nhau trước khi người dùng nhận được một món. Người đang bí món phải hiểu tab buổi, chip khẩu vị, chế độ một/nhiều người, bộ lọc và nhiều phương pháp. | `index.html` đưa tab buổi + 6 chip + nút “Khẩu vị & số người” + mode group + 3 select + advanced filters vào cùng vùng chọn; đồng thời có Quick pick và panel 7 phương pháp. `dining.md` yêu cầu progressive disclosure và một CTA chính. | Đặt một câu hỏi chính theo ngữ cảnh: “Bây giờ là [buổi] — muốn ăn kiểu nào?”; hiển thị 3–4 lựa chọn nhanh (Ăn no, Nhẹ bụng, Dưới 40K, Nhậu), trả ngay 1 món; chuyển toàn bộ bộ lọc nâng cao và phương pháp phụ vào “Tùy chọn khác”. | Home/chooser, mobile trước rồi desktop | Cao |
| 2 | Khái niệm “buổi ăn” chưa bao phủ đầy đủ cách người dùng nói về nhu cầu. Có “Xế chiều” và “Ăn khuya”, nhưng không có nhãn/tình huống “nhậu”, “nấu ở nhà”, “ăn một mình”, “ăn cùng gia đình”; người dùng phải suy ra từ loại món hoặc mode. | Tab chỉ có 5 giá trị `sang/trua/chieu/toi/khuya`; category có “Món mặn · Nhậu”, mode có “Một người/Nhiều người”. Các mục này nằm ở các lớp điều khiển khác nhau. | Thêm lớp “Tình huống” sau khi chọn buổi: `Nấu ở nhà`, `Đặt giao`, `Nhậu`, `Ăn một mình`, `Ăn cùng gia đình`; dùng cùng một bộ lọc dữ liệu và hiển thị chip ngữ cảnh trên kết quả để người dùng biết vì sao món được đề xuất. | Taxonomy, chooser, result copy/data mapping | Cao |
| 3 | Kết quả chưa giúp quyết định giữa “nấu” và “đặt” đủ nhanh, dù đây là bước chuyển từ phân vân sang hành động. | Modal kết quả có `Đặt món này`, phần chọn provider và nút `Gợi ý món khác`; dữ liệu món có `price`, `pair`, `meals` nhưng README ghi khoảng giá chưa hiển thị. Không thấy CTA tương đương cho “Công thức/nấu tại nhà”. | Trên result card hiển thị 2 hành động ngang cấp theo ý định: `Nấu món này` (nguyên liệu/thời gian nếu có) và `Tìm quán đặt món`; bổ sung giá tham khảo và thời gian/độ khó khi dữ liệu đủ, giữ provider ở bước sau. | Result modal/card, dữ liệu món, copy | Cao |

## Kiểm tra theo thành phần

- **Header/brand:** nhận diện tốt, lời chào có ngữ cảnh; badge “đã chọn/tổng món” có thể gây nhiễu với người mới vì không giúp chọn bữa.
- **Meal tabs:** là điểm mạnh cho mục tiêu theo thời điểm; cần trạng thái mặc định và văn bản giải thích “đang ưu tiên món hợp giờ”.
- **Craving chips:** đúng nhu cầu đời thường; nên tránh để người dùng phải cuộn ngang mà không biết còn chip nào.
- **Preferences/filters:** nhiều nhưng hợp lý cho người dùng quay lại; nên giữ lựa chọn sau khi đổi món và cho nút “Xóa lọc” gần kết quả rỗng.
- **Quick pick/methods:** 8 cách tạo cảm giác vui; nên phân cấp một cách mặc định, các cách còn lại là khám phá.
- **Deck/cards:** bản sắc mạnh nhưng mật độ 52 lá có thể cạnh tranh với nhiệm vụ trên mobile; tên món phải luôn là điểm nổi bật sau reveal.
- **Result:** cần một bố cục món ăn làm trung tâm, pairing/giá/buổi/tình huống quét được trong 2 giây.
- **Ordering:** phải nói rõ mở ứng dụng ngoài và người dùng tự xác nhận; không dùng ngôn ngữ như đã đặt thành công.
- **Multi-player:** có 2–6 người và nút “Người tiếp theo”; cần luôn hiển thị đang chọn cho ai và cách kết thúc ván.
- **Settings:** gom nhiều tính năng (lịch, món tự thêm, loại trừ, lịch sử, riêng tư); nên đặt “Tôi chỉ muốn một món ngay” bên ngoài settings.
- **Custom dish/privacy:** cần giữ nhãn rõ cho ảnh URL ngoài và trạng thái offline; đây là đúng hướng theo design contract.
- **Responsive:** cần kiểm tra lại 320/360/390px, landscape thấp, safe area; đảm bảo tab/chip không tạo scroll ngang ngoài ý muốn.
- **Accessibility:** phần lớn control có tên, SVG trang trí ẩn, target/focus có contract; cần kiểm tra runtime tab semantics, focus trap và live announcement trên từng modal.
- **Motion/sound:** animation phục vụ reveal; âm thanh phải có tắt rõ ràng và reduced-motion không làm mất phản hồi trạng thái.
- **Offline/PWA:** giá trị khác biệt tốt; nên thông báo khi ảnh/provider không khả dụng thay vì để người dùng đoán.

## Improve first

**Giảm tải quyết định ở màn đầu và trả một món theo ngữ cảnh trong một chạm.** Đây là thay đổi có đòn bẩy cao nhất: nó trực tiếp giải quyết trạng thái “không biết ăn gì”, tận dụng dữ liệu buổi/khẩu vị đang có, giữ được các cách chơi cho người muốn khám phá và làm cho toàn bộ luồng nấu/đặt phía sau dễ hiểu hơn.

## Giới hạn và kiểm chứng còn thiếu

- Chưa có phỏng vấn hoặc usability test với người thật; các nhận định về quá tải cần xác nhận bằng task test 5 giây và completion rate.
- Ảnh baseline trong `screenshots/` và `tests/visual-baselines/` không nên dùng làm bằng chứng duy nhất nếu khác runtime hiện tại.
- Chưa đo Core Web Vitals trên thiết bị thật, độ chính xác phân loại món theo vùng/buổi, hoặc khả năng phục vụ của provider theo địa điểm.
- Test tự động hiện xác nhận dữ liệu và logic chính; cần bổ sung kiểm thử UI cho trạng thái rỗng sau lọc, 5 buổi, reduced motion, keyboard modal và 2–6 người.
