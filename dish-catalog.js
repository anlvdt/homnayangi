// Homnayangi — catalog món ăn và tài nguyên minh hoạ.
// Tách khỏi app.js để dữ liệu tĩnh có thể được kiểm tra/cập nhật độc lập.
(function initDishCatalog(root, factory) {
  const catalog = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = catalog;
  if (root) root.HNAG_CATALOG = catalog;
})(typeof globalThis !== 'undefined' ? globalThis : this, function buildDishCatalog() {
// Homnayangi — Bốc bài chọn món ăn Việt
// Suspense animation + âm thanh tổng hợp, chạy hoàn toàn offline.

// ========================================
// DATA
// ========================================
const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Tên nhóm hiển thị — dùng chung cho bộ lọc, form thêm món và thẻ kết quả
const CATEGORY_NAMES = {
  '♥': 'Bún · Phở · Mì',
  '♦': 'Cơm',
  '♣': 'Bánh · Xôi',
  '♠': 'Món mặn · Nhậu'
};

// Số lá mỗi ván — giữ đúng hình ảnh "bộ bài 52 lá" dù kho món lớn hơn nhiều
const DECK_SIZE = 52;

// Kho món — không giới hạn ở 52. Mỗi ván chỉ chia 52 lá rút ngẫu nhiên từ
// kho này, nên "chia lại bộ bài" thật sự cho ra một bộ khác.
//
// meals:  buổi ăn hợp — sang | trua | chieu | toi | khuya
// price:  khoảng giá tham khảo, đơn vị nghìn đồng (một suất bình dân ở VN)
// region: B = Bắc, T = Trung, N = Nam, A = phổ biến cả nước
// img:    ảnh gốc trong thư mục images/. Các giá trị null bên dưới được thay bằng
//         ảnh chụp có nguồn rõ ràng trong REAL_PHOTO_OVERRIDES trước khi dựng UI.
const DISH_DB = {
  // ♥ BÚN · PHỞ · MÌ — món nước, món sợi
  '♥': [
    { name: 'Phở bò',              region: 'B', img: 'pho_bo_1769851159194.webp',        pair: 'Quẩy, giá trần, tương ớt',            price: [40, 75],  meals: ['sang', 'trua', 'toi', 'khuya'] },
    { name: 'Phở gà',              region: 'B', img: 'pho_ga.webp',                      pair: 'Hành lá, lá chanh, tiêu bắc',         price: [35, 65],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Bún bò Huế',          region: 'T', img: 'bun_bo_hue_1769851174568.webp',    pair: 'Rau sống, mắm ruốc, chanh ớt',        price: [40, 70],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Bún chả',             region: 'B', img: 'bun_cha_1769851878488.webp',       pair: 'Chả nướng, nem rán, rau sống',        price: [40, 70],  meals: ['trua'] },
    { name: 'Bún riêu cua',        region: 'B', img: 'bun_rieu_1769851188904.webp',      pair: 'Rau muống chẻ, đậu rán, mắm tôm',     price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Bún đậu mắm tôm',     region: 'B', img: 'bun_dau_mam_tom_1769851860469.webp', pair: 'Đậu rán, chả cốm, kinh giới',       price: [45, 90],  meals: ['trua', 'chieu', 'toi'] },
    { name: 'Bún thịt nướng',      region: 'N', img: 'bun_thit_nuong.webp',              pair: 'Đồ chua, đậu phộng, mắm chua ngọt',   price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Hủ tiếu Nam Vang',    region: 'N', img: 'hu_tieu_1769851204224.webp',       pair: 'Giá, hẹ, tóp mỡ, chanh ớt',           price: [35, 65],  meals: ['sang', 'trua', 'khuya'] },
    { name: 'Mì Quảng',            region: 'T', img: 'mi_quang_1769851314324.webp',      pair: 'Bánh tráng mè, đậu phộng, rau sống',  price: [35, 60],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Bún chả cá',          region: 'T', img: 'bun_cha_ca_1769851349249.webp',    pair: 'Rau sống, ớt xanh, mắm ruốc',         price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Bún mắm',             region: 'N', img: 'bun_mam_1769851373054.webp',       pair: 'Rau đắng, bông súng, cà tím',         price: [40, 70],  meals: ['trua', 'toi'] },
    { name: 'Bún thang',           region: 'B', img: 'bun_thang_1769851298396.webp',     pair: 'Trứng tráng, giò lụa, ruốc tôm',      price: [40, 70],  meals: ['sang', 'trua'] },
    { name: 'Bún mọc',             region: 'B', img: 'bun_moc_1769851279926.webp',       pair: 'Mọc viên, măng khô, hành lá',         price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Bún cá',              region: 'B', img: 'bun_ca_1769851333627.webp',        pair: 'Thì là, dọc mùng, cà chua',           price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Miến gà',             region: 'B', img: 'mien_ga_1769851220414.webp',       pair: 'Hành phi, măng khô, tiêu',            price: [35, 60],  meals: ['sang', 'toi', 'khuya'] },
    { name: 'Bánh canh cua',       region: 'T', img: 'banh_canh_1769851264800.webp',     pair: 'Chả cua, hành ngò, tiêu',             price: [35, 65],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Mì xào giòn',         region: 'A', img: 'mi_xao.webp',                      pair: 'Cải ngọt, tim cật, nước sốt sánh',    price: [35, 65],  meals: ['trua', 'toi'] },
    { name: 'Bánh đa cua',         region: 'B', img: null,                               pair: 'Chả lá lốt, rau rút, gạch cua',       price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Bún ốc',              region: 'B', img: null,                               pair: 'Tía tô, giấm bỗng, ớt chưng',         price: [30, 55],  meals: ['sang', 'trua', 'chieu'] },
    { name: 'Mì vằn thắn',         region: 'B', img: null,                               pair: 'Sủi cảo, trứng, gan heo',             price: [40, 70],  meals: ['toi', 'khuya'] },
    { name: 'Phở khô Gia Lai',     region: 'T', img: null,                               pair: 'Tương đen, rau sống, chén nước lèo',  price: [35, 60],  meals: ['sang', 'trua'] },
    { name: 'Bún nước lèo',        region: 'N', img: null,                               pair: 'Rau ghém, heo quay, mắm bò hóc',      price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Hủ tiếu gõ',          region: 'N', img: null,                               pair: 'Giá trụng, hành phi, tóp mỡ',         price: [20, 35],  meals: ['toi', 'khuya'] },
    { name: 'Mì cay Hàn Quốc',     region: 'A', img: null,                               pair: 'Kimchi, phô mai, cấp độ tuỳ gan',     price: [50, 90],  meals: ['trua', 'toi'] },
    { name: 'Ramen Nhật',          region: 'A', img: null,                               pair: 'Trứng lòng đào, chashu, rong biển',   price: [80, 160], meals: ['trua', 'toi'] },
    { name: 'Mì Ý sốt bò bằm',     region: 'A', img: null,                               pair: 'Phô mai bào, bánh mì bơ tỏi',         price: [60, 130], meals: ['trua', 'toi'] },
    { name: 'Phở cuốn',            region: 'B', img: null,                               pair: 'Thịt bò xào, rau thơm, nước chấm',    price: [40, 70],  meals: ['chieu', 'toi'] },
    { name: 'Bún măng vịt',        region: 'N', img: null,                               pair: 'Măng khô, rau răm, mắm gừng',         price: [35, 65],  meals: ['trua', 'toi'] },
    { name: 'Miến lươn',           region: 'B', img: null,                               pair: 'Lươn giòn, hành phi, rau răm',        price: [35, 60],  meals: ['sang', 'trua'] },
    { name: 'Cao lầu',             region: 'T', img: null,                               pair: 'Tóp mỡ, rau sống Trà Quế, bánh tráng', price: [30, 55], meals: ['trua', 'toi'] },
    { name: 'Hủ tiếu Mỹ Tho',      region: 'N', img: null,                               pair: 'Tôm, gan, giá hẹ, tương đen',         price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Bún riêu ốc',         region: 'B', img: null,                               pair: 'Ốc bươu, đậu rán, giấm bỗng',         price: [30, 55],  meals: ['sang', 'trua'] },
    { name: 'Phở xào bò',          region: 'A', img: null,                               pair: 'Cải ngồng, hành tây, tương ớt',       price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Mì tôm trứng',        region: 'A', img: null,                               pair: 'Trứng chần, hành lá, rau cải',        price: [10, 25],  meals: ['sang', 'khuya'] },
    { name: 'Pad Thái',            region: 'A', img: null,                               pair: 'Đậu phộng, giá, tôm, chanh',          price: [50, 95],  meals: ['trua', 'toi'] },
    { name: 'Bún cá rô đồng',      region: 'B', img: null,                               pair: 'Thì là, rau cải, cà chua',            price: [30, 55],  meals: ['sang', 'trua'] }
  ],
  // ♦ CƠM — cơm quán, cơm nhà, cơm ngoại
  '♦': [
    { name: 'Cơm tấm sườn',        region: 'N', img: 'com_tam_1769851390923.webp',       pair: 'Bì, chả trứng, đồ chua, mỡ hành',     price: [35, 65],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Cơm sườn nướng',      region: 'A', img: 'com_suon_1769851423572.webp',      pair: 'Dưa leo, cà chua, canh rau',          price: [35, 65],  meals: ['trua', 'toi'] },
    { name: 'Cơm gà Hội An',       region: 'T', img: 'com_ga_1769851406663.webp',        pair: 'Gỏi hành, rau răm, mắm gừng',         price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Cơm gà xối mỡ',       region: 'N', img: 'com_ga_xoi_mo_1769851512591.webp', pair: 'Dưa leo, cà chua, canh rong biển',    price: [40, 70],  meals: ['trua', 'toi'] },
    { name: 'Cơm gà luộc',         region: 'B', img: 'com_ga_luoc.webp',                 pair: 'Muối tiêu chanh, lá chanh, canh xương', price: [40, 70], meals: ['trua', 'toi'] },
    { name: 'Cơm rang dưa bò',     region: 'B', img: 'com_rang_dua_bo.webp',             pair: 'Dưa chua, hành lá, tương ớt',         price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Cơm chiên Dương Châu', region: 'N', img: 'com_chien_1769851438643.webp',    pair: 'Lạp xưởng, trứng, đậu Hà Lan',        price: [35, 65],  meals: ['trua', 'toi'] },
    { name: 'Cơm cá kho tộ',       region: 'N', img: 'com_ca_kho_1769851495798.webp',    pair: 'Canh chua, rau luộc, dưa giá',        price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Cơm cá chiên',        region: 'A', img: 'com_ca_chien.webp',                pair: 'Nước mắm gừng, dưa leo, canh cải',    price: [30, 55],  meals: ['trua', 'toi'] },
    { name: 'Cơm thịt kho trứng',  region: 'N', img: 'com_thit_kho_1769851603858.webp',  pair: 'Dưa giá, canh khổ qua nhồi thịt',     price: [30, 55],  meals: ['trua', 'toi'] },
    { name: 'Cơm thịt luộc',       region: 'B', img: 'com_thit_luoc.webp',               pair: 'Mắm tép, cà pháo, rau luộc',          price: [30, 50],  meals: ['trua', 'toi'] },
    { name: 'Cơm thịt xào',        region: 'A', img: 'com_thit_xao.webp',                pair: 'Hành tây, cần tỏi, canh rau',         price: [30, 50],  meals: ['trua', 'toi'] },
    { name: 'Cơm trứng chiên',     region: 'A', img: 'com_trung_chien.webp',             pair: 'Nước tương, dưa leo, canh rau',       price: [25, 45],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Cơm bò lúc lắc',      region: 'N', img: 'com_bo_luc_lac_1769851454953.webp', pair: 'Xà lách, cà chua, muối tiêu chanh',  price: [50, 90],  meals: ['trua', 'toi'] },
    { name: 'Cơm cà ri gà',        region: 'N', img: 'com_ca_ri_1769851559778.webp',     pair: 'Bánh mì, rau răm, muối ớt chanh',     price: [40, 70],  meals: ['trua', 'toi'] },
    { name: 'Cơm vịt quay',        region: 'B', img: 'com_vit_1769851588657.webp',       pair: 'Xì dầu tỏi ớt, dưa góp',              price: [45, 80],  meals: ['trua', 'toi'] },
    { name: 'Cơm niêu',            region: 'N', img: 'com_nieu_1769851480399.webp',      pair: 'Cá kho tộ, canh chua, rau luộc',      price: [60, 120], meals: ['trua', 'toi'] },
    { name: 'Cơm cháy Ninh Bình',  region: 'B', img: 'com_chay_1769851545278.webp',      pair: 'Ruốc thịt, sốt dê, hành phi',         price: [30, 60],  meals: ['chieu', 'toi'] },
    { name: 'Cơm đậu hũ chay',     region: 'A', img: 'com_dau_hu.webp',                  pair: 'Rau luộc, nấm kho, canh chay',        price: [25, 45],  meals: ['trua', 'toi'] },
    { name: 'Cơm trộn',            region: 'A', img: 'com_tron_1769851528327.webp',      pair: 'Trứng ốp la, rau củ, tương ớt Hàn',   price: [45, 85],  meals: ['trua', 'toi'] },
    { name: 'Cơm hến',             region: 'T', img: null,                               pair: 'Mắm ruốc, tóp mỡ, bánh tráng, đậu phộng', price: [20, 40], meals: ['sang', 'trua'] },
    { name: 'Cơm lam',             region: 'B', img: null,                               pair: 'Muối vừng, gà nướng, măng rừng',      price: [25, 50],  meals: ['trua', 'toi'] },
    { name: 'Cơm âm phủ',          region: 'T', img: null,                               pair: 'Nem chua, tôm, trứng, rau thái sợi',  price: [40, 70],  meals: ['trua', 'toi'] },
    { name: 'Cơm gà Hải Nam',      region: 'A', img: null,                               pair: 'Nước sốt gừng, canh gà, dưa leo',     price: [50, 90],  meals: ['trua', 'toi'] },
    { name: 'Cơm bò Nhật',         region: 'A', img: null,                               pair: 'Hành tây, trứng lòng đào, gừng đỏ',   price: [60, 110], meals: ['trua', 'toi'] },
    { name: 'Cơm rang hải sản',    region: 'A', img: null,                               pair: 'Tôm mực, đậu Hà Lan, tương ớt',       price: [45, 85],  meals: ['trua', 'toi'] },
    { name: 'Cơm sườn Hàn Quốc',   region: 'A', img: null,                               pair: 'Kimchi, rong biển, trứng chiên',      price: [60, 110], meals: ['trua', 'toi'] },
    { name: 'Cơm heo quay',        region: 'N', img: null,                               pair: 'Bánh hỏi, mắm nêm, dưa leo',          price: [40, 75],  meals: ['trua', 'toi'] },
    { name: 'Cơm gà nướng',        region: 'A', img: null,                               pair: 'Dưa góp, muối ớt, canh rau',          price: [40, 70],  meals: ['trua', 'toi'] },
    { name: 'Cơm chiên trứng',     region: 'A', img: null,                               pair: 'Nước tương, dưa leo, tương ớt',       price: [20, 40],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Cơm gà Tam Kỳ',       region: 'T', img: null,                               pair: 'Gỏi đu đủ, rau răm, mắm gừng',        price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Cơm sườn bì chả',     region: 'N', img: null,                               pair: 'Đồ chua, mỡ hành, canh rau',          price: [35, 65],  meals: ['sang', 'trua', 'toi'] },
    { name: 'Cơm bò xào cần tỏi',  region: 'A', img: null,                               pair: 'Cần tây, tỏi, canh rau',              price: [35, 60],  meals: ['trua', 'toi'] },
    { name: 'Cơm cà ri Ấn',        region: 'A', img: null,                               pair: 'Bánh naan, rau củ, sữa chua',         price: [55, 110], meals: ['trua', 'toi'] },
    { name: 'Cơm bò Hàn Quốc',     region: 'A', img: null,                               pair: 'Kim chi, rau trộn, trứng ốp la',      price: [55, 100], meals: ['trua', 'toi'] },
    { name: 'Cơm dừa Bến Tre',     region: 'N', img: null,                               pair: 'Tôm rang, thịt kho, dừa nạo',         price: [35, 65],  meals: ['trua', 'toi'] }
  ],
  // ♣ BÁNH · XÔI — ăn sáng, ăn xế, ăn vặt
  '♣': [
    { name: 'Bánh mì thịt',        region: 'A', img: 'banh_mi_1769851625130.webp',       pair: 'Pate, chả lụa, đồ chua, rau mùi',     price: [15, 35],  meals: ['sang', 'chieu', 'khuya'] },
    { name: 'Bánh mì trứng',       region: 'A', img: 'banh_mi_trung.webp',               pair: 'Trứng ốp la, pate, tương ớt',         price: [15, 30],  meals: ['sang'] },
    { name: 'Bánh cuốn',           region: 'B', img: 'banh_cuon_1769851655972.webp',     pair: 'Chả quế, hành phi, nước mắm pha',     price: [25, 45],  meals: ['sang', 'chieu'] },
    { name: 'Bánh ướt',            region: 'T', img: 'banh_uot_1769851715272.webp',      pair: 'Chả lụa, giá trụng, mắm nêm',         price: [20, 40],  meals: ['sang', 'chieu'] },
    { name: 'Bánh xèo miền Tây',   region: 'N', img: 'banh_xeo.webp',                    pair: 'Rau sống, cải xanh, mắm chua ngọt',   price: [25, 60],  meals: ['chieu', 'toi'] },
    { name: 'Bánh xèo miền Trung', region: 'T', img: 'banh_xeo_1769851641773.webp',      pair: 'Bánh tráng cuốn, rau sống, mắm nêm',  price: [25, 50],  meals: ['chieu', 'toi'] },
    { name: 'Bánh khọt',           region: 'N', img: 'banh_khot_1769851670592.webp',     pair: 'Tôm cháy, rau sống, mắm nêm',         price: [30, 60],  meals: ['chieu', 'toi'] },
    { name: 'Bánh bèo',            region: 'T', img: 'banh_beo_1769851730342.webp',      pair: 'Tôm chấy, tóp mỡ, mắm ngọt',          price: [20, 45],  meals: ['chieu'] },
    { name: 'Bánh bột lọc',        region: 'T', img: 'banh_bot_loc_1769851828366.webp',  pair: 'Tôm thịt, mỡ hành, mắm ớt',           price: [20, 45],  meals: ['chieu', 'toi'] },
    { name: 'Bánh căn',            region: 'T', img: 'banh_can_1769851698678.webp',      pair: 'Xíu mại, mỡ hành, mắm nêm',           price: [25, 50],  meals: ['sang', 'chieu'] },
    { name: 'Bánh giò',            region: 'B', img: 'banh_gio.webp',                    pair: 'Giò lụa, dưa góp, tương ớt',          price: [15, 30],  meals: ['sang', 'chieu'] },
    { name: 'Bánh đúc nóng',       region: 'B', img: 'banh_duc_1769851745434.webp',      pair: 'Thịt băm, mộc nhĩ, hành phi',         price: [15, 30],  meals: ['chieu', 'toi'] },
    { name: 'Bánh hỏi thịt nướng', region: 'N', img: 'banh_hoi_1769851762429.webp',      pair: 'Mỡ hành, rau sống, mắm nêm',          price: [30, 60],  meals: ['sang', 'trua'] },
    { name: 'Bánh bao',            region: 'A', img: 'banh_bao_1769851844328.webp',      pair: 'Trứng cút, lạp xưởng, tương ớt',      price: [15, 30],  meals: ['sang', 'chieu', 'khuya'] },
    { name: 'Bánh tráng nướng',    region: 'T', img: 'banh_trang_nuong_1769851778904.webp', pair: 'Trứng cút, khô bò, tương ớt',      price: [15, 35],  meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Bánh tráng trộn',     region: 'N', img: 'banh_trang_tron_1769851813225.webp', pair: 'Khô bò, xoài xanh, rau răm, tắc',   price: [15, 35],  meals: ['chieu', 'toi'] },
    { name: 'Xôi xéo',             region: 'B', img: 'xoi_xeo.webp',                     pair: 'Đậu xanh, hành phi, mỡ gà',           price: [15, 30],  meals: ['sang'] },
    { name: 'Xôi gà',              region: 'A', img: 'xoi_ga.webp',                      pair: 'Gà xé, lạp xưởng, hành phi',          price: [25, 45],  meals: ['sang', 'toi'] },
    { name: 'Xôi mặn',             region: 'N', img: 'xoi_man.webp',                     pair: 'Lạp xưởng, chà bông, mỡ hành',        price: [20, 40],  meals: ['sang', 'khuya'] },
    { name: 'Bánh gối',            region: 'B', img: null,                               pair: 'Rau sống, nước chấm chua ngọt',       price: [15, 30],  meals: ['chieu'] },
    { name: 'Bánh tôm Hồ Tây',     region: 'B', img: null,                               pair: 'Rau sống, đu đủ ngâm, nước chấm',     price: [30, 60],  meals: ['chieu'] },
    { name: 'Bánh khoái',          region: 'T', img: null,                               pair: 'Nước lèo đậu phộng, vả, rau sống',    price: [25, 50],  meals: ['chieu', 'toi'] },
    { name: 'Bánh mì chảo',        region: 'A', img: null,                               pair: 'Pate, xúc xích, trứng, bò né',        price: [35, 70],  meals: ['sang', 'trua'] },
    { name: 'Xôi lạc',             region: 'B', img: null,                               pair: 'Muối vừng, ruốc, hành phi',           price: [10, 25],  meals: ['sang'] },
    { name: 'Bánh giầy giò',       region: 'B', img: null,                               pair: 'Giò lụa, tương ớt',                   price: [10, 25],  meals: ['sang', 'chieu'] },
    { name: 'Pizza',               region: 'A', img: null,                               pair: 'Phô mai kéo sợi, tương ớt, oregano',  price: [90, 250], meals: ['trua', 'toi'] },
    { name: 'Hamburger',           region: 'A', img: null,                               pair: 'Khoai tây chiên, sốt mayonnaise',     price: [50, 120], meals: ['trua', 'chieu', 'toi'] },
    { name: 'Bánh mì xíu mại',     region: 'T', img: null,                               pair: 'Xíu mại sốt cà, ngò, ớt',             price: [15, 35],  meals: ['sang', 'chieu'] },
    { name: 'Xôi gấc',             region: 'B', img: null,                               pair: 'Chả lụa, đường, dừa nạo',             price: [10, 25],  meals: ['sang'] },
    { name: 'Bánh chưng rán',      region: 'B', img: null,                               pair: 'Dưa hành, tương ớt',                  price: [20, 40],  meals: ['sang', 'chieu'] },
    { name: 'Bánh nậm',            region: 'T', img: null,                               pair: 'Tôm chấy, mỡ hành, mắm ớt',           price: [15, 35],  meals: ['chieu'] },
    { name: 'Bánh cống',           region: 'N', img: null,                               pair: 'Rau sống, nước mắm chua ngọt',        price: [20, 45],  meals: ['chieu', 'toi'] },
    { name: 'Bánh flan',           region: 'A', img: null,                               pair: 'Cà phê, nước cốt dừa, đá bào',        price: [10, 25],  meals: ['chieu'] },
    { name: 'Sandwich',            region: 'A', img: null,                               pair: 'Trứng, rau, sốt mayonnaise',          price: [20, 45],  meals: ['sang', 'chieu'] },
    { name: 'Kebab Thổ Nhĩ Kỳ',    region: 'A', img: null,                               pair: 'Rau trộn, sốt phô mai, tương ớt',     price: [25, 50],  meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Bánh mì que',         region: 'T', img: null,                               pair: 'Pate cay, ruốc, tương ớt',            price: [10, 25],  meals: ['sang', 'chieu'] },
    { name: 'Bánh bao bánh vạc',   region: 'T', img: 'photo_banh_bao_banh_vac.webp',      pair: 'Nước chấm chua ngọt, rau thơm',       price: [40, 80],  meals: ['chieu', 'toi'] }
  ],
  // ♠ MÓN MẶN · NHẬU — cơm nhà, lẩu nướng, hải sản, món ngoại
  '♠': [
    { name: 'Gỏi cuốn',            region: 'N', img: 'goi_cuon_1769851929695.webp',      pair: 'Tương hột, đậu phộng rang',           price: [25, 50],  meals: ['chieu', 'toi'] },
    { name: 'Chả giò',             region: 'N', img: 'cha_gio_1769851944525.webp',       pair: 'Rau sống, bún, mắm chua ngọt',        price: [30, 60],  meals: ['trua', 'chieu', 'toi'] },
    { name: 'Nem rán',             region: 'B', img: 'nem_ran.webp',                     pair: 'Bún, rau sống, nước chấm chua ngọt',  price: [30, 60],  meals: ['trua', 'toi'] },
    { name: 'Nem nướng Nha Trang', region: 'T', img: 'nem_nuong_1769851901613.webp',     pair: 'Bánh tráng, rau sống, tương chấm',    price: [40, 75],  meals: ['chieu', 'toi'] },
    { name: 'Cá kho tộ',           region: 'N', img: 'ca_kho_to.webp',                   pair: 'Cơm trắng, canh chua, dưa giá',       price: [40, 80],  meals: ['trua', 'toi'] },
    { name: 'Thịt kho trứng',      region: 'N', img: 'thit_kho_trung.webp',              pair: 'Dưa giá, cơm trắng, canh khổ qua',    price: [35, 70],  meals: ['trua', 'toi'] },
    { name: 'Thịt luộc mắm tôm',   region: 'B', img: 'thit_luoc.webp',                   pair: 'Bún, rau kinh giới, mắm tôm chanh',   price: [40, 80],  meals: ['trua', 'toi'] },
    { name: 'Gà kho gừng',         region: 'A', img: 'ga_kho_gung.webp',                 pair: 'Cơm nóng, dưa cải, canh rau',         price: [40, 80],  meals: ['trua', 'toi'] },
    { name: 'Sườn xào chua ngọt',  region: 'A', img: 'suon_xao_chua_ngot.webp',          pair: 'Cơm trắng, dưa leo, canh rau',        price: [40, 80],  meals: ['trua', 'toi'] },
    { name: 'Đậu hũ sốt cà',       region: 'A', img: 'dau_hu_sot_ca.webp',               pair: 'Cơm trắng, rau luộc, canh rau',       price: [20, 40],  meals: ['trua', 'toi'] },
    { name: 'Rau xào tỏi',         region: 'A', img: 'rau_xao.webp',                     pair: 'Cơm trắng, nước mắm ớt',              price: [15, 35],  meals: ['trua', 'toi'] },
    { name: 'Canh chua cá',        region: 'N', img: 'canh_chua.webp',                   pair: 'Cá kho tộ, cơm trắng, rau thơm',      price: [35, 70],  meals: ['trua', 'toi'] },
    { name: 'Canh mồng tơi',       region: 'B', img: 'canh_mong_toi.webp',               pair: 'Cà pháo, thịt kho, cơm trắng',        price: [15, 30],  meals: ['trua', 'toi'] },
    { name: 'Cháo sườn',           region: 'B', img: 'chao_suon_1769851239545.webp',     pair: 'Quẩy, ruốc, tiêu, hành',              price: [15, 35],  meals: ['sang', 'chieu', 'khuya'] },
    { name: 'Cháo gà',             region: 'A', img: 'chao_ga.webp',                     pair: 'Gỏi gà, hành răm, tiêu',              price: [25, 50],  meals: ['sang', 'toi', 'khuya'] },
    { name: 'Gà nướng muối ớt',    region: 'A', img: 'ga_nuong_1769852050721.webp',      pair: 'Muối ớt xanh, cơm lam, rau rừng',     price: [120, 250], meals: ['toi'] },
    { name: 'Thịt nướng BBQ',      region: 'A', img: 'bbq_nuong_1769852036308.webp',     pair: 'Kim chi, rau xà lách, muối ớt chanh', price: [150, 350], meals: ['toi'] },
    { name: 'Hải sản nướng',       region: 'A', img: 'hai_san_1769852083065.webp',       pair: 'Mỡ hành, muối ớt xanh, rau răm',      price: [150, 400], meals: ['toi', 'khuya'] },
    { name: 'Lẩu Thái',            region: 'A', img: 'lau_thai_1769851977079.webp',      pair: 'Hải sản, nấm, rau muống, bún',        price: [150, 350], meals: ['toi'] },
    { name: 'Lẩu bò',              region: 'A', img: 'lau_bo_1769851992471.webp',        pair: 'Cải cúc, mì tôm, sa tế',              price: [150, 350], meals: ['toi'] },
    { name: 'Lẩu hải sản',         region: 'A', img: 'lau_hai_san_1769852007068.webp',   pair: 'Nghêu, mực, rau nhúng, bún tươi',     price: [200, 450], meals: ['toi'] },
    { name: 'Ốc các loại',         region: 'A', img: 'oc_cac_loai_1769851960829.webp',   pair: 'Rau răm, muối tiêu chanh, sả ớt',     price: [50, 150],  meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Vịt quay Lạng Sơn',   region: 'B', img: 'vit_quay_1769852066805.webp',      pair: 'Măng ớt, bánh hỏi, xì dầu',           price: [60, 140],  meals: ['trua', 'toi'] },
    { name: 'Gà rán',              region: 'A', img: null,                               pair: 'Khoai tây chiên, tương cà, sốt phô mai', price: [50, 120], meals: ['trua', 'chieu', 'toi'] },
    { name: 'Bò né',               region: 'N', img: null,                               pair: 'Bánh mì, pate, trứng ốp la',          price: [40, 80],   meals: ['sang', 'trua'] },
    { name: 'Lẩu gà lá é',         region: 'T', img: null,                               pair: 'Lá é, nấm, bún tươi, muối ớt xanh',   price: [180, 350], meals: ['toi'] },
    { name: 'Phá lấu',             region: 'N', img: null,                               pair: 'Bánh mì, nước cốt dừa, mắm me',       price: [25, 60],   meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Sushi',               region: 'A', img: null,                               pair: 'Wasabi, gừng hồng, xì dầu',           price: [100, 300], meals: ['trua', 'toi'] },
    { name: 'Dimsum',              region: 'A', img: null,                               pair: 'Xì dầu, tương ớt, trà nóng',          price: [60, 150],  meals: ['sang', 'trua'] },
    { name: 'Bò kho',              region: 'N', img: null,                               pair: 'Bánh mì, rau quế, tương ớt',          price: [35, 70],   meals: ['sang', 'trua', 'toi'] },
    { name: 'Bò lá lốt',           region: 'N', img: null,                               pair: 'Bánh hỏi, rau sống, mắm nêm',         price: [40, 90],   meals: ['chieu', 'toi'] },
    { name: 'Trứng vịt lộn',       region: 'A', img: null,                               pair: 'Rau răm, muối tiêu chanh, gừng',      price: [10, 25],   meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Nem chua rán',        region: 'B', img: null,                               pair: 'Tương ớt, dưa leo, rau thơm',         price: [25, 50],   meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Chân gà sả tắc',      region: 'A', img: null,                               pair: 'Xoài xanh, sả, tắc, ớt',              price: [30, 60],   meals: ['chieu', 'toi', 'khuya'] },
    { name: 'Cánh gà chiên mắm',   region: 'A', img: null,                               pair: 'Cơm trắng, dưa leo, tương ớt',        price: [30, 60],   meals: ['trua', 'toi'] },
    { name: 'Mực nướng sa tế',     region: 'A', img: null,                               pair: 'Muối ớt xanh, rau răm, bia',          price: [70, 180],  meals: ['toi', 'khuya'] },
    { name: 'Lẩu mắm',             region: 'N', img: null,                               pair: 'Cá, heo quay, rau đồng, bún',         price: [180, 400], meals: ['toi'] },
    { name: 'Chả cá Lã Vọng',      region: 'B', img: null,                               pair: 'Bún, thì là, mắm tôm, đậu phộng',     price: [90, 200],  meals: ['trua', 'toi'] },
    { name: 'Tokbokki',            region: 'A', img: null,                               pair: 'Chả cá, trứng luộc, phô mai',         price: [40, 80],   meals: ['chieu', 'toi'] },
    { name: 'Cà ri dê',            region: 'N', img: null,                               pair: 'Bánh mì, rau quế, muối ớt',           price: [60, 130],  meals: ['toi'] },
    { name: 'Ếch xào lăn',         region: 'N', img: null,                               pair: 'Bánh mì, cơm, đậu phộng, nước cốt dừa', price: [50, 110], meals: ['toi'] },
    { name: 'Bột chiên',           region: 'N', img: 'photo_bot_chien.webp',              pair: 'Trứng, đu đủ bào, nước tương',         price: [25, 45],  meals: ['sang', 'chieu', 'toi'] },
    { name: 'Bánh tráng cuốn thịt heo', region: 'T', img: 'photo_banh_trang_cuon_thit_heo.webp', pair: 'Rau sống, mắm nêm, bún', price: [60, 160], meals: ['trua', 'toi'] },
    { name: 'Bún mắm nêm',          region: 'T', img: null,                              pair: 'Heo quay, rau sống, đậu phộng',         price: [35, 60],  meals: ['trua', 'toi'] }
  ]
};

// Ảnh chụp bổ sung từ Wikimedia Commons (tác giả, giấy phép và nguồn được lưu tại
// images/commons-food-sources.json). Tách mapping khỏi dữ liệu món để việc
// kiểm tra và cập nhật nguồn ảnh không làm xô lệch các thuộc tính món ăn.
const REAL_PHOTO_OVERRIDES = {
  'Bánh flan': 'photo_banh_flan.webp',
  'Bánh chưng rán': 'photo_banh_chung_ran.webp',
  'Bánh cống': 'photo_banh_cong.webp',
  'Bánh giầy giò': 'photo_banh_giay_gio.webp',
  'Bánh mì chảo': 'photo_banh_mi_chao.webp',
  'Bánh mì xíu mại': 'photo_banh_mi_xiu_mai.webp',
  'Bánh nậm': 'photo_banh_nam.webp',
  'Bánh tôm Hồ Tây': 'photo_banh_tom_ho_tay.webp',
  'Bánh đa cua': 'photo_banh_da_cua.webp',
  'Bò kho': 'photo_bo_kho.webp',
  'Bò lá lốt': 'photo_bo_la_lot.webp',
  'Bò né': 'photo_bo_ne.webp',
  'Bún cá rô đồng': 'photo_bun_ca_ro_dong.webp',
  'Bún măng vịt': 'photo_bun_mang_vit.webp',
  'Bún nước lèo': 'photo_bun_nuoc_leo.webp',
  'Bún ốc': 'photo_bun_oc.webp',
  'Cao lầu': 'photo_cao_lau.webp',
  'Chả cá Lã Vọng': 'photo_cha_ca_la_vong.webp',
  'Cơm bò Hàn Quốc': 'photo_com_bo_han_quoc.webp',
  'Cơm bò Nhật': 'photo_com_bo_nhat.webp',
  'Cơm chiên trứng': 'photo_com_chien_trung.webp',
  'Cơm gà Hải Nam': 'photo_com_ga_hai_nam.webp',
  'Cơm gà Tam Kỳ': 'photo_com_ga_tam_ky.webp',
  'Cơm gà nướng': 'photo_com_ga_nuong.webp',
  'Cơm hến': 'photo_com_hen.webp',
  'Cơm heo quay': 'photo_com_heo_quay.webp',
  'Cơm lam': 'photo_com_lam.webp',
  'Cơm rang hải sản': 'photo_com_rang_hai_san.webp',
  'Cơm sườn bì chả': 'photo_com_suon_bi_cha.webp',
  'Dimsum': 'photo_dimsum.webp',
  'Gà rán': 'photo_ga_ran.webp',
  'Hamburger': 'photo_hamburger.webp',
  'Hủ tiếu Mỹ Tho': 'photo_hu_tieu_my_tho.webp',
  'Kebab Thổ Nhĩ Kỳ': 'photo_kebab_tho_nhi_ky.webp',
  'Mì cay Hàn Quốc': 'photo_mi_cay_han_quoc.webp',
  'Mì tôm trứng': 'photo_mi_tom_trung.webp',
  'Mì vằn thắn': 'photo_mi_van_than.webp',
  'Mì Ý sốt bò bằm': 'photo_mi_y_sot_bo_bam.webp',
  'Mực nướng sa tế': 'photo_muc_nuong_sa_te.webp',
  'Nem chua rán': 'photo_nem_chua_ran.webp',
  'Pad Thái': 'photo_pad_thai.webp',
  'Phá lấu': 'photo_pha_lau.webp',
  'Phở khô Gia Lai': 'photo_pho_kho_gia_lai.webp',
  'Phở xào bò': 'photo_pho_xao_bo.webp',
  'Pizza': 'photo_pizza.webp',
  'Ramen Nhật': 'photo_ramen_nhat.webp',
  'Sandwich': 'photo_sandwich.webp',
  'Sushi': 'photo_sushi.webp',
  'Tokbokki': 'photo_tokbokki.webp',
  'Trứng vịt lộn': 'photo_trung_vit_lon.webp',
  'Xôi gấc': 'photo_xoi_gac.webp'
};

// These files depict a different dish or an unverifiable generic variant.
// Do not show them as if they were evidence for the dish name.
const UNVERIFIED_PHOTO_DISHES = new Set([
  'Bánh gối', 'Bánh khoái', 'Bánh mì que', 'Cánh gà chiên mắm',
  'Chân gà sả tắc', 'Cơm âm phủ', 'Cơm cà ri Ấn', 'Cơm dừa Bến Tre', 'Cơm cháy Ninh Bình',
  'Ếch xào lăn', 'Hủ tiếu gõ', 'Lẩu gà lá é', 'Lẩu mắm', 'Miến lươn', 'Phở cuốn',
  'Xôi lạc', 'Bún riêu ốc', 'Cà ri dê', 'Cơm bò xào cần tỏi', 'Cơm sườn Hàn Quốc'
]);

for (const suit of SUITS) {
  DISH_DB[suit].forEach(dish => {
    if (REAL_PHOTO_OVERRIDES[dish.name]) dish.img = REAL_PHOTO_OVERRIDES[dish.name];
    if (UNVERIFIED_PHOTO_DISHES.has(dish.name)) dish.img = null;
  });
}

// Bảng phái sinh — giữ nguyên hình dạng cũ để phần còn lại của app và test dùng lại.
// Mọi thứ index theo cùng một mảng nguồn nên ảnh/vùng miền/ăn kèm không thể lệch nhau.
const DISHES = {};
const PAIRINGS = {};
const REGIONS = {};
const IMAGES = {};
const DISH_META = {}; // name -> { suit, region, price, meals, imageUrl }
// Curated examples of local food, not a shop inventory or statistical ranking.
const CITY_DISHES = {
  hanoi: new Set(['Phở bò', 'Phở gà', 'Bún chả', 'Bún riêu cua', 'Bún đậu mắm tôm', 'Bún thang', 'Bún ốc', 'Bánh cuốn', 'Bánh tôm Hồ Tây', 'Chả cá Lã Vọng', 'Xôi xéo', 'Bánh đa cua', 'Miến lươn', 'Bánh mì thịt']),
  hcm: new Set(['Cơm tấm sườn', 'Bột chiên', 'Hủ tiếu Nam Vang', 'Bánh mì thịt', 'Bánh tráng trộn', 'Phá lấu', 'Ốc các loại', 'Gỏi cuốn', 'Cơm sườn nướng', 'Bánh xèo miền Tây', 'Bún mắm']),
  danang: new Set(['Mì Quảng', 'Bún chả cá', 'Bánh tráng cuốn thịt heo', 'Bún mắm nêm', 'Bánh xèo miền Trung', 'Bánh mì thịt']),
  hoian: new Set(['Cao lầu', 'Cơm gà Hội An', 'Mì Quảng', 'Bún thịt nướng', 'Bánh bao bánh vạc', 'Bánh mì thịt', 'Bánh xèo miền Trung'])
};
const SIDE_DISHES = new Set(['Canh mồng tơi', 'Canh chua cá', 'Rau xào tỏi', 'Đậu hũ sốt cà']);
const DISH_FAMILIES = {
  'Cơm tấm sườn': 'com-suon', 'Cơm sườn nướng': 'com-suon', 'Cơm sườn bì chả': 'com-suon',
  'Nem rán': 'cha-gio', 'Chả giò': 'cha-gio',
  'Cơm cá kho tộ': 'ca-kho-to', 'Cá kho tộ': 'ca-kho-to',
  'Cơm thịt kho trứng': 'thit-kho-trung', 'Thịt kho trứng': 'thit-kho-trung'
};
function dishFamily(name) { return DISH_FAMILIES[name] || name; }

// Hoạ tiết thay ảnh cho món chưa có hình chụp. Sinh sẵn dạng data-URI nên mọi
// nơi đang dùng imageUrl (thẻ bài, lịch sử, băng chuyền, so sánh, thẻ cào, ảnh
// chia sẻ) chạy y hệt như với ảnh thật, không phải rẽ nhánh ở từng chỗ.
// Bộ ký hiệu thay ♠♥♦♣ — mỗi nhóm món một vật quen trên mâm cơm quê.
// Bản cũ để '♣' là cái hộp có gạch chéo và '♠' là hai nét xiên trơ trọi,
// nhìn ra "kiện hàng" chứ không ra "bánh · xôi" hay "nhậu".
const SUIT_GLYPHS = {
  // Bún · Phở · Mì — tô nước có hơi bốc lên, đôi đũa gác ngang miệng tô
  '♥': 'M3 12.5h18a9 9 0 0 1-18 0zM8.5 9c0-1.7 1.6-1.7 1.6-3.4M13.4 9c0-1.7 1.6-1.7 1.6-3.4M14.5 12.5l6.5-4.2',
  // Cơm — chén cơm đầy ngọn
  '♦': 'M4 13.5h16a8 8 0 0 1-16 0zM7.5 13.5a4.5 3.6 0 0 1 9 0',
  // Bánh · Xôi — gói bánh chưng nhìn nghiêng, có nếp gấp lá; tránh hình
  // vuông chia bốn ô vì ở kích thước nhỏ nó bị đọc thành cửa sổ.
  '♣': 'M5 8.5 12 4l7 4.5v9L12 22l-7-4.5zM5 8.5l7 4.5 7-4.5M12 13v9M8.5 6.2l7 4.5',
  // Món mặn · Nhậu — chén rượu có chân
  '♠': 'M6 5.5h12l-1.6 7.4a4.6 4.6 0 0 1-4.4 3.6 4.6 4.6 0 0 1-4.4-3.6zM12 16.5v3M8.5 19.5h7'
};

// Màu viền theo nhóm món, lấy trong bảng màu làng quê. Ký hiệu KHÔNG chép
// lại ở đây mà tra thẳng SUIT_GLYPHS — trước đây là hai bản sao, sửa một bên
// thì bên kia lệch, góc lá bài một kiểu mà thẻ minh hoạ một kiểu khác.
const CATEGORY_ART = {
  '♥': { from: '#d4603f', to: '#8f3221' },  // gạch nung
  '♦': { from: '#e3ad4a', to: '#a8741f' },  // vàng nghệ
  '♣': { from: '#8fa858', to: '#4a5f2a' },  // lá chuối
  '♠': { from: '#a8814f', to: '#5a4029' }   // nâu sồng
};

function categoryGlyph(suit) {
  return SUIT_GLYPHS[suit] || SUIT_GLYPHS['♠'];
}

// Vẽ nền hoạ tiết giống mặt lưng lá bài: nan chéo + vệt sáng giữa + biểu
// tượng nhóm món, để lá không ảnh vẫn ra chất bộ bài chứ không như ảnh lỗi.
function categoryArt(suit) {
  const art = CATEGORY_ART[suit] || CATEGORY_ART['♠'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">`
    + `<defs>`
    + `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`
    + `<stop offset="0" stop-color="${art.from}"/><stop offset="1" stop-color="${art.to}"/></linearGradient>`
    + `<radialGradient id="h" cx="0.5" cy="0.42" r="0.62">`
    + `<stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`
    + `<pattern id="w" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`
    + `<rect width="26" height="26" fill="none"/>`
    + `<path d="M0 0v26" stroke="#fff" stroke-opacity="0.07" stroke-width="9"/></pattern>`
    + `</defs>`
    + `<rect width="512" height="512" fill="url(#g)"/>`
    + `<rect width="512" height="512" fill="url(#w)"/>`
    + `<rect width="512" height="512" fill="url(#h)"/>`
    + `<g transform="translate(140 140) scale(9.33)" fill="none" stroke="#fff" stroke-opacity="0.72"`
    + ` stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${categoryGlyph(suit)}"/></g>`
    + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// Bỏ dấu để dò tên món không phụ thuộc dấu tiếng Việt.
function noAccent(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
}

// Bảng chọn biểu tượng món theo TỪ KHOÁ trong tên — dò theo thứ tự, khớp
// trước thắng. Đặt món ghép/ngoại lai và "bánh …" cụ thể lên trước các từ
// chung (bún/phở/cơm/gà/bò…) để không bị bắt nhầm.
const DISH_EMOJI = [
  ['ca ri', '🍛'], ['pad thai', '🍜'], ['mi y', '🍝'], ['ramen', '🍜'], ['sushi', '🍣'],
  ['dimsum', '🥟'], ['pizza', '🍕'], ['hamburger', '🍔'], ['sandwich', '🥪'], ['kebab', '🥙'],
  ['tokbokki', '🍢'], ['pha lau', '🍢'], ['trung vit', '🥚'],
  ['banh mi', '🥖'], ['banh bao', '🥟'], ['banh cuon', '🍥'], ['banh uot', '🍥'],
  ['banh xeo', '🥞'], ['banh khot', '🥞'], ['banh can', '🥞'], ['banh khoai', '🥞'],
  ['banh beo', '🍥'], ['banh bot loc', '🥟'], ['banh nam', '🍥'], ['banh hoi', '🍜'],
  ['banh giay', '🍡'], ['banh gio', '🍙'], ['banh duc', '🍮'], ['banh cong', '🧆'],
  ['banh chung', '🍙'], ['banh trang', '🫓'], ['banh goi', '🥟'], ['banh tom', '🍤'],
  ['banh flan', '🍮'], ['banh canh', '🍜'], ['banh da', '🍜'], ['banh', '🥮'],
  ['xoi', '🍙'],
  ['pho', '🍜'], ['bun', '🍜'], ['mien', '🍜'], ['hu tieu', '🍜'], ['cao lau', '🍜'],
  ['nui', '🍝'], ['mi ', '🍜'],
  ['lau', '🍲'], ['chao', '🥣'],
  ['goi cuon', '🌯'], ['cha gio', '🥟'], ['nem', '🍢'],
  ['chan ga', '🍗'], ['canh ga', '🍗'], ['ga ', '🍗'], ['ga', '🍗'],
  ['vit', '🦆'], ['de', '🍖'], ['ech', '🐸'], ['bo', '🥩'], ['heo', '🥓'],
  ['suon', '🍖'], ['thit', '🥩'],
  ['ca kho', '🐟'], ['ca chien', '🐟'], ['canh chua', '🍲'], ['ca ', '🐟'],
  ['tom', '🦐'], ['muc', '🦑'], ['oc', '🐌'], ['cua', '🦀'], ['ghe', '🦀'],
  ['hai san', '🦐'], ['so ', '🦪'],
  ['trung vit', '🥚'], ['trung', '🍳'],
  ['dau hu', '🍲'], ['rau', '🥬'], ['nam', '🍄'], ['canh', '🍲'],
  ['bbq', '🍖'], ['nuong', '🍢']
];

function pickDishEmoji(name, suit) {
  const n = noAccent(name);
  for (const [key, emoji] of DISH_EMOJI) {
    if (n.includes(key)) return emoji;
  }
  return { '♥': '🍜', '♦': '🍚', '♣': '🥮', '♠': '🍲' }[suit] || '🍽️';
}

// Thẻ minh hoạ cho món chưa có ảnh chụp: bát đĩa đặt trên mặt bàn gỗ, đúng
// bối cảnh của ảnh chụp thật sau khi grade — trước đây nền là giấy dó sáng
// trắng (độ sáng ~0.80) trong khi ảnh chụp ~0.40, nên trong bộ bài thẻ vẽ
// sáng bừng còn thẻ ảnh tối, nhìn ra hai bộ bài khác nhau.
function dishArt(suit, name) {
  const art = CATEGORY_ART[suit] || CATEGORY_ART['♠'];
  const emoji = pickDishEmoji(name, suit);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">`
    + `<defs>`
    + `<linearGradient id="p" x1="0.1" y1="0" x2="0.9" y2="1">`
    + `<stop offset="0" stop-color="#7a5433"/><stop offset="1" stop-color="#3d2716"/></linearGradient>`
    + `<radialGradient id="pl" cx="0.5" cy="0.42" r="0.58">`
    + `<stop offset="0" stop-color="#fdf6e4"/><stop offset="0.78" stop-color="#f0e3c4"/><stop offset="1" stop-color="#dfcda3"/></radialGradient>`
    + `<radialGradient id="lt" cx="0.5" cy="0.3" r="0.75">`
    + `<stop offset="0" stop-color="#ffdca8" stop-opacity="0.26"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>`
    + `<pattern id="wv" width="34" height="34" patternUnits="userSpaceOnUse">`
    + `<path d="M0 0h34" stroke="#2a1a0c" stroke-opacity="0.30" stroke-width="3"/>`
    + `<path d="M0 17h34" stroke="#f6e7bf" stroke-opacity="0.05" stroke-width="2"/></pattern>`
    + `</defs>`
    // mặt bàn gỗ, vân ngang
    + `<rect width="512" height="512" fill="url(#p)"/>`
    + `<rect width="512" height="512" fill="url(#wv)"/>`
    + `<rect width="512" height="512" fill="url(#lt)"/>`
    // bóng đổ dưới đĩa
    + `<ellipse cx="256" cy="408" rx="168" ry="26" fill="#1a0f06" opacity="0.34"/>`
    // đĩa men trắng ngà
    + `<circle cx="256" cy="250" r="152" fill="url(#pl)"/>`
    + `<circle cx="256" cy="250" r="152" fill="none" stroke="${art.to}" stroke-opacity="0.45" stroke-width="4"/>`
    + `<circle cx="256" cy="250" r="124" fill="none" stroke="${art.from}" stroke-opacity="0.34" stroke-width="2.5"/>`
    + `<text x="256" y="262" font-size="176" text-anchor="middle" dominant-baseline="central">${emoji}</text>`
    // Không đóng dấu ký hiệu ở góc: mặt lá bài cắt ảnh vuông về khung 5:7 nên
    // góc bị xén mất một nửa. Ký hiệu nhóm đã có sẵn trên dải đầu lá bài.
    + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const ART_CACHE = {};

function dishImageUrl(suit, img, name) {
  if (img) return 'images/' + img;
  // Every dish still gets a dish-specific illustrated card when a sourced photo
  // is unavailable; the UI labels it as illustration rather than implying a photo.
  return dishArt(suit, name);
}

for (const suit of SUITS) {
  DISHES[suit] = DISH_DB[suit].map(d => d.name);
  PAIRINGS[suit] = DISH_DB[suit].map(d => d.pair);
  REGIONS[suit] = DISH_DB[suit].map(d => d.region);
  IMAGES[suit] = DISH_DB[suit].map(d => dishImageUrl(suit, d.img, d.name));
  DISH_DB[suit].forEach(d => {
    d.imageUrl = dishImageUrl(suit, d.img, d.name);
    d.hasPhoto = Boolean(d.img);
    DISH_META[d.name] = {
      suit, region: d.region, price: d.price, meals: d.meals,
      imageUrl: d.imageUrl, hasPhoto: d.hasPhoto,
      imageStatus: !d.hasPhoto ? 'illustrated' : d.img.startsWith('photo_') ? 'sourced' : 'source-unknown'
    };
  });
}

const TOTAL_DISHES = SUITS.reduce((n, suit) => n + DISH_DB[suit].length, 0);

const REGION_NAMES = {
  'A': 'Cả nước',
  'B': 'Miền Bắc',
  'T': 'Miền Trung',
  'N': 'Miền Nam'
};


  return {
    SUITS, VALUES, CATEGORY_NAMES, DECK_SIZE, DISH_DB,
    REAL_PHOTO_OVERRIDES, UNVERIFIED_PHOTO_DISHES,
    DISHES, PAIRINGS, REGIONS, IMAGES, DISH_META,
    CITY_DISHES, SIDE_DISHES, DISH_FAMILIES, dishFamily,
    SUIT_GLYPHS, CATEGORY_ART, categoryGlyph, categoryArt,
    noAccent, DISH_EMOJI, pickDishEmoji, dishArt, ART_CACHE, dishImageUrl,
    TOTAL_DISHES, REGION_NAMES
  };
});
