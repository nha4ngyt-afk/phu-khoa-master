# Rà soát chéo độc lập Topic 3 và Topic 4

**Trạng thái cuối 11/10/2026: đã đóng các P1 của vòng rà soát này sau đọc lại bản sửa.** Topic 3/4 giữ 150 câu mỗi topic, mức 15/15/60/60. Chấp nhận bàn giao nội dung theo phạm vi biên tập/nguồn mô tả bên dưới; không gọi đây là chứng nhận lâm sàng hoặc nghiệm thu tâm trắc. Các bảng P1 tiếp theo là lịch sử lỗi của bản trước sửa, không phải danh sách còn mở ở bản đóng băng.

Bản cuối đã đối chiếu:

- topic3.json SHA-256 `53090b4bf2fa4bb2e576b9bcbfe0da4cb93388e50549997f576650178696a1ba`.
- topic4.json SHA-256 `948a8184dd4af5ca4323e936d67090a0410761daa505c5bd285f5ec199cfd498`.

Ngày: 2026-10-11. Đây là rà soát biên tập và đối chiếu nguồn, không phải chứng nhận của hội đồng chuyên môn hoặc đánh giá tâm trắc trên người học.

## Phạm vi đã đọc

- Đọc toàn bộ prompt, task, learningObjective và đáp án đúng của **240 câu mang nhãn L3/L4**: 120 câu/topic. Đọc đủ 49 vignette và metadata ảnh; xem trực tiếp **18 tệp ảnh thực** trong public/images: 4 của T3 và 14 của T4. Không chỉ dựa vào tên tệp.
- Kiểm tra cấu trúc toàn bộ 300 câu: ID và prompt khác nhau về chuỗi ký tự; bốn lựa chọn khác nhau; answer hợp lệ; bốn optionExplanations; đường dẫn PDF/ảnh tồn tại. SHA-256 ảnh trùng tệp nguồn obgyn-imaging-lab/dist/assets. Không có lỗi cấu trúc ở bản kiểm tra.
- Số nhãn hiện tại: mỗi topic 150 câu, 15/15/60/60; T3 có 16 câu ảnh/4 nhóm; T4 có 33 câu ảnh/**14 nhóm**, không phải 13 nhóm như audit tác giả. Tổng 49 câu ảnh/18 nhóm. Các câu cùng hình không phải 49 ca nguồn độc lập.
- Bản được rà: topic3.json SHA-256 `8fd79d4fb53354bde2c7ac46aa83e4276b446f8b2dae4c29db85a484c933d786`; topic4.json `c2ed5dbc7ced6907f50c46d4ec310149fe23b71af9e803238378befd644a0884`.

**Kết luận lịch sử trước sửa:** chưa chấp nhận 300 câu này như 300 câu độc lập có đúng hạn mức nhận thức. Kiểm tra cấu trúc đạt nhưng nhãn L3/L4 và tính khác biệt nội dung có các điểm dưới đây. Không được lấy số chuỗi prompt khác nhau hoặc nhãn `reviewed` làm bằng chứng đã giải quyết các điểm này. Vòng đọc lại cuối ở phần cuối báo cáo đóng các cờ này theo nội dung sửa thực tế.

## P1: đáp án bị nói sẵn hoặc task không khớp lựa chọn

| ID | Vấn đề cụ thể | Sửa cần thiết |
|---|---|---|
| T3-043 | Vignette đã nêu thất bại làm tổ nhiều lần; task hỏi khâu sinh sản bị ảnh hưởng và đáp án lại là thất bại làm tổ. | Dùng dữ kiện kết quả/lịch chuyển phôi để yêu cầu phân định một bước xử trí hoặc cơ chế; không lặp tên kết cục. |
| T3-047 | Đã xác nhận chèn niệu quản/thận ứ nước rồi lại hỏi biến chứng đó. | Cho dấu chức năng thận, triệu chứng và khảo sát chưa kết luận; yêu cầu chọn khảo sát hoặc ưu tiên có lý do. |
| T3-055 | Máu kinh giảm và khối không giảm đã có trong đề; đáp án lặp đúng hai sự kiện. | Hỏi một quyết định theo mục tiêu điều trị, cần cân hiệu quả, tình trạng buồng tử cung và mong muốn sinh sản. |
| T3-060 | Mục tiêu tránh flare đã nói sẵn; đáp án “tránh flare-up”. | Hỏi lựa chọn cơ chế/chiến lược từ diễn biến hormone cụ thể, thêm phương án nhiễu có cơ sở. |
| T3-065 | Đề đã đặt lo ngại nam hóa; đáp án nam hóa/khàn giọng. | Dùng một bất lợi cụ thể chưa được đặt tên hoặc yêu cầu cân lựa chọn thực tế, nguồn phiên bản rõ. |
| T3-068 | Task hỏi “phương án” nhưng đáp án là “có chỉ định can thiệp và còn nguyện vọng...” — một điều kiện, không phải phương án. | Viết lại task và lựa chọn thành các phương thức can thiệp có thể so sánh; đáp án bóc nhân xơ nếu dữ kiện đủ. |
| T4-037 | Đề cho chu kỳ không phóng noãn; đáp án nang không vỡ/không phóng noãn. | Hỏi phân biệt với hoàng thể bằng dữ kiện nội tiết/timeline thay vì lặp sự kiện. |
| T4-044 | Đề nêu dùng chống đông; hỏi đặc điểm nguy cơ và đáp án dùng chống đông. | Hỏi kế hoạch theo dõi/ưu tiên khi diễn tiến ổn định so với mất máu tiếp diễn. |
| T4-047,049,052,054,057,058,059 | Đề lần lượt đã cho biểu mô vòi; trụ cao tiết nhầy; nhiều mô xơ; thần kinh chưa trưởng thành; bộ Meigs; tác động estrogen; Call-Exner. Đáp án lặp lại chính mô tả đó. | Loại tên/mô tả kết luận khỏi stem; cho dữ kiện để phân biệt thực sự, hoặc hạ mức và bổ sung câu khác có tư duy ứng dụng. |
| T4-053 | Đề đã cho u nghịch mầm và LDH tăng; lựa chọn đúng là theo dõi LDH cùng đánh giá bệnh, khác rất ít T4-056. | Đổi mục tiêu sang giới hạn của marker hoặc bất đồng marker–hình ảnh/timeline, có bằng chứng riêng. |
| T4-063,066,075 | Gia đình ung thư vú/buồng trứng; khối đã biết trước mổ; chảy máu không tự cầm đều được nêu trong stem rồi lặp ở đáp án. | Câu hỏi phải yêu cầu quyết định hoặc phân biệt một lựa chọn chưa được giải quyết sẵn trong stem. |

## P1: trùng nội dung/cùng một bước suy luận

Các nhóm dưới đây có chung tiêu điểm và đáp án, thay tuổi/câu văn mà chưa có dữ kiện làm đổi quyết định. Giữ một câu rõ nhất; viết lại những câu còn lại quanh mục tiêu mới, hoặc chỉ giữ sau khi chứng minh khác biệt về thao tác nhận thức. Không đổi ID để tăng số lượng.

| Nhóm ID | Nội dung lặp | Hướng tách có cơ sở |
|---|---|---|
| T3-037/041/050/111 | Nhân xơ nhỏ không giải thích thống kinh; nghĩ adenomyosis. | Một câu chẩn đoán; các câu khác cần dữ kiện khác tạo quyết định khảo sát, phân biệt cơ chế đau hoặc theo dõi. |
| T3-052/083 | Nhân xơ tình cờ, không triệu chứng: tư vấn theo dõi. | Không tính hai câu khác mức chỉ vì câu sau dùng từ “chiến lược”. |
| T3-055/093 | LNG-IUS giảm máu dù nhân không nhỏ. | Một câu giải thích; câu khác cần ngưỡng/diễn tiến làm thay đổi điều trị. |
| T3-066/094/100 | Nhân dưới niêm mạc có chỉ định và muốn giữ tử cung: nội soi buồng tử cung. | Cần các loại FIGO/giới hạn kỹ thuật hoặc mục tiêu thực sự làm đổi lựa chọn. |
| T3-069/101/133 | Bóc nhân bảo tồn rồi tư vấn tái phát/theo dõi. | Đổi sang phát hiện triệu chứng mới hoặc đánh giá hiệu quả có kết quả cụ thể. |
| T3-080/107/128 | Đau mạn/nhạy cảm trung ương cần đa ngành, không bảo đảm một can thiệp hết đau. | Giữ sự khác biệt nếu task chọn khảo sát nguyên nhân hoặc mục tiêu theo dõi cụ thể thay vì luôn chọn “đa ngành”. |
| T3-081/122 | Điều trị adenomyosis kéo dài làm trì hoãn kế hoạch hiếm muộn. | Cần kế hoạch/số liệu/thứ tự ưu tiên thực tế, không chỉ nhắc lại trì hoãn. |
| T3-073/104/127 | UAE ở người mong con: thảo luận ảnh hưởng nội mạc/buồng trứng/thành tử cung. | Mỗi câu cần điểm quyết định mới, không chỉ đổi “nhóm hậu quả” thành “tư vấn”. |
| T4-041/078 | Nang không tiêu qua nhiều chu kỳ: xem lại chẩn đoán. | Có thể giữ COC như mục tiêu riêng nếu câu sau thực sự kiểm tra tác dụng/giới hạn khác, không cùng câu trả lời đánh giá lại. |
| T4-053/056 | Dysgerminoma và LDH. | Phân biệt marker trước mổ, đáp ứng, bất đồng hay giới hạn; tránh hỏi chọn LDH hai lần. |
| T4-055/086 | Khối buồng trứng+cường giáp+iod ở chậu: struma ovarii. | Thêm dữ kiện và task khác làm thay đổi chẩn đoán phân biệt/xử trí. |
| T4-070/071 | Trào ngược+miễn dịch quyết định tồn tại mô cấy ghép. | Một câu cơ chế; câu khác cần dự đoán/đánh giá chứng cứ khác. |
| T4-100/110 | Mổ lặp endometrioma, dự trữ giảm, trước ART: tránh mổ thường quy. | Cần yếu tố chỉ định mới hoặc tình huống cân đau/tiếp cận noãn khác kết luận. |
| T4-104/116 | Đã quyết định mổ, còn mong sinh sản: giảm sang chấn, giữ mô buồng trứng. | Task thực hành kỹ thuật hoặc kế hoạch tư vấn có tiêu điểm riêng. |

T3-032/140 cũng cùng số 30% và đáp án FIGO1; ảnh của T3-140 không cần để áp dụng tỷ lệ đã được nêu. T3-147/149 cùng nhận diện co cơ thoáng qua; câu sau chỉ gọi việc bỏ qua dấu đó là sai sót. Có thể giữ câu trong cùng nhóm ảnh nếu bước nhận thức thực sự khác, nhưng thêm bối cảnh giả định không tự tạo ca độc lập.

## P1: nhãn mức độ đang nâng quá thao tác tư duy

Tiêu chí dùng: L1 nhớ; L2 hiểu/giải thích một quan hệ; L3 áp dụng quy tắc vào dữ kiện mới; L4 cần tích hợp nhiều dữ kiện có cạnh tranh, phân biệt giả thuyết hoặc lựa chọn có đánh đổi. Thêm tuổi, “người bệnh hỏi”, “theo nguồn” hoặc “chiến lược” chưa tự biến một câu nhớ thành L3/L4. Các nhãn đề nghị dưới đây là đánh giá biên tập, không phải thông số khó thực nghiệm.

- **T3 L3 cần hạ L1/L2 hoặc viết lại thực chất:** 034,036,038,039,040,043,044,047,055,059,060,061,062,063,065,068,071,072,075,077,078,079,082,135,136. Đa số hỏi định nghĩa, cơ chế hoặc tên dấu; các tautology nêu trên cần sửa trước.
- **T4 L3 cần hạ L1/L2 hoặc viết lại thực chất:** 033,034,035,036,037,038,039,042,043,044,045,046,047,048,049,050,051,052,053,054,056,057,058,059,060,062,063,064,065,066,069,070,071,075. Nhiều stem “người bệnh hỏi” vẫn chỉ hỏi hormone/nguồn mô/marker đã biết. T4-035 có dự đoán nhưng là quan hệ hai tế bào đã được nêu sẵn; nhiễu như “thành tuyến giáp” không đòi hỏi áp dụng lâm sàng.
- **T3 L4 cần hạ tối đa L3 hoặc tăng phân tích:** 083,086,093,096,097,098,099,100,101,102,104,105,108,109,110,111,113,114,118,123,128,129,132,133,134,137,138,141,145,146,149,150. T3-097/110 là cơ chế thuốc; T3-145 nhắc đúng hai đặc điểm trong stem rồi chọn lại; T3-146 chọn nguyên tắc cá thể hóa; T3-141 chỉ hỏi tỷ lệ FIGO1/2.
- **T4 L4 cần hạ tối đa L3 hoặc tăng phân tích:** 077,078,082,083,084,085,086,087,088,089,090,092,093,094,095,096,097,098,102,104,105,106,107,109,111,112,113,114,115,116,117,124,125,126,129,132,135,137,138,140,142,144,148. ADNEX 095–098 chủ yếu cộng/trừ hoặc chia số đúng quy tắc; NICE112/113 áp dụng bảng một bước; không đủ bằng việc gắn bối cảnh y học để mặc định L4.

Không cần sửa tất cả câu thành dài. Câu L4 tốt cần một quyết định có dữ kiện quyết định thật và nhiễu hợp lý. T4-147/150 có giá trị phân tích đa chuỗi MRI; T4-079/080/081/099/101/108/110 có các yếu tố cạnh tranh hữu ích, nhưng vẫn cần tránh trùng tiêu điểm và đáp án quá hiển nhiên. Không khẳng định các câu ngoài danh sách đều đã đạt chuẩn L4.

## 49 câu ảnh: đối chiếu thực tế và bệnh cảnh

Không thấy tệp ảnh sai bệnh rõ ràng trong 18 tệp đã xem: MUSA, nhân xơ buồng tử cung, adenomyosis/adenomyoma, co cơ thoáng qua, nang xuất huyết, endometrioma, nhú, dermoid, fibroma, xoắn và các bộ MRI khớp chủ đề/task. Dữ kiện O-RADS bổ sung chỉ được xem là giả định giảng dạy; ảnh tĩnh không tự chứng minh số nhú của toàn bộ khối, Doppler tối ưu, DCE đạt chuẩn hoặc một số đo ROI không được công bố.

- **T4-118,121,129,140:** clinicalVignette mới là mô tả ảnh/kỹ thuật, thiếu bệnh cảnh người bệnh độc lập. Cần bổ sung một ca có triệu chứng/lý do khảo sát/bối cảnh đủ cho task và ghi là giả định, không mượn câu trước.
- T4-119,122,124,125,128,130,131,133,134,136,138,142 có lặp câu/dữ kiện trong vignette; biên tập cho gọn, không nhân đôi thông tin. T4-129/140 task kỹ thuật có thể hợp lệ sau thêm bối cảnh nhưng chưa phải L4 chỉ vì gọi là kỹ thuật.
- T3-140/142/146 và nhiều câu O-RADS cho sẵn đặc điểm quyết định trong chữ; ảnh đang thiên về minh họa hơn đọc ảnh độc lập. Để tính như câu hình ảnh có chất lượng, task nên yêu cầu người học thực sự dùng một chi tiết có thể thấy trên ảnh, đồng thời cung cấp những dữ kiện ngoài ảnh cần thiết.
- Ảnh MUSA CC BY-NC-ND4.0 đã giữ nguyên; các ảnh US journal CC BY-NC3.0; MRI/ISUOG CC BY4.0 theo metadata. Hạn chế phi thương mại cần giữ trong gói nguồn và ghi credit. Chưa có kiểm toán pháp lý độc lập cho quyền của bên thứ ba; ảnh ac-10 đã ghi courtesy Dr. Eun Ju Lee.
- Sửa audit tác giả đếm T4 thành14 nhóm, tổng18. Giữ chọn tối đa một câu mỗi caseGroup trong đề để không đưa các đáp án liên tiếp gợi lẫn nhau.

## Đối chiếu nguồn đại diện

Không lặp lại toàn bộ việc dò evidence/PDF tác giả đã mô tả. Đã kiểm tra nguồn phiên bản cho các mệnh đề mới quan trọng:

- ESHRE2022 khuyến nghị56–57: không mổ thường quy endometrioma trước ART chỉ để tăng sinh sống; nguy cơ giảm dự trữ; có thể cân phẫu thuật vì đau/khó tiếp cận noãn. T4-108/109 đúng phạm vi này. [PDF ESHRE2022](https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS-2022_1.pdf).
- NICE NG12 cập nhật15/4/2026: ngưỡng CA12550–59 là31;60–69 là24 IU/ml; vượt ngưỡng ở người có triệu chứng gợi ý dẫn tới siêu âm bụng–chậu khẩn, không chẩn đoán mô học ngay. T4-112/113 đúng nội dung phiên bản, vấn đề là mức nhận thức và nhiễu. Trang mở trực tiếp403 nhưng kết quả chính thức NICE và PDF hiển thị bảng. [NICE NG12](https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer), [PDF2026](https://www.nice.org.uk/guidance/ng12/resources/suspected-cancer-recognition-andreferral-pdf-1837268071621).
- MUSA2022 phân ba dấu trực tiếp; mạch xuyên tổn thương là gián tiếp; chỉ dấu gián tiếp chưa kết luận chắc adenomyosis. Khớp T3-135–138. [Bài đồng thuận chính thức](https://obgyn.onlinelibrary.wiley.com/doi/full/10.1002/uog.24786).
- Nougaret2024 xác định fibrous solid tissue đồng nhất dark T2/dark DWI là O-RADS MRI2 bất kể ngấm thuốc; ADC thấp đơn độc không đủ gọi hạn chế khuếch tán. Figure7 đúng ảnh47mm ở MRI_IMG13; T4-149/150 khớp. [Bài chính thức Springer](https://link.springer.com/article/10.1186/s13244-023-01577-5).

Chưa phát hiện một đáp án điều trị sai rõ ràng ở các nguồn đại diện này. Điều đó không bảo đảm mọi mệnh đề của cả300 câu đúng lâm sàng ngoài phạm vi nguồn trích. Các câu lịch sử WHO2014/nội khoa8/2018 phải giữ khung thời gian, không diễn đạt thành hướng dẫn hiện hành.

## Điều kiện đóng rà soát

1. Sửa các tautology/task lỗi và bốn vignette thiếu ca độc lập.
2. Tách/loại nhóm trùng theo nội dung, giữ số câu hợp lệ sau loại trùng; viết bổ sung khi thiếu150/topic hoặc hạn mức.
3. Không giữ quota60/60 bằng cách đổi nhãn. Sau sửa, mỗi topic phải có ít nhất60 câu L3 và60 câu L4 theo thao tác thực tế và các mục tiêu/ca khác biệt đủ rõ.
4. Rà lại các câu đã thay bằng nguồn hỗ trợ và nhiễu hợp lý; cập nhật audit với count thực tế. Bản này là danh sách trước sửa; chỉ đóng sau đối chiếu phiên bản sửa.

## Đọc lại và đóng vòng sửa 11/10/2026

Đã đọc lại prompt, task, mục tiêu và đáp án của **143 ID khác nhau trong revision-3-4-log.json**: 63 Topic 3 và 80 Topic 4. T3-060 xuất hiện hai lần trong log nhưng chỉ được tính một ID. Đọc thêm bản sửa mới T4-099 ngoài log, tổng 144 câu có sửa nội dung được rà lại. Đã đối chiếu đủ bốn phương án/lý do ở các ca tranh luận về nguồn, giới hạn xét nghiệm, hội chứng mô bệnh học và hình ảnh; phạm vi này không được diễn đạt là có bác sĩ độc lập đọc đủ từng từ của cả 300 câu.

- Các cờ 134 nhãn L3/L4 ban đầu đã được giải quyết bằng nhiệm vụ thực: dùng dữ kiện IVF/hormone/thiếu máu/diễn tiến, so khả thi và mục tiêu can thiệp, kiểm tra giới hạn bằng chứng, hoặc phân biệt các giả thuyết cạnh tranh. Không thay ID hay đổi nhãn để giữ số lượng. Số cuối vẫn 150/topic và 15/15/60/60.
- Những nhóm lặp nêu trong báo cáo được tách theo quyết định có dữ kiện: T3-041/050/107/094/122/127; T3-060 chuyển riêng sang tái tăng nhân sau ngừng GnRHa, khác ca flare/đối vận. T4-053 dùng giới hạn dấu ấn với triệu chứng mới; 056 lựa chọn dấu ấn trong mô đã xác định; 100/110 phân biệt kế hoạch bảo tồn trước can thiệp với ngoại lệ có mục tiêu đau/tiếp cận. Không coi khác tuổi hoặc đổi chữ là bằng chứng đủ cho tính độc lập.
- Bốn ca ảnh T4-118/121/129/140 đã có bệnh cảnh riêng. Task mới yêu cầu diễn giải chi tiết nhìn được, cộng điều kiện ngoài ảnh cần thiết và giới hạn của ảnh tĩnh. Đã đọc lại các ca kỹ thuật/đa chuỗi được sửa; 49 câu vẫn dùng 18 nhóm hình, các byte ảnh giữ nguyên. Nhóm gyn-endo-4 dùng chung với Topic 1 phải giữ cùng caseGroup toàn ngân hàng.
- Đã xác nhận chỉnh thủ công các trường hiển thị T4-045/051/052/057/059/062/064 và các lỗi cách từ tiếp theo; T4-099 nay phân biệt giới hạn mẫu đông lạnh khối nhầy, mô cuối và hệ quả sinh sản, không dùng đường kính hoặc CA125 để mặc định phạm vi mổ. T3-042 và T4-099 có lý do riêng từng nhiễu. Tác giả đã cập nhật giải thích nền mức 1–2 của 60 câu; bước kiểm tra cấu trúc xác nhận đủ bốn lý do.

Đối chiếu nguồn bổ sung đại diện sau sửa:

- Đọc PDF SOGC 2015 trang vật lý 2 và 10: sửa thiếu máu trước mổ chương trình; bản đồ vị trí/số/kích thước trước bóc; type II có khả năng phải chia hai thì và cần thận trọng khi lớp cơ còn dưới 5 mm; phá hủy nội mạc phối hợp được cân khi không mong sinh sản. Những nội dung này khớp T3-096/127/100/094 và vẫn được ghi là phiên bản 2015.
- T3-060 đã bỏ những trích đoạn flare/đối vận không còn liên quan; còn nguồn 8/2018 về tái tăng sau ngừng và bài bệnh học về tăng nhanh không xác định chắc sarcoma. Nguồn và nhiệm vụ sau sửa thống nhất.
- Đọc lại khuyến nghị 56–57 và 59 trong [ESHRE 2022](https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS-2022_1.pdf): T4-109 cân ngoại lệ đau/tiếp cận noãn với dự trữ, T4-111 tư vấn bảo tồn sinh sản trong lạc nội mạc buồng trứng lan rộng nhưng không bảo đảm sinh sống. [Bảng chứng cứ chính thức](https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS_ANNEX-8_evidence-tables.pdf) cũng hỗ trợ những giới hạn này.
- Đọc lại bảng CA125 tuổi trong [NICE NG12 2026](https://www.nice.org.uk/guidance/ng12/resources/suspected-cancer-recognition-andreferral-pdf-1837268071621): T4-112 dùng 28 IU/ml ở người 65 tuổi vượt mốc 24 để siêu âm khẩn, đồng thời bác lời trấn an từ ngưỡng chung 35 hoặc nhân xơ cũ; chưa tự kết luận ung thư. T4-113 giữ mốc nhóm tuổi tương ứng.

Bản cuối có **458 trích dẫn PDF cục bộ ở 56 trang khác nhau**, cùng các nguồn chính thức bổ sung; đây là số metadata thực, không phải số nghiên cứu độc lập. Tác giả kiểm tra mọi trích đoạn; rà soát chéo này kiểm tra mệnh đề đại diện và các cờ đã sửa, không lặp toàn bộ chứng minh nguồn của tác giả.

**Kết luận đóng:** không còn P1 đã xác định trong phạm vi rà soát này. Các hạn chế còn lại là chất lượng nhiễu và độ khó thực nghiệm: một số đáp án đúng dài hoặc nhiễu quá tuyệt đối có thể gợi đáp án. Đây là P2 biên tập cần đo/hiệu chỉnh qua người học, không được dùng nhãn L4 để tuyên bố đã có độ khó tâm trắc. Nội dung/source review được chấp nhận để tích hợp; parent vẫn phải chạy kiểm tra toàn ngân hàng và quota đa chiều trước phát hành. Không có xác nhận chuyên môn của bác sĩ/hội đồng, cũng không có kiểm toán pháp lý độc lập.
