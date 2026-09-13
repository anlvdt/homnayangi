# Audit UI/UX — trải nghiệm phục vụ món

Ngày 13/09/2026. Phạm vi: màn hình chọn phương pháp, tám cách chọn, kết quả, chuyển sang dịch vụ đặt món, quay lại, responsive và bàn phím. Kiểm tra mã nguồn và trình duyệt Chromium; chưa có nghiên cứu trực tiếp với người dùng.

## Các vấn đề quan sát được và thay đổi

| Mức độ | Bằng chứng trước sửa | Cải tiến |
|---|---|---|
| Cao | Bộ lọc, số người, món trong ngày xuất hiện trước phương pháp; ở 390 × 844 phần chọn món bắt đầu gần giữa màn hình. | Lời mời và ba bước dẫn hướng xuất hiện trước; tùy chỉnh khẩu vị/số người được mở khi cần. |
| Cao | Kết quả mang góc bài, chất bài và tỷ lệ 5:7; trang trí bài cạnh tranh với tên và ảnh món. | Một khung phục vụ duy nhất, ảnh rộng, tên món rõ, thông tin ăn kèm và CTA đặt món. |
| Cao | Nút “Đóng” đưa người dùng về trạng thái nền khác nhau tùy phương pháp. | Nút “Về chọn cách random”, Escape và nền kết quả đều trả về lựa chọn phương pháp; đưa focus về tiêu đề. |
| Cao | Bốn liên kết dịch vụ hiện ngang hàng ngay khi mở kết quả. | Một CTA “Đặt món này”; dịch vụ được mở ở bước tiếp theo, giữ tên món trong truy vấn. Không tạo đơn hàng trong ứng dụng. |
| Cao | Mâm cơm không có đường đi từ từng món đến hành động đặt. | Từng món trong mâm có “Chọn món này”, đi vào cùng màn hình phục vụ. |
| Vừa | Nền hoa văn, màu vàng và viền đậm lặp lại trên nhiều lớp. | Giấy kem, chữ mực, xanh lá chủ đạo; giảm độ đậm trang trí nền và loại bỏ bóng nút kết quả. |
| Vừa | Cỡ chữ mô tả phương pháp nhỏ; icon vàng nhạt thiếu tương phản trên nền kem mới. | Tăng độ thoáng và cỡ chữ, đổi icon sang màu chữ phụ. |
| Vừa | Kết quả dài có thể vượt chiều cao cửa sổ thấp khi thêm bước đặt món. | Panel giới hạn theo dynamic viewport, cuộn nội bộ, hành động tối thiểu 44px. |

## Hợp đồng luồng

Chọn phương pháp → thực hiện tương tác → nhận một món → mở nơi đặt hoặc trở về phương pháp. Đóng hoạt động random phải hủy các callback cũ. Món mới đóng các panel random còn mở và đặt lại phần chọn dịch vụ về trạng thái thu gọn. Bộ lọc được giữ khi quay lại. Tính năng mâm cơm vẫn gợi ý cả bữa, nhưng chỉ phục vụ một món được chọn ở màn hình kết quả.

## Giới hạn

Liên kết giao hàng kế thừa tích hợp hiện có; kiểm tra truy vấn chứa tên món, không đặt đơn thật và không xác minh khả năng phục vụ của nhà hàng. Món thiếu ảnh đúng giữ trạng thái thiếu ảnh, không dùng ảnh món khác. Chưa đo Core Web Vitals trên thiết bị thật hay kiểm thử người dùng. Những phần lịch tuần, dữ liệu món và quản lý cá nhân không được thiết kế lại trong đợt này.
