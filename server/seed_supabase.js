import './env.js';
import supabase from './supabase.js';

const newsData = [
    {
        title: "Nghị định 175/2024: Bước ngoặt pháp lý cho áp dụng BIM tại Việt Nam",
        category: "Pháp lý",
        excerpt: "Nghị định 175/2024/NĐ-CP chính thức quy định lộ trình áp dụng BIM bắt buộc cho các dự án đầu tư công từ năm 2026, mở ra kỷ nguyên mới cho ngành xây dựng.",
        content: `
            <h3>Tổng quan Nghị định 175/2024</h3>
            <p>Chính phủ vừa ban hành Nghị định quy định về lộ trình áp dụng Mô hình thông tin công trình (BIM) trong hoạt động xây dựng. Đây được coi là văn bản pháp lý quan trọng nhất từ trước đến nay về chuyển đổi số ngành xây dựng.</p>
            <h3>Các điểm chính cần lưu ý</h3>
            <ul>
                <li><strong>Lộ trình áp dụng:</strong> Bắt buộc áp dụng BIM đối với các công trình cấp I từ năm 2025 và toàn bộ công trình đầu tư công từ năm 2026.</li>
                <li><strong>Phê duyệt chi phí:</strong> Quy định rõ về định mức chi phí áp dụng BIM trong tổng mức đầu tư.</li>
                <li><strong>Tiêu chuẩn kỹ thuật:</strong> Yêu cầu tuân thủ các tiêu chuẩn ISO 19650 về quản lý thông tin.</li>
            </ul>
        `,
        image_url: "https://picsum.photos/seed/legal2/800/600",
        author: "Ban Pháp chế CIC",
        metaTitle: "Nghị định 175/2024 về áp dụng BIM - Phân tích chi tiết",
        metaDescription: "Phân tích chi tiết Nghị định 175/2024/NĐ-CP về lộ trình và quy định áp dụng BIM tại Việt Nam.",
        keywords: "BIM, Nghị định 175, Pháp lý xây dựng, Chuyển đổi số"
    },
    {
        title: "CIC Platform ra mắt tính năng AI Assistant tra cứu TCVN",
        category: "Công nghệ",
        excerpt: "Tính năng mới giúp kỹ sư tra cứu nhanh hàng nghìn Tiêu chuẩn Việt Nam (TCVN) và Quy chuẩn Việt Nam (QCVN) chỉ bằng ngôn ngữ tự nhiên.",
        content: `
            <p>CIC Platform tự hào giới thiệu trợ lý ảo AI chuyên dụng cho ngành xây dựng, được tích hợp sâu vào nền tảng quản trị dự án.</p>
            <p>Với khả năng xử lý ngôn ngữ tự nhiên tiếng Việt vượt trội, AI Assistant có thể:</p>
            <ul>
                <li>Trả lời chính xác các câu hỏi về quy chuẩn, tiêu chuẩn.</li>
                <li>Trích dẫn nguồn văn bản pháp lý cụ thể.</li>
                <li>Hỗ trợ kiểm tra tuân thủ thiết kế tự động.</li>
            </ul>
        `,
        image_url: "https://picsum.photos/seed/tech1/800/600",
        author: "CIC Tech Team",
        keywords: "AI Xây dựng, Tra cứu TCVN, CIC Platform"
    },
    {
        title: "Hội thảo: Ứng dụng Scan-to-BIM trong bảo tồn di sản",
        category: "Sự kiện",
        excerpt: "CIC phối hợp với Cục Di sản văn hóa tổ chức hội thảo chuyên đề về số hóa di tích bằng công nghệ Laser Scanning và Photogrammetry.",
        content: "<p>Hội thảo sẽ diễn ra vào ngày 15/03/2026 tại Hà Nội, quy tụ các chuyên gia hàng đầu về bảo tồn và công nghệ số...</p>",
        image_url: "https://picsum.photos/seed/event1/800/600",
        author: "Ban Truyền thông",
        keywords: "Scan to BIM, Di sản số, Hội thảo CIC"
    },
    {
        title: "Top 5 xu hướng công nghệ xây dựng năm 2026",
        category: "Xu hướng",
        excerpt: "Digital Twins, in 3D bê tông, và robot công trường là những công nghệ được dự báo sẽ bùng nổ trong năm nay.",
        content: "<p>Năm 2026 đánh dấu sự trưởng thành của các công nghệ...</p>",
        image_url: "https://picsum.photos/seed/trend1/800/600",
        author: "Research Team",
        keywords: "Xu hướng xây dựng 2026, Digital Twin, Construction Tech"
    },
    {
        title: "CIC ký kết hợp tác chiến lược với Autodesk",
        category: "Tin tức CIC",
        excerpt: "Thỏa thuận hợp tác nhằm thúc đẩy đào tạo và cấp chứng chỉ BIM quốc tế cho kỹ sư Việt Nam.",
        content: "<p>CIC chính thức trở thành đối tác đào tạo ủy quyền (ATP) của Autodesk...</p>",
        image_url: "https://picsum.photos/seed/partner/800/600",
        author: "Ban Lãnh đạo",
        keywords: "CIC, Autodesk, Đào tạo BIM"
    }
];

const libraryData = [
    {
        title: 'Mẫu Hồ sơ Yêu cầu thông tin (EIR) chuẩn ISO 19650',
        type: 'technical',
        description: 'Template EIR chuẩn giúp Chủ đầu tư xác định rõ các yêu cầu về thông tin, dữ liệu và quy trình phối hợp cho nhà thầu.',
        tag: 'Template',
        image_url: 'https://picsum.photos/seed/doc1/400/300',
        link: '#'
    },
    {
        title: 'Quy trình Phối hợp BIM (BIM Coordination Process)',
        type: 'guide',
        description: 'Sơ đồ quy trình phối hợp đa bộ môn, kiểm soát va chạm và phê duyệt mô hình trên môi trường dữ liệu chung (CDE).',
        tag: 'Quy trình',
        image_url: 'https://picsum.photos/seed/doc2/400/300',
        link: '#'
    },
    {
        title: 'Bộ thư viện Revit Family cửa đi và cửa sổ TCVN',
        type: 'resource',
        description: 'Bộ family cửa thông dụng theo tiêu chuẩn kích thước lỗ ban và TCVN, đầy đủ tham biến (parametric).',
        tag: 'Revit Family',
        image_url: 'https://picsum.photos/seed/doc3/400/300',
        link: '#'
    },
    {
        title: 'Sổ tay hướng dẫn triển khai BIM cho Nhà thầu thi công',
        type: 'guide',
        description: 'Cẩm nang chi tiết về cách sử dụng mô hình BIM để bóc tách khối lượng, lập biện pháp thi công và shop drawing.',
        tag: 'E-book',
        image_url: 'https://picsum.photos/seed/doc4/400/300',
        link: '#'
    },
    {
        title: 'Checklist kiểm tra chất lượng mô hình BIM (QA/QC)',
        type: 'standard',
        description: 'Danh mục các tiêu chí cần kiểm tra để đảm bảo mô hình sạch, đúng tiêu chuẩn và sẵn sàng cho việc trích xuất dữ liệu.',
        tag: 'Checklist',
        image_url: 'https://picsum.photos/seed/doc5/400/300',
        link: '#'
    },
    {
        title: 'Hướng dẫn áp dụng Mô hình thông tin công trình (BIM) cho Chủ đầu tư',
        type: 'featured',
        description: 'Cẩm nang toàn diện giúp Chủ đầu tư hiểu rõ quy trình, lợi ích và cách thức triển khai BIM hiệu quả trong các dự án đầu tư xây dựng, từ giai đoạn chuẩn bị dự án đến vận hành khai thác.',
        tag: 'Must Read',
        image_url: 'https://picsum.photos/seed/feature1/800/600',
        link: '#'
    },
    {
        title: 'Infographic: Quy trình thẩm định hồ sơ thiết kế BIM',
        type: 'infographic',
        description: 'Sơ đồ hóa quy trình thẩm định hồ sơ thiết kế cơ sở và thiết kế kỹ thuật thi công có áp dụng BIM theo quy định mới nhất.',
        tag: 'Infographic',
        image_url: 'https://picsum.photos/seed/info1/600/400',
        link: '#'
    },
    {
        title: 'Infographic: Lộ trình áp dụng BIM theo Quyết định 258',
        type: 'infographic',
        description: 'Tóm tắt lộ trình áp dụng BIM bắt buộc đối với từng loại công trình và nguồn vốn theo Quyết định 258/QĐ-TTg.',
        tag: 'Lộ trình',
        image_url: 'https://picsum.photos/seed/info2/600/400',
        link: '#'
    }
];

const toolsData = [
    {
        title: "CIC BIM Viewer",
        description: "Xem mô hình 3D trực tuyến, đo đạc và cắt lớp không cần cài đặt phần mềm.",
        icon: "View3D", // Icon component name
        link: "/tools/viewer"
    },
    {
        title: "BIM Cost Estimator",
        description: "Công cụ ước tính chi phí sơ bộ dựa trên diện tích sàn và loại công trình.",
        icon: "Calculator",
        link: "/tools/estimator"
    },
    {
        title: "IFC Converter",
        description: "Chuyển đổi định dạng file IFC sang các định dạng web-ready (GLB, OBJ).",
        icon: "RefreshCw",
        link: "/tools/converter"
    },
    {
        title: "TCVN Lookup AI",
        description: "Tra cứu nhanh Tiêu chuẩn Việt Nam bằng trí tuệ nhân tạo.",
        icon: "Search",
        link: "/tools/lookup"
    },
    {
        title: "Clash Report Generator",
        description: "Tạo báo cáo va chạm tự động từ file XML của Navisworks.",
        icon: "FileText",
        link: "/tools/clash-report"
    }
];

async function seedData() {
    if (!supabase) {
        console.error("❌ Cannot seed: Supabase client not initialized.");
        process.exit(1);
    }

    console.log("🌱 Starting Data Seed...");

    // 1. Seed News
    const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });

    // Always refresh news to fix broken images
    console.log("Cleaning up existing News...");
    await supabase.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    console.log("Creating News articles...");
    const { error } = await supabase.from('news').insert(newsData);
    if (error) console.error("Error seeding news:", error);
    else console.log("✅ News seeded successfully.");

    // 2. Seed Library
    const { count: libCount } = await supabase.from('library').select('*', { count: 'exact', head: true });
    if (libCount < 10) {
        console.log("Creating Library items...");
        const { error } = await supabase.from('library').insert(libraryData);
        if (error) console.error("Error seeding library:", error);
        else console.log("✅ Library seeded successfully.");
    } else {
        console.log(`ℹ️ Library table already has ${libCount} items. Skipping.`);
    }

    // 3. Seed Tools
    const { count: toolsCount } = await supabase.from('tools').select('*', { count: 'exact', head: true });
    if (toolsCount === 0) {
        console.log("Creating Tools...");
        const { error } = await supabase.from('tools').insert(toolsData);
        if (error) console.error("Error seeding tools:", error);
        else console.log("✅ Tools seeded successfully.");
    } else {
        console.log(`ℹ️ Tools table already has ${toolsCount} items. Skipping.`);
    }

    console.log("✨ Seeding process completed!");
}

seedData();
