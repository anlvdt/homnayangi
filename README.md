# Hôm Nay Ăn Gì?

Ứng dụng chọn món ăn thú vị với bộ bài 52 lá. Không biết ăn gì? Bốc một lá bài!

**Demo:** [https://hnangi.netlify.app/](https://hnangi.netlify.app/)

---

## Giới thiệu / Introduction

**Hôm Nay Ăn Gì?** là ứng dụng giúp bạn chọn món ăn mỗi ngày một cách thú vị với bộ bài 52 lá. Mỗi lá bài tương ứng với một món ăn Việt Nam truyền thống.

A fun Vietnamese food picker app using a 52-card deck concept. Can't decide what to eat? Just pick a card!

---

## Tính năng / Features

- 52 món ăn Việt Nam chia theo 4 loại: Bún/Phở, Cơm, Bánh/Xôi, Món khác
- Lọc theo vùng miền: Bắc, Trung, Nam
- Đánh dấu món yêu thích và loại trừ món không thích
- Chế độ nhiều người chơi - chơi cùng bạn bè
- Lên lịch ăn tuần
- Thêm món ăn tùy chỉnh
- Hiệu ứng lật bài đẹp mắt với âm thanh
- Hỗ trợ chế độ tối
- PWA - Cài đặt trên điện thoại để truy cập nhanh
- Chia sẻ kết quả lên mạng xã hội

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
├── icons/              # App icons
├── images/             # Food images
└── screenshots/        # Screenshots for README
```
---

## Tác giả

**Le Van An** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)

## Ủng hộ dự án

Nếu bạn thấy dự án hữu ích, hãy cân nhắc ủng hộ tác giả.

### Chuyển khoản

| Phương thức | Số tài khoản | Chủ tài khoản |
|------------|-------------|---------------|
| MB Bank | `0360126996868` | LE VAN AN |
| Momo | `0976896621` | LE VAN AN |

### Shopee Affiliate

Mình làm Affiliate Shopee, nếu thấy sản phẩm hữu ích hãy ủng hộ mình một click nhé. Chỉ cần click không cần mua cũng được!

[![Shopee](https://img.shields.io/badge/Shopee-EE4D2D?style=for-the-badge&logo=shopee&logoColor=white)](https://s.shopee.vn/7AYWh5NzOB)

**[Xem sản phẩm trên Shopee](https://s.shopee.vn/7AYWh5NzOB)** — Xin cảm ơn!

### Ủng hộ khác

- Star repo trên GitHub
- Chia sẻ dự án cho bạn bè, đồng nghiệp
- Báo bug hoặc đề xuất tính năng mới qua Issues
- Đóng góp code qua Pull Requests

---

## License

MIT License — Copyright (c) 2026 Le An (Vietnam IT)
