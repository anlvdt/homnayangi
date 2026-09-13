# Kế hoạch hợp nhất audit và triển khai fix — Hôm Nay Ăn Gì?

**Ngày:** 13/09/2026  
**Căn cứ:** `docs/ui-ux-audit-comprehensive.md`, `docs/ui-ux-audit-computer-use-2026-09-13.md`, ảnh màn hình desktop dark mode và design system trong `design-system/homnayangi/`.

## Mục tiêu sản phẩm

Trong vòng vài giây, người dùng đang ở bất kỳ buổi nào cũng nhận được một món phù hợp và hiểu ngay có thể nấu, ăn hoặc đặt món đó. Các cách chơi vui vẫn tồn tại nhưng không được cạnh tranh với đường đi nhanh.

## Nguyên tắc giữ nguyên

- Giữ nhận diện sân quê Việt, Be Vietnam Pro, nền đất, giấy kem, màu xanh lá/vàng và bộ bài.
- “Gợi ý theo giờ” tiếp tục là ưu tiên có trọng số; chọn buổi cụ thể là bộ lọc xác định.
- Provider bên ngoài chỉ mở tìm kiếm; không mô phỏng đơn hàng thành công.
- Mọi control giữ target tối thiểu 44px, focus-visible, Escape đóng modal và khôi phục focus.
- Không hiển thị ảnh món khác để bù ảnh thiếu; không biến giá tham khảo thành giá cam kết.

## Thứ tự triển khai

### Phase 0 — Sửa lỗi nền tảng trước

**Mục tiêu:** tránh hành vi lặp và làm cho trạng thái UI có ý nghĩa semantic.

1. Di chuyển đăng ký listener của `.intent-chip` khỏi `updateCravingChips()` vào `setupEvents()`; đảm bảo mỗi chip chỉ có một listener trong suốt vòng đời app.
2. Thêm `aria-pressed` cho intent chips; cập nhật cùng lúc với class `.active`.
3. Gắn `role="dialog"`, `aria-modal="true"`, `aria-labelledby` cho các modal chính: kết quả, settings, planner, custom dish, excludes và các modal game.
4. Đối chiếu version từ một nguồn duy nhất; đồng bộ About, `manifest.json` và `package.json`.

**Tiêu chí nghiệm thu:** đổi buổi/khẩu vị 20 lần rồi bấm một intent chỉ tạo một kết quả; screen reader đọc được intent đang chọn; mỗi modal được nhận diện là dialog có tên; version hiển thị thống nhất.

### Phase 1 — Làm đường đi “một món ngay” rõ hơn

**Mục tiêu:** người mới không phải học app trước khi có món.

1. Giữ một CTA chính ở spotlight; đổi text phụ thành hành động rõ ràng theo ngữ cảnh.
2. Đưa nhóm tình huống vào nhãn “Lọc nhanh” hoặc “Bạn đang muốn…”; hiển thị một trạng thái được chọn duy nhất và trạng thái chưa chọn nhẹ hơn.
3. Cho intent áp dụng buổi hiện tại cùng craving/category tương ứng, sau đó trả một món; hiển thị inline/live message “Đang gợi ý theo …”.
4. Giữ `Lật thẻ` là đường nhanh thứ hai; đưa 7 game vào “Chơi thêm”.
5. Trên mobile, đảm bảo nhóm intent cuộn ngang có chỉ dấu còn nội dung và không tạo scroll ngang cho toàn trang.

**Tiêu chí nghiệm thu:** người dùng mới từ màn vào bấm một intent và nhận modal món; không cần mở preferences; không có hơn một CTA mang cùng mức nổi bật; task “chọn món tối nay” hoàn tất trong tối đa hai chạm sau khi trang sẵn sàng.

### Phase 2 — Mô hình hóa tình huống ăn uống

**Mục tiêu:** dùng ngôn ngữ đời thường thay vì buộc người dùng suy ra từ category.

1. Bổ sung context state: `Nấu ở nhà`, `Tìm quán`, `Nhậu lai rai`, `Ăn một mình`, `Ăn cùng gia đình`.
2. Tách context khỏi `meal` và `craving`; context chỉ thêm trọng số/lọc khi có dữ liệu đủ.
3. Hiển thị context đã chọn trên result card để giải thích vì sao món được đề xuất.
4. Với `Nấu ở nhà`, hiển thị thời gian/độ khó/nguyên liệu khi dữ liệu tồn tại; nếu chưa có thì dùng CTA tìm cách nấu và không bịa thông tin.

**Tiêu chí nghiệm thu:** mỗi context có ít nhất một kết quả hoặc trạng thái rỗng có hướng xử lý; context không làm mất bộ lọc buổi; result nói rõ “nấu” hay “đặt”.

### Phase 3 — Hoàn thiện result và hành động

**Mục tiêu:** biến món được chọn thành quyết định có thể thực hiện.

1. Giữ hai CTA ngang cấp: `Xem cách nấu` và `Tìm quán đặt món`; mobile xếp dọc.
2. Thêm giá tham khảo dạng `40–70K` và chú thích ngắn “Giá tham khảo” ở result.
3. Giữ pairing, vùng miền, buổi hợp và context ở vùng thông tin quét nhanh.
4. Provider chỉ hiện sau khi người dùng chọn tìm quán; focus tới tiêu đề provider như hiện tại.
5. Thêm trạng thái ảnh thiếu/offline rõ ràng, giữ aspect ratio cố định.

**Tiêu chí nghiệm thu:** người dùng hiểu trong một màn hình món là gì, ăn kèm gì, khoảng giá nào và bước tiếp theo là nấu hoặc đặt; URL provider chứa đúng tên món; không có ngôn ngữ ám chỉ đơn đã được đặt.

### Phase 4 — Giảm tải các tính năng phụ

**Mục tiêu:** tính năng sâu hữu ích mà không làm màn chính nặng.

1. Nhóm danh sách “Món không thích” theo 4 loại món bằng accordion hoặc section heading; giữ tìm kiếm.
2. Hiển thị số kết quả sau tìm kiếm và nút xóa lọc gần empty state.
3. Trong multi-player, luôn hiển thị người chơi hiện tại, số người còn lại và cách kết thúc ván.
4. Trong settings, thêm mô tả ngắn cho dark mode, âm thanh, tốc độ và phong cách thẻ.

**Tiêu chí nghiệm thu:** người dùng tìm và loại một món trong tối đa 3 thao tác; empty state có hướng dẫn; không mất focus khi mở/đóng accordion.

### Phase 5 — Visual, responsive và media QA

**Mục tiêu:** đưa hệ thống màu và layout về cùng một ngôn ngữ trên mọi viewport.

1. Sửa tương phản tiêu đề “Chọn nhanh theo lúc này” trong dark mode; kiểm tra mọi text trên surface kem/nâu theo WCAG AA.
2. Đồng nhất surface dark mode của intent panel với hệ thống dining/result; tránh card kem sáng nổi lạc lõng trên nền tối.
3. Đặt `width`/`height` hoặc aspect ratio cho mọi ảnh nội dung ở spotlight, result, history và planner.
4. Kiểm tra `320×568`, `360×800`, `390×844`, `812×375`, tablet và desktop; kiểm tra safe area, overflow-x và vùng cảnh quê.
5. Kiểm tra reduced motion, âm thanh tắt, focus-visible, keyboard-only và zoom 200%.

**Tiêu chí nghiệm thu:** không có scroll ngang ngoài chủ ý; không layout shift khi ảnh tải; không text mờ trên dark mode; mọi modal và CTA dùng được bằng bàn phím.

## Ma trận kiểm thử bắt buộc

| Nhóm | Kịch bản | Kết quả mong đợi |
|---|---|---|
| Quick path | Mở app → chọn từng intent | Mỗi intent áp đúng lọc, một kết quả, không duplicate handler |
| Meal | Chuyển đủ 5 buổi | Greeting, tab, filter và spotlight đồng bộ |
| Filters | Kết hợp buổi + craving + category + vùng + yêu thích | Kết quả đúng hoặc empty state có hướng dẫn |
| Result | Nấu, đặt, provider, đổi món, chia sẻ | CTA đúng ngữ nghĩa, URL đúng món, không mất context |
| Modal | Mở từng modal → Tab vòng → Escape | Dialog có tên, focus trap, focus restore |
| Multi-player | 2–6 người, số lẻ, kết thúc ván | Hiển thị người hiện tại và kết quả không mơ hồ |
| Data | Món thiếu ảnh, món tự thêm, ảnh lỗi | Không ảnh giả, aspect ratio ổn định, thông báo rõ |
| Theme | Light/dark, zoom, reduced motion | Tương phản AA, không vỡ bố cục, không animation bắt buộc |
| PWA | Reload/offline sau cache | Shell vẫn mở; trạng thái ảnh/provider được giải thích |

## Lệnh xác minh

```bash
npm test -- --runInBand
npm run test:browser
```

Khi thay đổi có chủ đích về visual baseline, chụp và xem lại ảnh trước khi chạy:

```bash
UPDATE_VISUAL_BASELINES=1 npm run test:browser
```

## Definition of done

- Phase 0 và Phase 1 hoàn tất trước khi đánh giá lại conversion của màn chính.
- Không còn listener intent đăng ký lặp.
- Dialog semantics, intent state, ảnh và version đạt các tiêu chí tương ứng.
- Người dùng mới có thể chọn món theo buổi hoặc tình huống mà không cần mở settings.
- Mọi thay đổi được kiểm tra trên mobile, desktop, light/dark, reduced motion và keyboard-only.
- Cập nhật `design-system/homnayangi/pages/dining.md` sau khi các quyết định mới được chấp nhận và ổn định.

## Rủi ro và quyết định cần xác nhận khi triển khai

- Context `Nấu ở nhà` hiện chưa có dữ liệu công thức/thời gian/độ khó; chỉ thêm metadata khi có nguồn đáng tin.
- Việc đổi hierarchy CTA có thể làm visual baseline thay đổi; cần cập nhật baseline có chủ đích sau khi xem ảnh.
- Giá là tham khảo theo dữ liệu hiện có, không nên hiển thị như giá theo khu vực/thời điểm nếu chưa có nguồn.
