# Rà soát mới toàn bộ Topic 1 và Topic 2

**CLOSED — 326/326 bản ghi đã đọc đầy đủ và đóng. Hai JSON nội dung đã FREEZE; không còn P1 xác định đang mở trong phạm vi cặp này. Ledger đã bind hash Node cho đúng 326 bản ghi cuối.**

Đây là vòng đọc mới theo yêu cầu rà lại toàn bộ ngân hàng. Hai tệp `topic1.json` và `topic2.json` hiện tại là bản chính; không chạy lại author/revision script cũ và không lấy trạng thái nghiệm thu cũ làm chứng cứ. Mỗi ID có một bản ghi trong `reaudit-1-2.json`, gồm mục tiêu, thao tác nhận thức thực, đánh giá quan hệ trùng ý, từng nguồn/điều kiện áp dụng, mức trước/sau, ảnh nếu có, phát hiện, sửa và trạng thái cuối.

## Phạm vi đã đọc và số lượng

Đã đọc độc lập từng bản ghi gồm prompt, bệnh cảnh, nhiệm vụ, cả bốn lựa chọn, khóa đáp án, giải thích chung, cả bốn lý do lựa chọn và toàn bộ trường nguồn/provenance. Đã đối chiếu ngữ cảnh trang PDF gốc trong thư mục; các liều, điều kiện đặc biệt hoặc kết luận cần làm rõ được đối chiếu thêm nguồn sơ cấp chính thức. Phạm vi tác giả là 326 câu của cặp này. Đối chiếu xuyên sáu topic được root phụ trách; các chùm có Topic 1/2 liên quan đã được đọc lại và ghi quan hệ cụ thể trong ledger.

| Tệp | Tổng | Mức 1 | Mức 2 | Mức 3 | Mức 4 | Câu có ảnh |
|---|---:|---:|---:|---:|---:|---:|
| Topic 1 | 163 | 25 | 17 | 61 | 60 | 20 |
| Topic 2 | 163 | 25 | 18 | 60 | 60 | 0 |
| Cặp 1/2 | 326 | 50 | 35 | 121 | 120 | 20 |

Không thêm hoặc bỏ ID. Sáu câu T1-016/017/019/020/021/023 và năm câu T2-016/018/021/024/027 đã hạ từ mức 2 về mức 1 vì thao tác thực chỉ là nhớ dữ kiện. Giữ ít nhất 60 mức 3 và 60 mức 4 mỗi topic bằng viết lại nội dung có dữ kiện chi phối quyết định; không tăng nhãn để bù số.

So với snapshot ngay trước vòng mới, Topic 1 có 127 bản ghi đổi ít nhất một trường, trong đó 88 prompt, 112 bộ lựa chọn, 114 bộ lý do và 67 bộ nguồn khác snapshot. Topic 2 có 123 bản ghi đổi trường, trong đó 25 prompt, 120 bộ lựa chọn/lý do và 24 bộ nguồn khác snapshot. Các số này đo khác biệt tệp, gồm cả sửa chữ và sắp lựa chọn; không phải số câu từng có đáp án y khoa sai. Topic 1 có 31 khóa chỉ số đổi theo bộ lựa chọn mới, Topic 2 giữ chỉ số nhưng một số nội dung lựa chọn đúng đã thay để sửa điều kiện áp dụng.

## Các nhóm nội dung đã sửa

Các câu mức 3 được yêu cầu dùng dữ kiện mới của ca để quyết định hoặc diễn giải. Ví dụ T1-041/042/043/045/048/052/067 và 080/084/086/091 đã chuyển khỏi hỏi cơ chế, tên nhánh, mục đích xét nghiệm hoặc danh sách điều kiện đơn thuần. Dữ liệu như pha lấy progesterone, thiếu năng lượng, đáp ứng điều trị, nguy cơ nội mạc, hCG nối tiếp và khả năng theo dõi thực sự ảnh hưởng lựa chọn. T2-038/059/065 được đọc lại ở dạng quyết định xét nghiệm, giới hạn chứng cứ LNG-IUD và giả thuyết viêm quanh gan cần đánh giá; không gọi cơ chế ghi nhớ là mức 3 chỉ vì thêm tuổi.

Các ca mức 4 của Topic 1 đã tách các ràng buộc thực: bệnh cầm máu với hồi sức dịch, tổn thương khu trú với bảo tồn sinh sản, dữ kiện hình với lấy mẫu, đáp ứng EIN với thời gian và nhu cầu sinh sản, diễn tiến hCG với an toàn MTX hoặc khả năng theo dõi, bằng chứng lịch sử với phạm vi suy luận. Các câu ảnh cũng đã thay thao tác chỉ nói “ảnh chưa đủ” bằng quyết định có hai nguồn thông tin hoặc điều kiện độc lập. Bốn ca T1-116/119/139/146 được root viết lại và tác giả đọc chéo; T1-130 được root đọc chéo sau sửa bài toán PUL sau hút và chống chỉ định thận. Năm ca 100/103/120/142/143 được tái tạo thêm ở lượt đọc cuối vì bản trước còn thiên một quy tắc và đã được root đọc chéo bốn lựa chọn, bốn lý do cùng điều kiện nguồn. T1-103 tích hợp diễn tiến sau điều chỉnh thuốc, nguy cơ nội mạc và thất bại điều trị thay chỉ ghép hai hệ phân loại.

Topic 2 có 23 ca mức 4 tái tạo đầy đủ: T2-094/102/105/106/109/113/115/116/117/118/119/128/129/130/132/133/134/135/136/139/140/141/147. Root đã đọc chéo cả bốn lựa chọn, bốn lý do và nguồn của các ca này. Chúng phân biệt hai nơi điều trị, hai giai đoạn liệu trình, đường dùng riêng với chuyển toàn phác đồ, căn nguyên cùng tồn tại, hai khả năng theo dõi, khác quần thể/HIV/thai kỳ, hoặc khả năng so xét nghiệm. Các 37 ca mức 4 còn lại đã được đọc đủ và thay nhiễu gần đáp án khi cần; bộ mức 3 và lý do ở mức nền cũng được đọc mới. Không dùng ba lựa chọn phi lý và một đoạn dài chứa mọi nguyên tắc để thay cho phân tích bệnh cảnh.

Một lỗi điều kiện có ý nghĩa đã sửa tại **T2-105**: ca nêu sốt miệng 38,6°C nhưng kế hoạch trước bỏ tiêu chí nhập viện trên 38,5°C của CDC. Bản mới kết hợp nơi điều trị với phổ tác nhân PID, kể cả NAAT cổ tử cung âm. Các giới hạn được đọc lại gồm xác nhận Trichomonas trước xử lý NAAT tái dương, không gọi Candida là virus, không đảo PCR/cấy với chứng cứ gây triệu chứng, không dùng TP-PA làm thước định lượng đáp ứng, và không dùng hiệu giá/CD4 đơn độc thay khám thần kinh để chỉ định CSF.

Nhiễu được giải thích riêng theo sai sót cụ thể về thời gian, quần thể, đường thuốc, điều kiện theo dõi hoặc phương pháp xét nghiệm. Lượt cuối thay thêm 39 nhiễu/lý do của 14 câu ảnh T1-144/145/148/149/150/151/153/154/156/157/158/159/161/163. Lý do của lựa chọn đúng có thể ngắn hơn giải thích chung; đã đọc tính nhất quán về ý nghĩa, không buộc hai trường giống từng ký tự.

## Trùng ý và quan hệ xuyên topic

Các quan hệ đã ghi rõ trong từng ID, gồm:

- T1-009 với T6-011: Topic 6 hiện hỏi PTEN/PIP3–PIP2, tách khỏi tự/cận tiết ở chiêu mộ nang. T1-022 với T4-019: phân vai gonadotropin/tế bào khác phân biệt noãn bào với tế bào tùy hành tạo steroid.
- T1-027/028 với T6-014: Topic 6 hiện hỏi hatching, không còn mục tiêu nội mạc estrogen/progesterone.
- T1-077/128 với T4-063/091: 077 xử lý phả hệ chưa xác nhận gene; 128 đã chuyển sang EIN trong tamoxifen; Topic 4 xét cascade khi biến thể đã biết hoặc tuổi/sinh sản trước phẫu thuật giảm nguy cơ.
- Cùng hình `gyn-endo-4`, T1-157 giải quyết nội soi trái siêu âm do bơm căng; T1-158 cân khối giả định 5,5 cm/type 2 với bối cảnh thủ thuật. T3-139/140 hiện nhận diện biến dạng đường giữa hoặc tính tỷ lệ phân FIGO. Giữ cùng caseGroup; không gọi bốn câu là bốn người bệnh độc lập.
- T1-162 đã đổi khỏi PMB/mẫu ít sang đo loại dịch và phân cảnh báo ở người không AUB, tách quyết định của T3-150.
- T2-113 cân HIV/nơi điều trị và giữ Cu-IUD khi đáp ứng; T2-059 nêu giới hạn bằng chứng LNG-IUD. T6-120 đã chuyển sang người muốn tháo, thứ tự kháng sinh trước tháo và tránh thai tiếp theo.

Lượt đối chiếu cuối phát hiện T1-034 vẫn chung lõi lấy mẫu dưới 45 với T1-103 mới. T1-034 đã đổi hoàn toàn sang dùng khám mỏ vịt định vị nguồn chảy máu ở vết rách âm đạo trước khung AUB; root đọc chéo đúng bản cuối và chấp nhận thao tác mức 3 riêng biệt T1-103. Không đổi tuổi để giữ mục tiêu lấy mẫu.

Những câu nền và áp dụng có thể dùng chung một kiến thức, nhưng nhiệm vụ và dữ liệu chi phối phải khác. Kiểm tra câu trùng nguyên văn hoặc tên mục tiêu chỉ là hỗ trợ kỹ thuật; kết luận trùng ý dựa đọc thao tác, không dựa điểm tương đồng hoặc thay số tuổi.

## Đối chiếu nguồn và giới hạn phiên bản

Hiện có **486 source objects**, gồm **442 lượt dẫn file/trang** và **225 lượt URL**; một object có thể có cả hai nên không cộng hai số này thành tổng. Các nguồn địa phương là **32 PDF, 147 cặp file/trang vật lý**; có **23 URL khác nhau**. Mỗi source object có `verified: true`, phương thức đọc và điều kiện áp dụng trong ledger. Kiểm tra excerpt so PDF là hỗ trợ tránh sai trang; việc đúng điều kiện được đọc riêng, không kết luận đáp án đúng chỉ vì đoạn trích có trong PDF.

Các bản địa phương ACOG 2013/2018/2019 và NICE 2019 được đặt trong đúng phiên bản ở câu hỏi. CDC sử dụng khung STI Guidelines 2021; những khác biệt giữa bản PDF và trang chính thức được ghi rõ. Cụ thể:

- **T2-111:** PDF ghi từ 150 kg, trang CDC PID hiện ghi trên 150 kg khi lậu xác nhận. Ca 152 kg và lậu xác nhận đáp ứng cả hai; không tuyên bố hai ngưỡng giống hệt.
- **T2-115:** đã render và xem PDF vật lý 98/trang in 96. Đoạn clindamycin–gentamicin thực in **24–28 hours**, còn phần chuyển uống chung cùng trang là 24–48. [Trang CDC PID](https://www.cdc.gov/std/treatment-guidelines/pid.htm) ghi 24–48 cho đoạn này. Evidence hiện là diễn giải so phiên bản, dùng nguồn web cho mốc trong đáp án; không gọi nhầm khác biệt bản in là lỗi OCR và không sửa âm thầm trích nguyên văn PDF.
- Nhánh quinolone PID trên trang web có cách diễn đạt moxifloxacin khác PDF; không áp nhầm giữa nguồn hoặc suy mọi PID có thể dùng quinolone. T2-106 xét lậu chỉ NAAT, thiếu kháng sinh đồ và cần tham vấn; T2-120 giữ nhánh levofloxacin–metronidazole với đủ điều kiện.
- **T1-116/146:** [NICE NG126 trang cập nhật 2026](https://www.nice.org.uk/guidance/ng126/chapter/management-of-miscarriage) được đọc qua chỉ mục toàn văn sơ cấp khi mở trực tiếp trả 403. Phân biệt khuyến cáo progesterone 2021, phối mifepristone–misoprostol cho sẩy lưu sửa 2023 và nhánh sẩy không trọn; không dùng nội dung NICE 2019 về mifepristone như quy trình hiện hành.
- **T1-119:** dùng [thông báo ACOG chính thức tháng 4/2026](https://www.acog.org/news/news-releases/2026/04/acog-publishes-updated-guidance-evaluation-postmenopausal-bleeding) cho phần lớn PMB ban đầu cần TVUS/mẫu và phần CO734 về ra máu dai dẳng/tái diễn sau mẫu mù lành. Không tuyên bố đã đọc toàn văn Clinical Practice Update 2026 sau tường trả phí.
- EIN theo ACOG 2023, tamoxifen theo CO601 2014, FIGO giai đoạn nội mạc 2023, U.S. MEC 2024, FIGO GTN 2026, ISUOG 2026 và ESGE 2024 được đối chiếu đúng nguồn sơ cấp/điều kiện liên quan. Không mở thêm guideline ngoài phạm vi thư mục/Phụ khoa/nguồn hình được người dùng cho phép để cứu một mục tiêu.

## Toàn bộ câu có ảnh

Đã xem trực quan **20/20 câu ảnh** trên **10 tệp nguồn thật**, đối chiếu caption, hình, giấy phép và bản sao trong `public/images`. Bản sao byte giống nguồn, không sửa pixel. Mọi câu có bệnh cảnh riêng, ảnh thật, nhiệm vụ rõ và trường finding/provenance; dữ kiện khác ca nguồn được ghi rõ giả định. Topic 2 không có ảnh.

Các ảnh `ob-i04/08/09/12/13/14/15.jpg` dùng bài Murugan 2020, CC BY-NC 4.0. Publisher trả 403/PMC captcha trong một số lần mở; đã đọc PDF nguyên bản tác giả 13 trang có trang bìa UMass qua bản sao, đối chiếu caption [PubMed chính thức](https://pubmed.ncbi.nlm.nih.gov/32036643/). Không tuyên bố đọc được trang bị chặn. Câu 155 khớp tuổi 35 và hCG ca nguồn; câu 156 không gán tăng tưới máu cho Figure 15 có ít màu ngoại vi. Các dữ kiện hCG sau hút là giả định, không biến thành diễn tiến của ca ảnh.

Các ảnh `gyn-endo-4/5/12.jpg` dùng [đồng thuận ISUOG 2026 trên Wiley](https://obgyn.onlinelibrary.wiley.com/doi/10.1002/uog.70163), CC BY 4.0. Đã đọc trực tiếp Table 1, quy tắc đo, thuật toán AUB/không AUB và hình tương ứng. T1-162 nêu rõ Figure 5 không có dịch; số dịch/hai lá là dữ kiện bổ sung. Bản đồ khối và giới hạn bơm căng/kích thước được đối chiếu ESGE 2024; hướng dẫn 4–5 cm được đọc ở bản sơ cấp, không xem là chống chỉ định tuyệt đối của mọi kỹ thuật.

Không sao chép PDF riêng của người dùng ra thư mục public. Dùng lại hình là quan hệ ca chung; không nâng số ca lâm sàng bằng đổi tuổi hoặc caseGroup. Việc có ảnh không tự làm một câu thành mức 4.

## Kiểm tra kỹ thuật và phạm vi kết luận

Đã kiểm tra 326 ID duy nhất, cấu trúc bốn lựa chọn/bốn lý do khác nhau, khóa hợp lệ, nguồn/trang tồn tại, đồng bộ mức trong ledger, bệnh cảnh/nhiệm vụ ở mức cao, không có prompt trùng nguyên văn và tính nguyên vẹn của tất cả tệp ảnh. Các lý do khác cách diễn đạt với giải thích chung được đọc lại về ý nghĩa. Hai tệp JSON cuối là đầu vào tích hợp; các tệp tác giả tạm không phải quy trình phát hành. Ledger cuối đã bind mỗi `questionSha256` với SHA-256 của UTF-8 `JSON.stringify(record)` bằng Node; CI đối chiếu bản ghi đã đọc với nội dung thực được tích hợp, không tự tạo hash thay owner hoặc dùng hash canonical Python.

Kết luận khi đóng sổ là nghiệm thu biên tập nội dung và đối chiếu nguồn trong phạm vi đọc đã ghi. Đây không phải chứng nhận của bác sĩ chuyên khoa, hội đồng đào tạo hay kiểm định tâm trắc. Chưa có dữ liệu làm bài thực để đo độ khó/độ phân biệt hoặc độ tin cậy; các phương án dài/ngắn vẫn có thể cần hiệu chỉnh từ dữ liệu đó. Không dùng kiểm tra cấu trúc hoặc một lần chấp nhận trước để thay việc đọc nguồn và thao tác nhận thức.

Hai JSON nội dung cuối đã freeze lúc **09:01:58 UTC ngày 11/10/2026 (16:01:58 giờ Việt Nam)** sau khi root chấp nhận T1-034 và toàn bộ pending đã đóng. Mỗi ID trong ledger có `fullRecordRead: true`, `status/finalStatus: closed`, toàn bộ source keys đúng bản cuối có `verified: true` và điều kiện áp dụng; mỗi câu ảnh có clinical/actual image/explicit task/finding/provenance.

| Tệp | SHA-256 của byte tệp JSON cuối |
|---|---|
| topic1.json | `7ec8828b22eabd07acabb1a59cb278951cc89b76a6c3adb1e7dc98f00cfb1096` |
| topic2.json | `626d152d66de616dfb56d45651158abe214637b444b38687980a2a7f69ea2742` |

Hash từng câu `questionSha256` trong ledger dùng Node `JSON.stringify(record)` và SHA-256 UTF-8, được owner bind sau đọc/đóng đúng bản cuối. Hash tệp trong bảng dùng byte tệp, không phải hash canonical Python. Kiểm tra kỹ thuật cuối: 441 trích đoạn file/trang khớp PDF, một dẫn T2-115 là diễn giải so phiên bản đã render và đối chiếu web; không có lỗi cấu trúc/source key/ảnh/khóa, không có prompt hoặc mục tiêu trùng nguyên văn. Hai JSON này là bản nội dung đã chốt để root tích hợp; không có lần ghi nội dung sau freeze.
