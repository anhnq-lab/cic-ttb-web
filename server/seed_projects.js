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
    }
];

function seedProjects(db) {
    db.get("SELECT count(*) as count FROM projects", (err, row) => {
        if (err) return console.error('Error checking projects:', err);
        if (row.count === 0) {
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
                ]);
            });

            stmt.finalize(() => {
                console.log('Done seeding projects!');
            });
        }
    });
}

module.exports = seedProjects;
