# Audit UI/UX bằng Computer Use — Hôm Nay Ăn Gì?

**Ngày:** 13/09/2026  
**Thiết bị kiểm tra:** Chrome extension, app local `http://127.0.0.1:4173/`, viewport desktop đang kết nối.  
**Mục tiêu:** giúp người dùng đang phân vân chọn món theo buổi, khẩu vị, ngân sách, nhậu, nấu hoặc đặt.

## Luồng đã kiểm tra

- Màn vào app và lời chào theo buổi hiện tại.
- Tab Sáng/Trưa/Xế chiều/Tối/Ăn khuya; trạng thái “Bây giờ”; bộ lọc khẩu vị và giá.
- 5 nút chọn nhanh: Ăn no, Nhẹ bụng, Dưới 40K, Nhậu lai rai, Nấu ở nhà.
- Quick pick, panel 7 phương pháp, mở/đóng phương pháp bằng Escape.
- Kết quả món, yêu thích, Xem cách nấu, Tìm quán đặt món, 4 provider.
- Menu Cài đặt, Tính năng, Lịch sử, Giới thiệu, Quyền riêng tư.
- Lịch ăn tuần, Thêm món mới, Món không thích.
- Chế độ tối, focus sau khi mở/đóng modal, thông báo live.

## Findings ưu tiên

| # | Phát hiện quan sát được | Bằng chứng Computer Use | Tác động | Đề xuất |
|---|---|---|---|---|
| 1 | Nút tình huống chọn nhanh có trạng thái hình ảnh nhưng trạng thái chọn không được truyền cho assistive technology. | AX tree hiển thị 5 phần tử là `button` bình thường; sau khi bấm “Nấu ở nhà” không có `aria-pressed`, `aria-current` hoặc trạng thái selected. Code chỉ đổi class `.active`. | Người dùng bàn phím/trình đọc màn hình không biết tình huống nào đang áp dụng; dễ tưởng đã nhận món nhưng bộ lọc khác vẫn còn. | Thêm `aria-pressed` cho intent chips và thông báo inline/live “Đang lọc theo …”; đồng bộ trạng thái với chip khẩu vị và category.
| 2 | Các lớp modal không khai báo semantic dialog trong DOM. | Đánh giá DOM trực tiếp khi modal kết quả mở: `role`, `aria-labelledby` của `#modal`, `#settingsModal`, `#plannerModal`, `#customDishModal`, `#excludesModal` đều `null`; AX vẫn đọc được tiêu đề nhờ nội dung bên trong. | Trình đọc màn hình có thể không nhận diện ranh giới hộp thoại ổn định giữa các modal; người dùng khó biết đang ở lớp nào. | Gắn `role="dialog"`, `aria-modal="true"`, `aria-labelledby` cho từng modal; giữ focus trap và Escape hiện có.
| 3 | Modal “Món không thích” đưa toàn bộ kho món thành một danh sách phẳng rất dài. | AX tree khi mở modal có hơn 220 node checkbox liên tục, từ Phở bò đến món tráng miệng; chỉ có một ô tìm kiếm ở đầu. | Tốn thời gian quét, khó định hướng theo nhóm món/vùng/buổi, đặc biệt trên màn hình nhỏ. | Chia nhóm theo 4 loại món hoặc dùng accordion; giữ tìm kiếm, thêm số lượng kết quả và nút “Bỏ tất cả lọc”.
| 4 | Ảnh món trong các trạng thái đang hiển thị chưa có kích thước HTML cố định. | DOM audit bằng Computer Use tìm thấy nhiều `img` thiếu thuộc tính `width`/`height`, gồm ảnh món trong spotlight, result và history. | Khi ảnh tải chậm hoặc offline, chiều cao có thể thay đổi và làm lệch nội dung; tăng nguy cơ layout shift. | Đặt kích thước hoặc `aspect-ratio` rõ trên mọi ảnh nội dung, bao gồm result/history; giữ lazy loading cho ảnh dưới màn hình.
| 5 | Màn chính giàu lựa chọn nhưng vẫn có hai đường nhận món cạnh nhau: spotlight “Chọn” và “Chọn nhanh theo lúc này”, sau đó thêm “Lật thẻ” và panel 7 cách chơi. | Screenshot desktop cho thấy 4 khối hành động liên tiếp trước khi người dùng bắt đầu; AX tree có spotlight, 5 intent buttons, Quick pick và 7 method buttons. | Người mới có thể không biết nên bấm “Chọn”, “Lật thẻ” hay một intent; mục tiêu “một món ngay” bị cạnh tranh bởi trò chơi. | Giữ spotlight làm đề xuất chính với một CTA; gom intent vào nhãn “Lọc nhanh”; đặt Quick pick làm hành động mặc định, các game còn lại dưới “Chơi thêm”.
| 6 | Màn giới thiệu hiển thị `v2.0` trong khi metadata dự án đang dùng version khác. | AX tree của Giới thiệu đọc “v2.0”; kiểm tra repo cho thấy `package.json` là `1.0.0`. | Giảm độ tin cậy khi người dùng kiểm tra bản phát hành hoặc báo lỗi. | Chọn một nguồn version duy nhất và hiển thị cùng giá trị ở About, manifest và package metadata.

## Phát hiện kỹ thuật ảnh hưởng trực tiếp UX

| # | Phát hiện | Bằng chứng | Tác động |
|---|---|---|---|
| 7 | Listener cho intent chips đang được đăng ký bên trong `updateCravingChips()`, thay vì đăng ký một lần trong `setupEvents()`. | `app.js:3341–3381`: hàm cập nhật trạng thái chip chứa cả `intentMap` và `addEventListener`; cùng hàm được gọi mỗi lần đổi buổi/khẩu vị. | Sau nhiều lần đổi filter, một lần bấm intent có thể chạy nhiều handler, tạo deck/rerender/quickPick lặp lại và làm trải nghiệm chậm hoặc cho kết quả bất ngờ. Đây là lỗi cần ưu tiên cao hơn một nhận xét thẩm mỹ.
| 8 | Nút `Tìm quán đặt món` chuyển sang trạng thái expanded và focus tiêu đề phần provider đúng; phần CTA nấu mở link Google ngoài. | AX tree sau khi bấm cho thấy `aria-expanded=true`, focus ở `Bạn muốn đặt ở đâu?`, URL giữ đúng tên món. | Luồng hành động chính đạt yêu cầu; nên giữ làm baseline khi sửa các phần còn lại.

## Điểm đạt

- Lời chào, tab buổi và nhãn “Bây giờ” giúp người dùng định hướng theo thời điểm.
- Nhãn giá đã nhất quán dạng `40–70K` ở chip và spotlight.
- Kết quả phân tách rõ `Xem cách nấu` và `Tìm quán đặt món`; link provider giữ đúng tên món.
- Modal có nút đóng rõ ràng; Escape đóng được phương pháp và trả về màn chọn.
- Dark mode giữ được độ tương phản và không làm mất nội dung chính trong lần kiểm tra trực quan.
- Form thêm món có nhãn, loại input phù hợp và giải thích ảnh ngoài/offline.
- Lịch sử, lịch tuần, món tự thêm, món loại trừ và privacy đều có bề mặt truy cập rõ trong settings.

## Giới hạn kiểm tra

- Computer Use session hiện gắn viewport desktop; chưa có thiết bị mobile thật hoặc trình giả lập notch để xác minh 320/360/390px bằng mắt.
- Không bấm các hành động xóa dữ liệu/lịch vì đó là thao tác phá hủy và không cần thiết cho audit.
- Không mở link provider ra ngoài vì audit chỉ cần xác nhận URL truy vấn, không cần truyền dữ liệu sang dịch vụ bên thứ ba.
- Không đánh giá độ phù hợp món bằng nghiên cứu người dùng hoặc dữ liệu chuyển đổi thực tế.

## Ưu tiên xử lý

1. Bổ sung semantic dialog và trạng thái `aria-pressed` cho intent chips.
2. Rút gọn danh sách loại trừ bằng nhóm/accordion.
3. Cố định kích thước ảnh và thống nhất version hiển thị.
4. Tiếp tục thử nghiệm mobile thật để quyết định có cần giảm thêm số lựa chọn ở màn đầu.
