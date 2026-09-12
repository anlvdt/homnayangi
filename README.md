# Hôm Nay Ăn Gì?

Ứng dụng chọn món ăn thú vị với bộ bài 52 lá. Không biết ăn gì? Bốc một lá bài!

**Demo:** [https://hnangi.netlify.app/](https://hnangi.netlify.app/)

---

## Giới thiệu / Introduction

**Hôm Nay Ăn Gì?** là ứng dụng giúp bạn chọn món ăn mỗi ngày một cách thú vị với bộ bài 52 lá. Mỗi lá bài tương ứng với một món ăn Việt Nam truyền thống.

A fun Vietnamese food picker app using a 52-card deck concept. Can't decide what to eat? Just pick a card!

---

## Tính năng / Features

**Bộ món**
- Gần 150 món chia 4 nhóm: Bún · Phở, Cơm, Bánh · Xôi, Nhậu · Cơm nhà — từ món dân dã tới món ngoại lai quen thuộc; mỗi ván chia 52 lá rút ngẫu nhiên
- Mỗi món có ảnh riêng, gợi ý ăn kèm, vùng miền, khoảng giá tham khảo và buổi ăn hợp
- Đủ ba miền Bắc – Trung – Nam trong từng nhóm
- Thêm món tùy chỉnh của riêng bạn

**Tám cách chọn món**
- Bốc bài (chạm một lá) và Bốc ngẫu nhiên (một chạm)
- Vòng quay may mắn · Quay Mâm (băng chuyền) · Cào vé số
- Xin xăm (quẻ lục bát) · Hái hoa dân chủ · Mâm cơm gia đình ba miền
- So găng — đấu loại trực tiếp giữa các món

**Cá nhân hoá**
- Lọc theo nhóm món, vùng miền, **buổi ăn** (sáng · trưa · xế · tối · khuya) và món yêu thích
- Đánh dấu yêu thích, loại trừ món không hợp khẩu vị (có ô tìm kiếm, bỏ dấu vẫn ra)
- Gợi ý theo giờ: món hợp buổi hiện tại được xếp lên đầu — phục vụ cả ngày, không chỉ bữa tối
- Món của ngày, lịch ăn tuần, lịch sử và thống kê món hay ăn
- Chế độ nhiều người chơi (2–6 người)
- Chế độ tối, ba mức tốc độ hiệu ứng, hai kiểu mặt bài (Dân gian / Bài tây)

**Kỹ thuật**
- Giao diện tự co giãn vừa khít mọi khung nhìn — từ 320px đến màn 4K, không cuộn trang
- Đặt món nhanh qua GrabFood, ShopeeFood, beFood, Google Maps
- PWA cài được lên điện thoại, chạy offline, không cần tài khoản
- Chia sẻ kết quả kèm ảnh thẻ bài
- Ảnh WebP 512×512, tải lazy, tôn trọng `prefers-reduced-motion`
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

### PWA
1. Mở ứng dụng trong Chrome/Safari / Open the app in Chrome/Safari
2. Nhấn "Add to Home Screen" / Click "Add to Home Screen" or install prompt
3. Sử dụng shortcuts để truy cập nhanh / Use shortcuts for quick actions

---

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Web Audio API for sound effects
- Canvas API for share image generation
- Service Worker for offline support
- LocalStorage for data persistence

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
├── icons/              # App icons
├── images/             # Food images (WebP 512×512)
└── screenshots/        # Screenshots for README
```

### Dữ liệu món ăn

Toàn bộ 52 món nằm trong hằng `DISH_DB` ở đầu `app.js`. Mỗi món là một bản ghi
duy nhất gồm tên, vùng miền, ảnh, gợi ý ăn kèm, khoảng giá và buổi ăn hợp —
các bảng `DISHES` / `IMAGES` / `REGIONS` / `PAIRINGS` được suy ra từ đó, nên
không thể xảy ra cảnh tên món một đằng ảnh một nẻo.

`dish-data.test.js` kiểm tra tự động: ảnh tồn tại và khớp tên món, không trùng
lặp, vùng miền và buổi ăn hợp lệ, khoảng giá tăng dần, mỗi nhóm đủ ba miền.

```bash
npm test
```

---

## Tác giả / Author

**Le Van An** (Vietnam IT)

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

MIT License
