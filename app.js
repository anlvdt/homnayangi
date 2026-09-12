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
    { name: 'Bánh mì que',         region: 'T', img: null,                               pair: 'Pate cay, ruốc, tương ớt',            price: [10, 25],  meals: ['sang', 'chieu'] }
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
    { name: 'Ếch xào lăn',         region: 'N', img: null,                               pair: 'Bánh mì, cơm, đậu phộng, nước cốt dừa', price: [50, 110], meals: ['toi'] }
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
  'Bánh gối': 'photo_banh_goi.webp',
  'Bánh khoái': 'photo_banh_khoai.webp',
  'Bánh mì chảo': 'photo_banh_mi_chao.webp',
  'Bánh mì que': 'photo_banh_mi_que.webp',
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
  'Bún riêu ốc': 'photo_bun_rieu_oc.webp',
  'Bún ốc': 'photo_bun_oc.webp',
  'Cao lầu': 'photo_cao_lau.webp',
  'Cánh gà chiên mắm': 'photo_canh_ga_chien_mam.webp',
  'Chân gà sả tắc': 'photo_chan_ga_sa_tac.webp',
  'Chả cá Lã Vọng': 'photo_cha_ca_la_vong.webp',
  'Cơm âm phủ': 'photo_com_am_phu.webp',
  'Cơm bò Hàn Quốc': 'photo_com_bo_han_quoc.webp',
  'Cơm bò xào cần tỏi': 'photo_com_bo_xao_can_toi.webp',
  'Cơm bò Nhật': 'photo_com_bo_nhat.webp',
  'Cơm cà ri Ấn': 'photo_com_ca_ri_an.webp',
  'Cơm chiên trứng': 'photo_com_chien_trung.webp',
  'Cơm dừa Bến Tre': 'photo_com_dua_ben_tre.webp',
  'Cơm gà Hải Nam': 'photo_com_ga_hai_nam.webp',
  'Cơm gà Tam Kỳ': 'photo_com_ga_tam_ky.webp',
  'Cơm gà nướng': 'photo_com_ga_nuong.webp',
  'Cơm hến': 'photo_com_hen.webp',
  'Cơm heo quay': 'photo_com_heo_quay.webp',
  'Cơm lam': 'photo_com_lam.webp',
  'Cơm rang hải sản': 'photo_com_rang_hai_san.webp',
  'Cơm sườn Hàn Quốc': 'photo_com_suon_han_quoc.webp',
  'Cơm sườn bì chả': 'photo_com_suon_bi_cha.webp',
  'Dimsum': 'photo_dimsum.webp',
  'Gà rán': 'photo_ga_ran.webp',
  'Hamburger': 'photo_hamburger.webp',
  'Hủ tiếu Mỹ Tho': 'photo_hu_tieu_my_tho.webp',
  'Hủ tiếu gõ': 'photo_hu_tieu_go.webp',
  'Kebab Thổ Nhĩ Kỳ': 'photo_kebab_tho_nhi_ky.webp',
  'Lẩu gà lá é': 'photo_lau_ga_la_e.webp',
  'Lẩu mắm': 'photo_lau_mam.webp',
  'Miến lươn': 'photo_mien_luon.webp',
  'Mì cay Hàn Quốc': 'photo_mi_cay_han_quoc.webp',
  'Mì tôm trứng': 'photo_mi_tom_trung.webp',
  'Mì vằn thắn': 'photo_mi_van_than.webp',
  'Mì Ý sốt bò bằm': 'photo_mi_y_sot_bo_bam.webp',
  'Mực nướng sa tế': 'photo_muc_nuong_sa_te.webp',
  'Nem chua rán': 'photo_nem_chua_ran.webp',
  'Pad Thái': 'photo_pad_thai.webp',
  'Phá lấu': 'photo_pha_lau.webp',
  'Phở cuốn': 'photo_pho_cuon.webp',
  'Phở khô Gia Lai': 'photo_pho_kho_gia_lai.webp',
  'Phở xào bò': 'photo_pho_xao_bo.webp',
  'Pizza': 'photo_pizza.webp',
  'Ramen Nhật': 'photo_ramen_nhat.webp',
  'Sandwich': 'photo_sandwich.webp',
  'Sushi': 'photo_sushi.webp',
  'Tokbokki': 'photo_tokbokki.webp',
  'Trứng vịt lộn': 'photo_trung_vit_lon.webp',
  'Xôi gấc': 'photo_xoi_gac.webp',
  'Xôi lạc': 'photo_xoi_lac.webp',
  'Cà ri dê': 'photo_ca_ri_de.webp',
  'Ếch xào lăn': 'photo_ech_xao_lan.webp'
};

for (const suit of SUITS) {
  DISH_DB[suit].forEach(dish => {
    if (REAL_PHOTO_OVERRIDES[dish.name]) dish.img = REAL_PHOTO_OVERRIDES[dish.name];
  });
}

// Bảng phái sinh — giữ nguyên hình dạng cũ để phần còn lại của app và test dùng lại.
// Mọi thứ index theo cùng một mảng nguồn nên ảnh/vùng miền/ăn kèm không thể lệch nhau.
const DISHES = {};
const PAIRINGS = {};
const REGIONS = {};
const IMAGES = {};
const DISH_META = {}; // name -> { suit, region, price, meals, imageUrl }

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
  const key = suit + '|' + (name || '');
  return ART_CACHE[key] || (ART_CACHE[key] = dishArt(suit, name || ''));
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
      imageUrl: d.imageUrl, hasPhoto: d.hasPhoto
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

// ========================================
// FAMILY MEALS — mâm cơm gia đình theo vùng miền
// Traditional Vietnamese meal structure: canh + món mặn + rau + tráng miệng
// ========================================
const FAMILY_MEALS = {
  B: {
    name: 'Miền Bắc',
    soup: ['Canh cua rau đay', 'Canh mướp nhồi thịt', 'Canh bí nấu tôm', 'Canh mọc nấm', 'Canh cải nấu thịt băm', 'Canh bóng thả', 'Canh cá rô đồng', 'Canh riêu cua'],
    main: ['Thịt lợn luộc chấm mắm tôm', 'Thịt kho trứng', 'Gà luộc chấm muối tiêu', 'Cá kho tộ', 'Sườn xào chua ngọt', 'Nem rán', 'Đậu rán sốt cà chua', 'Thịt ba chỉ rang cháy cạnh', 'Cá rán sốt cà', 'Giả cầy'],
    veg: ['Rau muống luộc chấm mắm', 'Rau muống xào tỏi', 'Bông cải xào', 'Đậu que xào tỏi', 'Rau củ luộc kho quẹt', 'Cải thìa xào nấm', 'Su su xào trứng'],
    dessert: ['Trái cây theo mùa', 'Chè đậu xanh', 'Hoa quả dầm', 'Bánh flan', 'Chè khoai dẻo']
  },
  T: {
    name: 'Miền Trung',
    soup: ['Canh chua cá', 'Canh bí đao hầm', 'Canh rau tần ô', 'Canh khổ qua', 'Canh hến nấu chua', 'Canh bắp cải tôm khô'],
    main: ['Cá kho nghệ', 'Thịt heo quay', 'Mực nhồi thịt chiên', 'Tôm rim mặn ngọt', 'Cá nục kho thơm', 'Thịt kho mắm ruốc', 'Gà rang muối', 'Trứng chiên thịt', 'Cá thu chiên nước mắm'],
    veg: ['Rau muống xào tỏi', 'Rau sống chấm mắm nêm', 'Bí xanh xào tỏi', 'Cà tím kho', 'Đậu đũa xào tép', 'Rau lang luộc'],
    dessert: ['Mè xửng Huế', 'Trái cây', 'Bánh đậu xanh', 'Chè bắp']
  },
  N: {
    name: 'Miền Nam',
    soup: ['Canh chua cá lóc', 'Canh khổ qua nhồi thịt', 'Canh bí đỏ hầm', 'Canh rau ngót nấu thịt', 'Canh chua tôm', 'Canh cải bẹ xanh'],
    main: ['Thịt kho tàu', 'Cá lóc kho tộ', 'Sườn ram mặn', 'Cá điêu hồng chiên xù', 'Gà kho sả ớt', 'Bò lúc lắc', 'Tép kho tộ', 'Thịt ba chỉ kho nước dừa', 'Cá basa kho sả'],
    veg: ['Rau muống xào tỏi', 'Rau củ luộc kho quẹt', 'Đậu đũa xào', 'Cải xanh xào nấm', 'Bầu xào tôm', 'Rau muống luộc chấm mắm kho'],
    dessert: ['Chè thái', 'Trái cây nhiệt đới', 'Sương sáo', 'Chè ba màu', 'Bánh flan']
  }
};

// ========================================
// STATE
// ========================================
let deck = [];
let flippedCards = [];
let isMultiPlayer = false;
let currentPlayer = 1;
let totalPlayers = 2;
let playerNames = ['Người chơi 1', 'Người chơi 2'];
let isAnimating = false;
let audioContext = null;
let gameResults = []; // Track {player, dish, imageUrl} for multiplayer

// Favorites and Excludes
let favorites = []; // Array of dish names
let excludes = []; // Array of dish names

// Settings with localStorage persistence
let settings = {
  darkMode: false,
  soundEnabled: true,
  animSpeed: 'normal', // slow, normal, fast
  timeFilterEnabled: false,
  cardStyle: 'folk' // folk (dân gian), classic (bài tây)
};

// Buổi trong ngày — khớp nhịp ăn của người Việt:
// sáng (5–10h), trưa (10–14h), xế chiều (14–17h), tối (17–22h), khuya (22–5h)
const MEAL_LABELS = { sang: 'Bữa sáng', trua: 'Bữa trưa', chieu: 'Xế chiều', toi: 'Bữa tối', khuya: 'Ăn khuya' };
const MEAL_GREETINGS = {
  sang: 'Chào buổi sáng — sáng nay ăn gì?',
  trua: 'Trưa rồi — trưa nay ăn gì?',
  chieu: 'Xế chiều — làm gì lót dạ?',
  toi: 'Chiều tối rồi — tối nay ăn gì?',
  khuya: 'Khuya rồi — đói bụng hả?'
};

function getTimePeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return 'sang';
  if (hour >= 10 && hour < 14) return 'trua';
  if (hour >= 14 && hour < 17) return 'chieu';
  if (hour >= 17 && hour < 22) return 'toi';
  return 'khuya';
}

function getTimeLabel(period) {
  return MEAL_LABELS[period] || '';
}

// Món có hợp buổi này không — tra theo nhãn từng món, không còn đoán theo nhóm
function fitsMeal(dishName, period) {
  const meta = DISH_META[dishName];
  if (!meta) return true; // món tự thêm: luôn hợp
  return meta.meals.includes(period);
}

// Escape user-controlled strings before injecting into innerHTML
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

// Read persisted JSON safely — corrupted values fall back to null
// instead of throwing during init.
function loadStored(key, validate) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    return validate && !validate(value) ? null : value;
  } catch {
    return null;
  }
}

function loadSettings() {
  const saved = loadStored('homnayangi_settings', v => v && typeof v === 'object' && !Array.isArray(v));
  if (saved) {
    settings = {
      darkMode: saved.darkMode === true,
      soundEnabled: saved.soundEnabled !== false,
      animSpeed: ['slow', 'normal', 'fast'].includes(saved.animSpeed) ? saved.animSpeed : 'normal',
      timeFilterEnabled: saved.timeFilterEnabled === true,
      cardStyle: ['folk', 'classic'].includes(saved.cardStyle) ? saved.cardStyle : 'folk'
    };
  }
  applySettings();
}

// Persist safely — storage can be full or blocked; surface it instead of crashing
let storageWarned = false;

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    if (!storageWarned) {
      storageWarned = true;
      showToast('Không thể lưu dữ liệu. Lựa chọn chỉ giữ trong phiên này.');
    }
  }
}

// Vùng thông báo cho trình đọc màn hình — kết quả bốc bài trước đây
// chỉ hiện bằng hình ảnh, người dùng screen reader không biết đã ra món gì.
function announce(message) {
  let live = document.getElementById('srLive');
  if (!live) {
    live = document.createElement('div');
    live.id = 'srLive';
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);
  }
  live.textContent = '';
  setTimeout(() => { live.textContent = message; }, 60);
}

// Mục Quyền riêng tư nói dữ liệu nằm trên máy người dùng — nên phải cho họ
// cách xoá. Chỉ đụng tới khoá của app, không đập cả localStorage vì tên miền
// có thể còn đang chứa dữ liệu của trang khác.
const STORAGE_KEYS = [
  'homnayangi_settings', 'homnayangi_favorites', 'homnayangi_history',
  'homnayangi_excludes', 'homnayangi_custom_dishes', 'homnayangi_week_plan',
  'homnayangi_spins', 'homnayangi_visits', 'homnayangi_onboarded'
];

function clearAllLocalData() {
  const ok = window.confirm(
    'Xoá toàn bộ dữ liệu của ứng dụng trên trình duyệt này?\n\n' +
    'Gồm: món yêu thích, món loại trừ, món bạn tự thêm, lịch ăn tuần, ' +
    'lịch sử bốc bài và mọi tuỳ chọn.\n\nKhông thể hoàn tác.'
  );
  if (!ok) return;
  try {
    STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    showToast('Trình duyệt không cho xoá dữ liệu lưu trữ.');
    return;
  }
  showToast('Đã xoá. Đang tải lại ứng dụng…');
  setTimeout(() => location.reload(), 900);
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function saveSettings() {
  persist('homnayangi_settings', settings);
}

// Thanh chrome của trình duyệt/PWA ăn theo nền sân quê. Đọc thẳng biến CSS
// để không phải chép tay mã màu ở hai nơi — bản cũ vẫn ghim màu mặt nỉ xanh
// kể cả sau khi nền đã đổi.
function updateThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const ground = getComputedStyle(document.body).getPropertyValue('--ground-1').trim();
  meta.setAttribute('content', ground || '#4a2e19');
}

function applySettings() {
  // Dark mode
  document.body.classList.toggle('dark-mode', settings.darkMode);
  document.getElementById('darkModeToggle').checked = settings.darkMode;
  updateThemeColor();

  // Sound
  document.getElementById('soundToggle').checked = settings.soundEnabled;

  // Time filter
  const timeFilterToggle = document.getElementById('timeFilterToggle');
  if (timeFilterToggle) {
    timeFilterToggle.checked = settings.timeFilterEnabled;
  }

  // Animation speed
  document.getElementById('animSpeedSelect').value = settings.animSpeed;
  document.documentElement.style.setProperty('--anim-speed',
    settings.animSpeed === 'slow' ? '1.5' : settings.animSpeed === 'fast' ? '0.6' : '1'
  );

  // Card skin
  document.body.classList.toggle('folk-deck', settings.cardStyle === 'folk');
  const cardStyleSelect = document.getElementById('cardStyleSelect');
  if (cardStyleSelect) cardStyleSelect.value = settings.cardStyle;
}

// ========================================
// CUSTOM DISHES - User-defined dishes
// ========================================
let customDishes = [];

const MAX_CUSTOM_DISHES = 50;
const MAX_DISH_NAME = 60;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\x00-\x1f\x7f]/g;

function sanitizeDishName(name) {
  return String(name || '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .normalize('NFC')
    .slice(0, MAX_DISH_NAME);
}

function loadCustomDishes() {
  const saved = loadStored('homnayangi_custom_dishes', Array.isArray);
  if (saved) {
    const seen = new Set(getBuiltInDishNames().map(dishKey));
    customDishes = saved
      .filter(d => d && typeof d === 'object' && SUITS.includes(d.category))
      .map(d => ({ ...d, name: sanitizeDishName(d.name) }))
      .filter(d => {
        const key = dishKey(d.name);
        if (!d.name || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_CUSTOM_DISHES);
  }
}

function saveCustomDishes() {
  persist('homnayangi_custom_dishes', customDishes);
}

// ========================================
// FAVORITES & EXCLUDES
// ========================================
function loadFavorites() {
  const saved = loadStored('homnayangi_favorites', Array.isArray);
  if (saved) favorites = saved.filter(d => typeof d === 'string');
}

function saveFavorites() {
  persist('homnayangi_favorites', favorites);
}

function toggleFavorite(dishName) {
  if (favorites.includes(dishName)) {
    favorites = favorites.filter(d => d !== dishName);
  } else {
    favorites.push(dishName);
  }
  saveFavorites();
}

function isFavorite(dishName) {
  return favorites.includes(dishName);
}

function loadExcludes() {
  const saved = loadStored('homnayangi_excludes', Array.isArray);
  if (saved) excludes = saved.filter(d => typeof d === 'string');
}

function saveExcludes() {
  persist('homnayangi_excludes', excludes);
}

function toggleExclude(dishName) {
  if (excludes.includes(dishName)) {
    excludes = excludes.filter(d => d !== dishName);
  } else {
    excludes.push(dishName);
    // Remove from favorites if excluded
    if (favorites.includes(dishName)) {
      favorites = favorites.filter(d => d !== dishName);
      saveFavorites();
    }
  }
  saveExcludes();
}

function isExcluded(dishName) {
  return excludes.includes(dishName);
}

function openExcludesModal() {
  const search = document.getElementById('excludesSearch');
  if (search) search.value = '';
  renderExcludesList();
  document.getElementById('excludesModal').classList.add('show');
}

function closeExcludesModal() {
  document.getElementById('excludesModal').classList.remove('show');
  // Refresh deck after changes
  createDeck();
  renderDeck(true);
  renderDishOfDay();
}

// Bỏ dấu tiếng Việt để gõ "bun bo" vẫn ra "Bún bò Huế"
function normalizeVi(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function dishKey(name) {
  return normalizeVi(sanitizeDishName(name)).replace(/\s+/g, ' ').trim();
}

function getBuiltInDishNames() {
  return SUITS.flatMap(suit => DISH_DB[suit].map(d => d.name));
}

function renderExcludesList(query = '') {
  const container = document.getElementById('excludesList');
  if (!container) return;

  // Gồm cả món tự thêm — trước đây chỉ liệt kê 52 món dựng sẵn nên
  // món do người dùng tạo không có cách nào loại trừ từ giao diện.
  const allDishes = getAllDishes();
  const q = normalizeVi(query.trim());
  const shown = q ? allDishes.filter(d => normalizeVi(d).includes(q)) : allDishes;

  if (!shown.length) {
    container.innerHTML = '<p class="no-results">Không tìm thấy món nào.</p>';
    return;
  }

  container.innerHTML = shown.map(dish => `
    <button type="button" class="exclude-item ${isExcluded(dish) ? 'excluded' : ''}"
            data-dish="${escapeHtml(dish)}" aria-pressed="${isExcluded(dish)}">
      <span class="exclude-checkbox" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="exclude-name">${escapeHtml(dish)}</span>
    </button>
  `).join('');

  container.querySelectorAll('.exclude-item').forEach(item => {
    item.addEventListener('click', () => {
      const dish = item.dataset.dish;
      toggleExclude(dish);
      const off = isExcluded(dish);
      item.classList.toggle('excluded', off);
      item.setAttribute('aria-pressed', String(off));
    });
  });
}

function addCustomDish(dish) {
  if (customDishes.length >= MAX_CUSTOM_DISHES) {
    showToast(`Tối đa ${MAX_CUSTOM_DISHES} món tự thêm. Hãy xóa bớt món cũ.`);
    return false;
  }
  const name = sanitizeDishName(dish.name);
  if (!name) {
    showToast('Tên món không hợp lệ.');
    return false;
  }
  if (getAllDishes().some(existing => dishKey(existing) === dishKey(name))) {
    showToast(`Món “${name}” đã có trong danh sách.`);
    return false;
  }
  customDishes.push({
    id: Date.now(),
    name,
    pairing: dish.pairing,
    category: dish.category,
    imageUrl: dish.imageUrl || 'icons/icon-192.png'
  });
  saveCustomDishes();
  renderCustomDishesList();
  updateChallengeBadge();
  return true;
}

function deleteCustomDish(id) {
  const dish = customDishes.find(d => d.id === id);
  if (!dish || !window.confirm(`Xóa món “${dish.name}”?`)) return;
  customDishes = customDishes.filter(d => d.id !== id);
  saveCustomDishes();
  renderCustomDishesList();
  // Refresh deck to remove deleted dish
  createDeck();
  renderDeck(true);
  updateChallengeBadge();
}

function renderCustomDishesList() {
  const container = document.getElementById('customDishesContent');
  if (!container) return;

  if (customDishes.length === 0) {
    container.innerHTML = '<p class="no-results">Chưa có món tùy chỉnh</p>';
    return;
  }

  container.innerHTML = customDishes.map(d => `
    <div class="custom-dish-item">
      <span class="dish-name">${escapeHtml(d.name)}</span>
      <button type="button" class="delete-btn" data-delete-dish="${d.id}" aria-label="Xóa món ${escapeHtml(d.name)}">Xóa</button>
    </div>
  `).join('');

  container.querySelectorAll('[data-delete-dish]').forEach(button => {
    button.addEventListener('click', () => deleteCustomDish(Number(button.dataset.deleteDish)));
  });
}

// Food Challenge - Track unique dishes tried
function getUniqueDishCount() {
  const currentDishes = new Set(getAllDishes().map(dishKey));
  const uniqueDishes = new Set(history.map(h => dishKey(h.dish)).filter(key => currentDishes.has(key)));
  return uniqueDishes.size;
}

// Mốc huy hiệu tính theo tỉ lệ của cả kho món, không còn cứng ở 52
function getChallengeLevel(count, total = TOTAL_DISHES) {
  const ratio = total ? count / total : 0;
  if (ratio >= 1) return 'platinum';
  if (ratio >= 0.75) return 'gold';
  if (ratio >= 0.45) return 'silver';
  if (ratio >= 0.15) return 'bronze';
  return '';
}

function updateChallengeBadge() {
  const count = getUniqueDishCount();
  const total = TOTAL_DISHES + customDishes.length;
  const badge = document.getElementById('challengeBadge');
  const countEl = document.getElementById('triedCount');
  const totalEl = document.getElementById('totalDishes');

  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = total;
  const aboutTotal = document.getElementById('aboutTotalDishes');
  if (aboutTotal) aboutTotal.textContent = total;

  if (badge) {
    badge.setAttribute('aria-label', `Đã thử ${count} trong ${total} món`);
    // Remove old level classes
    badge.classList.remove('level-bronze', 'level-silver', 'level-gold', 'level-platinum');

    const level = getChallengeLevel(count, total);
    if (level) {
      badge.classList.add('level-' + level);
    }
  }
}

function openCustomDishModal() {
  document.getElementById('customDishModal').classList.add('show');
  renderCustomDishesList();
}

function closeCustomDishModal() {
  document.getElementById('customDishModal').classList.remove('show');
  // Clear form
  document.getElementById('customDishName').value = '';
  document.getElementById('customDishPairing').value = '';
  document.getElementById('customDishImage').value = '';
}

function saveCustomDishFromForm() {
  const name = document.getElementById('customDishName').value.trim();
  const pairing = document.getElementById('customDishPairing').value.trim();
  const category = document.getElementById('customDishCategory').value;
  const imageUrl = document.getElementById('customDishImage').value.trim();

  if (!name) {
    showToast('Bạn chưa nhập tên món.');
    document.getElementById('customDishName').focus();
    return;
  }

  if (imageUrl && !/^https:\/\//i.test(imageUrl)) {
    showToast('Link ảnh phải bắt đầu bằng https://');
    document.getElementById('customDishImage').focus();
    return;
  }

  if (!addCustomDish({ name, pairing: pairing || 'Tùy thích', category, imageUrl })) return;

  // Refresh deck to include new dish
  createDeck();
  renderDeck(true);

  closeCustomDishModal();
}

// ========================================
// WEEKLY PLANNER
// ========================================
const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
let weekPlan = ['', '', '', '', '', '', ''];

function loadWeekPlan() {
  const saved = loadStored('homnayangi_week_plan', v => Array.isArray(v) && v.length === 7);
  if (saved) {
    weekPlan = saved.map(d => typeof d === 'string' ? d : '');
  }
}

function saveWeekPlan() {
  persist('homnayangi_week_plan', weekPlan);
}

// Toàn bộ kho món (không chỉ 52 lá đang chia) — dùng cho lịch ăn tuần,
// danh sách loại trừ và thống kê.
function getAllDishes() {
  const allDishes = [];
  for (const suit of SUITS) {
    DISH_DB[suit].forEach(d => allDishes.push(d.name));
  }
  customDishes.forEach(d => allDishes.push(d.name));
  return allDishes;
}

function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  if (!grid) return;

  grid.innerHTML = DAY_NAMES.map((day, i) => `
    <div class="day-card">
      <span class="day-name">${day}</span>
      <span class="day-dish ${weekPlan[i] ? '' : 'empty'}">${escapeHtml(weekPlan[i]) || 'Chưa chọn'}</span>
      <div class="day-actions">
        <button type="button" class="day-btn random-btn" data-random-day="${i}" aria-label="Chọn ngẫu nhiên món cho ${day}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="8" cy="8" r="1.5"/>
            <circle cx="16" cy="8" r="1.5"/>
            <circle cx="16" cy="16" r="1.5"/>
            <circle cx="8" cy="16" r="1.5"/>
          </svg>
        </button>
        <button type="button" class="day-btn clear-btn" data-clear-day="${i}" aria-label="Xóa món của ${day}">✕</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-random-day]').forEach(button => {
    button.addEventListener('click', () => randomDayDish(Number(button.dataset.randomDay)));
  });
  grid.querySelectorAll('[data-clear-day]').forEach(button => {
    button.addEventListener('click', () => clearDayDish(Number(button.dataset.clearDay)));
  });
}

function randomDayDish(dayIndex) {
  const allDishes = getAllDishes().filter(dish => !isExcluded(dish));
  if (!allDishes.length) {
    showToast('Không còn món nào sau khi áp danh sách loại trừ.');
    return;
  }
  // Avoid dishes already in plan
  const usedDishes = weekPlan.filter(d => d);
  const available = allDishes.filter(d => !usedDishes.includes(d));

  if (available.length > 0) {
    weekPlan[dayIndex] = available[Math.floor(Math.random() * available.length)];
  } else {
    weekPlan[dayIndex] = allDishes[Math.floor(Math.random() * allDishes.length)];
  }

  saveWeekPlan();
  renderWeekGrid();
}

function clearDayDish(dayIndex) {
  weekPlan[dayIndex] = '';
  saveWeekPlan();
  renderWeekGrid();
}

function autoFillWeek() {
  const allDishes = getAllDishes().filter(dish => !isExcluded(dish));
  if (!allDishes.length) {
    showToast('Không còn món nào sau khi áp danh sách loại trừ.');
    return;
  }
  weekPlan = fillWeekPlan(weekPlan, allDishes);

  saveWeekPlan();
  renderWeekGrid();
}

function fillWeekPlan(plan, dishes, random = Math.random) {
  const used = new Set(plan.filter(Boolean));
  const available = dishes.filter(dish => !used.has(dish));
  shuffleArray(available, random);
  let cursor = 0;
  return plan.map(current => current || available[cursor++] || '');
}

function clearWeekPlan() {
  if (!weekPlan.some(Boolean)) return;
  if (!window.confirm('Xóa toàn bộ lịch ăn tuần?')) return;
  weekPlan = ['', '', '', '', '', '', ''];
  saveWeekPlan();
  renderWeekGrid();
}

function openPlanner() {
  loadWeekPlan();
  renderWeekGrid();
  document.getElementById('plannerModal').classList.add('show');
}

function closePlanner() {
  document.getElementById('plannerModal').classList.remove('show');
}

// ========================================
// HISTORY - Track dish selections
// ========================================
let history = [];

// Local counters — cumulative, never truncated like the 100-item history.
// Honest labeling like truanayangi: "on this browser", not a global total.
let totalSpins = 0;
let visitCount = 0;

function loadCounters() {
  const spins = loadStored('homnayangi_spins', v => Number.isSafeInteger(v) && v >= 0);
  const visits = loadStored('homnayangi_visits', v => Number.isSafeInteger(v) && v >= 0);
  totalSpins = spins || 0;
  visitCount = visits || 0;
}

function recordSpin() {
  totalSpins = Math.min(Number.MAX_SAFE_INTEGER, totalSpins + 1);
  persist('homnayangi_spins', totalSpins);
  updateSessionInfo();
}

function recordVisit() {
  visitCount = Math.min(Number.MAX_SAFE_INTEGER, visitCount + 1);
  persist('homnayangi_visits', visitCount);
}

function loadHistory() {
  const saved = loadStored('homnayangi_history', Array.isArray);
  if (saved) {
    history = saved.filter(h => h && typeof h.dish === 'string');
  }
}

function saveHistory() {
  // Keep only last 100 items
  if (history.length > 100) {
    history = history.slice(-100);
  }
  persist('homnayangi_history', history);
}

function addToHistory(card) {
  history.push({
    dish: card.dish,
    pairing: card.pairing,
    imageUrl: card.imageUrl,
    date: new Date().toISOString()
  });
  saveHistory();
  recordSpin();
  updateHistoryPanel();
  updateChallengeBadge();
  updateSessionInfo();
}

function getStats() {
  const dishCount = {};
  history.forEach(h => {
    dishCount[h.dish] = (dishCount[h.dish] || 0) + 1;
  });

  return Object.entries(dishCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([dish, count]) => ({ dish, count }));
}

function updateHistoryPanel() {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (history.length === 0) {
    list.innerHTML = '<p class="no-results">Chưa có lịch sử</p>';
    return;
  }

  // Show last 10 items, newest first
  const recent = [...history].reverse().slice(0, 10);
  list.innerHTML = recent.map(h => {
    const date = new Date(h.date);
    const timeStr = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
    return `
      <div class="history-item">
        <img src="${escapeHtml(h.imageUrl)}" alt="${escapeHtml(h.dish)}" class="history-thumb" loading="lazy" decoding="async" onerror="this.style.display='none'">
        <div class="history-info">
          <span class="history-dish">${escapeHtml(h.dish)}</span>
          <span class="history-date">${timeStr}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateStatsPanel() {
  const statsEl = document.getElementById('statsContent');
  if (!statsEl) return;

  const stats = getStats();
  if (stats.length === 0) {
    statsEl.innerHTML = '<p class="no-results">Chưa có thống kê</p>';
    return;
  }

  statsEl.innerHTML = stats.map((s, i) => `
    <div class="stat-item">
      <span class="stat-rank">#${i + 1}</span>
      <span class="stat-dish">${escapeHtml(s.dish)}</span>
      <span class="stat-count">${s.count} lần</span>
    </div>
  `).join('');
}

// ========================================
// AUDIO - Web Audio API for suspense sounds
// ========================================
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Short synthesized tick — played when a reel tile crosses the pointer
function playTick() {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();
  if (audioContext.state !== 'running') return;

  const t = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(2200, t);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(t);
  osc.stop(t + 0.03);
}

function playDrumroll(duration = 1500) {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  const startTime = audioContext.currentTime;
  const endTime = startTime + duration / 1000;

  // Create noise for drumroll texture
  const bufferSize = audioContext.sampleRate * (duration / 1000);
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate rhythmic drumroll pattern
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioContext.sampleRate;
    const frequency = 8 + (t / (duration / 1000)) * 20; // Increasing tempo
    const amplitude = 0.3 + (t / (duration / 1000)) * 0.4; // Increasing volume
    data[i] = Math.sin(t * frequency * Math.PI * 2) * (Math.random() * 0.5 + 0.5) * amplitude;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  // Low-pass filter for warmer sound
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  // Gain for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.4, startTime);
  gainNode.gain.linearRampToValueAtTime(0.8, endTime - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, endTime);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start(startTime);
  source.stop(endTime);
}

function playRevealSound() {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  const startTime = audioContext.currentTime;

  // Cymbal crash / shimmer
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(220, startTime + 0.3);

  // Second harmonic
  const oscillator2 = audioContext.createOscillator();
  oscillator2.type = 'triangle';
  oscillator2.frequency.setValueAtTime(1320, startTime);
  oscillator2.frequency.exponentialRampToValueAtTime(440, startTime + 0.2);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.5, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

  oscillator.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator2.start(startTime);
  oscillator.stop(startTime + 0.4);
  oscillator2.stop(startTime + 0.4);
}

function playHeartbeat(count = 3) {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  for (let i = 0; i < count; i++) {
    const delay = i * 600; // 600ms between beats - slower, more suspenseful
    setTimeout(() => {
      const startTime = audioContext.currentTime;

      // Low thump
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, startTime + 0.15);

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.6, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    }, delay);
  }
}

// ========================================
// INIT
// ========================================
function init() {
  loadSettings();
  loadHistory();
  loadCounters();
  recordVisit();
  loadCustomDishes();
  loadFavorites();
  loadExcludes();
  createDeck();
  renderDeck(true);
  setupEvents();
  observeDeckSize();
  updateHistoryPanel();
  updateChallengeBadge();
  renderDishOfDay();
  updateSessionInfo();
  renderGreeting();

  // Handle PWA shortcuts
  handleUrlParams();

  // Show onboarding for first-time users
  if (!localStorage.getItem('homnayangi_onboarded')) {
    showOnboarding();
  }
}

function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  let handled = false;

  // Random card action
  if (params.get('action') === 'random') {
    setTimeout(quickPick, 500);
    params.delete('action');
    handled = true;
  }

  // Multiplayer mode
  if (params.get('mode') === 'multi') {
    setTimeout(() => setMode(true), 300);
    params.delete('mode');
    handled = true;
  }

  // Clear params after handling
  if (handled) {
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }
}

// ========================================
// ONBOARDING
// ========================================
let currentSlide = 1;
const totalSlides = 5;

function showOnboarding() {
  document.getElementById('onboardingModal').classList.add('show');
}

function hideOnboarding() {
  document.getElementById('onboardingModal').classList.remove('show');
  localStorage.setItem('homnayangi_onboarded', 'true');
}

function goToSlide(slideNum) {
  currentSlide = slideNum;

  // Update slides
  document.querySelectorAll('.onboarding-slide').forEach(slide => {
    slide.classList.toggle('active', parseInt(slide.dataset.slide) === slideNum);
  });

  // Update dots
  document.querySelectorAll('.onboarding-dots .dot').forEach(dot => {
    const active = parseInt(dot.dataset.dot) === slideNum;
    dot.classList.toggle('active', active);
    if (active) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });

  // Update button text
  const nextBtn = document.getElementById('nextOnboarding');
  nextBtn.textContent = slideNum === totalSlides ? 'Bắt đầu' : 'Tiếp theo';
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    goToSlide(currentSlide + 1);
  } else {
    hideOnboarding();
  }
}

// Rút đều từ nhiều kho — lấy lần lượt mỗi kho một món cho tới khi đủ số lá,
// nên bộ bài luôn cân giữa các nhóm dù kho món của từng nhóm to nhỏ khác nhau.
function drawBalanced(pools, limit) {
  const picked = [];
  for (let round = 0; picked.length < limit; round++) {
    let progressed = false;
    for (const pool of pools) {
      if (round >= pool.length) continue;
      picked.push(pool[round]);
      progressed = true;
      if (picked.length >= limit) break;
    }
    if (!progressed) break;
  }
  return picked;
}

// Kho món của một nhóm sau khi áp bộ lọc, gồm cả món người dùng tự thêm
function candidatesFor(suit, regionFilter, favFilter, mealFilter = 'all') {
  const keep = (name, region) => {
    if (isExcluded(name)) return false;
    if (favFilter === 'fav' && !isFavorite(name)) return false;
    if (mealFilter !== 'all' && !fitsMeal(name, mealFilter)) return false;
    return regionFilter === 'all' || region === 'A' || region === regionFilter;
  };

  const list = DISH_DB[suit]
    .filter(d => keep(d.name, d.region))
    .map(d => ({ suit, name: d.name, pairing: d.pair, region: d.region, imageUrl: d.imageUrl }));

  customDishes
    .filter(d => d.category === suit && keep(d.name, 'A'))
    .forEach(d => list.push({
      suit,
      name: d.name,
      pairing: d.pairing || 'Tùy thích',
      region: 'A',
      imageUrl: d.imageUrl || dishImageUrl(suit, null, d.name),
      isCustom: true
    }));

  return list;
}

function createDeck() {
  deck = [];
  flippedCards = [];

  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const regionFilter = document.getElementById('regionFilter')?.value || 'all';
  const favFilter = document.getElementById('favFilter')?.value || 'all';
  const mealFilter = document.getElementById('mealFilter')?.value || 'all';
  const suitsToUse = categoryFilter === 'all' ? SUITS : [categoryFilter];

  const pools = suitsToUse.map(suit => {
    const list = candidatesFor(suit, regionFilter, favFilter, mealFilter);
    shuffleArray(list);
    return list;
  });

  let chosen = drawBalanced(pools, DECK_SIZE);

  // Gợi ý theo giờ: món hợp buổi này xếp lên đầu (ưu tiên, không loại bỏ),
  // hai nhóm đều được xáo riêng nên vẫn ngẫu nhiên trong từng nhóm.
  if (settings.timeFilterEnabled && mealFilter === 'all') {
    const period = getTimePeriod();
    const fit = chosen.filter(c => fitsMeal(c.name, period));
    const rest = chosen.filter(c => !fitsMeal(c.name, period));
    shuffleArray(fit);
    shuffleArray(rest);
    chosen = [...fit, ...rest];
  } else {
    shuffleArray(chosen);
  }

  // Đánh số lá bài (A → K) riêng trong từng nhóm để mặt bài vẫn ra chất cỗ bài
  const seen = {};
  deck = chosen.map((d, i) => {
    const n = seen[d.suit] || 0;
    seen[d.suit] = n + 1;
    return {
      id: i,
      value: VALUES[n % VALUES.length],
      suit: d.suit,
      dish: d.name,
      pairing: d.pairing,
      imageUrl: d.imageUrl,
      isRed: d.suit === '♥' || d.suit === '♦',
      isCustom: Boolean(d.isCustom),
      region: d.region
    };
  });
}

function shuffleArray(arr, random = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Chọn ngẫu nhiên có trọng số: khi cả món hợp giờ và món khác đều tồn tại,
// ưu tiên nhóm hợp giờ nhưng vẫn giữ độ bất ngờ. Hàm thuần để kiểm thử được.
function chooseSuggestedCard(cards, predicate, random = Math.random, preferredChance = 0.75) {
  if (!Array.isArray(cards) || cards.length === 0) return null;
  const preferred = cards.filter(predicate);
  const others = cards.filter(card => !predicate(card));
  let pool = cards;
  if (preferred.length && others.length) {
    pool = random() < preferredChance ? preferred : others;
  }
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
}

function suggestedRandomCard(cards, random = Math.random) {
  const mealFilter = typeof document === 'undefined'
    ? 'all'
    : (document.getElementById('mealFilter')?.value || 'all');
  if (!settings.timeFilterEnabled || mealFilter !== 'all') {
    return cards[Math.min(cards.length - 1, Math.floor(random() * cards.length))] || null;
  }
  const period = getTimePeriod();
  return chooseSuggestedCard(cards, card => fitsMeal(card.dish || card.name, period), random);
}

// ========================================
// RENDER
// ========================================
function renderDeck(withAnimation = false) {
  const container = document.getElementById('deck');
  container.innerHTML = '';

  // Empty pool — tell the user to relax filters instead of a blank board
  if (deck.length === 0) {
    container.style.removeProperty('--deck-w');
    container.innerHTML = '<p class="empty-deck" role="status">Không còn món nào khớp bộ lọc. Bạn thử nới bộ lọc hoặc thêm món mới nhé.</p>';
    updateRemaining();
    return;
  }

  let rovingTabAssigned = false;
  deck.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = index;

    if (withAnimation) {
      el.classList.add('dealing');
      el.style.setProperty('--deal-delay', `${index * 15}ms`);
    }

    if (flippedCards.includes(index)) {
      el.classList.add('flipped');
      el.innerHTML = createCardFront(card);
      el.setAttribute('aria-label', card.dish + ' (đã bốc)');
    } else {
      el.innerHTML = `<div class="back"></div>`;
      el.tabIndex = rovingTabAssigned ? -1 : 0;
      rovingTabAssigned = true;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'Lá bài úp số ' + (index + 1) + ' — nhấn Enter để bốc');
      el.addEventListener('click', () => pickCard(index));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pickCard(index);
        } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          moveDeckFocus(el, e.key);
        }
      });
    }

    container.appendChild(el);
  });

  container.setAttribute('aria-label', `Bộ bài ${deck.length} món`);
  fitDeck();
  updateRemaining();
}

function moveDeckFocus(current, key) {
  const cards = [...document.querySelectorAll('#deck .card[role="button"]')];
  if (!cards.length) return;
  const currentIndex = Math.max(0, cards.indexOf(current));
  let nextIndex;
  if (key === 'Home') nextIndex = 0;
  else if (key === 'End') nextIndex = cards.length - 1;
  else {
    const delta = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
    nextIndex = (currentIndex + delta + cards.length) % cards.length;
  }
  cards.forEach((card, index) => { card.tabIndex = index === nextIndex ? 0 : -1; });
  cards[nextIndex].focus();
}

// ========================================
// FIT DECK — chọn số lá mỗi hàng sao cho cả bộ bài lấp vừa khít khung
//
// Bài toán: xếp N hình chữ nhật tỉ lệ 5:7 vào một ô rộng W cao H sao cho
// từng lá to nhất có thể. Với mỗi số cột khả dĩ, bề rộng lá bài bị chặn bởi
// cả chiều ngang lẫn chiều dọc; lấy min của hai chặn rồi chọn cột cho giá
// trị lớn nhất. Nhờ vậy app vừa khít ở mọi cỡ cửa sổ mà không cần
// breakpoint thủ công.
// ========================================
const CARD_ASPECT = 5 / 7; // rộng / cao

function bestDeckFit(count, boxW, boxH, gap, minW, maxW) {
  let best = { cols: 1, cardW: 0 };

  let bestScore = 0;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const byWidth = (boxW - (cols - 1) * gap) / cols;
    const byHeight = ((boxH - (rows - 1) * gap) / rows) * CARD_ASPECT;
    const cardW = Math.min(byWidth, byHeight);

    // Phạt nhẹ lưới có hàng cuối thiếu lá, để khi hai phương án xấp xỉ nhau
    // thì chọn lưới chữ nhật đầy đủ cho gọn mắt.
    const score = cardW * (1 - 0.5 * (cols * rows - count) / count);
    if (score > bestScore) {
      bestScore = score;
      best = { cols, cardW };
    }
  }

  // Bộ bài lớn hơn khung: bỏ ràng buộc chiều cao, xếp kín bề ngang ở cỡ
  // tối thiểu rồi cho khu vực bài cuộn dọc.
  if (best.cardW < minW) {
    const cols = Math.max(1, Math.floor((boxW + gap) / (minW + gap)));
    return { cols, cardW: Math.max(minW, Math.min(maxW, (boxW - (cols - 1) * gap) / cols)) };
  }

  return { cols: best.cols, cardW: Math.min(maxW, best.cardW) };
}

function fitDeck() {
  const area = document.getElementById('deckArea');
  const deckEl = document.getElementById('deck');
  if (!area || !deckEl) return;

  const count = deck.length;
  if (!count) return;

  const cs = getComputedStyle(deckEl);
  // Đọc rowGap (giá trị đã tính ra px) chứ không đọc biến --deck-gap:
  // custom property trả về nguyên văn "clamp(4px, 0.7vmin, 12px)", parseFloat
  // ra NaN nên trước đó JS tính bằng khoảng cách mặc định, lệch với thực tế.
  const gap = parseFloat(cs.rowGap) || 8;
  const minW = parseFloat(cs.getPropertyValue('--card-min')) || 44;
  const maxW = parseFloat(cs.getPropertyValue('--card-max')) || 150;

  // Chừa 2px hụt: nếu bề rộng cỗ bài bằng đúng bề rộng ô chứa thì sai số
  // làm tròn dưới pixel khiến lá cuối rơi xuống hàng mới, dôi ra một hàng
  // và bộ bài lại phải cuộn.
  // Trừ padding của khung (khoảng cách lá bài ↔ khung tre) khỏi ô đo, nếu
  // không cỗ bài sẽ tính rộng hơn thực tế và tràn vào khung.
  const acs = getComputedStyle(area);
  const padX = (parseFloat(acs.paddingLeft) || 0) + (parseFloat(acs.paddingRight) || 0);
  const padY = (parseFloat(acs.paddingTop) || 0) + (parseFloat(acs.paddingBottom) || 0);
  const boxW = area.clientWidth - padX - 2;
  const boxH = area.clientHeight - padY - 2;
  if (boxW < 40 || boxH < 40) return;

  const { cols, cardW } = bestDeckFit(count, boxW, boxH, gap, minW, maxW);
  const w = Math.floor(cardW * 100) / 100;

  deckEl.style.setProperty('--card-w', w + 'px');
  deckEl.style.setProperty('--deck-w', (cols * w + (cols - 1) * gap) + 'px');
  markDeckScroll();
}

// Trên màn nhỏ, 52 lá không thể vừa một khung nên khu vực bài phải cuộn.
// Trước đây lá bài chỉ bị cắt ngang thân, không có dấu hiệu nào cho biết
// bên dưới còn bài — đánh dấu để CSS mờ dần đúng cái mép đang còn nội dung.
function markDeckScroll() {
  markScrollEdges(document.getElementById('deckArea'));
  markScrollEdges(document.querySelector('.sidebar'));
}

// Đánh dấu một vùng cuộn còn nội dung ở mép nào, để CSS mờ dần đúng mép đó.
function markScrollEdges(el) {
  if (!el) return;
  const scrollable = el.scrollHeight - el.clientHeight > 2;
  el.classList.toggle('is-scrollable', scrollable);
  el.classList.toggle('at-top', !scrollable || el.scrollTop <= 2);
  el.classList.toggle(
    'at-bottom',
    !scrollable || el.scrollTop + el.clientHeight >= el.scrollHeight - 2
  );
}

// Gọi lại khi cửa sổ đổi kích thước, xoay máy, hoặc thanh địa chỉ trên
// di động trượt lên/xuống (dvh thay đổi mà không có sự kiện resize).
let fitFrame = 0;
function scheduleFitDeck() {
  cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(fitDeck);
}

function observeDeckSize() {
  const area = document.getElementById('deckArea');
  if (!area) return;
  // Chiều cao phần chrome đổi khi web font tải xong — tính lại một lần nữa
  document.fonts?.ready.then(scheduleFitDeck).catch(() => {});
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(scheduleFitDeck).observe(area);
  }
  area.addEventListener('scroll', markDeckScroll, { passive: true });
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('scroll', markDeckScroll, { passive: true });
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(markDeckScroll).observe(sidebar);
    }
  }
  window.addEventListener('resize', scheduleFitDeck);
  window.addEventListener('orientationchange', scheduleFitDeck);
}

// Bring a freshly flipped card into view when it sits off-screen
// (small viewports can leave the picked card below the fold)
function scrollCardIntoView(cardEl) {
  if (!cardEl || typeof cardEl.getBoundingClientRect !== 'function') return;
  const rect = cardEl.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    cardEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }
}

// A flipped card is no longer interactive — drop button semantics
// and announce the revealed dish instead
function markCardElFlipped(cardEl, card) {
  if (!cardEl) return;
  const wasRovingTarget = cardEl.tabIndex === 0;
  cardEl.tabIndex = -1;
  cardEl.removeAttribute('role');
  cardEl.setAttribute('aria-label', card.dish + ' (đã bốc)');
  if (wasRovingTarget) {
    const next = document.querySelector('#deck .card[role="button"]');
    if (next) next.tabIndex = 0;
  }
}

// Folk card skin — category glyphs instead of suit symbols,
// sequential numbers instead of card ranks (less casino-coded)
const FOLK_VALUES = { 'A': '1', 'J': '11', 'Q': '12', 'K': '13' };

function isFolkDeck() {
  return settings.cardStyle === 'folk';
}

function cardCornerHTML(card) {
  if (isFolkDeck()) {
    const num = FOLK_VALUES[card.value] || card.value;
    const glyph = SUIT_GLYPHS[card.suit] || SUIT_GLYPHS['♠'];
    return `<span class="num">${num}</span>
      <svg class="suit suit-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${glyph}"/></svg>`;
  }
  return `<span class="num">${card.value}</span>
    <span class="suit">${card.suit}</span>`;
}

// Deck card face — 3 zones (head / figure / name band), no overlapping layers.
// Sizes are in cqw (container query units) so they scale with card width.
function cardHeadHTML(card) {
  if (isFolkDeck()) {
    const num = FOLK_VALUES[card.value] || card.value;
    const glyph = SUIT_GLYPHS[card.suit] || SUIT_GLYPHS['♠'];
    return `<span class="num">${num}</span>
      <svg class="suit-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${glyph}"/></svg>`;
  }
  return `<span class="num">${card.value}</span>
    <span class="suit">${card.suit}</span>`;
}

function cardMainSuitHTML(card) {
  if (isFolkDeck()) {
    const glyph = SUIT_GLYPHS[card.suit] || SUIT_GLYPHS['♠'];
    return `<svg class="suit-glyph big" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${glyph}"/></svg>`;
  }
  return card.suit;
}

function createCardFront(card) {
  const colorClass = card.isRed ? 'red' : 'black';
  return `
    <div class="front ${colorClass}">
      <div class="card-head">${cardHeadHTML(card)}</div>
      <div class="card-figure">
        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.dish)}" class="card-thumb" loading="lazy" decoding="async" onerror="this.style.display='none'">
      </div>
      <div class="food">${escapeHtml(card.dish)}</div>
    </div>
  `;
}

function updateRemaining() {
  document.getElementById('remaining').textContent = deck.length - flippedCards.length;
}

// ========================================
// DRAMATIC CARD PICK - EXTENDED SUSPENSE (~5 seconds)
// ========================================
async function pickCard(index) {
  if (flippedCards.includes(index) || isAnimating) return;
  isAnimating = true;

  const card = deck[index];
  const cardEl = document.querySelector(`[data-index="${index}"]`);

  // Dim other cards
  document.querySelectorAll('.card:not(.flipped)').forEach(c => {
    if (c !== cardEl) c.classList.add('dimmed');
  });

  // Vibrate on mobile (short pulse)
  if (navigator.vibrate) navigator.vibrate(50);

  const reduceMotion = prefersReducedMotion();

  // Start heartbeat (5 beats for longer suspense)
  playHeartbeat(reduceMotion ? 1 : 5);

  // PHASE 1: Lift card up with glow (800ms)
  cardEl.classList.add('picking');
  await beat(reduceMotion ? 150 : 800);

  // PHASE 2: Dramatic shake with drumroll (3000ms = 3 seconds!)
  cardEl.classList.add('shaking');
  const shakeMs = Math.round((reduceMotion ? 400 : 2200) * animSpeedFactor());
  playDrumroll(shakeMs);
  // Vibrate pattern during shake
  if (!reduceMotion && navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100, 50, 100, 50, 100]);
  await sleep(shakeMs);

  // PHASE 3: Flash reveal with sound
  cardEl.classList.remove('picking', 'shaking');
  cardEl.classList.add('revealing');
  playRevealSound();
  // Strong vibrate on reveal
  if (navigator.vibrate) navigator.vibrate(200);

  // Show popup FIRST, then flip card
  flippedCards.push(index);
  showResult(card);

  // Track results for multiplayer
  if (isMultiPlayer) {
    gameResults.push({
      player: currentPlayer,
      dish: card.dish,
      imageUrl: card.imageUrl
    });
    updateResultsPanel();
  }

  // Always add to history
  addToHistory(card);

  createConfetti();

  // Then flip the card in background
  await beat(100);
  cardEl.classList.add('flipped');
  cardEl.innerHTML = createCardFront(card);
  markCardElFlipped(cardEl, card);
  scrollCardIntoView(cardEl);

  await beat(400);
  cardEl.classList.remove('revealing');

  // Undim other cards
  document.querySelectorAll('.dimmed').forEach(c => c.classList.remove('dimmed'));

  updateRemaining();

  isAnimating = false;
}

// Thẻ thông tin dưới tên món: vùng miền · khoảng giá · buổi hợp.
// Giá là khoảng tham khảo cho một suất bình dân, có ghi rõ để không ai hiểu nhầm.
function formatPrice(range) {
  if (!Array.isArray(range)) return '';
  const [lo, hi] = range;
  return lo === hi ? `~${lo}k` : `${lo}–${hi}k`;
}

function dishFactsHTML(card) {
  const meta = DISH_META[card.dish];
  const facts = [];

  const region = REGION_NAMES[card.region || meta?.region];
  if (region) facts.push({ label: region, cls: 'fact-region' });
  if (meta?.price) facts.push({ label: formatPrice(meta.price) + '/suất', cls: 'fact-price' });

  const period = getTimePeriod();
  if (meta?.meals?.includes(period)) {
    facts.push({ label: 'Hợp ' + getTimeLabel(period).toLowerCase(), cls: 'fact-time' });
  }

  if (!facts.length) return '';
  return `<div class="dish-facts">${facts
    .map(f => `<span class="dish-fact ${f.cls}">${escapeHtml(f.label)}</span>`)
    .join('')}</div>`;
}

function showResult(card) {
  currentResult = card; // Store for sharing
  const modal = document.getElementById('modal');
  const resultCard = document.getElementById('resultCard');
  const isFav = isFavorite(card.dish);

  resultCard.className = 'result-card ' + (card.isRed ? 'red' : 'black');
  resultCard.innerHTML = `
    <button class="fav-btn ${isFav ? 'active' : ''}" id="favBtn" title="${isFav ? 'Bỏ yêu thích' : 'Yêu thích'}" aria-label="${isFav ? 'Bỏ yêu thích' : 'Yêu thích'}">
      <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
    <div class="corner-tl">${cardCornerHTML(card)}</div>
    <div class="main-suit">${cardMainSuitHTML(card)}</div>
    <div class="card-center">
      <div class="card-image">
        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.dish)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      </div>
      <div class="image-disclaimer">${DISH_META[card.dish]?.hasPhoto === false
        ? 'Tranh minh hoạ — món này chưa có ảnh chụp'
        : 'Hình ảnh mang tính chất minh hoạ'}</div>
      <div class="card-content">
        <div class="food-name">${escapeHtml(card.dish)}</div>
        ${dishFactsHTML(card)}
        <div class="food-pairing">Ăn kèm: ${escapeHtml(card.pairing)}</div>
      </div>
    </div>
    <div class="corner-br">${cardCornerHTML(card)}</div>
  `;

  // Add favorite button listener
  document.getElementById('favBtn').addEventListener('click', () => {
    toggleFavorite(card.dish);
    const btn = document.getElementById('favBtn');
    const nowFav = isFavorite(card.dish);
    btn.classList.toggle('active', nowFav);
    btn.title = nowFav ? 'Bỏ yêu thích' : 'Yêu thích';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="${nowFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>`;
  });

  // Food delivery / map links (same pattern as truanayangi)
  const dishQ = encodeURIComponent(card.dish);
  document.getElementById('linkMaps').href =
    `https://www.google.com/maps/search/${encodeURIComponent(card.dish + ' gần đây')}`;
  document.getElementById('linkGrab').href =
    `https://food.grab.com/vn/vi/restaurants?${new URLSearchParams({ search: card.dish, 'support-deeplink': 'true', searchParameter: card.dish })}`;
  document.getElementById('linkShopee').href = `https://shopeefood.vn/search?keyword=${dishQ}`;
  document.getElementById('linkBe').href = `https://food.be.com.vn/search?q=${dishQ}`;

  document.getElementById('nextBtn').classList.toggle('show', isMultiPlayer);
  modal.classList.add('show');
  announce(`Món của bạn: ${card.dish}. Ăn kèm ${card.pairing}.`);
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

function nextPlayer() {
  currentPlayer = currentPlayer >= totalPlayers ? 1 : currentPlayer + 1;
  document.getElementById('playerName').textContent = playerNames[currentPlayer - 1];
  closeModal();
}

async function resetGame() {
  if (isAnimating) return;
  isAnimating = true;

  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.classList.add('collecting');
    card.style.setProperty('--collect-delay', `${i * 8}ms`);
  });

  await sleep(700);

  flippedCards = [];
  gameResults = [];
  currentPlayer = 1;
  createDeck();
  renderDeck(true);
  document.getElementById('playerName').textContent = 'Người chơi 1';
  updateResultsPanel();

  isAnimating = false;
}

// Đồng bộ hai nút chế độ. Các nhánh thoát trước đây chỉ đổi class nên
// aria-pressed kẹt ở giá trị cũ, trình đọc màn hình báo sai chế độ.
function syncModeButtons(multi) {
  const singleBtn = document.getElementById('singleMode');
  const multiBtn = document.getElementById('multiMode');
  singleBtn.classList.toggle('active', !multi);
  multiBtn.classList.toggle('active', multi);
  singleBtn.setAttribute('aria-pressed', String(!multi));
  multiBtn.setAttribute('aria-pressed', String(multi));
}

function setMode(multi) {
  isMultiPlayer = multi;
  syncModeButtons(multi);

  if (multi) {
    // Show multiplayer modal for setup
    openMultiplayerModal();
  } else {
    // Single player - hide all panels
    document.getElementById('playerBar').classList.remove('show');
    document.getElementById('resultsPanel').classList.remove('show');
    resetGame();
  }
}

// ========================================
// MULTIPLAYER MODAL
// ========================================
function openMultiplayerModal() {
  const modal = document.getElementById('multiplayerModal');
  modal.classList.add('show');
  generatePlayerInputs(3); // Default 3 players
}

function closeMultiplayerModal() {
  document.getElementById('multiplayerModal').classList.remove('show');
  // Reset to single mode if cancelled
  isMultiPlayer = false;
  syncModeButtons(false);
}

function generatePlayerInputs(count) {
  const container = document.getElementById('playerInputs');
  container.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const row = document.createElement('div');
    row.className = 'player-input-row';
    row.innerHTML = `
      <span class="player-number">${i}</span>
      <label class="sr-only" for="playerName${i}">Tên người chơi ${i}</label>
      <input type="text" id="playerName${i}" name="playerName${i}" autocomplete="off" placeholder="Người chơi ${i}" data-player="${i}">
    `;
    container.appendChild(row);
  }
}

function startMultiplayerGame() {
  const inputs = document.querySelectorAll('#playerInputs input');
  totalPlayers = inputs.length;
  playerNames = Array.from(inputs).map((inp, i) => inp.value.trim() || `Người chơi ${i + 1}`);
  currentPlayer = 1;
  gameResults = [];

  // Close modal and show player bar
  document.getElementById('multiplayerModal').classList.remove('show');
  document.getElementById('playerBar').classList.add('show');
  document.getElementById('playerName').textContent = playerNames[0];

  // Reset deck for new game
  flippedCards = [];
  createDeck();
  renderDeck(true);
  updateResultsPanel();
}

function endMultiplayerGame() {
  // Show results panel with final results
  document.getElementById('resultsPanel').classList.add('show');

  // Reset to single mode
  isMultiPlayer = false;
  syncModeButtons(false);
  document.getElementById('playerBar').classList.remove('show');
}

// ========================================
// CONFETTI
// ========================================
function createConfetti() {
  if (prefersReducedMotion()) return;
  // Giấy vụn rơi theo tông làng quê — gạch nung, vàng nghệ, lá chuối, chàm,
  // giấy dó, hoa đào. Bản cũ dùng hồng/xanh dương/tím neon, lạc hẳn palette.
  const colors = ['#c85a3c', '#f0b429', '#8fa858', '#35526f', '#f6e7bf', '#e8879b'];
  const container = document.createElement('div');
  container.className = 'confetti';
  container.style.left = '50%';
  container.style.top = '20%';

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 400 - 200}px`;
    piece.style.animationDelay = `${Math.random() * 400}ms`;
    piece.style.animationDuration = `${1.2 + Math.random() * 0.6}s`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2500);
}

// ========================================
// HELPERS & EVENTS
// ========================================
function updateResultsPanel() {
  const list = document.getElementById('resultsList');
  if (gameResults.length === 0) {
    list.innerHTML = '<p class="no-results">Chưa có kết quả</p>';
    return;
  }

  list.innerHTML = gameResults.map(r => `
    <div class="result-item">
      <img src="${escapeHtml(r.imageUrl)}" alt="${escapeHtml(r.dish)}" class="result-thumb" loading="lazy" decoding="async">
      <div class="result-info">
        <span class="result-player">${escapeHtml(playerNames[r.player - 1] || 'Người chơi ' + r.player)}</span>
        <span class="result-dish">${escapeHtml(r.dish)}</span>
      </div>
    </div>
  `).join('');
}

function toggleResultsPanel() {
  document.getElementById('resultsPanel').classList.toggle('show');
}

// Lucky Wheel - Canvas-based spinning wheel
let wheelDishes = [];
let wheelAngle = 0;
let isSpinning = false;
let wheelRun = 0;

// Các múi xoay lấy từ bảng màu làng quê — gạch nung, lá chuối khô, chàm,
// đất nung, nâu sồng, vàng nghệ, mận chín, lá tre. Bản cũ dùng cầu vồng bão
// hoà (magenta/cyan/lime) nên màn này đọc ra hội chợ chứ không phải sân đình.
// Mọi múi đều đủ tối để chữ trắng đạt tương phản ≥ 5.4:1.
const WHEEL_COLORS = [
  '#8d3b24', '#5f6b33', '#35526f', '#a35426',
  '#4f3319', '#7a5a1f', '#6d3348', '#2f5c4a'
];

function openWheelModal() {
  // Get available dishes
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length === 0) {
    showToast('Hết lá rồi — bấm nút chia lại bộ bài nhé!');
    return;
  }

  // Pick up to 8 random dishes for wheel
  const shuffled = [...available];
  shuffleArray(shuffled);
  wheelDishes = shuffled.slice(0, Math.min(8, shuffled.length));

  wheelRun++;
  isSpinning = false;
  document.getElementById('wheelModal').classList.add('show');
  document.getElementById('spinWheelBtn').disabled = false;
  drawWheel();
}

function closeWheelModal() {
  wheelRun++;
  isSpinning = false;
  document.getElementById('wheelModal').classList.remove('show');
}

function drawWheel(highlightIndex = -1) {
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  // Mọi kích thước vẽ co theo cạnh canvas (gốc thiết kế 320px) để phóng to
  // bánh xe mà không lệch tỉ lệ hay vỡ nét.
  const S = canvas.width / 320;
  const outerRadius = 145 * S;
  const innerRadius = 130 * S;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw outer rim (decorative border)
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#4f3319';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw tick marks on rim
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * (outerRadius - 8 * S),
      centerY + Math.sin(angle) * (outerRadius - 8 * S)
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * outerRadius,
      centerY + Math.sin(angle) * outerRadius
    );
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const sliceAngle = (2 * Math.PI) / wheelDishes.length;

  wheelDishes.forEach((dish, i) => {
    const startAngle = wheelAngle + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    if (highlightIndex === i) {
      ctx.fillStyle = '#fbbf24'; // Highlight winner
    }
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chưa xoay thì giữ bí mật món; chỉ lộ tên ở ô thắng sau khi dừng.
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(13 * S)}px "Be Vietnam Pro", sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    let dishName = highlightIndex === i ? dish.dish : '?';
    if (dishName.length > 10) dishName = dishName.substring(0, 8) + '..';

    // Position text in middle of slice
    ctx.fillText(dishName, innerRadius / 2 + 15 * S, 5 * S);
    ctx.restore();
  });

  // Draw center circle with gradient
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30 * S);
  gradient.addColorStop(0, '#fbbf24');
  gradient.addColorStop(0.5, '#f59e0b');
  gradient.addColorStop(1, '#d97706');

  ctx.beginPath();
  ctx.arc(centerX, centerY, 28 * S, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw "?" in center
  ctx.fillStyle = '#3a2a00';
  ctx.font = `bold ${Math.round(24 * S)}px "Be Vietnam Pro", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'transparent';
  ctx.fillText('?', centerX, centerY);
}

function spinWheel() {
  if (isSpinning || wheelDishes.length === 0) return;
  isSpinning = true;
  const run = ++wheelRun;

  document.getElementById('spinWheelBtn').disabled = true;

  const reduceMotion = prefersReducedMotion();

  // Play sound
  if (settings.soundEnabled) playDrumroll(reduceMotion ? 800 : 3000);

  const TAU = 2 * Math.PI;
  const suggestedWinner = suggestedRandomCard(wheelDishes);
  const winnerIndex = Math.max(0, wheelDishes.indexOf(suggestedWinner));
  const sliceAngle = TAU / wheelDishes.length;

  // Góc đích để tâm ô thắng nằm dưới kim (kim ở đỉnh = -PI/2).
  // Số vòng xoay phải là SỐ NGUYÊN, nếu không bánh xe sẽ dừng lệch
  // ngẫu nhiên so với ô được tô sáng.
  const targetAngle = -Math.PI / 2 - (winnerIndex * sliceAngle) - sliceAngle / 2;
  const turns = reduceMotion ? 1 : 5 + Math.floor(Math.random() * 3);
  let delta = (targetAngle - wheelAngle) % TAU;
  if (delta < 0) delta += TAU;
  const finalAngle = wheelAngle + turns * TAU + delta;

  const startAngle = wheelAngle;
  const duration = Math.round((reduceMotion ? 1500 : 4500) * animSpeedFactor());
  const startTime = Date.now();

  function animate() {
    if (run !== wheelRun) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: decelerate
    const easeOut = 1 - Math.pow(1 - progress, 3);

    wheelAngle = startAngle + (finalAngle - startAngle) * easeOut;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Spin complete
      isSpinning = false;

      // Highlight winner
      drawWheel(winnerIndex);

      // Play reveal sound
      playRevealSound();

      // Show result after short delay
      setTimeout(() => {
        if (run !== wheelRun) return;
        const winner = wheelDishes[winnerIndex];
        closeWheelModal();
        completePick(winner);
      }, 800);
    }
  }

  requestAnimationFrame(animate);
}

// ========================================
// REEL MODE — CS:GO-style horizontal case opening
// ========================================
let reelDishes = [];
let reelStrip = [];
let isReelSpinning = false;
let reelWinnerIndex = -1;
let reelRun = 0;

const REEL_TILE_W = 104; // px, must match CSS
const REEL_LEN = 42;
const REEL_WIN_AT = 36;

function openReelModal() {
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length === 0) {
    showToast('Hết lá rồi — bấm nút chia lại bộ bài nhé!');
    return;
  }
  reelRun++;
  isReelSpinning = false;
  reelDishes = available;
  buildReelStrip();
  document.getElementById('reelModal').classList.add('show');
  document.getElementById('spinReelBtn').disabled = false;
}

function closeReelModal() {
  reelRun++;
  isReelSpinning = false;
  document.getElementById('reelModal').classList.remove('show');
}

// Spin profile — randomized per roll so each opening feels different
// (ported from truanayangi's CS:GO Panorama reconstruction)
function createSpinProfile(random = Math.random, reducedMotion = false) {
  const factor = animSpeedFactor();
  if (reducedMotion) {
    return { durationMs: Math.round((800 + Math.floor(random() * 400)) * factor), friction: 2.7 + random() * 0.6 };
  }
  return { durationMs: Math.round((4200 + Math.floor(random() * 1600)) * factor), friction: 2.7 + random() * 0.6 };
}

function spinProgress(progress, friction) {
  const p = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - p, friction);
}

function buildReelStrip() {
  const winner = suggestedRandomCard(reelDishes);
  reelStrip = [];
  const recent = [];
  for (let i = 0; i < REEL_LEN; i++) {
    if (i === REEL_WIN_AT) {
      reelStrip.push(winner);
      continue;
    }
    // Avoid repeating the same dish back-to-back like truanayangi's reel
    const alternatives = reelDishes.filter(d => !recent.includes(d));
    const pick = (alternatives.length ? alternatives : reelDishes)[Math.floor(Math.random() * (alternatives.length ? alternatives : reelDishes).length)];
    reelStrip.push(pick);
    recent.push(pick);
    if (recent.length > 6) recent.shift();
  }
  reelWinnerIndex = REEL_WIN_AT;

  const strip = document.getElementById('reelStrip');
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0)';
  strip.innerHTML = reelStrip.map(() => `
    <div class="reel-tile">
      <div class="reel-tile-back" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      </div>
    </div>
  `).join('');
}

function spinReel() {
  if (isReelSpinning || reelStrip.length === 0) return;
  isReelSpinning = true;
  const run = ++reelRun;
  document.getElementById('spinReelBtn').disabled = true;

  const reduceMotion = prefersReducedMotion();
  const window_ = document.querySelector('.reel-window');
  const strip = document.getElementById('reelStrip');

  // Offset so the winner tile's center lands on the window's center,
  // with a small random jitter within the tile for realism
  const jitter = (Math.random() - 0.5) * (REEL_TILE_W - 24);
  const targetX = -(REEL_WIN_AT * REEL_TILE_W + REEL_TILE_W / 2) + window_.clientWidth / 2 + jitter;

  const profile = createSpinProfile(Math.random, reduceMotion);
  const duration = profile.durationMs;
  const startTime = performance.now();

  if (settings.soundEnabled) playDrumroll(Math.min(duration, 3000));

  // Tick when a tile crosses the pointer (CS:GO scroll tick)
  let lastCell = Math.floor(-targetX / REEL_TILE_W);

  function frame(now) {
    if (run !== reelRun) return;
    const p = Math.min((now - startTime) / duration, 1);
    const ease = spinProgress(p, profile.friction);
    const currentX = targetX * ease;
    strip.style.transform = `translateX(${currentX}px)`;

    const cell = Math.floor((-currentX + window_.clientWidth / 2) / REEL_TILE_W);
    if (cell !== lastCell) {
      playTick();
      lastCell = cell;
    }

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      isReelSpinning = false;
      const winner = reelStrip[reelWinnerIndex];
      const tile = strip.children[reelWinnerIndex];
      if (tile) tile.classList.add('winner');
      playRevealSound();

      setTimeout(() => {
        if (run !== reelRun) return;
        closeReelModal();
        completePick(winner);
      }, 700);
    }
  }

  requestAnimationFrame(frame);
}

// ========================================
// BATTLE MODE — So sánh món: 8 món loại dần theo từng cặp
// ========================================
let battleRound = [];
let battleNextRound = [];
let battleRoundSize = 0;

function openBattleModal() {
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length < 2) {
    showToast('Cần ít nhất 2 món để so sánh — hãy chia lại bộ bài.');
    return;
  }

  const shuffled = [...available];
  shuffleArray(shuffled);
  battleRound = shuffled.slice(0, Math.min(8, shuffled.length));
  battleRoundSize = battleRound.length;
  battleNextRound = [];

  document.getElementById('battleModal').classList.add('show');
  renderBattleMatch();
}

function closeBattleModal() {
  document.getElementById('battleModal').classList.remove('show');
}

function battleRoundLabel(size) {
  if (size <= 2) return 'chung kết';
  if (size <= 4) return 'bán kết';
  return 'tứ kết';
}

function renderBattleMatch() {
  const a = battleRound[0];
  const b = battleRound[1];

  document.getElementById('battleTitle').textContent =
    `So sánh món — ${battleRoundLabel(battleRoundSize)}`;

  for (const [id, d] of [['battleCardA', a], ['battleCardB', b]]) {
    const btn = document.getElementById(id);
    btn.setAttribute('aria-label', d.dish);
    btn.innerHTML = `
      <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.dish)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      <span class="battle-dish">${escapeHtml(d.dish)}</span>
    `;
  }

  document.getElementById('battleProgress').textContent =
    `Còn ${battleRound.length} món vòng này`;
}

function advanceBattleBracket(round, nextRound, side) {
  if (!Array.isArray(round) || round.length < 2 || (side !== 0 && side !== 1)) return null;
  const qualified = [...nextRound, round[side]];
  const remaining = round.slice(2);
  if (remaining.length > 1) {
    return { round: remaining, nextRound: qualified, advanced: false, champion: null };
  }
  if (remaining.length === 1) qualified.push(remaining[0]);
  return {
    round: qualified,
    nextRound: [],
    advanced: true,
    champion: qualified.length === 1 ? qualified[0] : null
  };
}

function pickBattleSide(side) {
  const state = advanceBattleBracket(battleRound, battleNextRound, side);
  if (!state) return;
  battleRound = state.round;
  battleNextRound = state.nextRound;
  if (state.advanced) battleRoundSize = battleRound.length;
  if (state.champion) {
    closeBattleModal();
    completePick(state.champion);
    return;
  }

  renderBattleMatch();
}

// ========================================
// FAMILY MEAL — Mâm Cơm Gia Đình: region-themed tray generator
// ========================================
const MAM_COURSES = [
  { key: 'soup', label: 'Món canh', icon: 'M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4' },
  { key: 'main', label: 'Món mặn', icon: 'M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1M3 13h18a9 9 0 0 1-18 0z' },
  { key: 'veg', label: 'Món rau', icon: 'M12 21c-5 0-8-3.5-8-8 4.5 0 8 3.5 8 8zm0 0c0-4.5 3.5-8 8-8 0 4.5-3.5 8-8 8zm0-8V5' },
  { key: 'dessert', label: 'Tráng miệng', icon: 'M7 3h10l-2 7a3 3 0 0 1-6 0L7 3zM12 13v6M8 21h8' }
];

let mamRegion = 'B';
let mamTray = null; // {soup, main, veg, dessert}

function openMamComModal() {
  document.getElementById('mamModal').classList.add('show');
  document.querySelectorAll('.mam-chip').forEach(ch => {
    const on = ch.dataset.region === mamRegion;
    ch.classList.toggle('selected', on);
    ch.setAttribute('aria-pressed', String(on));
  });
  renderMamTray();
}

function closeMamComModal() {
  document.getElementById('mamModal').classList.remove('show');
}

function setMamRegion(region) {
  mamRegion = region;
  document.querySelectorAll('.mam-chip').forEach(ch => {
    const on = ch.dataset.region === region;
    ch.classList.toggle('selected', on);
    ch.setAttribute('aria-pressed', String(on));
  });
  rollMamCom();
}

function pickCourse(region, course, exclude) {
  const pool = FAMILY_MEALS[region][course].filter(d => d !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function rollMamCom() {
  mamTray = {};
  for (const c of MAM_COURSES) {
    mamTray[c.key] = pickCourse(mamRegion, c.key);
  }
  renderMamTray();
  playTick();
}

function rerollMamItem(course) {
  if (!mamTray) return;
  mamTray[course] = pickCourse(mamRegion, course, mamTray[course]);
  renderMamTray();
  playTick();
}

function renderMamTray() {
  const tray = document.getElementById('mamTray');
  if (!tray) return;
  const label = document.getElementById('rollMamLabel');
  if (label) label.textContent = mamTray ? 'Gợi ý mâm khác' : 'Gợi ý mâm';

  if (!mamTray) {
    tray.innerHTML = '<p class="mam-hint">Chọn miền rồi bấm Gợi ý mâm để nhận thực đơn đủ 4 món.</p>';
    return;
  }

  tray.innerHTML = MAM_COURSES.map(c => `
    <div class="mam-course">
      <div class="mam-course-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${c.icon}"/></svg>
        <span>${c.label}</span>
        <button class="mam-reroll" data-course="${c.key}" aria-label="Đổi ${c.label}" title="Đổi món này">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
      <div class="mam-dish">${escapeHtml(mamTray[c.key])}</div>
    </div>
  `).join('');

  tray.querySelectorAll('.mam-reroll').forEach(btn => {
    btn.addEventListener('click', () => rerollMamItem(btn.dataset.course));
  });
}

// Shared finish for pick-style modes: flip card, record, celebrate
function completePick(card) {
  const deckIndex = deck.findIndex(c => c.id === card.id);
  if (deckIndex !== -1 && !flippedCards.includes(deckIndex)) {
    flippedCards.push(deckIndex);
    const cardEl = document.querySelector(`[data-index="${deckIndex}"]`);
    if (cardEl) {
      cardEl.classList.add('flipped');
      cardEl.innerHTML = createCardFront(card);
      markCardElFlipped(cardEl, card);
      scrollCardIntoView(cardEl);
    }
  }
  showResult(card);
  addToHistory(card);
  if (isMultiPlayer) {
    gameResults.push({ player: currentPlayer, dish: card.dish, imageUrl: card.imageUrl });
    updateResultsPanel();
  }
  createConfetti();
  updateRemaining();
}

function availableCards() {
  return deck.filter((_, i) => !flippedCards.includes(i));
}

// ========================================
// LẮC CHỌN MÓN — shake the tube and reveal a playful verse
// ========================================
let xamWinner = null;
let xamShaking = false;
let xamRun = 0;

// Câu gợi ý viết theo nhịp lục bát để màn lắc có nét riêng mà không dựa
// vào thuật ngữ bói quẻ hoặc cách phân hạng khó hiểu.
const XAM_VERSES = [
  { tier: 'Rất hợp hôm nay', text: 'Duyên gì đưa đẩy tới đây\nMón này ăn thử, no đầy cả trưa.' },
  { tier: 'Món đáng thử',    text: 'Hôm nay món đến tận nơi\nĂn xong nhẹ bụng, thảnh thơi cả ngày.' },
  { tier: 'Lựa chọn dễ ăn',  text: 'Không ngon cũng chẳng dở đâu\nĂn cho qua bữa, mai cầu món sang.' },
  { tier: 'Rất hợp hôm nay', text: 'Bụng đang réo gọi từng hồi\nMón này hợp ý, đứng ngồi không yên.' },
  { tier: 'Lựa chọn vừa ý',  text: 'Chọn chi cho mệt cái đầu\nQuán quen góc phố, món đâu cũng vừa.' },
  { tier: 'Món đáng thử',    text: 'Món này trông thật là xinh\nĂn vào một miếng, thình lình thấy vui.' },
  { tier: 'Lựa chọn thân quen', text: 'Hôm nay chẳng có gì sang\nCơm nhà rau muống, vẫn ngon lạ thường.' },
  { tier: 'Tiện đường hôm nay', text: 'Đói thì đầu gối phải bò\nMón này gần đấy, khỏi lo đường xa.' }
];

function openXamModal() {
  const available = availableCards();
  if (!available.length) {
    showToast('Hết lá rồi — bấm nút chia lại bộ bài nhé!');
    return;
  }
  xamRun++;
  xamWinner = null;
  xamShaking = false;
  document.getElementById('xamFortune').hidden = true;
  document.getElementById('xamModal').classList.add('show');
  document.getElementById('shakeXamBtn').disabled = false;
}

function closeXamModal() {
  xamRun++;
  xamShaking = false;
  document.getElementById('xamModal').classList.remove('show');
  document.getElementById('xamTube').classList.remove('shaking');
}

function shakeXam() {
  if (xamShaking) return;
  const available = availableCards();
  if (!available.length) return;
  xamShaking = true;
  const run = ++xamRun;
  document.getElementById('shakeXamBtn').disabled = true;

  xamWinner = suggestedRandomCard(available);
  const tube = document.getElementById('xamTube');
  const shakeMs = prefersReducedMotion() ? 400 : 1400;

  if (settings.soundEnabled) playDrumroll(Math.min(shakeMs, 1200));
  tube.classList.add('shaking');

  setTimeout(() => {
    if (run !== xamRun) return;
    tube.classList.remove('shaking');
    const verse = XAM_VERSES[Math.floor(Math.random() * XAM_VERSES.length)];
    document.getElementById('xamDish').textContent = xamWinner.dish;
    document.getElementById('xamVerse').textContent = verse.text;
    const tierEl = document.getElementById('xamTier');
    if (tierEl) tierEl.textContent = verse.tier;
    document.getElementById('xamFortune').hidden = false;
    playRevealSound();

    setTimeout(() => {
      if (run !== xamRun) return;
      closeXamModal();
      completePick(xamWinner);
    }, prefersReducedMotion() ? 700 : 1500);
  }, shakeMs);
}

// ========================================
// CHẠM CHỌN MÓN — pick a flower, get the dish inside
// ========================================
// Hoa vườn quê: dâm bụt, vạn thọ, sen, mướp, xoan, gạo, cau, nụ lá.
// Bản cũ là pastel hồng/tím/mint kiểu game trẻ em — lạc nhất trong app.
const HOA_COLORS = ['#e2563c', '#f2a33c', '#e8879b', '#d9c34a', '#b07fa8', '#c9452f', '#efdcbb', '#8fa858'];
let hoaRun = 0;

function openHoaModal() {
  const available = availableCards();
  if (!available.length) {
    showToast('Hết lá rồi — bấm nút chia lại bộ bài nhé!');
    return;
  }
  const run = ++hoaRun;
  const garden = document.getElementById('hoaGarden');
  const count = 12;
  garden.innerHTML = Array.from({ length: count }, (_, i) => `
    <button class="hoa-flower" style="--petal:${HOA_COLORS[i % HOA_COLORS.length]}" aria-label="Chọn bông hoa ${i + 1} để mở món">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <ellipse cx="24" cy="12" rx="7" ry="11" fill="var(--petal)"/>
        <ellipse cx="24" cy="36" rx="7" ry="11" fill="var(--petal)"/>
        <ellipse cx="12" cy="24" rx="11" ry="7" fill="var(--petal)"/>
        <ellipse cx="36" cy="24" rx="11" ry="7" fill="var(--petal)"/>
        <circle cx="24" cy="24" r="7" fill="#ffd93d"/>
        <circle cx="24" cy="24" r="3" fill="#e8a50c"/>
      </svg>
    </button>
  `).join('');

  garden.querySelectorAll('.hoa-flower').forEach(btn => {
    btn.addEventListener('click', () => pickFlower(btn, available, run), { once: true });
  });

  document.getElementById('hoaModal').classList.add('show');
}

function closeHoaModal() {
  hoaRun++;
  document.getElementById('hoaModal').classList.remove('show');
}

function pickFlower(btn, available, run) {
  if (btn.classList.contains('picked')) return;
  btn.classList.add('picked');
  playTick();

  const winner = suggestedRandomCard(available);
  setTimeout(() => {
    if (run !== hoaRun) return;
    closeHoaModal();
    completePick(winner);
  }, prefersReducedMotion() ? 150 : 500);
}

// ========================================
// CÀO CHỌN MÓN — scratch card reveal
// ========================================
let scratchWinner = null;
let scratchDone = false;
let scratchRun = 0;

function openVesoModal() {
  const available = availableCards();
  if (!available.length) {
    showToast('Hết lá rồi — bấm nút chia lại bộ bài nhé!');
    return;
  }
  const run = ++scratchRun;
  scratchWinner = suggestedRandomCard(available);
  scratchDone = false;

  document.getElementById('scratchDish').textContent = scratchWinner.dish;
  const img = document.getElementById('scratchImg');
  img.src = scratchWinner.imageUrl;
  img.alt = '';

  document.getElementById('vesoModal').classList.add('show');
  requestAnimationFrame(() => {
    if (run === scratchRun) setupScratchCanvas(run);
  });
}

function closeVesoModal() {
  scratchRun++;
  scratchDone = true;
  document.getElementById('vesoModal').classList.remove('show');
}

function setupScratchCanvas(run) {
  const canvas = document.getElementById('scratchCanvas');
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Lớp cào nhũ đồng trên giấy điệp — tông ấm cùng hệ với cả app.
  // Bản cũ là nhũ bạc xanh lạnh, màu lạnh duy nhất trong giao diện.
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#b59461');
  grad.addColorStop(0.45, '#e6d0a4');
  grad.addColorStop(0.55, '#c9a877');
  grad.addColorStop(1, '#a07f4e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#5a4020';
  ctx.font = '700 20px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦ CÀO ĐỂ XEM MÓN ✦', w / 2, h / 2 - 12);
  ctx.font = '500 12px "Be Vietnam Pro", sans-serif';
  ctx.fillText('món ngon đang chờ bên dưới', w / 2, h / 2 + 14);

  let scratching = false;
  let moves = 0;
  const brush = Math.max(22, w / 14);

  const erase = (e) => {
    if (run !== scratchRun || scratchDone) return;
    const r = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, brush, 0, Math.PI * 2);
    ctx.fill();
    if (++moves % 8 === 0) checkScratched(canvas, ctx, w, h);
  };

  canvas.onpointerdown = (e) => {
    scratching = true;
    canvas.setPointerCapture(e.pointerId);
    erase(e);
  };
  canvas.onpointermove = (e) => { if (scratching && !scratchDone) erase(e); };
  canvas.onpointerup = () => { scratching = false; checkScratched(canvas, ctx, w, h, run); };
}

// Đo phần đã cào trên một lưới thưa (~60×60 điểm) thay vì đọc toàn bộ
// canvas theo devicePixelRatio — trên điện thoại retina đó là hàng triệu pixel
// mỗi lần kiểm tra, đủ để cảm giác cào bị khựng.
const SCRATCH_SAMPLE = 60;

function checkScratched(canvas, ctx, w, h, run = scratchRun) {
  if (scratchDone || run !== scratchRun) return;
  const sw = Math.min(SCRATCH_SAMPLE, canvas.width);
  const sh = Math.min(SCRATCH_SAMPLE, canvas.height);
  const stepX = canvas.width / sw;
  const stepY = canvas.height / sh;
  let clear = 0, total = 0;

  for (let y = 0; y < sh; y++) {
    const py = Math.min(canvas.height - 1, Math.floor(y * stepY));
    const row = ctx.getImageData(0, py, canvas.width, 1).data;
    for (let x = 0; x < sw; x++) {
      const px = Math.min(canvas.width - 1, Math.floor(x * stepX));
      total++;
      if (row[px * 4 + 3] < 128) clear++;
    }
  }

  if (total && clear / total > 0.45) revealScratch(ctx, w, h, run);
}

function revealScratch(ctx, w, h, run = scratchRun) {
  if (scratchDone || run !== scratchRun) return;
  scratchDone = true;
  ctx.clearRect(0, 0, w, h);
  playRevealSound();
  setTimeout(() => {
    if (run !== scratchRun) return;
    closeVesoModal();
    completePick(scratchWinner);
  }, prefersReducedMotion() ? 600 : 1400);
}

function revealScratchInstant() {
  if (scratchDone) return;
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  revealScratch(ctx, canvas.clientWidth, canvas.clientHeight, scratchRun);
}

// ========================================
// DISH OF THE DAY — deterministic daily suggestion
// ========================================
function getDishOfDay() {
  const all = [];
  for (const suit of SUITS) {
    DISH_DB[suit].forEach((d, i) => {
      all.push({
        value: VALUES[i % VALUES.length],
        suit,
        dish: d.name,
        pairing: d.pair,
        imageUrl: d.imageUrl,
        isRed: suit === '♥' || suit === '♦',
        region: d.region
      });
    });
  }
  // Băm ngày trước khi lấy chỉ số — nếu dùng thẳng YYYYMMDD thì mỗi ngày
  // món chỉ nhích lên đúng 1 ô, người dùng đoán được món mai ăn gì.
  const d = new Date();
  const day = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  let h = day ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x21f0aaad);
  h = Math.imul(h ^ (h >>> 15), 0x735a2d97);
  h = (h ^ (h >>> 15)) >>> 0;
  const allowed = all.filter(card => !isExcluded(card.dish));
  const pool = allowed.length ? allowed : all;
  return pool[h % pool.length];
}

// Lời chào đổi theo buổi — thay câu tĩnh "Chọn một lá bài để xem món ăn"
function renderGreeting() {
  const el = document.getElementById('headerGreeting');
  if (el) el.textContent = MEAL_GREETINGS[getTimePeriod()];
}

function renderDishOfDay() {
  const el = document.getElementById('dishOfDayName');
  if (el) el.textContent = getDishOfDay().dish;
}

// "Last choice" + local pick counter — ported from truanayangi's local-counter
function updateSessionInfo() {
  const lastWrap = document.getElementById('lastChoiceWrap');
  const lastName = document.getElementById('lastChoiceName');
  const countWrap = document.getElementById('pickCountWrap');
  const countEl = document.getElementById('pickCount');
  if (!lastWrap || !countWrap) return;

  if (history.length > 0 && lastName) {
    const last = history[history.length - 1];
    lastName.textContent = last.dish || '';
    lastWrap.hidden = !last.dish;
  }
  if (totalSpins > 0 && countEl) {
    countEl.textContent = new Intl.NumberFormat('vi-VN').format(totalSpins);
    countWrap.hidden = false;
  }
  const visitsWrap = document.getElementById('visitCountWrap');
  const visitsEl = document.getElementById('visitCount');
  if (visitCount > 1 && visitsWrap && visitsEl) {
    visitsEl.textContent = new Intl.NumberFormat('vi-VN').format(visitCount);
    visitsWrap.hidden = false;
  }

  // Hide the whole strip when nothing has data yet
  const strip = document.getElementById('sessionInfo');
  if (strip) {
    const anyVisible = [...strip.querySelectorAll('.session-item')].some(el => !el.hidden);
    strip.hidden = !anyVisible;
  }
}

function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
}

// Current result for sharing
let currentResult = null;

async function shareResult() {
  if (!currentResult) return;

  // Try to create and share image
  try {
    const canvas = await createShareImage(currentResult);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'homnayangi.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Hôm Nay Ăn Gì?',
        text: `Hôm nay ăn: ${currentResult.dish}`,
        files: [file]
      });
      return;
    }
  } catch (err) {
    console.log('Image share failed:', err);
  }

  // Fallback to text share
  const shareData = {
    title: 'Hôm Nay Ăn Gì?',
    text: `🍜 Hôm nay ăn: ${currentResult.dish}\n🥢 Ăn kèm: ${currentResult.pairing}\n\n👉 Thử ngay: ${window.location.href}`,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share cancelled:', err);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.text);
      showToast('Đã chép kết quả vào bộ nhớ tạm.');
    } catch (err) {
      showToast('Không chia sẻ được. Bạn hãy chép thủ công nhé.');
    }
  }
}

async function createShareImage(card) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Nền sân gạch — cùng tông với giao diện. Trước đây là mặt nỉ xanh casino,
  // mà đây lại đúng là tấm ảnh người dùng đem đi khoe với bạn bè.
  const gradient = ctx.createLinearGradient(0, 0, 0, 800);
  gradient.addColorStop(0, '#6b4426');
  gradient.addColorStop(1, '#2c1a0d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 800);

  // Card background
  ctx.fillStyle = '#fdf6e4';
  roundRect(ctx, 100, 80, 400, 560, 20);
  ctx.fill();

  // Viền tre quanh lá bài
  ctx.strokeStyle = '#b5834a';
  ctx.lineWidth = 4;
  roundRect(ctx, 100, 80, 400, 560, 20);
  ctx.stroke();

  // Load and draw food image
  try {
    const img = await loadImage(card.imageUrl);
    ctx.save();
    roundRect(ctx, 130, 180, 340, 220, 10);
    ctx.clip();
    ctx.drawImage(img, 130, 180, 340, 220);
    ctx.restore();
  } catch (e) {
    // Draw placeholder if image fails
    ctx.fillStyle = '#eee';
    roundRect(ctx, 130, 180, 340, 220, 10);
    ctx.fill();
  }

  // Số thứ tự + biểu tượng nhóm món
  ctx.fillStyle = card.isRed ? '#8e3826' : '#4f3319';
  ctx.font = 'bold 48px "Be Vietnam Pro", sans-serif';
  ctx.fillText(isFolkDeck() ? (FOLK_VALUES[card.value] || card.value) : card.value, 130, 150);
  ctx.font = '36px "Be Vietnam Pro", sans-serif';
  ctx.fillText(card.suit, 135, 190);

  // Food name
  ctx.fillStyle = card.isRed ? '#8e3826' : '#4f3319';
  ctx.font = 'bold 32px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.dish, 300, 460);

  // Pairing
  ctx.fillStyle = '#6b6455';
  ctx.font = '18px "Be Vietnam Pro", sans-serif';
  ctx.fillText(`Ăn kèm: ${card.pairing}`, 300, 500);

  // App name
  ctx.fillStyle = '#f7f0dd';
  ctx.font = 'bold 28px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Hôm Nay Ăn Gì?', 300, 720);

  ctx.font = '16px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = 'rgba(247,240,221,0.72)';
  ctx.fillText('homnayangi.app', 300, 760);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Pick a random unflipped card — used by the quick-pick CTA and PWA shortcut
function quickPick() {
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length === 0 || isAnimating) return;
  const winner = suggestedRandomCard(available);
  const deckIndex = deck.indexOf(winner);
  if (deckIndex !== -1) pickCard(deckIndex);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Hệ số tốc độ từ mục Cài đặt. Trước đây nó chỉ đổi biến CSS, còn màn bốc
// bài lại chờ bằng setTimeout cứng — chọn "Nhanh" mà vẫn phải đợi đủ 4 giây.
const ANIM_SPEED_FACTOR = { slow: 1.5, normal: 1, fast: 0.6 };

function animSpeedFactor() {
  return ANIM_SPEED_FACTOR[settings.animSpeed] ?? 1;
}

// Chờ theo nhịp đã nhân hệ số tốc độ
function beat(ms) {
  return sleep(Math.round(ms * animSpeedFactor()));
}

// ========================================
// MODAL MANAGER — dialog semantics dùng chung cho mọi lớp phủ
// Mỗi modal trước đây tự bật/tắt class .show, nên Escape chỉ gỡ class mà
// bỏ qua phần dọn trạng thái của hàm đóng riêng (ví dụ thoát màn hình lập
// nhóm chơi mà isMultiPlayer vẫn đang bật). Ở đây gom về một chỗ.
// ========================================
const MODAL_IDS = [
  'modal', 'settingsModal', 'multiplayerModal', 'plannerModal', 'customDishModal',
  'excludesModal', 'wheelModal', 'reelModal', 'battleModal', 'mamModal',
  'xamModal', 'hoaModal', 'vesoModal', 'resultsPanel', 'onboardingModal'
];

const PANEL_SELECTOR = [
  '.modal-card', '.settings-content', '.multiplayer-content', '.planner-content',
  '.custom-dish-content', '.excludes-content', '.wheel-content', '.reel-content',
  '.battle-content', '.results-panel-content', '.onboarding-content'
].join(', ');

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let modalEls = [];
let focusBeforeModal = null;

function modalCloser(id) {
  return {
    modal: closeModal,
    settingsModal: closeSettings,
    multiplayerModal: closeMultiplayerModal,
    plannerModal: closePlanner,
    customDishModal: closeCustomDishModal,
    excludesModal: closeExcludesModal,
    wheelModal: closeWheelModal,
    reelModal: closeReelModal,
    battleModal: closeBattleModal,
    mamModal: closeMamComModal,
    xamModal: closeXamModal,
    hoaModal: closeHoaModal,
    vesoModal: closeVesoModal,
    resultsPanel: () => document.getElementById('resultsPanel').classList.remove('show'),
    onboardingModal: hideOnboarding
  }[id];
}

function openModalStack() {
  return modalEls.filter(m => m.classList.contains('show'));
}

function focusablesIn(root) {
  return [...root.querySelectorAll(FOCUSABLE)]
    .filter(el => !el.hasAttribute('hidden') && el.offsetParent !== null);
}

function syncModalState() {
  const stack = openModalStack();
  document.body.classList.toggle('modal-open', stack.length > 0);

  if (!stack.length) {
    if (focusBeforeModal && document.body.contains(focusBeforeModal)) {
      focusBeforeModal.focus({ preventScroll: true });
    }
    focusBeforeModal = null;
    return;
  }

  if (!focusBeforeModal) focusBeforeModal = document.activeElement;

  const top = stack[stack.length - 1];
  if (top.contains(document.activeElement)) return;
  const panel = top.querySelector(PANEL_SELECTOR) || top;
  (focusablesIn(panel)[0] || panel).focus({ preventScroll: true });
}

function initModalManager() {
  modalEls = MODAL_IDS.map(id => document.getElementById(id)).filter(Boolean);

  modalEls.forEach(m => {
    const panel = m.querySelector(PANEL_SELECTOR);
    if (panel) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.tabIndex = -1;
      const heading = panel.querySelector('h2, h3');
      if (heading) {
        if (!heading.id) heading.id = m.id + 'Title';
        panel.setAttribute('aria-labelledby', heading.id);
      }
    }
    // Bấm ra ngoài để đóng — vài modal (mâm cơm, lắc, chạm, cào)
    // trước đây không có lớp nền nên chỉ đóng được bằng nút X.
    m.addEventListener('mousedown', e => {
      if (e.target === m) modalCloser(m.id)?.();
    });
  });

  document.querySelectorAll('[data-close]').forEach(bg => {
    bg.addEventListener('click', () => modalCloser(bg.dataset.close)?.());
  });

  const observer = new MutationObserver(syncModalState);
  modalEls.forEach(m => observer.observe(m, { attributes: true, attributeFilter: ['class'] }));

  document.addEventListener('keydown', e => {
    const stack = openModalStack();
    if (!stack.length) return;
    const top = stack[stack.length - 1];

    if (e.key === 'Escape') {
      e.preventDefault();
      const close = modalCloser(top.id);
      if (close) close();
      else top.classList.remove('show');
      return;
    }

    if (e.key !== 'Tab') return;
    const items = focusablesIn(top.querySelector(PANEL_SELECTOR) || top);
    if (items.length < 2) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function setupEvents() {
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', closeModal);
  document.getElementById('nextBtn').addEventListener('click', nextPlayer);
  document.getElementById('resetBtn').addEventListener('click', resetGame);
  document.getElementById('singleMode').addEventListener('click', () => setMode(false));
  document.getElementById('multiMode').addEventListener('click', () => setMode(true));
  document.getElementById('resultsToggle').addEventListener('click', toggleResultsPanel);
  document.getElementById('shareBtn').addEventListener('click', shareResult);
  document.getElementById('quickPickBtn')?.addEventListener('click', quickPick);

  // Lucky wheel
  document.getElementById('wheelBtn')?.addEventListener('click', openWheelModal);
  document.getElementById('closeWheelX')?.addEventListener('click', closeWheelModal);
  document.getElementById('wheelBg')?.addEventListener('click', closeWheelModal);
  document.getElementById('spinWheelBtn')?.addEventListener('click', spinWheel);

  // Reel (Lướt chọn món)
  document.getElementById('reelBtn')?.addEventListener('click', openReelModal);
  document.getElementById('closeReelX')?.addEventListener('click', closeReelModal);
  document.getElementById('reelBg')?.addEventListener('click', closeReelModal);
  document.getElementById('spinReelBtn')?.addEventListener('click', spinReel);

  // So sánh món
  document.getElementById('battleBtn')?.addEventListener('click', openBattleModal);
  document.getElementById('closeBattleX')?.addEventListener('click', closeBattleModal);
  document.getElementById('battleBg')?.addEventListener('click', closeBattleModal);
  document.getElementById('battleCardA')?.addEventListener('click', () => pickBattleSide(0));
  document.getElementById('battleCardB')?.addEventListener('click', () => pickBattleSide(1));

  // Family meal (Mâm Cơm)
  document.getElementById('mamBtn')?.addEventListener('click', openMamComModal);
  document.getElementById('closeMamX')?.addEventListener('click', closeMamComModal);
  document.getElementById('rollMamBtn')?.addEventListener('click', rollMamCom);
  document.querySelectorAll('.mam-chip').forEach(ch => {
    ch.addEventListener('click', () => setMamRegion(ch.dataset.region));
  });

  // Lắc / Chạm / Cào chọn món
  document.getElementById('xamBtn')?.addEventListener('click', openXamModal);
  document.getElementById('closeXamX')?.addEventListener('click', closeXamModal);
  document.getElementById('shakeXamBtn')?.addEventListener('click', shakeXam);
  document.getElementById('hoaBtn')?.addEventListener('click', openHoaModal);
  document.getElementById('closeHoaX')?.addEventListener('click', closeHoaModal);
  document.getElementById('vesoBtn')?.addEventListener('click', openVesoModal);
  document.getElementById('closeVesoX')?.addEventListener('click', closeVesoModal);
  document.getElementById('revealScratchBtn')?.addEventListener('click', revealScratchInstant);

  // Dish of the day
  document.getElementById('dishOfDay')?.addEventListener('click', () => {
    showResult(getDishOfDay());
  });

  // Onboarding
  document.getElementById('skipOnboarding')?.addEventListener('click', hideOnboarding);
  document.getElementById('nextOnboarding')?.addEventListener('click', nextSlide);
  document.querySelectorAll('.onboarding-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.dot)));
  });

  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Region filter
  document.getElementById('regionFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Meal-time filter — chọn xem món hợp buổi nào (sáng/trưa/xế/tối/khuya)
  document.getElementById('mealFilter')?.addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Favorites filter
  document.getElementById('favFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Multiplayer modal
  document.getElementById('closeMultiplayerX')?.addEventListener('click', closeMultiplayerModal);
  document.getElementById('multiplayerBg')?.addEventListener('click', closeMultiplayerModal);
  document.getElementById('startGameBtn')?.addEventListener('click', startMultiplayerGame);
  document.getElementById('endGameBtn')?.addEventListener('click', endMultiplayerGame);
  document.getElementById('closeResultsPanel')?.addEventListener('click', () => {
    document.getElementById('resultsPanel').classList.remove('show');
  });
  document.getElementById('resultsPanelBg')?.addEventListener('click', () => {
    document.getElementById('resultsPanel').classList.remove('show');
  });

  // Player count buttons
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.dataset.count);
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      generatePlayerInputs(count);
    });
  });

  // Custom dish modal
  document.getElementById('cancelCustomDish').addEventListener('click', closeCustomDishModal);
  document.getElementById('customDishBg').addEventListener('click', closeCustomDishModal);
  document.getElementById('saveCustomDish').addEventListener('click', saveCustomDishFromForm);
  document.getElementById('closeCustomDishX')?.addEventListener('click', closeCustomDishModal);

  // Planner modal
  document.getElementById('closePlannerX')?.addEventListener('click', closePlanner);
  document.getElementById('plannerBg').addEventListener('click', closePlanner);
  document.getElementById('autoFillBtn').addEventListener('click', autoFillWeek);
  document.getElementById('clearPlanBtn').addEventListener('click', clearWeekPlan);

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsX')?.addEventListener('click', closeSettings);
  document.getElementById('settingsBg').addEventListener('click', closeSettings);
  document.getElementById('clearDataBtn')?.addEventListener('click', clearAllLocalData);

  // Settings navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;

      // Update nav buttons
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update sections
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
      const sectionId = section === 'privacy' ? 'sectionAbout' :
        'section' + section.charAt(0).toUpperCase() + section.slice(1);
      document.getElementById(sectionId)?.classList.add('active');

      if (section === 'privacy') {
        requestAnimationFrame(() => document.getElementById('privacyBlock')?.scrollIntoView({ block: 'start' }));
      }

      // Refresh history if needed
      if (section === 'history') {
        updateHistoryPanel();
        updateStatsPanel();
      }
    });
  });

  // Feature cards in settings
  document.getElementById('openPlannerBtn')?.addEventListener('click', () => {
    closeSettings();
    openPlanner();
  });

  document.getElementById('openCustomDishBtn')?.addEventListener('click', () => {
    closeSettings();
    openCustomDishModal();
  });

  document.getElementById('openExcludesBtn')?.addEventListener('click', () => {
    closeSettings();
    openExcludesModal();
  });

  document.getElementById('closeExcludesX')?.addEventListener('click', closeExcludesModal);
  document.getElementById('excludesSearch')?.addEventListener('input', e => renderExcludesList(e.target.value));
  document.getElementById('excludesBg')?.addEventListener('click', closeExcludesModal);

  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    settings.darkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', settings.darkMode);
    updateThemeColor();
    saveSettings();
  });

  document.getElementById('soundToggle').addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    saveSettings();
  });

  // Time filter toggle (now in settings)
  document.getElementById('timeFilterToggle')?.addEventListener('change', (e) => {
    settings.timeFilterEnabled = e.target.checked;
    saveSettings();
    createDeck();
    renderDeck(true);
  });

  document.getElementById('animSpeedSelect').addEventListener('change', (e) => {
    settings.animSpeed = e.target.value;
    document.documentElement.style.setProperty('--anim-speed',
      settings.animSpeed === 'slow' ? '1.5' : settings.animSpeed === 'fast' ? '0.6' : '1'
    );
    saveSettings();
  });

  document.getElementById('cardStyleSelect')?.addEventListener('change', (e) => {
    settings.cardStyle = e.target.value;
    document.body.classList.toggle('folk-deck', settings.cardStyle === 'folk');
    saveSettings();
    renderDeck(false);
  });

  // Tab switching for history/stats
  document.querySelectorAll('.history-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // Update buttons
      document.querySelectorAll('.history-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      document.getElementById('historyTab').classList.toggle('hidden', tab !== 'history');
      document.getElementById('statsTab').classList.toggle('hidden', tab !== 'stats');

      // Refresh content
      if (tab === 'history') updateHistoryPanel();
      if (tab === 'stats') updateStatsPanel();
    });
  });

  // Enable audio on first interaction
  document.body.addEventListener('click', () => {
    if (!audioContext) initAudio();
  }, { once: true });

  initModalManager();

  // Suspend audio when the tab is hidden, resume when it returns
  // (truanayangi pauses its audio engine on visibilitychange)
  document.addEventListener('visibilitychange', () => {
    if (!audioContext) return;
    if (document.hidden) {
      audioContext.suspend().catch(() => {});
    } else if (settings.soundEnabled) {
      audioContext.resume().catch(() => {});
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

// ========================================
// TEST API — CommonJS export for Jest (no-op in browser)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  const SUIT_KEYS = { '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs', '♠': 'spades' };
  const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

  const FoodDatabase = {
    FOOD_DATA: {
      hearts: DISHES['♥'],
      diamonds: DISHES['♦'],
      clubs: DISHES['♣'],
      spades: DISHES['♠']
    },

    getAllFoods() {
      const foods = [];
      for (const suit of SUITS) {
        DISHES[suit].forEach((foodName, i) => {
          foods.push(this._toFoodItem(SUIT_KEYS[suit], VALUES[i % VALUES.length], foodName));
        });
      }
      return foods;
    },

    getFoodByCard(suit, value) {
      const symbol = SUIT_SYMBOLS[suit];
      const index = VALUES.indexOf(value);
      if (!symbol || index === -1) return null;
      return this._toFoodItem(suit, value, DISHES[symbol][index]);
    },

    // Rút trong cả kho món, không dừng ở 13 món đầu mỗi nhóm
    getRandomCard() {
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const index = Math.floor(Math.random() * DISHES[suit].length);
      return this._toFoodItem(SUIT_KEYS[suit], VALUES[index % VALUES.length], DISHES[suit][index]);
    },

    _toFoodItem(suit, cardValue, foodName) {
      return {
        cardValue,
        suit,
        suitSymbol: SUIT_SYMBOLS[suit],
        suitColor: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
        foodName
      };
    }
  };

  const HistoryManager = {
    saveToHistory(entry) {
      history.push(entry);
      saveHistory();
    },
    getHistory() {
      return [...history].reverse();
    },
    getRecentHistory(n) {
      return this.getHistory().slice(0, n);
    },
    clearHistory() {
      history = [];
      saveHistory();
    }
  };

  const CardPicker = {
    drawCard() {
      if (isAnimating) return null;
      return { card: FoodDatabase.getRandomCard(), timestamp: Date.now() };
    },
    isDrawing() {
      return isAnimating;
    },
    setDrawingState(state) {
      isAnimating = state === true;
    }
  };

  module.exports = {
    FoodDatabase, HistoryManager, CardPicker,
    // Dữ liệu thô cho bộ test toàn vẹn (dish-data.test.js)
    DISH_DB, DISH_META, SUITS, VALUES, REGION_NAMES, TOTAL_DISHES, DECK_SIZE,
    CATEGORY_NAMES, drawBalanced,
    // Thuật toán thuần, test được mà không cần DOM
    bestDeckFit, getTimePeriod, fitsMeal, chooseSuggestedCard, advanceBattleBracket, fillWeekPlan
  };
}
