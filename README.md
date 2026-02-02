# Hom Nay An Gi? (What to Eat Today?)

A fun Vietnamese food picker app using a 52-card deck concept. Can't decide what to eat? Just pick a card!

---

## Gioi thieu (Tieng Viet)

**Hom Nay An Gi?** la ung dung giup ban chon mon an moi ngay mot cach thu vi voi bo bai 52 la. Moi la bai tuong ung voi mot mon an Viet Nam truyen thong.

### Tinh nang chinh

- 52 mon an Viet Nam chia theo 4 loai: Bun/Pho, Com, Banh/Xoi, Mon khac
- Loc theo vung mien: Bac, Trung, Nam
- Danh dau mon yeu thich va loai tru mon khong thich
- Che do nhieu nguoi choi - choi cung ban be
- Len lich an tuan
- Them mon an tuy chinh
- Hieu ung lat bai dep mat voi am thanh
- Ho tro che do toi
- PWA - Cai dat tren dien thoai de truy cap nhanh
- Chia se ket qua len mang xa hoi

### Cach su dung

1. Mo ung dung
2. Cham vao bat ky la bai nao de xem goi y mon an
3. Su dung bo loc de thu hep theo loai mon hoac vung mien
4. Danh dau yeu thich bang cach nhan vao bieu tuong trai tim
5. Chia se ket qua voi ban be

### Ho tro tac gia

Neu ban thay ung dung huu ich, hay can nhac ung ho tac gia:

| Phuong thuc | So tai khoan | Ten |
|-------------|--------------|-----|
| MB Bank | 0360126996868 | LE VAN AN |
| Momo | 0976896621 | LE VAN AN |

---

## Features

- 52 Vietnamese dishes organized by category (Noodles, Rice, Pastry, Others)
- Filter by region (North, Central, South Vietnam)
- Mark favorite dishes and exclude dishes you don't like
- Multiplayer mode - play with friends to see who gets the best dish
- Weekly meal planner
- Add custom dishes
- Beautiful card flip animations with sound effects
- Dark mode support
- PWA - Install on your phone for quick access
- Share results as images to social media

## Screenshots

![Home Screen](screenshots/home.png)
![Card Result](screenshots/result.png)
![Settings](screenshots/settings.png)

## How to Use

1. Open the app
2. Tap any card to reveal your meal suggestion
3. Use filters to narrow down by category or region
4. Mark favorites by tapping the heart icon
5. Share your result with friends

## Installation

### Web
Visit the hosted version or run locally:

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
1. Open the app in Chrome/Safari
2. Click "Add to Home Screen" or install prompt
3. Use shortcuts for quick actions

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Web Audio API for sound effects
- Canvas API for share image generation
- Service Worker for offline support
- LocalStorage for data persistence

## Project Structure

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

## Author

Le An (Vietnam IT)
- GitHub: [@anlvdt](https://github.com/anlvdt)

## Support

If you find this app useful, consider buying me a coffee:

| Method | Account | Name |
|--------|---------|------|
| MB Bank | 0360126996868 | LE VAN AN |
| Momo | 0976896621 | LE VAN AN |

## License

MIT License - See [LICENSE](LICENSE) for details.
