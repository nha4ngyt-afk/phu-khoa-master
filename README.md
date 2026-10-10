# Phụ khoa — Góc học lâm sàng

Website trắc nghiệm tiếng Việt cho sáu topic Phụ khoa. Cấu hình mặc định là **90 câu trong 90 phút**, gồm 15 câu mỗi topic, tỉ lệ nhận biết/thông hiểu/vận dụng/vận dụng cao là 10/10/40/40. Kết quả hiển thị **số câu đúng / tổng số câu**, kèm số sai, bỏ trống và thời gian; không có thang điểm hay tự luận.

Website công khai: **https://nha4ngyt-afk.github.io/phu-khoa-master/**

## Cách sử dụng

1. Mở website rồi chọn **Cấu hình đề tổng hợp**, hoặc chọn thumbnail của một topic.
2. Chọn phạm vi, số câu, thời gian, tỉ lệ bốn mức độ và tỉ lệ câu có hình. Trọng số topic cho phép phân bố câu theo nhu cầu. Tổng tỉ lệ độ khó phải bằng 100%.
3. Chọn **Bắt đầu làm bài**. Website kiểm tra đủ dữ liệu và tải hình trước khi bắt đầu tính thời gian. Cấu hình thiếu câu sẽ có thông báo và gợi ý điều chỉnh.
4. Chọn đáp án, chuyển câu, đánh dấu **Xem lại**, hoặc lọc **Chỉ câu chưa trả lời** trên phiếu trả lời.
5. Chọn **Nộp bài** rồi xem lời giải, lý do của từng phương án, nguồn và quyền sử dụng hình. Có thể làm lại bộ câu hoặc ôn những câu sai/bỏ trống.

**Luyện tập** không giới hạn thời gian và có nút kiểm tra đáp án từng câu. Bài kiểm tra dùng thời hạn đã lưu; tải lại trang không cấp lại 90 phút. Nếu đóng trình duyệt qua thời hạn, bài được hoàn tất khi mở lại.

Trong **Ngân hàng câu hỏi**, người dùng có thể tìm kiếm, lọc, thêm, sửa, xóa và nhập/xuất JSON hoặc CSV. Các thay đổi này chỉ nằm trên thiết bị đang dùng. **Cài đặt → Xuất bản sao lưu đầy đủ** lưu ngân hàng, lịch sử và bài đang làm vào một tệp JSON để chuyển thiết bị. Không có đăng nhập hoặc đồng bộ tự động.

## Nội dung và hình ảnh

Sáu topic: xuất huyết tử cung bất thường; nhiễm trùng sinh dục/STI; u xơ và bệnh tuyến-cơ tử cung; khối u buồng trứng; HPV và tổn thương cổ tử cung; tránh thai và phá thai an toàn.

Ngân hàng ban đầu có **926 câu**:

| Topic | Tổng câu | Câu có hình |
| --- | ---: | ---: |
| 1. Xuất huyết tử cung bất thường | 163 | 20 |
| 2. Nhiễm trùng sinh dục và STI | 163 | 0 |
| 3. U xơ và bệnh tuyến-cơ tử cung | 150 | 16 |
| 4. Khối u buồng trứng | 150 | 33 |
| 5. HPV và tổn thương cổ tử cung | 150 | 0 |
| 6. Tránh thai và phá thai an toàn | 150 | 0 |
| **Tổng** | **926** | **69** |

Có 99 câu nhận biết, 106 câu thông hiểu, 361 câu vận dụng và 360 câu vận dụng cao. Các nhãn nhận thức dựa trên nhiệm vụ được biên soạn và đọc chéo; độ khó thực nghiệm cần dữ liệu người học. 69 câu hình sử dụng 27 tệp/nhóm hình nguồn. Đề mặc định chọn 18 nhóm khác nhau.

Ngân hàng được biên soạn từ tài liệu trong thư mục được cung cấp và nguồn Phụ khoa/hình ảnh chính thống được ghi ở từng câu. Tài liệu cũ được xác định theo năm; câu hỏi áp dụng nguồn lịch sử phải nêu rõ nguồn đó trong yêu cầu, thay vì diễn đạt như khuyến cáo hiện hành. Bản PDF/Word nguồn riêng tư không được đưa vào repository hoặc thư mục phát hành.

Mỗi câu hình có bệnh cảnh độc lập, yêu cầu cụ thể, hình thật, nguồn ảnh và giấy phép. Bệnh cảnh mô phỏng phục vụ học tập được ghi rõ, không tự nhận là bệnh sử gốc của người bệnh trong ảnh. Nhiều câu có thể học các khía cạnh khác nhau từ cùng một nhóm hình; thuật toán giới hạn **một câu mỗi nhóm hình trong một đề**. Vì vậy số câu hình và số ca/hình độc lập là hai con số khác nhau. Không dùng ảnh do AI tạo để thay ảnh chẩn đoán.

Số lượng và phân bố của phiên bản hiện tại được ghi tại [`public/data/metadata.json`](public/data/metadata.json) và [`content/validation-report.json`](content/validation-report.json). Giấy phép từng hình nằm tại [`public/data/image-credits.json`](public/data/image-credits.json). Các báo cáo `content/audit-*.md`, `content/cross-audit-*.md` và nhật ký sửa nội dung lưu lại phạm vi kiểm tra, phát hiện và cách xử lý. Kiểm tra cấu trúc tự động không chứng minh độ khó hay tính đúng chuyên môn; các câu cần được đối chiếu nguồn và đọc rà soát nội dung riêng.

## Kiến trúc

React + TypeScript + Vite. Thư viện, font KaTeX, ngân hàng và hình được đóng gói tại chỗ, không tải thư viện từ CDN khi sử dụng. Tạo đề, chấm đáp án, IndexedDB và Service Worker chạy trong trình duyệt. Không có backend, API AI, API key, phân tích hành vi hay dịch vụ trả phí.

`src/engine.ts` lọc phạm vi, làm tròn theo phần dư lớn nhất, phân bổ số câu nguyên theo topic × mức độ, chọn câu hình và giữ đúng tất cả hạn ngạch. Câu ít gặp trong năm bài gần nhất được ưu tiên. Seed và thứ tự phương án được lưu với bài làm. Đề dùng câu đã sửa cục bộ cần xuất ngân hàng cho người nhận hoặc cập nhật bản chung trước; website chặn chia sẻ nếu bộ câu khác nguồn chung. Khi mở liên kết hợp lệ, website dùng câu gốc của phiên bản đó dù thiết bị có sửa ngân hàng riêng. Liên kết **Chia sẻ đề** chứa cấu hình không có tên, phiên bản, seed, ID câu và thứ tự phương án; người nhận cần đúng phiên bản ngân hàng để mở cùng bộ câu.

`src/storage.ts` lưu bài và lịch sử trong IndexedDB. `src/files.ts` xử lý nhập/xuất, giới hạn ngân hàng nhập 10 MB và sao lưu đầy đủ 50 MB và kiểm tra dữ liệu. `src/Editor.tsx` là biểu mẫu biên soạn. `content/topic1.json` đến `topic6.json` là nguồn ngân hàng; component giao diện không chứa ngân hàng hard-code.

## Chạy trên máy để chỉnh sửa

Cài Node.js 22 LTS và pnpm 11.25.0 từ nguồn chính thức. Sau đó mở terminal tại thư mục dự án:

```sh
pnpm install --frozen-lockfile
pnpm assemble
pnpm validate
pnpm test
pnpm dev
```

Terminal sẽ hiển thị địa chỉ xem thử trên máy. Đây là công cụ phát triển; website đã phát hành không cần máy cá nhân tiếp tục chạy.

Tạo bản phát hành tĩnh:

```sh
pnpm assemble
pnpm validate
pnpm test
pnpm build
pnpm preview
```

`pnpm build` kiểm tra TypeScript, tạo `dist/` và tạo Service Worker với danh sách toàn bộ tài nguyên. Không mở `dist/index.html` bằng `file://`; dùng địa chỉ preview hoặc static hosting.

## Cập nhật website chung trên GitHub Pages

1. Mở repository `nha4ngyt-afk/phu-khoa-master` trên GitHub.
2. Chỉnh sửa câu trong `content/topicN.json` tương ứng. Cách dễ hơn: sửa bằng biểu mẫu trên web, xuất JSON, sau đó phân tách câu theo topic vào sáu tệp nguồn.
3. Nếu thêm hình, đặt tệp trong `public/images/` và ghi đúng nguồn/giấy phép, bệnh cảnh, nhiệm vụ. Không tải tài liệu nguồn riêng tư lên GitHub.
4. Đối chiếu nguồn, đáp án, mức độ và từng phương án. Câu mới/sửa trên giao diện mang trạng thái biên tập cục bộ; chỉ đặt `reviewStatus` thành `reviewed` trong tệp nguồn sau khi đã hoàn tất rà soát. Chạy các lệnh kiểm tra ở trên. Không phát hành khi thiếu câu, lỗi nguồn/ảnh hoặc còn phát hiện nội dung chưa được xử lý.
5. Commit vào nhánh `main`. Trong tab **Actions**, workflow **Publish static website** sẽ tự kiểm tra, build và phát hành.
6. Trong **Settings → Pages**, nguồn phát hành phải là **GitHub Actions**. Workflow đã nằm tại `.github/workflows/pages.yml`; không chọn Jekyll hay thêm máy chủ.

Routing dùng dấu `#` và tài nguyên dùng đường dẫn tương đối để tải lại trang ở `/phu-khoa-master/` không bị lỗi 404. Khi ngân hàng đổi, hash tạo phiên bản mới. Bài đang làm và lịch sử giữ bản chụp câu cũ. Nếu thiết bị đang dùng một ngân hàng đã chỉnh sửa cục bộ, chọn **Cài đặt → Khôi phục ngân hàng gốc** để dùng bản chung mới, sau khi sao lưu phần cần giữ.

Service Worker mới tiếp quản sau khi các trang của phiên bản cũ đóng. Nếu vẫn thấy phiên bản cũ, đóng các tab website rồi mở lại khi có mạng. Ngoại tuyến chỉ dùng được sau khi cache cài đặt thành công; không phải lần đầu truy cập khi mất mạng.

## Phương án Cloudflare Pages miễn phí

Kết nối repository, chọn build command `pnpm assemble && pnpm validate && pnpm test && pnpm build`, output directory `dist`, Node.js 22. Chỉ dùng Pages tĩnh với tên miền `pages.dev`; không tạo Functions, Workers, database hay dịch vụ trả phí. Các gói miễn phí có giới hạn và có thể thay đổi theo nhà cung cấp.

## Thêm câu hỏi và mở rộng phạm vi

Sao chép cấu trúc một câu cùng topic trong tệp nguồn. ID phải duy nhất; `answer` là chỉ số 0–3 của phương án gốc, trước khi xáo trộn. `optionExplanations` phải tương ứng với bốn phương án. Nguồn cần xác định được tên, trang PDF hoặc URL chính thức và căn cứ cho đáp án. Mức vận dụng cần quyết định từ dữ kiện; mức vận dụng cao cần nhiều bước, dữ kiện cạnh tranh hoặc giới hạn lựa chọn, không chỉ kéo dài câu dẫn.

Ngân hàng dành riêng cho một môn Phụ khoa. Thêm topic của môn này cần cập nhật danh mục `src/types.ts`, giới hạn topic trong validator, cấu hình mặc định và script tổng hợp. Thêm một môn hoàn toàn mới cần mở rộng schema với `subjectId`, danh mục môn và bộ lọc tương ứng; cấu trúc đã tách dữ liệu/thuật toán/giao diện để không phải viết lại toàn bộ website. Không quảng cáo tính năng đa môn đã có khi chưa triển khai bộ lọc đó.

## Giới hạn sử dụng

Dữ liệu học tập không tự đồng bộ giữa thiết bị, trình duyệt hoặc tên miền. Chế độ riêng tư, xóa dữ liệu trình duyệt và thiếu dung lượng có thể ảnh hưởng lưu trữ; website báo lỗi lưu và có nút sao lưu. Đáp án đi cùng website tĩnh và đồng hồ dùng giờ thiết bị, nên đây là công cụ ôn tập/tự kiểm tra. Rà soát biên soạn và đối chiếu nguồn không tương đương nghiệm thu bởi hội đồng chuyên môn độc lập.

Tệp hình giữ giấy phép của tác giả gốc, bao gồm những hình có điều kiện phi thương mại. Không coi giấy phép của mã phần mềm là giấy phép của toàn bộ tài liệu hoặc hình. Chi tiết trong `THIRD_PARTY_NOTICES.md` và danh mục quyền sử dụng hình.
