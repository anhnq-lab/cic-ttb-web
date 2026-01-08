const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Projects extracted from CIC_BIM_Profile.pdf
const projects = [
    {
        title: 'Terra An Hưng',
        client: 'Công ty Cổ phần Ecoba Việt Nam',
        location: 'Hà Đông, Hà Nội',
        service_type: 'BIM Modeling',
        description: 'Dự án nhà ở Terra An Hưng với diện tích 62.610 m2. CIC thực hiện dựng mô hình 3D và kiểm soát chất lượng thiết kế.',
        challenge: 'Yêu cầu phối hợp đa bộ môn trên quy mô lớn.',
        solution: 'Ứng dụng BIM 3D để kiểm soát thiết kế và bóc tách khối lượng.',
        result: 'Hoàn thành đúng tiến độ, nâng cao độ chính xác thiết kế.',
        images: ['https://picsum.photos/seed/terra/800/600'],
        completion_date: '2020-12-31'
    },
    {
        title: 'Chung cư Phúc Đạt Connect 2',
        client: 'Công ty TNHH Phúc Đạt Connect 2',
        location: 'Đông Hòa, Dĩ An, Bình Dương',
        service_type: 'BIM Modeling',
        description: 'Dự án chung cư 71.320 m2. Dựng mô hình thiết kế thi công, xuất khối lượng từ mô hình, hỗ trợ CĐT kiểm soát khối lượng đấu thầu.',
        challenge: 'Cần kiểm soát chặt chẽ khối lượng để đấu thầu lựa chọn nhà thầu.',
        solution: 'Sử dụng BIM để xuất khối lượng chính xác từ mô hình.',
        result: 'Hỗ trợ thành công quá trình đấu thầu với dữ liệu khối lượng tin cậy.',
        images: ['https://picsum.photos/seed/phucdat/800/600'],
        completion_date: '2020-12-31'
    },
    {
        title: 'Khu nhà ở Tư Đình - Him Lam',
        client: 'Công ty Cổ phần Đầu tư Him Lam BC',
        location: 'Long Biên, Hà Nội',
        service_type: 'BIM Modeling',
        description: 'Khu nhà ở và vui chơi giải trí 48.000 m2. Thực hiện dựng mô hình thiết kế kỹ thuật, phối hợp mô hình, kiểm tra va chạm và xuất khối lượng chi tiết.',
        challenge: 'Phối hợp đa bộ môn phức tạp trên dự án quy mô lớn.',
        solution: 'Triển khai BIM coordination để phát hiện xung đột sớm.',
        result: 'Giảm thiểu xung đột thiết kế, tối ưu chi phí.',
        images: ['https://picsum.photos/seed/himlam/800/600'],
        completion_date: '2024-12-31'
    },
    {
        title: 'Hệ thống thoát nước & XLNT TP Sơn La',
        client: 'BQL Dự án XLNT TP Sơn La',
        location: 'Thành phố Sơn La, Sơn La',
        service_type: 'Digital Twin',
        description: 'Dự án ODA về hệ thống thoát nước và xử lý nước thải. Khảo sát quy trình vận hành, lập mô hình hoàn công, cập nhật thông tin tài sản phục vụ vận hành, chuyển giao kỹ năng sử dụng BIM cho công tác quản lý.',
        challenge: 'Số hóa toàn bộ hệ thống hạ tầng phức tạp để vận hành hiệu quả.',
        solution: 'Áp dụng BIM và Digital Twins cho quản lý tài sản.',
        result: 'Nâng cao hiệu quả vận hành và bảo trì hệ thống.',
        images: ['https://picsum.photos/seed/sonla/800/600'],
        completion_date: '2022-12-31'
    },
    {
        title: 'Global Business Center',
        client: 'Công ty Cổ phần Địa ốc Dầu khí Viễn thông',
        location: 'Phạm Hùng, Nam Từ Liêm, Hà Nội',
        service_type: 'BIM Modeling',
        description: 'Tòa nhà văn phòng cao cấp 114.040 m2. Dựng mô hình BIM từ thiết kế cơ sở đến thi công, diễn họa video marketing, phối hợp mô hình và xuất khối lượng.',
        challenge: 'Dự án lớn yêu cầu tích hợp BIM cho marketing và kỹ thuật.',
        solution: 'Kết hợp BIM với visualization cho video marketing chất lượng cao.',
        result: 'Hỗ trợ sales và marketing hiệu quả với video diễn họa 3D.',
        images: ['https://picsum.photos/seed/gbc/800/600'],
        completion_date: '2024-12-31'
    },
    {
        title: 'Sân bay Quốc tế Phnom Penh',
        client: 'Cambodia Airport Investment Co., Ltd',
        location: 'Phnom Penh, Cambodia',
        service_type: 'BIM Modeling',
        description: 'Dự án sân bay quốc tế và trạm kiểm soát không lưu 21.300 m2. Cập nhật mô hình thi công, phối hợp mô hình, kiểm tra va chạm, xuất bản vẽ Shop và tạo mô hình hoàn công.',
        challenge: 'Dự án quốc tế với yêu cầu chất lượng cao và tiêu chuẩn nghiêm ngặt.',
        solution: 'Áp dụng quy trình BIM quốc tế, coordination chặt chẽ.',
        result: 'Hoàn thành dự án đúng tiến độ với chất lượng đạt chuẩn quốc tế.',
        images: ['https://picsum.photos/seed/airport/800/600'],
        completion_date: '2022-12-31'
    },
    {
        title: 'Bệnh viện Nhân dân Gia Định',
        client: 'Công ty Cổ phần Tập đoàn Xây dựng Thành Đô',
        location: 'Bình Thạnh, TP. Hồ Chí Minh',
        service_type: 'BIM Modeling',
        description: 'Bệnh viện 70.200 m2. Dựng mô hình giai đoạn thi công, phối hợp mô hình, kiểm tra va chạm và xuất bản vẽ Shop.',
        challenge: 'Công trình y tế với hệ thống kỹ thuật phức tạp (MEP).',
        solution: 'BIM coordination chuyên sâu cho hệ thống MEP bệnh viện.',
        result: 'Phát hiện và xử lý hơn 500 va chạm trước khi thi công.',
        images: ['https://picsum.photos/seed/hospital1/800/600'],
        completion_date: '2022-12-31'
    },
    {
        title: 'Bệnh viện Đa khoa Củ Chi',
        client: 'BQL Dự án ĐTXD công trình Dân dụng & Công nghiệp',
        location: 'Củ Chi, TP. Hồ Chí Minh',
        service_type: 'BIM Modeling',
        description: 'Bệnh viện đa khoa 84.500 m2. Dựng mô hình giai đoạn thi công, phối hợp mô hình, kiểm tra va chạm và xuất bản vẽ.',
        challenge: 'Quy mô lớn với nhiều bộ môn chuyên ngành.',
        solution: 'Triển khai BIM Level 2 với CDE tập trung.',
        result: 'Nâng cao chất lượng phối hợp giữa các bên.',
        images: ['https://picsum.photos/seed/cuchi/800/600'],
        completion_date: '2021-12-31'
    },
    {
        title: 'K8-CT1 KĐT Tây Hồ Tây',
        client: 'Công ty TNHH Phát triển THT',
        location: 'Xuân La, Tây Hồ, Hà Nội',
        service_type: 'BIM Modeling',
        description: 'Tòa nhà hỗn hợp 70.200 m2. Dựng mô hình BIM từ TKCS đến TKTC, phối hợp mô hình, diễn họa thi công, xuất khối lượng và bản vẽ, đệ trình hồ sơ BIM lên Bộ Xây dựng.',
        challenge: 'Yêu cầu đệ trình hồ sơ BIM theo quy định mới của Bộ Xây dựng.',
        solution: 'Tuân thủ đầy đủ quy trình BIM theo NĐ 175/2024.',
        result: 'Được Bộ Xây dựng phê duyệt hồ sơ BIM thành công.',
        images: ['https://picsum.photos/seed/k8ct1/800/600'],
        completion_date: '2022-12-31'
    },
    {
        title: 'Lotte Eco Smart City Thủ Thiêm 2-6',
        client: 'Công ty TNHH Lotte Properties HCMC',
        location: 'Thủ Đức, TP. Hồ Chí Minh',
        service_type: 'BIM Modeling',
        description: 'Khu phức hợp 159.241 m2 tại Thủ Thiêm. Dựng mô hình BIM đầy đủ, phối hợp mô hình, diễn họa, xuất khối lượng và đệ trình hồ sơ BIM lên Bộ Xây dựng.',
        challenge: 'Dự án quy mô rất lớn với tiêu chuẩn Hàn Quốc.',
        solution: 'Kết hợp tiêu chuẩn BIM Việt Nam và Hàn Quốc.',
        result: 'Đáp ứng yêu cầu cả hai bên và Bộ Xây dựng.',
        images: ['https://picsum.photos/seed/lotte/800/600'],
        completion_date: '2024-12-31'
    },
    {
        title: 'Đại học Cần Thơ (JICA)',
        client: 'JICA - Cơ quan Hợp tác Quốc tế Nhật Bản',
        location: 'Ninh Kiều, TP. Cần Thơ',
        service_type: 'BIM Modeling',
        description: 'Công trình giáo dục 31.600 m2. Dựng mô hình giai đoạn thiết kế bản vẽ thi công, kiểm tra va chạm, phối hợp xử lý và xuất bản vẽ từ mô hình.',
        challenge: 'Dự án ODA với tiêu chuẩn Nhật Bản nghiêm ngặt.',
        solution: 'Áp dụng tiêu chuẩn BIM theo yêu cầu JICA.',
        result: 'Được JICA nghiệm thu và đánh giá cao về chất lượng BIM.',
        images: ['https://picsum.photos/seed/cantho/800/600'],
        completion_date: '2020-12-31'
    },
    {
        title: 'KCN Thuận Thành I - Bắc Ninh',
        client: 'Tổng Công ty Viglacera - CTCP',
        location: 'Thuận Thành, Bắc Ninh',
        service_type: 'Digital Twin',
        description: 'Khu công nghiệp 262.7 ha. Khảo sát quy trình vận hành, lập mô hình hoàn công, cập nhật thông tin tài sản và chuyển giao kỹ năng BIM cho vận hành.',
        challenge: 'Số hóa toàn bộ KCN quy mô lớn để quản lý vận hành.',
        solution: 'Triển khai Digital Twins cho quản lý tài sản KCN.',
        result: 'Nâng cao hiệu quả quản lý và giảm chi phí vận hành.',
        images: ['https://picsum.photos/seed/viglacera/800/600'],
        completion_date: '2024-12-31'
    },
    {
        title: 'Bệnh viện Tim Hà Nội (Cơ sở 2)',
        client: 'Ban QLDA ĐTXD công trình Dân dụng TP. Hà Nội',
        location: 'Tây Hồ, Hà Nội',
        service_type: 'BIM Modeling',
        description: 'Bệnh viện chuyên khoa tim mạch 47.960 m2. Tạo lập mô hình BIM 3D, kiểm soát thiết kế, phối hợp mô hình, video diễn họa, bóc tách khối lượng.',
        challenge: 'Công trình y tế chuyên khoa với yêu cầu kỹ thuật cao.',
        solution: 'BIM full-service từ thiết kế đến bóc tách khối lượng.',
        result: 'Đảm bảo chất lượng thiết kế và tiến độ dự án.',
        images: ['https://picsum.photos/seed/heart/800/600'],
        completion_date: '2025-12-31'
    },
    {
        title: 'Cung Thiếu nhi TP. Hồ Chí Minh',
        client: 'BQL Dự án ĐTXD các công trình Dân dụng và Công nghiệp',
        location: 'Thủ Thiêm, Quận 2, TP. HCM',
        service_type: 'BIM Modeling',
        description: 'Cung thiếu nhi 11.606 m2 tại Thủ Thiêm. Tạo lập mô hình BIM 3D, kiểm soát thiết kế, phối hợp mô hình, video diễn họa và bóc tách khối lượng.',
        challenge: 'Công trình công cộng với kiến trúc đặc thù cho trẻ em.',
        solution: 'BIM hỗ trợ visualization để trình bày cho các bên liên quan.',
        result: 'Hỗ trợ ra quyết định thiết kế hiệu quả.',
        images: ['https://picsum.photos/seed/children/800/600'],
        completion_date: '2025-12-31'
    },
    {
        title: 'Nhà xưởng Bình Dương - BW',
        client: 'Công ty TNHH MTV Phát triển BW Thới Hòa',
        location: 'Bến Cát, Bình Dương',
        service_type: 'BIM Modeling',
        description: 'Nhà xưởng công nghiệp 9.5 ha. Dựng mô hình thiết kế và thi công, phối hợp mô hình, kiểm tra va chạm, xuất bản vẽ Shop, tạo mô hình hoàn công và nhập thông tin tài sản.',
        challenge: 'Dự án FDI với tiêu chuẩn quốc tế và tiến độ gấp.',
        solution: 'Quy trình BIM tối ưu cho nhà xưởng công nghiệp.',
        result: 'Hoàn thành trước tiến độ, bàn giao mô hình hoàn công đầy đủ.',
        images: ['https://picsum.photos/seed/factory/800/600'],
        completion_date: '2021-12-31'
    }
];

console.log('Seeding projects from CIC_BIM_Profile...');

const stmt = db.prepare(`INSERT INTO projects 
    (title, client, location, service_type, description, challenge, solution, result, images, completion_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

projects.forEach((p, idx) => {
    stmt.run([
        p.title,
        p.client,
        p.location,
        p.service_type,
        p.description,
        p.challenge,
        p.solution,
        p.result,
        JSON.stringify(p.images),
        p.completion_date
    ], (err) => {
        if (err) console.error(`Error inserting ${p.title}:`, err.message);
        else console.log(`[${idx + 1}/${projects.length}] Added: ${p.title}`);
    });
});

stmt.finalize(() => {
    console.log('Done seeding projects!');
    db.close();
});
