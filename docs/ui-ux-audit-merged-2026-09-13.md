# Audit UI/UX hợp nhất — Hôm Nay Ăn Gì?

**Ngày:** 13/09/2026  
**Phạm vi:** audit mã nguồn/design system, Computer Use trên Chrome desktop và ảnh màn hình dark mode. Mục tiêu là giúp người dùng biết nên nấu gì, ăn gì hoặc nhậu món gì theo từng buổi.

## Kết luận điều hành

Sản phẩm có bản sắc Việt rõ, dữ liệu món phong phú, phân loại theo 5 buổi và luồng đặt món đã tốt. Điểm cản trở lớn nhất là màn đầu vẫn có quá nhiều lựa chọn cạnh tranh nhau, trong khi một số trạng thái quan trọng chưa được truyền đầy đủ cho assistive technology và dark mode còn lỗi tương phản.

## Điểm mạnh đã xác nhận

- Tab Sáng/Trưa/Xế chiều/Tối/Ăn khuya và nhãn “Bây giờ” định hướng tốt theo thời điểm.
- Spotlight có ảnh, tên món, vùng miền, giá dạng `40–70K`, món ăn kèm và CTA.
- Có 5 intent nhanh, Quick pick và 7 phương pháp chơi; các game nằm sau progressive disclosure.
- Result tách `Xem cách nấu` và `Tìm quán đặt món`; provider giữ đúng tên món trong URL.
- Modal đóng bằng Escape, focus provider được đưa tới tiêu đề; settings, planner, custom dish, excludes, history, privacy đều truy cập được.
- Form thêm món có nhãn và cảnh báo ảnh ngoài/offline; ảnh sai món đã được cô lập.

## Findings hợp nhất

| Ưu tiên | Finding | Bằng chứng | Hướng xử lý |
|---|---|---|---|
| P0 | Listener intent bị đăng ký lặp. | `app.js:3341–3381` đặt `addEventListener` bên trong `updateCravingChips()`, hàm này chạy lại khi đổi filter. | Chuyển đăng ký vào `setupEvents()` và kiểm thử sau 20 lần đổi filter. |
| P0 | Intent chip không có semantic selected state. | Computer Use AX tree đọc các nút là button thường; code chỉ đổi class `.active`. | Thêm `aria-pressed` và live message cho intent hiện hành. |
| P0 | Modal thiếu dialog semantics trong DOM. | DOM kiểm tra trực tiếp cho `#modal`, settings, planner, custom dish, excludes cho `role`/`aria-modal`/`aria-labelledby` là null. | Gắn `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. |
| P1 | Màn đầu quá nhiều đường quyết định. | Source có meal tabs, craving chips, preferences, spotlight, 5 intent, Quick pick và 7 game; ảnh desktop cho thấy các khối nối tiếp nhau. | Một CTA nhanh làm mặc định; game và filter sâu nằm dưới “Chơi thêm/Tùy chọn khác”. |
| P1 | Dark mode có lỗi tương phản ở intent panel. | Ảnh màn hình cho thấy tiêu đề “Chọn nhanh theo lúc này” rất nhạt trên nền kem; các surface dark/cream không đồng nhất. | Dùng token chữ tương phản cao và surface dark đồng nhất; xác minh WCAG AA. |
| P1 | Danh sách “Món không thích” quá dài. | AX tree có hơn 220 checkbox phẳng trong một modal. | Chia theo 4 nhóm món bằng accordion/section, giữ tìm kiếm và số kết quả. |
| P1 | Ảnh nội dung thiếu kích thước HTML cố định. | DOM audit tìm nhiều `img` thiếu `width`/`height` ở spotlight/result/history. | Thêm kích thước hoặc aspect ratio để tránh layout shift. |
| P2 | Ngôn ngữ tình huống chưa đầy đủ. | Có meal/category/mode riêng nhưng thiếu lớp rõ cho nấu, đặt, nhậu, một người, gia đình. | Thêm context state độc lập, hiển thị context trên result. |
| P2 | Version hiển thị không nhất quán. | About đọc `v2.0`, `package.json` là `1.0.0`. | Chọn một nguồn version và đồng bộ metadata. |

## Phạm vi đã kiểm tra

Trang chính, 5 buổi, craving/category/city/region/favorite filters, 5 intent, Quick pick, 7 game, result/order/provider, multi-player, settings, dark mode, planner, custom dish, excludes, history, about, privacy, Escape/focus/live announcement và trạng thái ảnh lỗi.

## Giới hạn

Computer Use dùng viewport desktop của Chrome; mobile thật, notch/safe area và usability test với người dùng chưa được xác minh. Không xóa dữ liệu và không gửi dữ liệu sang provider bên ngoài.

## Kế hoạch triển khai

Xem [ui-ux-audit-merged-implementation-plan.md](ui-ux-audit-merged-implementation-plan.md) để biết phase, tiêu chí nghiệm thu, ma trận kiểm thử và lệnh xác minh.
