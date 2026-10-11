# Rà soát mới toàn bộ Topic 5 và Topic 6 — bản đóng băng

Ngày: 2026-10-11. **Trạng thái: đóng 300/300 bản ghi; không còn cờ P1 được phát hiện trong phạm vi rà soát.** Đây là chấp nhận biên tập và đối chiếu nguồn của các tác nhân AI, không phải chứng nhận chuyên gia lâm sàng hay hiệu chuẩn độ khó bằng dữ liệu người học.

| Phạm vi | Tổng | Mức 1 | Mức 2 | Mức 3 | Mức 4 | Câu có ảnh |
|---|---:|---:|---:|---:|---:|---:|
| Topic 5 | 150 | 15 | 15 | 60 | 60 | 0 |
| Topic 6 | 150 | 15 | 15 | 60 | 60 | 0 |
| Cả hai | 300 | 30 | 30 | 120 | 120 | 0 |

Không thay số câu hoặc gán lại mức chỉ để giữ ma trận. Các câu mức 3 được rà theo yêu cầu diễn giải hoặc quyết định từ dữ kiện thực; mức 4 theo quan hệ giữa các ràng buộc, ngoại lệ, mục tiêu hoặc giới hạn bằng chứng độc lập. Những câu chỉ nhắc quy tắc, mốc hay tên kỹ thuật được thay nội dung hoặc thiết kế lại nhiệm vụ trong chính ID đang có.

## Bản được chấp nhận

- `topic5.json`, SHA-256 tệp: `c9953853f6867fe64ae79d86c86156ef5f5ea9ad62b612aa38e224177f231bb7`.
- `topic6.json`, SHA-256 tệp: `e563da5aa8ae1b342385943349ddcd71f3e8db4ea0aec4aad7208e26582cde07`.
- Sổ mới `reaudit-5-6.json` có một entry cho từng ID, `status: closed`, `fullRecordRead: true`, thao tác tư duy thực, mức trước/sau, các thay đổi, lịch sử ứng viên trùng và kết luận, từng tham chiếu đã kiểm cùng điều kiện áp dụng, và `questionSha256` của bản cuối.
- Hash từng câu được tính bằng Node.js: SHA-256 trên UTF-8 của `JSON.stringify` bản ghi JSON đã phân tích, giữ thứ tự thuộc tính. Hash tệp dùng byte tệp thực. Hash là ràng buộc tính toàn vẹn của bản đã đọc, không chứng minh chất lượng y học.

## Phạm vi đọc và cách đối chiếu

Đã đọc mới đủ 300 bản ghi: prompt, tình huống, nhiệm vụ, bốn phương án, chỉ số đáp án, giải thích chung, đủ bốn lý do lựa chọn và mọi tham chiếu. Các phần từng bị cắt trong đầu ra được đọc bù; không dùng kết luận chấp nhận của vòng trước để thay lần đọc này. Sau khi sửa, bản nội dung cuối và các nhóm bị gắn cờ được đọc lại. Với T6-001–060, root thực hiện phần sửa và đọc nguồn; tôi đọc chéo độc lập đủ 60 bản cuối và nhập điều kiện nguồn cụ thể từ `reaudit-root-t6-1-60.json`. Bản T6-116–150 sau chỉnh hiển thị của root cũng được đọc lại toàn bộ trước đóng băng.

Sổ ghi **410 lượt tham chiếu nguồn trong 300 câu**, liên quan **28 PDF và 90 trang vật lý PDF khác nhau**, cùng các khuyến cáo gốc chính thức trên web. Số này là lượt tham chiếu, không phải 410 tài liệu độc lập. Đã kiểm lại đường dẫn và khoảng trang; số trang lưu là trang vật lý PDF. Các trang và ngữ cảnh liên quan được đọc để kiểm điều kiện, không chỉ dò chuỗi evidence. Hash văn bản trích xuất trang trong sổ giúp xác định trang, không thay đánh giá nguồn.

Các nguồn quản lý nhạy phiên bản được kiểm ở phần khuyến cáo/bảng/ngoại lệ gốc: ASCCP 2019 công bố 2020 và cập nhật đến 2023; ECC 2023; dual stain 2024; extended genotyping và non-HIV immunosuppression 2025; advisory self-collection 10/2025; CDC U.S. SPR/MEC 2024; WHO Abortion care guideline 2022; ASRM tubal surgery 2021; ACOG telehealth 10/2025. Khi truy cập trực tiếp PMC/ACOG thất bại, đã đọc đoạn khuyến cáo gốc được lập chỉ mục từ chính nguồn đó; không tuyên bố tái kiểm mọi nghiên cứu nền.

Tài liệu giảng dạy trong thư mục và bản FSRH 2015 sửa 2019/EC 2017 sửa 2020/sơ đồ CHC 2020 được ghi đúng phạm vi và phiên bản. WHO 2022 trong câu không được gọi là đồng thuận của mọi tổ chức hoặc quy định Việt Nam mới nhất. Advisory self-collection 10/2025 không được gọi là danh sách chấp thuận đầy đủ tháng 10/2026. IARC ở T5-034 chỉ hỗ trợ định nghĩa xâm lấn qua màng đáy; không dùng phân giai đoạn, tỷ lệ hay điều trị lịch sử của chương đó để chỉ dẫn hiện hành.

## Các chùm nội dung đã xử lý

- T5-034/035 thay mục tiêu lặp độ dày CIN bằng ranh giới xâm lấn và thuật ngữ AGC. Nguồn 034 chuyển sang đoạn IARC đúng định nghĩa; 035 chuyển đúng ASCCP trang vật lý 12, tránh lấy handout cũ chỉ ghi AGUS.
- T5-053/063 tách rõ xét nghiệm HPV nguy cơ thấp không phải primary screening và NILM đủ mẫu nhưng thiếu thành phần vùng chuyển tiếp. 063 hỏi HPV được **ưu tiên** khi từ 30 tuổi, HPV chưa rõ; tế bào học sau ba năm vẫn là lựa chọn chấp nhận được, không bị gọi là sai tuyệt đối.
- Nhóm T5-074–079/091–095 không còn dàn câu chỉ đổi số để áp một ngưỡng: các mục tiêu còn lại chuyển sang specimen AIS, tính liên tục mẫu, surveillance thực đã hoàn tất, kỹ thuật ECC, khả năng quan sát và ngoại lệ có điều kiện. Ngưỡng nguy cơ được giữ ở những nhiệm vụ khác nhau thật sự cần phân biệt thời hạn/nguy cơ và lịch sử; không dùng khác đáp án làm bằng chứng duy nhất rằng khác ý.
- T5-058 thay trùng lịch giám sát 25 năm bằng CIN1 kéo dài ít nhất hai năm, phân biệt quan sát được ưu tiên với điều trị có thể chấp nhận theo lựa chọn người bệnh. T5-106/108/109/114/118/120 thay các thao tác trùng cũ bằng nhánh dual stain hoặc extended genotyping có giới hạn quần thể, xét nghiệm và lịch sử thực.
- T5-122 phân hai ca HSIL sau một năm và ASC-H sau hai năm đã đánh giá mô đầy đủ; 123 đổi sang chỉ định soi trước đó chưa được thực hiện; 130 đổi sang quần thể ESRD/thainghén và quy tắc ECC; 131 phân biệt HPV-alone với cotest trong quan sát CIN2. Root đọc đủ bốn lựa chọn/lý do của các bản cuối và đóng các cờ này.
- Các bản T5-071/074 từng được phát hiện giải thích/phương án không khớp tình huống trong quá trình sửa đã được trả về đúng nhiệm vụ, đọc lại bốn lựa chọn và bốn lý do trước hash: 071 là lịch sử Pap đơn thuần; 074 là nguy cơ năm năm 0,10%. Không giữ đoạn giải thích ghép nhầm.
- T6-011 thay mục tiêu tuyển mộ nang/GnRH trùng Topic 1 bằng chiều tác động PTEN PIP3→PIP2 từ tài liệu Y3. T6-014/034 và các nhóm LNG-IUD/bleeding/Pap-STI cũng được tách thao tác qua nội dung mới, không chỉ thay tuổi.
- T6-030/031 được giữ với chế phẩm khác nhau: khoảng 28 giờ 30 với POP cổ điển vượt cửa sổ 27 giờ; desogestrel 33 giờ vẫn trong cửa sổ 36 giờ. Điểm cần học là phải xác định **chế phẩm** trước dùng ngưỡng, không áp một cửa sổ cho tất cả POP. T6-025 kiểm phạm vi sơ đồ EE đơn pha 21/7 và xử trí HFI; T6-099 phân hai kế hoạch COC cuối vỉ và POP cổ điển có phơi nhiễm thực sau quên.
- T6-099 đã sửa điều kiện EC thực chất: giao hợp của B xảy ra **sau** viên quên và trong 48 giờ sau bắt đầu lại, đúng đoạn FSRH đầy đủ. Không dùng giao hợp còn được bảo vệ trước viên quên để kết luận EC. A không có giao hợp gần đây nên không gán EC không có căn cứ.
- T6-073 chuyển hẳn khỏi lựa chọn phương pháp hồi phục/future fertility trùng 140 sang đánh giá thông vòi sau nối bảy tháng chưa có thai, với tinh dịch đã khảo sát; ASRM gợi ý đánh giá sau sáu tháng đã kiểm. T6-076 thay overlap quick-start bằng đại phẫu **kèm bất động kéo dài**: DMPA 2, CHC 4, ENG/POP 1; không xóa mức bất định bằng chứng của DMPA.
- T6-120 khác T2-113 ở người bệnh muốn tháo IUD: bắt đầu kháng sinh trước tháo, xét phơi nhiễm gần đây/EC phù hợp và thời điểm phương pháp chuyển tiếp. Các nhóm có thai với IUD được chuyển sang các nhiệm vụ khác nhau thay vì lặp dây hiện/không hiện. T6-122 giới hạn WHO 2022 dưới 12 tuần và làm rõ bất định tuổi thai; câu trả lời cuối ghi không cần anti-D theo khuyến cáo, không biến khuyến cáo thành chống chỉ định tuyệt đối.
- T6-130 dùng bốn tuần hậu sản và khoảng 60% cữ bú mẹ: không thỏa nearly-full LAM, nhiễm hậu sản cấm khởi đầu IUD, và nguồn WHO 2015 trong thư mục nêu trì hoãn triệt sản; kế hoạch bridge được kiểm riêng về thời gian/bảo vệ bổ sung. Không dùng nguồn CDC về sepsis để giả chứng minh phân loại thủ thuật WHO lịch sử.

Root đã đọc chéo tất cả 60 câu mức 4 Topic 5, các nhóm mức 3 có nguy cơ trùng/nhiễu xa, các thay thế Topic 6 trọng yếu và cả 35 câu display cuối. Các cờ được chuyển trực tiếp và đóng theo bản đã sửa. Không tuyên bố root đọc lại độc lập từng câu trong toàn bộ 240 bản do tôi phụ trách; phạm vi chính xác nằm trong sổ từng ID và các dấu peer.

## Mức thay đổi và giới hạn

So với baseline của lần yêu cầu rà soát này, có **282/300 ID** đổi ít nhất một trường nội dung/mục tiêu/nguồn: 277 bộ phương án, 279 bộ lý do, 202 nhiệm vụ, 176 tình huống và 183 bộ tham chiếu. Chỉ số đáp án đổi ở 150 câu do thiết kế/sắp lại phương án; con số này **không có nghĩa** từng ấy đáp án y học baseline đều sai. Không đổi nhãn mức.

Mỗi phương án có lý do gắn với điều kiện hoặc sai lầm diễn giải riêng, không dùng mẫu chung lặp đáp án đúng để bác cả ba nhiễu. Các lựa chọn quá xa được chỉnh trong các lượt sửa; vẫn có thể còn câu dễ hơn và phương án đúng dài hơn mong muốn. Không có dữ liệu làm bài để định lượng discrimination, độ khó thực hoặc độ tin cậy tâm trắc. Những đánh giá mức 3/4 và sự khác biệt mục tiêu là phán đoán biên tập được ghi cụ thể, không phải chỉ số tự động chứng nhận chất lượng.

Cả hai topic không có hình; các nhiệm vụ quản lý/giải thích chữ không yêu cầu suy hình ảnh chưa được cung cấp. Yêu cầu tình huống lâm sàng + ảnh thật + nhiệm vụ cho mọi câu diễn giải hình ảnh được root kiểm riêng ở các topic có ảnh. Không sao chép PDF riêng tư vào phần public.
