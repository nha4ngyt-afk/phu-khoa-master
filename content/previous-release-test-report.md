# Lưu trữ kiểm tra phiên bản trước lượt rà soát toàn bộ

Báo cáo dưới đây thuộc ngân hàng `2026.10-deeb45322c52`. Không dùng những số liệu hoặc workflow trong báo cáo này để xác nhận phiên bản rà soát ngày 11/10/2026. Xem `TEST_REPORT.md` ở thư mục gốc cho phiên bản hiện tại.

# Báo cáo kiểm tra bản phát hành

Ngày kiểm tra: 11/10/2026. Cấu hình chuẩn: 90 câu, 90 phút, sáu topic chia đều, bốn mức độ 10/10/40/40, 18 câu hình ảnh học. Website chạy hoàn toàn trong trình duyệt.

## Kiểm tra chức năng trên giao diện

Đã thao tác bản production tại localhost bằng Safari và trình duyệt Chromium trong Codex:

| Kiểm tra | Kết quả quan sát |
| --- | --- |
| Tạo đề chuẩn | 90 câu; 15/topic; 9/9/36/36 theo mức độ; đồng hồ bắt đầu 01:30:00 |
| Hình ảnh | Hình được tải trước khi bắt đầu, có bệnh cảnh và yêu cầu; phóng to/đóng hình hoạt động |
| Lưu tiếp tục | Chọn đáp án, đánh dấu, tải lại: giữ đáp án, dấu xem lại, bộ câu và thời hạn ban đầu |
| Nộp bài | Hộp xác nhận trong giao diện; bài thử có một đáp án đúng hiển thị 1/90, 0 sai, 89 bỏ trống |
| Tự hết giờ khi trang mở | Bài thử 1 phút được hoàn tất tự động, thời gian ghi 00:01:00 |
| Đóng/mở lại quá hạn | Đóng trang bài 1 phút, mở lại sau hạn: chuyển kết quả 0/90 với lý do “Bài quá hạn khi mở lại”; không cấp lại thời gian |
| Ngoại tuyến | Dừng server production sau khi Service Worker cài xong, tải lại bằng Safari: mở được giao diện và lịch sử, tạo được bài và tải hình đã cache |
| Biên tập cục bộ | Sửa mục tiêu học tập của một câu, lưu, tải lại và mở form: giữ thay đổi; sau thử đã khôi phục giá trị gốc |
| Xuất ngân hàng CSV | Nút trên giao diện tạo được tệp tải xuống |
| Ôn câu sai/bỏ trống | Mở lại đúng bộ câu cần ôn ở chế độ không hạn giờ; chọn đáp án rồi kiểm tra mới hiện lời giải và khóa lựa chọn đã kiểm tra |
| Chia sẻ | Bản cuối mở hộp liên kết; mở liên kết trên tab mới có cùng câu đầu/thứ tự phương án, đồng hồ mới 01:30:00 và ảnh MRI tải được; kiểm thử tự động đối chiếu toàn bộ ID/thứ tự |
| Bảo vệ bài luyện tập | Đóng tab bài luyện tập, mở liên kết đề kiểm tra: báo có bài đang làm; tiếp tục vẫn là bài cũ, không hạn giờ |
| Đề riêng Topic 3 | Thumbnail tạo cấu hình 30 câu, 10% hình = 3 nhóm; tạo bài thành công |
| Chế độ tối | Bật/tắt đúng; màu và bố cục được xem trực tiếp |
| Màn hình hẹp | Kiểm tra 390×844; trang chủ và cấu hình không tràn ngang; các nút và thẻ topic hiển thị đúng |

Không ghi nhận cảnh báo/lỗi console trong tab Chromium sau các thao tác làm bài, tải lại, biên tập, xuất CSV và luyện lại đã nêu.

Các luồng lưu/hết giờ/ngoại tuyến được kiểm tra trên bản production trước lượt chốt nội dung cuối. Sau khi khóa ngân hàng và build lại, đã kiểm tra thêm chia sẻ, ảnh MRI, cấu hình Topic 3 và bảo vệ bài luyện tập trên đúng bản cuối.

**GitHub Pages đã phát hành thành công:** [mở website](https://nha4ngyt-afk.github.io/phu-khoa-master/). [Workflow bản phát hành](https://github.com/nha4ngyt-afk/phu-khoa-master/actions/runs/38082846688) có cả job build và deploy thành công, gồm install, assemble, validate, test và build. Đã mở trang công khai bằng Chromium: hiển thị phiên bản `2026.10-deeb45322c52`, 926 câu và cấu hình chuẩn 90 câu/90 phút; bộ lọc có hình hiển thị 69 câu. Mở T1-144 xác nhận bệnh cảnh/nhiệm vụ, Figure 4 tải được, nguồn tác giả và CC BY-NC 4.0 hiển thị đầy đủ. Các hình của trang ngân hàng đầu cũng tải được, bao gồm Figure 15 đã được người dùng chấp thuận phát hành. Không thấy lỗi/cảnh báo console trong tab này. Ảnh trang chủ công khai được lưu trong tệp bàn giao `phu-khoa-master-live.png`.

## Kiểm tra tự động

Các bộ kiểm thử kiểm tra thuật toán tạo đề, phạm vi/chủ đề nhỏ, hạn ngạch, ưu tiên câu ít gặp, chấm theo chỉ số đáp án gốc, đồng hồ/thời hạn, khôi phục bài, luyện câu sai, liên kết chia sẻ, IndexedDB, nhập/xuất CSV/JSON, dữ liệu lịch sử sai định dạng và CSV có dấu nháy/xuống dòng/công thức.

Kiểm thử ngân hàng thật chạy 500 seed khác nhau. Mỗi đề phải đủ 90 ID riêng biệt, đúng 15 câu/topic, đúng 9/9/36/36 theo mức độ, đúng 18 nhóm hình khác nhau và không lặp tệp hình. Kiểm tra này không đánh giá tính đúng chuyên môn hay chứng minh mức độ khó.

Kết quả trên ngân hàng cuối: **17/17 kiểm thử đạt**, gồm 500 seed của ngân hàng thật. TypeScript và build production đạt; Service Worker liệt kê 97 tài nguyên cục bộ. Vite có cảnh báo kích thước bundle JavaScript khoảng 551 kB (168 kB gzip); không phải lỗi build.

Phiên bản ngân hàng: `2026.10-deeb45322c52`. SHA-256 của JSON ngân hàng chuẩn hóa: `deeb45322c520a12c515f058f27ca572d12ee02d86bbf5d6dcb964560cffe1ec`. Validator ghi 926 câu, 69 câu hình, 27 tệp/nhóm hình, không lỗi cấu trúc/tài sản, không trùng ID/câu dẫn hoàn toàn và không có cặp vượt ngưỡng tương đồng văn bản 0,83. Ngưỡng này không bảo đảm loại hết trùng ý nghĩa.

## Nội dung và phạm vi nghiệm thu

Mọi câu cần có bốn phương án riêng biệt, đáp án, giải thích, nguồn xác định được và mục tiêu học tập. Mọi câu hình cần bệnh cảnh riêng, nhiệm vụ đọc hình, hình thật có nguồn/quyền sử dụng và phân biệt ca nguồn với giả định giảng dạy. Các kiểm tra nguồn và đọc chéo nằm trong `content/audit-*.md` và `content/cross-audit-*.md`; kết quả cấu trúc nằm trong `content/validation-report.json`.

Sáu topic có 163/163/150/150/150/150 câu, tổng 926; phân bố bốn mức là 99/106/361/360. Các P1 được phát hiện trong các vòng đọc chéo đã được sửa và đọc lại trước khóa JSON. Đối chiếu trích đoạn cục bộ: 475 tham chiếu ở Topic 1/2, 458 ở Topic 3/4, 483 ở Topic 5/6, tổng 1.416, khớp đúng trang sau chuẩn hóa Unicode/khoảng trắng. Việc khớp trích đoạn xác minh khả năng truy xuất nguồn; kết luận nội dung vẫn dựa vào đọc câu, điều kiện guideline và lời giải trong phạm vi từng audit.

Việc biên soạn, đối chiếu trang nguồn và đọc chéo do các tác vụ Codex thực hiện, chưa có hội đồng lâm sàng độc lập nghiệm thu hoặc dữ liệu người học để hiệu chỉnh độ khó thực nghiệm. Một số phương án nhiễu còn diễn đạt tuyệt đối hoặc chênh lệch độ dài, được ghi trong audit để có thể cải thiện ở phiên bản sau.

Chưa kiểm tra trên Firefox, điện thoại vật lý hoặc mọi điều kiện thiếu dung lượng/chế độ riêng tư. Nhập CSV/JSON và sao lưu được kiểm tra bằng bộ kiểm thử dữ liệu; chưa hoàn tất mọi luồng chọn tệp trên mọi trình duyệt. Dữ liệu không tự đồng bộ giữa thiết bị. Website tĩnh phục vụ ôn tập và tự kiểm tra.
