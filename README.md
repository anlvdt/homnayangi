# Hôm Nay Ăn Gì?

Ứng dụng chọn món ăn thú vị với bộ bài 52 lá. Không biết ăn gì? Bốc một lá bài!

**Demo:** [https://hnangi.netlify.app/](https://hnangi.netlify.app/)

---

## Giới thiệu / Introduction

**Hôm Nay Ăn Gì?** là ứng dụng giúp bạn chọn món ăn mỗi ngày với bộ bài tối đa 52 lá. Mỗi ván lấy một phần từ kho món Việt và một số món quốc tế quen thuộc.

A fun Vietnamese food picker app using a 52-card deck concept. Can't decide what to eat? Just pick a card!

---

## Tính năng / Features

**Bộ món**
- 153 món chia 4 nhóm: Bún · Phở, Cơm, Bánh · Xôi, Món mặn · Nhậu; mỗi ván chia tối đa 52 lá
- Gợi ý ăn cùng, vùng miền và buổi ăn phù hợp; món chưa có ảnh phù hợp được ghi rõ, không thay bằng ảnh món khác
- Đủ ba miền Bắc – Trung – Nam trong từng nhóm
- Thêm món tùy chỉnh của riêng bạn

**Tám cách chọn món**
- Bốc bài (chạm một lá) và Bốc ngẫu nhiên (một chạm)
- Xoay chọn món · Lướt chọn món (băng chuyền) · Cào chọn món
- Lắc chọn món (kèm câu lục bát) · Chạm chọn món · Mâm cơm gia đình ba miền
- So sánh món — chọn từng cặp để loại dần

**Cá nhân hoá**
- Lọc theo nhóm món, món tiêu biểu của Hà Nội/TP. Hồ Chí Minh/Đà Nẵng/Hội An, vùng miền, **buổi ăn** (sáng · trưa · xế · tối · khuya) và món yêu thích
- Đánh dấu yêu thích, loại trừ món không hợp khẩu vị (có ô tìm kiếm, bỏ dấu vẫn ra)
- Gợi ý theo giờ: món hợp buổi hiện tại được xếp lên đầu — phục vụ cả ngày, không chỉ bữa tối
- Món của ngày theo bộ lọc hiện tại, lịch ăn tuần, lịch sử và thống kê món đã chọn
- Chế độ nhiều người chơi (2–6 người)
- Chế độ tối, ba mức tốc độ hiệu ứng, hai kiểu mặt bài (Dân gian / Bài tây)

**Không gian làng quê**
- Nền sân gạch nung phủ chiếu cói và hoạ tiết trống đồng, khung mẹt tre quanh bộ bài
- Dải cảnh quê chạy ngang chân màn: luỹ tre, mái đình, con trâu, người đội nón,
  cây chuối, đàn cò, đồng lúa — hiện cả ở chế độ sáng lẫn tối
- Toàn bộ ảnh món được grade về một tông "nắng chiều sân quê" (xem
  `tools-grade-images.py`), độ lệch sáng giữa các ảnh giảm hơn ba lần

**Kỹ thuật**
- Giao diện tự co giãn từ 320px đến màn 4K; trên máy rộng cả bộ bài nằm gọn
  một màn, trên điện thoại khu vực bài cuộn dọc và mờ dần ở mép để báo còn bài
- Đặt món nhanh qua GrabFood, ShopeeFood, beFood, Google Maps
- PWA cài được lên điện thoại, giao diện dùng được offline sau lần tải đầu; ảnh chưa được cache có thể không hiện khi mất mạng
- Chia sẻ kết quả kèm ảnh thẻ bài
- 132/153 món đang có ảnh; 21 món còn lại hiện "Ảnh chưa có" trong khi chờ ảnh đúng món và quyền sử dụng rõ ràng. Nguồn, tác giả và giấy phép của ảnh bổ sung xem tại [trang ghi công ảnh](images/credits.html). Không phải mọi ảnh cũ đã được xác minh độc lập về nguồn gốc hoặc độ đúng món
- Ảnh tải lazy, tôn trọng `prefers-reduced-motion`
- Truy cập bàn phím đầy đủ: Escape đóng modal, Tab bị giữ trong modal, có vùng thông báo cho trình đọc màn hình

---

## Cách sử dụng / How to Use

1. Mở ứng dụng / Open the app
2. Chạm vào bất kỳ lá bài nào để xem gợi ý món ăn / Tap any card to reveal your meal suggestion
3. Sử dụng bộ lọc để thu hẹp theo loại món hoặc vùng miền / Use filters to narrow down by category or region
4. Đánh dấu yêu thích bằng cách nhấn vào biểu tượng trái tim / Mark favorites by tapping the heart icon
5. Chia sẻ kết quả với bạn bè / Share your result with friends

---

## Cài đặt / Installation

### Web
```bash
# Clone the repository
git clone https://github.com/anlvdt/homnayangi.git

# Navigate to directory
cd homnayangi

# Start a local server
python -m http.server 3000

# Open http://localhost:3000 in your browser
```

### Kiểm tra trình duyệt / Browser regression

Smoke test responsive, modal, lọc, chia sẻ, credits, localStorage lỗi và
offline được đặt tại `tests/browser_regression.py`.

```bash
# Terminal 1
python -m http.server 4173

# Terminal 2 (cần cài Playwright, Pillow + Chromium một lần)
pip install playwright pillow
playwright install chromium
npm run test:browser
```

Test so sánh màn hình mobile chính và menu cài đặt với ảnh chuẩn trong
`tests/visual-baselines/`, đồng thời chụp các viewport chẩn đoán vào `/tmp`.
Khi thay đổi giao diện có chủ đích, xem ảnh mới rồi cập nhật baseline bằng:

```bash
npm run test:visual:update
```

### PWA
1. Mở ứng dụng trong Chrome/Safari / Open the app in Chrome/Safari
2. Nhấn "Add to Home Screen" / Click "Add to Home Screen" or install prompt
3. Sử dụng shortcuts để truy cập nhanh / Use shortcuts for quick actions

---

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla) — không framework, không bước build
- Web Audio API for sound effects
- Canvas API for share image generation
- Service Worker for offline support
- LocalStorage for data persistence
- Phông **Be Vietnam Pro** tự host (`fonts/`, 10 tệp woff2, tổng 89 KB)

### Riêng tư mặc định

Ứng dụng không dùng CDN, Google Fonts, analytics hay cookie bên thứ ba. Phông
chữ, biểu tượng và ảnh món có sẵn đều nằm trong repo. Chỉ khi người dùng chủ
động dán một link ảnh HTTPS cho món tùy chỉnh, trình duyệt mới tải ảnh từ máy
chủ của link đó; ảnh ngoài có thể không khả dụng khi offline.

Dữ liệu người dùng (món yêu thích, món loại trừ, món tự thêm, lịch ăn tuần,
lịch sử, tùy chọn) nằm trong `localStorage` của trình duyệt, không rời khỏi
máy. Mục **Cài đặt → Giới thiệu → Quyền riêng tư** có nút xoá sạch toàn bộ.

---

## Cấu trúc dự án / Project Structure

```
homnayangi/
├── index.html          # Main HTML
├── styles.css          # Styles
├── app.js              # Application logic
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── app.test.js         # Property-based tests (fast-check)
├── dish-data.test.js   # Kiểm tra toàn vẹn dữ liệu kho món
├── LICENSE             # MIT
├── icons/              # App icons (192/512 + bản maskable) + ảnh tác giả
├── fonts/              # Be Vietnam Pro (woff2, tự host) + OFL.txt
├── images/             # Food images (WebP 512×512)
├── screenshots/        # Screenshots for README
├── tools-grade-images.py  # Đồng bộ tông màu ảnh món
└── tools-make-icons.py    # Dựng bộ icon PWA từ logo
```

### Dữ liệu món ăn

153 món nằm trong hằng `DISH_DB` ở đầu `app.js` (mỗi ván tối đa 52 lá). Mỗi bản ghi
gồm tên, vùng miền, ảnh (có thể chưa có), gợi ý ăn cùng, khoảng giá nội bộ và buổi ăn hợp.
Khoảng giá chưa đủ nguồn cập nhật theo địa điểm/thời điểm nên không hiển thị cho người dùng.
Các bảng `DISHES` / `IMAGES` / `REGIONS` / `PAIRINGS` được suy ra từ đó; kiểm tra
tự động chỉ chứng minh tệp tồn tại và dữ liệu đúng định dạng, không chứng minh ảnh chụp đúng món.

`dish-data.test.js` kiểm tra tự động: tệp ảnh được gán tồn tại, không trùng
lặp, vùng miền và buổi ăn hợp lệ, khoảng giá tăng dần, mỗi nhóm đủ ba miền.

```bash
npm test
```

---

## Tác giả / Author

**Lê Văn Ẩn** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-@anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)
[![Facebook](https://img.shields.io/badge/Facebook-Laptop%20Le%20An-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/laptopleandotcom)

---

## Ủng hộ tác giả / Support the Developer

Nếu bạn thấy ứng dụng hữu ích, hãy cân nhắc ủng hộ tác giả:

If you find this app useful, please consider supporting the developer:

[![Sponsor](https://img.shields.io/badge/Sponsor-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/anlvdt)
[![Shopee](https://img.shields.io/badge/Shopee-EE4D2D?style=for-the-badge&logo=shopee&logoColor=white)](https://collshp.com/laptopleandotcom?view=storefront)

| Phương thức / Method | Số tài khoản / Account | Tên / Name |
|---------------------|------------------------|------------|
| **MB Bank** | `0360126996868` | LE VAN AN |
| **Momo** | `0976896621` | LE VAN AN |

---

## Giấy phép / License

Mã nguồn: **MIT License** — xem tệp [LICENSE](LICENSE).

Phông Be Vietnam Pro trong `fonts/` phát hành theo **SIL Open Font License 1.1**
— xem [fonts/OFL.txt](fonts/OFL.txt).
