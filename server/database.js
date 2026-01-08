const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) return console.error("Users table error:", err.message);

            // Seed default admin if empty
            db.get("SELECT count(*) as count FROM users", [], (err, row) => {
                if (err) return;
                if (row.count === 0) {
                    const bcrypt = require('bcrypt');
                    const defaultPass = 'admin123';
                    const saltRounds = 10;

                    bcrypt.hash(defaultPass, saltRounds, function (err, hash) {
                        if (err) return console.error("Hash error:", err);
                        db.run(`INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
                            ['admin', hash, 'admin'],
                            (err) => {
                                if (err) console.error("Seed admin error:", err.message);
                                else console.log("Default admin account created: admin / admin123");
                            });
                    });
                }
            });
        });

        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // News Table
        db.run(`CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            date TEXT,
            imageUrl TEXT,
            excerpt TEXT,
            content TEXT,
            author TEXT,
            videoUrl TEXT,
            audioUrl TEXT,
            attachments TEXT,
            metaTitle TEXT,
            metaDescription TEXT,
            keywords TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Library Table
        db.run(`CREATE TABLE IF NOT EXISTS library (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            type TEXT,
            description TEXT,
            tag TEXT,
            image_url TEXT,
            link TEXT,
            author TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tools Table
        db.run(`CREATE TABLE IF NOT EXISTS tools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            icon TEXT,
            link TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Pricing Table
        db.run(`CREATE TABLE IF NOT EXISTS pricing (
            id TEXT PRIMARY KEY,
            name TEXT,
            price TEXT,
            period TEXT,
            description TEXT,
            features TEXT,
            ctaText TEXT,
            type TEXT,
            isPopular INTEGER
        )`);

        // Contacts Table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            service TEXT,
            note TEXT,
            company TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Projects Table
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            client TEXT,
            location TEXT,
            service_type TEXT,
            description TEXT,
            challenge TEXT,
            solution TEXT,
            result TEXT,
            images TEXT,
            completion_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

        // Seed Data if empty
        seedData();
    });
}

function seedData() {
    // Check if news exists
    db.get("SELECT count(*) as count FROM news", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding News...");
            const newsValues = [
                ['Nghị định 175/2024/NĐ-CP: Lộ trình áp dụng BIM mới', 'Nghị định', '15/12/2024', 'https://picsum.photos/seed/news1/200/200', 'Chính phủ ban hành Nghị định mới về BIM...', '<p>Chi tiết về nghị định 175...</p>'],
                ['Thông tư 10/2024 về hướng dẫn áp dụng BIM', 'Thông tư', '10/12/2024', 'https://picsum.photos/seed/news2/200/200', 'Bộ Xây dựng hướng dẫn chi tiết...', '<p>Nội dung thông tư 10...</p>'],
                ['Xu hướng Digital Twin trong xây dựng 2025', 'Xu hướng', '05/12/2024', 'https://picsum.photos/seed/news3/200/200', 'Công nghệ bản sao số đang lên ngôi...', '<p>Phân tích xu hướng Digital Twin...</p>']
            ];
            const stmt = db.prepare("INSERT INTO news (title, category, date, imageUrl, excerpt, content) VALUES (?, ?, ?, ?, ?, ?)");
            newsValues.forEach(v => stmt.run(v));
            stmt.finalize();
        } else {
            // Migration: Check for missing columns
            db.all("PRAGMA table_info(news)", (err, columns) => {
                if (err) return;
                const existingColumns = columns.map(c => c.name);
                const newColumns = [
                    { name: 'author', type: 'TEXT' },
                    { name: 'videoUrl', type: 'TEXT' },
                    { name: 'audioUrl', type: 'TEXT' },
                    { name: 'attachments', type: 'TEXT' } // JSON string
                ];

                newColumns.forEach(col => {
                    if (!existingColumns.includes(col.name)) {
                        console.log(`Migrating: Adding ${col.name} to news table`);
                        db.run(`ALTER TABLE news ADD COLUMN ${col.name} ${col.type}`);
                    }
                });
            });
        }
    });

    // Check if settings exist
    db.get("SELECT count(*) as count FROM settings", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Settings...");
            const settings = {
                companyName: 'CIC BIM Hub',
                address: 'Hà Nội, Việt Nam',
                phone: '0901234567',
                email: 'contact@cic.example.com',
                footerDescription: 'Nền tảng tri thức và công cụ hỗ trợ chuyển đổi số hàng đầu cho ngành xây dựng Việt Nam.',
                facebook: 'https://facebook.com/cicbim',
                linkedin: 'https://linkedin.com/company/cicbim'
            };
            db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['general', JSON.stringify(settings)]);
        }
    });

    // Check if pricing exists
    db.get("SELECT count(*) as count FROM pricing", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Pricing...");
            const pricingData = [
                ['starter', 'Gói Khởi Đầu', '5.900.000đ', '/tháng', 'Phù hợp cho doanh nghiệp nhỏ, dự án đơn lẻ',
                    '["Quản lý tối đa 3 dự án","Lưu trữ 50GB Cloud","Số hóa Nhật ký công trình","Báo cáo tiến độ cơ bản","Hỗ trợ qua Email","Không có BIM Viewer 3D","Không có tích hợp API"]',
                    'Bắt đầu dùng thử', 'software', 0],
                ['professional', 'Gói Chuyên Nghiệp', '12.900.000đ', '/tháng', 'Dành cho PMU và tổ chức tư vấn giám sát',
                    '["Quản lý không giới hạn dự án","Lưu trữ 500GB Cloud","Số hóa toàn bộ quy trình","BIM Viewer 3D Online","Báo cáo tuân thủ pháp lý","Tích hợp e-Office / ERP","Hỗ trợ 24/7 qua Hotline","Đào tạo nhân sự (4 buổi)"]',
                    'Liên hệ tư vấn', 'software', 1],
                ['enterprise', 'Gói Doanh Nghiệp', 'Liên hệ', '', 'Giải pháp toàn diện cho tập đoàn lớn',
                    '["Mọi tính năng Chuyên Nghiệp","Lưu trữ không giới hạn","Tùy biến theo quy trình riêng","Digital Twin & IoT Integration","AI phân tích dự báo rủi ro","API mở & tích hợp SAP/Oracle","SLA đảm bảo uptime 99.9%","Đào tạo và triển khai tại chỗ"]',
                    'Nhận báo giá', 'software', 0],
                ['legal-service', 'Tư vấn Pháp lý BIM', '', '', 'Hỗ trợ tuân thủ pháp luật xây dựng và tối ưu hồ sơ pháp lý dự án.',
                    '["Rà soát hồ sơ theo NĐ 175/2024","Tư vấn quy trình nghiệm thu","Hỗ trợ quyết toán vốn đầu tư công","Đào tạo Compliance cho team"]',
                    'Xem chi tiết', 'service', 0],
                ['bim-consulting', 'Triển khai BIM Doanh nghiệp', '', '', 'Lộ trình chuyển đổi số toàn diện từ đánh giá hiện trạng đến vận hành.',
                    '["Khảo sát và đánh giá năng lực BIM","Xây dựng BIM Execution Plan (BEP)","Setup CDE và quy trình phối hợp","Đào tạo và chuyển giao công nghệ"]',
                    'Xem chi tiết', 'service', 0]
            ];
            const stmt = db.prepare("INSERT INTO pricing (id, name, price, period, description, features, ctaText, type, isPopular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            pricingData.forEach(v => stmt.run(v));
            stmt.finalize();
        }
    });
}

module.exports = db;
