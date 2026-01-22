-- =====================================================
-- BỔ SUNG DỮ LIỆU MẪU CHO THÁCH THỨC, GIẢI PHÁP, KẾT QUẢ
-- Cập nhật cho tất cả 28 dự án BIM
-- =====================================================
-- Date: 2026-01-22
-- Purpose: Add professional Challenge, Solution, Result content
-- =====================================================

-- 1. Bệnh viện Bãi Cháy
UPDATE projects 
SET 
  challenge = 'Thiết kế phức tạp với nhiều hệ thống MEP chồng chéo, yêu cầu cao về tiêu chuẩn y tế và vô trùng. Quản lý hơn 15,000 bộ phận trong mô hình BIM.',
  solution = 'Áp dụng quy trình BIM 5D kết hợp Clash Detection để phát hiện và giải quyết 850+ xung đột thiết kế trước thi công. Sử dụng Revit MEP cho hệ thống kỹ thuật phức tạp.',
  result = 'Giảm 30% thời gian thi công, tiết kiệm 15% chi phí nhờ phát hiện sớm các lỗi thiết kế. Bàn giao mô hình As-built đầy đủ cho vận hành bảo trì.'
WHERE name LIKE '%Bệnh viện Bãi Cháy%';

-- 2. K8 - CT1 - Khu vực Trung tâm KĐT Tây Hồ Tây
UPDATE projects 
SET 
  challenge = 'Dự án quy mô lớn với nhiều block chung cư cao tầng, yêu cầu phối hợp chặt chẽ giữa 8 đơn vị thi công. Quản lý tiến độ và chất lượng là thách thức lớn.',
  solution = 'Triển khai BIM 4D (3D + Time) để quản lý tiến độ thi công từng giai đoạn. Sử dụng Common Data Environment (CDE) trên Autodesk Construction Cloud để phối hợp đa bên.',
  result = 'Rút ngắn 4 tháng so với kế hoạch ban đầu. Giảm 40% số lượng RFI (Request for Information) nhờ mô hình BIM chi tiết. Tăng 25% năng suất thi công.'
WHERE name LIKE '%K8 - CT1%Tây Hồ Tây%';

-- 3. Khu trung tâm KĐT Tây Hồ Tây Ô K2CT1
UPDATE projects 
SET 
  challenge = 'Thiết kế cảnh quan phức tạp kết hợp với hạ tầng kỹ thuật ngầm (cấp thoát nước, điện, viễn thông). Cần đảm bảo tính liên kết giữa các công trình.',
  solution = 'Xây dựng mô hình BIM tích hợp từ quy hoạch đến thiết kế kỹ thuật. Sử dụng Infraworks cho hạ tầng và Revit cho kiến trúc, với Navisworks để tích hợp.',
  result = 'Phát hiện và xử lý 600+ xung đột hệ thống hạ tầng ngầm trước khi khởi công. Tiết kiệm 20% chi phí đào đắp nhờ tối ưu hóa tuyến ống.'
WHERE name LIKE '%K2CT1%';

-- 4. Hệ thống thoát nước & xử lý nước thải TP Sơn La
UPDATE projects 
SET 
  challenge = 'Địa hình đồi núi phức tạp, hệ thống thoát nước dài hơn 50km với nhiều độ dốc khác nhau. Yêu cầu tính toán thủy lực chính xác cao.',
  solution = 'Sử dụng Civil 3D kết hợp GIS để thiết kế tuyến ống tối ưu theo địa hình. Mô phỏng thủy lực 3D để đảm bảo lưu lượng và áp suất phù hợp.',
  result = 'Giảm 35% khối lượng đào đắp nhờ tối ưu tuyến. Phát hiện 12 điểm nghẽn tiềm ẩn và điều chỉnh thiết kế trước thi công. Tiết kiệm 18% tổng chi phí đầu tư.'
WHERE name LIKE '%thoát nước%Sơn La%';

-- 5. Khu nhà ở và Vui chơi giải trí Tư Đình
UPDATE projects 
SET 
  challenge = 'Kết hợp đa chức năng (nhà ở, thương mại, giải trí) trong cùng một khu phức hợp. Yêu cầu cao về thiết kế kiến trúc và hệ thống PCCC.',
  solution = 'Áp dụng BIM từ giai đoạn concept design, phối hợp 5 chuyên ngành (kiến trúc, kết cấu, MEP, PCCC, cảnh quan). Sử dụng Autodesk BIM 360 để quản lý.',
  result = 'Phối hợp hiệu quả giữa các chuyên ngành, giảm 50% thời gian họp điều chỉnh thiết kế. Bàn giao đúng tiến độ với 99.5% độ chính xác mô hình As-built.'
WHERE name LIKE '%Tư Đình%';

-- 6. Đại học Cần Thơ
UPDATE projects 
SET 
  challenge = 'Campus quy mô lớn với 12 tòa nhà, yêu cầu thiết kế bền vững và tiết kiệm năng lượng. Quản lý phức tạp do nhiều giai đoạn thi công.',
  solution = 'Xây dựng Digital Twin cho toàn bộ campus, tích hợp mô phỏng năng lượng (Energy Analysis). Sử dụng BIM 4D để lập kế hoạch thi công theo từng giai đoạn.',
  result = 'Giảm 28% tiêu th

ụ năng lượng dự kiến nhờ tối ưu hóa thiết kế. Quản lý tiến độ chính xác, bàn giao đúng hạn 12/12 công trình. Tiết kiệm 22% chi phí vận hành.'
WHERE name LIKE '%Đại học Cần Thơ%';

-- 7. Dự án số 10 - Nhà Xưởng Bình Dương
UPDATE projects 
SET 
  challenge = 'Nhà xưởng công nghiệp quy mô lớn (50,000m²) với hệ thống crane phức tạp. Yêu cầu độ chính xác cao trong lắp dựng kết cấu thép.',
  solution = 'Scan 3D hiện trạng mặt bằng, xây dựng mô hình BIM kết cấu thép chi tiết đến từng bu-lông. Xuất bản vẽ shop drawing tự động từ Tekla Structures.',
  result = 'Độ chính xác lắp dựng đạt ±2mm, không cần gia công hiện trường. Rút ngắn 6 tuần thời gian thi công kết cấu thép. Giảm 12% phế phẩm.'
WHERE name LIKE '%số 10%Nhà Xưởng%';

-- 8. K8 - HH1 Thuộc khu vực trung tâm KĐT Tây Hồ Tây
UPDATE projects 
SET 
  challenge = 'Chung cư cao tầng 40 tầng với thiết kế façade kính phức tạp. Yêu cầu tính toán kết cấu chịu gió và động đất chính xác.',
  solution = 'Tích hợp mô hình BIM với phần mềm phân tích kết cấu (ETABS). Mô phỏng CFD (Computational Fluid Dynamics) cho façade. Sử dụng BIM 5D để quản lý chi phí.',
  result = 'Tối ưu 15% thép kết cấu nhờ phân tích chính xác. Phát hiện 200+ xung đột MEP-kết cấu trước thi công. Tiết kiệm 18% tổng chi phí dự án.'
WHERE name LIKE '%HH1%Tây Hồ Tây%';

-- 9. Dự án Nhà ở xã hội Hà Nội
UPDATE projects 
SET 
  challenge = 'Dự án quy mô lớn (2000 căn hộ) với yêu cầu tiết kiệm chi phí tối đa. Áp lực tiến độ cao do nhu cầu nhà ở cấp thiết.',
  solution = 'Áp dụng BIM kết hợp Lean Construction để loại bỏ lãng phí. Standardize thiết kế và sử dụng Prefab cho 70% cấu kiện bê tông.',
  result = 'Giảm 25% thời gian thi công nhờ prefabrication. Tiết kiệm 30% chi phí nhân công. Đảm bảo chất lượng đồng nhất cho 2000 căn hộ.'
WHERE name LIKE '%Nhà ở xã hội%Hà Nội%';

-- 10. Lotte Eco Smart city Thủ Thiêm số 2-4
UPDATE projects 
SET 
  challenge = 'Dự án mixed-use cao cấp với yêu cầu thiết kế bền vững (LEED Gold). Hệ thống MEP thông minh phức tạp (BMS, Smart Home).',
  solution = 'Xây dựng BIM model tích hợp IoT sensors để mô phỏng vận hành. Sử dụng Energy Analysis để đạt chứng chỉ LEED. BIM 6D cho facility management.',
  result = 'Đạt chứng chỉ LEED Gold với 85 điểm. Giảm 40% tiêu thụ năng lượng so với tiêu chuẩn. Bàn giao Digital Twin để vận hành thông minh.'
WHERE name LIKE '%Lotte%2-4%';

-- 11. Dự án số 8 - Nhà Xưởng Bình Dương
UPDATE projects 
SET 
  challenge = 'Nhà xưởng logistics hiện đại với hệ thống tự động hóa (AGV, conveyor). Yêu cầu phối hợp chặt chẽ giữa kiến trúc và thiết bị.',
  solution = 'Mô hình BIM 3D tích hợp thiết bị cơ điện chi tiết. Mô phỏng động học (kinematic simulation) để kiểm tra không gian vận hành AGV.',
  result = 'Zero collision giữa thiết bị và kết cấu công trình. Tối ưu 20% diện tích kho nhờ bố trí hợp lý. Rút ngắn 8 tuần commissioning.'
WHERE name LIKE '%số 8%Nhà Xưởng%';

-- 12. Khu lưu trữ TP Đà Nẵng
UPDATE projects 
SET 
  challenge = 'Công trình đặc thù với yêu cầu khắt khe về nhiệt độ, độ ẩm, PCCC. Hệ thống HVAC và lưu trữ tài liệu phức tạp.',
  solution = 'Sử dụng BIM để thiết kế hệ thống HVAC tối ưu, đảm bảo nhiệt độ ±1°C. CFD simulation để kiểm tra phân bố nhiệt độ không khí.',
  result = 'Đạt tiêu chuẩn lưu trữ quốc gia với nhiệt độ đồng nhất 99.8% thời gian. Tiết kiệm 35% chi phí điện năng làm mát. Zero sự cố PCCC sau 2 năm vận hành.'
WHERE name LIKE '%lưu trữ%Đà Nẵng%';

-- 13. Bệnh viện Đa khoa Củ Chi
UPDATE projects 
SET 
  challenge = 'Bệnh viện đa khoa cấp 2 với 500 giường, thiết kế theo tiêu chuẩn JCI. Hệ thống khí y tế (oxygen, vacuum) phức tạp.',
  solution = 'BIM MEP chi tiết cho khí y tế, cấp thoát nước vô trùng. Clash detection giữa 6 hệ thống MEP. Mô phỏng áp suất và lưu lượng khí.',
  result = 'Đạt tiêu chuẩn JCI ngay lần đánh giá đầu tiên. Giảm 90% số lỗi thi công MEP. Tiết kiệm 25% thời gian commissioning hệ thống.'
WHERE name LIKE '%Củ Chi%';

-- 14. KCN Thuận Thành I - Bắc Ninh
UPDATE projects 
SET 
  challenge = 'Khu công nghiệp 500ha với hạ tầng phức tạp (đường, điện, nước, viễn thông). Quản lý nhiều nhà thầu thi công đồng thời.',
  solution = 'Xây dựng BIM master plan tích hợp tất cả hạ tầng. Sử dụng GIS + BIM để quản lý tài sản. CDE trên BIM 360 để phối hợp đa bên.',
  result = 'Quản lý hiệu quả 12 nhà thầu đồng thời. Giảm 45% thời gian phối hợp thiết kế - thi công. Bàn giao bản đồ số As-built đầy đủ.'
WHERE name LIKE '%KCN Thuận Thành%';

-- 15. Trung tâm Nghiên cứu Tiên Tiến - ĐH Quốc Gia HCM
UPDATE projects 
SET 
  challenge = 'Công trình lab nghiên cứu đặc biệt với phòng sạch cấp 100, hệ thống điều hòa precision. Yêu cầu kỹ thuật cao nhất Việt Nam.',
  solution = 'BIM kết hợp với CEA (Computational Environment Analysis) để mô phỏng môi trường phòng sạch. Coordination MEP - kết cấu - kiến trúc ở độ chi tiết LOD 500.',
  result = 'Đạt tiêu chuẩn phòng sạch ISO Class 5. Zero rework trong thi công MEP. Bàn giao mô hình BIM 6D cho facility management.'
WHERE name LIKE '%Nghiên cứu Tiên Tiến%';

-- 16. Bệnh viện Nhân dân Gia Định
UPDATE projects 
SET 
  challenge = 'Cải tạo và mở rộng bệnh viện đang vận hành, không được gián đoạn hoạt động khám chữa bệnh. Phối hợp phức tạp giữa cũ và mới.',
  solution = 'Scan 3D toàn bộ công trình hiện trạng, xây dựng BIM as-is model. Lập kế hoạch thi công 4D với pha phân vùng thi công không ảnh hưởng vận hành.',
  result = 'Hoàn thành dự án mà không gián đoạn hoạt động bệnh viện. 100% độ chính xác kết nối cũ - mới. Tiết kiệm 30% thời gian so với phương pháp truyền thống.'
WHERE name LIKE '%Gia Định%';

-- 17. Bệnh viện tim Hà Nội (cơ sở 2)
UPDATE projects 
SET 
  challenge = 'Bệnh viện tim chuyên sâu với phòng mổ hybrid, yêu cầu cực kỳ cao về hệ thống khí y tế và điện y tế (UPS, IT system).',
  solution = 'BIM MEP chi tiết LOD 400 cho khí y tế và điện y tế. Mô phỏng CFD cho phòng mổ. Tích hợp BIM với thiết bị y tế (CT, MRI) để kiểm tra kích thước.',
  result = 'Đạt tiêu chuẩn phòng mổ quốc tế (Laminar Flow). Zero downtime điện y tế sau 3 năm vận hành. Giảm 40% thời gian lắp đặt thiết bị.'
WHERE name LIKE '%tim Hà Nội%';

-- 18. Lotte Eco Smart city Thủ Thiêm số 2-6
UPDATE projects 
SET 
  challenge = 'Tòa tháp cao tầng 50 tầng với thiết kế biểu tượng. Yêu cầu tính toán gió và động đất chính xác, façade kính phức tạp.',
  solution = 'Parametric BIM cho thiết kế façade phức tạp. Tích hợp phân tích kết cấu (SAP2000) và CFD. BIM 5D để kiểm soát chi phí từng giai đoạn.',
  result = 'Tối ưu 18% khối lượng thép kết cấu. Giảm 25% chi phí façade nhờ tối ưu hóa thiết kế. Hoàn thành đúng tiến độ với 0% cost overrun.'
WHERE name LIKE '%Lotte%2-6%';

-- 19. Dự án Kè Nậm La
UPDATE projects 
SET 
  challenge = 'Công trình thủy lợi trên địa hình núi cao hiểm trở. Khó khăn trong khảo sát địa hình và thiết kế kết cấu chống sạt lở.',
  solution = 'Sử dụng drone photogrammetry và LiDAR để tạo bản đồ 3D chi tiết. Civil 3D để thiết kế kè và tính toán ổn định. BIM 4D cho kế hoạch thi công.',
  result = 'Giảm 60% thời gian khảo sát địa hình. Phát hiện 8 điểm sạt lở tiềm ẩn và gia cố trước thi công. Tiết kiệm 22% khối lượng bê tông.'
WHERE name LIKE '%Kè Nậm La%';

-- 20. Đường Xô Viết Nghệ Tĩnh kéo dài về phía Đông
UPDATE projects 
SET 
  challenge = 'Dự án hạ tầng giao thông quy mô lớn (12km) đi qua nhiều địa phương, nhiều loại địa hình khác nhau. Quản lý giải phóng mặt bằng phức tạp.',
  solution = 'GIS + BIM để quản lý toàn tuyến, tích hợp thông tin giải phóng mặt bằng. Civil 3D cho thiết kế đường, cầu, hầm. BIM 4D để lập kế hoạch thi công.',
  result = 'Tối ưu tuyến, giảm 15% diện tích giải phóng mặt bằng. Rút ngắn 10 tháng thời gian thi công. Tiết kiệm 28% khối lượng đào đắp.'
WHERE name LIKE '%Xô Viết Nghệ Tĩnh%';

-- 21-28. Các dự án test và còn lại
UPDATE projects 
SET 
  challenge = 'Dự án mẫu cần thách thức cụ thể về thiết kế, thi công hoặc quản lý để thể hiện năng lực BIM và Digital Twin của CIC Platform.',
  solution = 'Áp dụng quy trình BIM toàn diện từ thiết kế đến thi công. Sử dụng công nghệ tiên tiến (Scan 3D, IoT, AI) để tối ưu hóa quy trình và nâng cao hiệu quả.',
  result = 'Giảm thiểu lỗi thiết kế và rework, tối ưu chi phí và tiến độ. Bàn giao mô hình Digital Twin đầy đủ để phục vụ vận hành và bảo trì công trình.'
WHERE challenge IS NULL OR challenge = '';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check cập nhật thành công
SELECT 
    name AS "Dự án",
    CASE 
        WHEN challenge IS NOT NULL AND challenge != '' THEN '✅' 
        ELSE '❌' 
    END AS "Thách thức",
    CASE 
        WHEN solution IS NOT NULL AND solution != '' THEN '✅' 
        ELSE '❌' 
    END AS "Giải pháp",
    CASE 
        WHEN result IS NOT NULL AND result != '' THEN '✅' 
        ELSE '❌' 
    END AS "Kết quả"
FROM projects
ORDER BY name;

-- Count dự án đã cập nhật
SELECT 
    COUNT(*) AS "Tổng số dự án",
    COUNT(CASE WHEN challenge IS NOT NULL AND challenge != '' THEN 1 END) AS "Có thách thức",
    COUNT(CASE WHEN solution IS NOT NULL AND solution != '' THEN 1 END) AS "Có giải pháp",
    COUNT(CASE WHEN result IS NOT NULL AND result != '' THEN 1 END) AS "Có kết quả"
FROM projects;
