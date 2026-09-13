# Đánh giá trước phát hành — 13/09/2026

## Kết luận
Chưa nên phát hành công khai. Smoke test thành công không chứng minh đầy đủ tính nhất quán của bộ lọc, game flow, ảnh hay bố cục. Đây là đánh giá dựa trên DOM đang chạy, đọc mã và chạy lại các bộ kiểm thử; không phải chứng nhận mọi thiết bị/trình duyệt.

## Bằng chứng kiểm thử
- Jest: 51/51 đạt.
- `python3 tests/dining_flow.py`: đạt 8 phương thức, ordering, return, cancellation, responsive, keyboard theo phạm vi script.
- `npm run test:browser`: thất bại ở home-mobile-390x844, mean delta 49.91. Các kiểm tra phía sau không được chạy.
- DOM desktop: game-picker rộng 1020px nhưng chia 305.875px + 702.125px; lưới trò chơi chỉ dùng phần bên phải. `grid-area: methods` cũ trên play-actions tạo vùng grid ngầm trong wrapper mới.
- Kho chính: 153 món; 21 món hasPhoto=false sử dụng SVG emoji chung theo nhóm. Không có ID trùng trong DOM được kiểm tra (đính chính báo cáo trước).

## P1 — Cần giải quyết trước phát hành
1. **Bố cục trò chơi lệch:** styles.css rule grid-area: methods còn tồn tại sau khi thêm game-picker. Tiêu đề và lưới bị tách cột, để khoảng trống lớn. Nghiệm thu: heading ở trên, toàn bộ 8 thẻ cùng lưới toàn chiều rộng ở desktop và mobile.
2. **Mâm cơm không tuân cùng bộ lọc:** pickCourse chỉ lọc theo miền riêng và món loại trừ; bỏ qua giá, buổi, yêu thích, city, context. Dòng “8 cách · cùng một bộ lọc” không đúng. Cần xác định mâm là workflow riêng và ghi rõ phạm vi, hoặc bổ sung metadata/bộ lọc tương ứng.
3. **Mâm cơm thiếu nhất quán kết quả:** món ngoài deck gọi showResult trực tiếp, không addToHistory/gameResults. Cùng thao tác Chọn món này có tác dụng khác nhau. rerollMamItem có thể thay món duy nhất bằng null khi hết lựa chọn khác; phải giữ món cũ và báo không còn lựa chọn.
4. **Vòng quay nhãn chưa hoàn thiện:** drawWheel chỉ rút gọn nhãn thắng dù mọi nhãn đã được mở; tên dài có thể vượt lát. textAngle không chuẩn hóa modulo 2π nên logic giữ chữ thuận chiều sai sau nhiều vòng. Chữ trắng trên lát thắng vàng cũng cần đổi màu tương phản. Nghiệm thu: tên dài, quay lại nhiều lần, marker và winner đúng, chữ đọc được.
5. **Kiểm thử phát hành đang đỏ:** visual baseline cũ; không được coi là pass hoặc chỉ ghi đè. Cần kiểm tra ảnh thực tế, sửa lỗi bố cục, cập nhật baseline có chủ đích và chạy hết suite.

## P2 — Trải nghiệm và độ tin cậy
- Lướt chọn món dựng toàn thẻ úp, kết thúc chỉ thêm class winner rồi mở modal sau 700ms; không hiện tên trên thẻ thắng như báo cáo trước. Cần reveal rõ ở marker hoặc nói rõ đây là hiệu ứng chọn ngẫu nhiên. Tọa độ dùng hằng 104px, chưa đo offset/padding thực tế; cần kiểm tra resize giữa lượt.
- Battle tiêu đề “Chọn món thắng” xuất hiện khi còn hai món chưa so trong vòng hiện tại, dù nextRound còn các món đã qua vòng. Counter chỉ đếm battleRound, dễ hiểu nhầm tổng số ứng viên. Cần hiển thị vòng/cặp và tổng còn lại.
- Chạm hoa cho phép nhiều bông được đánh dấu trong thời gian chờ; token ngăn các callback sau ghi kết quả nhưng UI không khóa toàn lượt. Nên disable toàn vườn sau lần chọn đầu.
- Lắc món dùng nhãn “Rất hợp hôm nay” và thơ chọn ngẫu nhiên, không phải đánh giá độ phù hợp. Tránh khiến người dùng hiểu là kết luận về dinh dưỡng/khẩu vị.
- Các nút nấu/đặt hiện là tìm kiếm ngoài ứng dụng; cần nghiệm thu URL đúng món và không gọi đây là đơn hàng hoàn tất.
- 21 ảnh là emoji SVG chứ không phải ảnh riêng từng món; thông báo “Ảnh đang được kiểm duyệt — không dùng ảnh gần giống” không mô tả đúng nội dung đang hiện. Cần thống nhất trạng thái và nhãn, kiểm tra nguồn ảnh còn lại trước phát hành.
- Nút Đặt lại nằm trong nhóm nhu cầu nhưng reset cả buổi, vùng, city, yêu thích và context. Nhãn nên là “Đặt lại bộ lọc” và đặt cạnh toàn bộ bộ lọc, hoặc thu hẹp hành vi.
- Bộ lọc “Nấu ở nhà”, “Tìm quán”, “Gia đình” hiện chủ yếu thêm badge; không có dữ liệu thời gian/độ khó/khẩu phần. Không quảng bá là tư vấn đã cá nhân hóa đầy đủ.

## Thuật toán — giới hạn cần nói rõ
- Deck được lấy cân nhóm tối đa 52 từ 153 món, nên không phải mỗi món trong toàn kho có xác suất ngang nhau.
- Chọn tự động ưu tiên từng món hợp giờ với trọng số 3:1; xác suất tổng nhóm hợp giờ phụ thuộc số lượng, không cố định 75%.
- Vòng quay chọn tối đa 8 món từ deck rồi chọn có trọng số; lát bằng nhau không đồng nghĩa xác suất bằng nhau.
- Lật thẻ là lựa chọn vị trí của người dùng; battle là lựa chọn so sánh. Hai trò không dùng cùng cơ chế ngẫu nhiên với wheel/reel.
- Món đã chọn được đánh dấu trong một deck; chia lại/thay bộ lọc xóa flippedCards. Không có bảo đảm “không bao giờ lặp món”.
- Quick intent dùng showResult + addToHistory, còn trò chơi dùng completePick; cần kiểm thử thống nhất số đếm, lịch sử, nhiều người và quay lại.

## Chưa đủ bằng chứng để xác nhận
- Safari iOS, Android Chrome thật, cài PWA và nâng cấp từ phiên bản cũ.
- Offline sau lần cài đầu/nâng cấp: precache dùng URL không query trong khi HTML dùng ?v=46; fallback exact-match có rủi ro thiếu tài nguyên versioned chưa tải. Cần thử browser context độc lập, không dựa cache phát triển.
- Đo tương phản mọi trạng thái light/dark, zoom 200%, screen reader, focus ở mọi modal và prefers-reduced-motion (wheel vẫn quay một vòng trong chế độ reduce).
- Toàn bộ custom dish/planner/exclusions sau reload, dữ liệu cũ/hỏng, xuất/xóa dữ liệu và nhiều người 2–6.
- Core Web Vitals, tải ảnh trên mạng chậm, bản quyền và nguồn của toàn kho.

## Thứ tự nghiệm thu đề xuất
1. Sửa P1 layout và nhất quán mâm/kết quả.
2. Chốt ý nghĩa từng trò và cập nhật copy/ảnh/nhãn.
3. Kiểm thử xác định cho bộ lọc, empty pool, một món, nhiều click, hủy giữa chừng, resize và nhiều người.
4. Duyệt ảnh desktop/mobile light/dark rồi cập nhật baseline; toàn suite phải xanh.
5. Test PWA offline/update và thiết bị thật; chỉ phát hành khi không còn P1 và ghi rõ các giới hạn còn lại.
