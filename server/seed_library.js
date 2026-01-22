const libraryItems = [
    {
        title: 'Hướng dẫn áp dụng BIM cho Chủ đầu tư (2024)',
        type: 'featured',
        description: 'Tài liệu hướng dẫn chi tiết về lộ trình áp dụng BIM, các yêu cầu trong hồ sơ mời thầu (EIR) và kế hoạch thực hiện BIM (BEP) dành cho các chủ đầu tư dự án vốn ngân sách và tư nhân.',
        tag: 'Must Read',
        image_url: 'https://picsum.photos/seed/lib1/800/400',
        content: `
            <h3>Tổng quan</h3>
            <p>Việc áp dụng BIM không chỉ là xu hướng mà đã trở thành yêu cầu bắt buộc đối với một số loại công trình theo lộ trình của Chính phủ. Tài liệu này cung cấp cái nhìn toàn diện cho Chủ đầu tư.</p>
            <h3>Nội dung chính</h3>
            <ul>
                <li>Quy định pháp lý hiện hành (NĐ 15, NĐ 06, NĐ 10...)</li>
                <li>Cách xây dựng Yêu cầu thông tin của Chủ đầu tư (EIR)</li>
                <li>Đánh giá Kế hoạch thực hiện BIM (BEP) của nhà thầu</li>
                <li>Quy trình phối hợp trong môi trường dữ liệu chung (CDE)</li>
            </ul>
        `,
        link: '#'
    },
    {
        title: 'Infographic: Quy trình thẩm định hồ sơ BIM',
        type: 'infographic',
        description: 'Sơ đồ hóa quy trình thẩm định báo cáo nghiên cứu khả thi và thiết kế xây dựng triển khai sau thiết kế cơ sở có áp dụng BIM.',
        tag: 'Infographic',
        image_url: 'https://picsum.photos/seed/infographic1/600/800',
        link: '#',
        content: `<p>Mô tả chi tiết các bước thẩm định...</p>`
    },
    {
        title: 'Mẫu EIR (Employer Information Requirements)',
        type: 'technical',
        description: 'File mẫu hồ sơ yêu cầu thông tin của Chủ đầu tư, giúp tiết kiệm thời gian soạn thảo hồ sơ thầu.',
        tag: 'Template',
        link: '#',
        image_url: 'https://picsum.photos/seed/template1/400/300',
        content: `<p>Tải về mẫu EIR chuẩn...</p>`
    },
    {
        title: 'Giải mã Nghị định 175/2024 về BIM',
        type: 'legal',
        description: 'Phân tích các điểm mới và tác động của Nghị định 175 đối với các bên tham gia dự án đầu tư xây dựng.',
        tag: 'Pháp lý',
        image_url: 'https://picsum.photos/seed/legal1/400/300',
        content: `<p>Nghị định 175 mang đến nhiều thay đổi...</p>`,
        link: '#'
    }
];

function seedLibrary(db) {
    db.get("SELECT count(*) as count FROM library", (err, row) => {
        if (err) return console.error('Error checking library:', err);
        if (row.count === 0) {
            console.log('Seeding library...');
            const stmt = db.prepare("INSERT INTO library (title, type, description, tag, image_url, content, link) VALUES (?, ?, ?, ?, ?, ?, ?)");

            libraryItems.forEach(item => {
                stmt.run([
                    item.title,
                    item.type,
                    item.description,
                    item.tag,
                    item.image_url,
                    item.content,
                    item.link
                ]);
            });

            stmt.finalize(() => {
                console.log('Done seeding library!');
            });
        }
    });
}

module.exports = seedLibrary;
