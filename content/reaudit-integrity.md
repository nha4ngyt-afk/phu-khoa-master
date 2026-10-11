# Kiểm tra toàn vẹn vòng rà soát cuối

Ngày 11/10/2026. Trạng thái: **đạt**, ngân hàng **2026.10-cbb5eadfe4e0**, SHA-256 JSON chuẩn Node: `cbb5eadfe4e070a5914094f7f0f0b512aacc6d213da668a820882214f7cf4aff`.

Đã đối chiếu đủ **926 bản ghi** trong sáu topic với ngân hàng đã biên dịch, ba ledger gốc và index cuối. Từng ID phải có `fullRecordRead: true`, trạng thái `closed`, thao tác tư duy, nguồn đúng khóa file–trang hoặc URL với `verified: true` và điều kiện áp dụng không rỗng. Hash câu phải do người phụ trách ghi trong ledger cuối; finalizer không tự tạo hash thay thế khi thiếu hoặc đã cũ. Có **1338 lượt tham chiếu nguồn** được đối chiếu.

Đủ **69 câu ảnh**, **27 tệp/nhóm ảnh**: các cờ tình huống lâm sàng, ảnh thực, yêu cầu đề bài và nguồn gốc phải rõ; phát hiện nhìn thấy phải có mô tả; tài sản và nhóm được đọc phải trùng bản cuối. Cờ dạng chuỗi như `"false"` không được xem là xác nhận. Hash byte ảnh được kiểm thêm ở những ledger có lưu hash này.

Index gắn với hash từng bản ghi ledger, toàn ledger, ledger chéo và ledger peer. Đường dẫn ledger chỉ được lấy từ ba tệp cho phép. Ledger chéo cuối phải gắn đúng hash ngân hàng và từng câu trong cặp. Hash `AtPeerRead` được bảo toàn như lịch sử đọc; không bị đổi thành hash mới để đạt kiểm tra.

Fixture trong thư mục tạm sử dụng bản sao 926 câu và **ledger mô phỏng chỉ dành cho kiểm thử**, không tạo sự chấp nhận nội dung. Trường hợp dương tính đạt; **21 tình huống âm tính** đều bị chặn đúng nhánh. Các lần finalizer thất bại không ghi đè index fixture cũ.

1. changed current question / stale owner hash: validator từ chối; finalizer từ chối trước khi ghi.
2. missing owner hash (Python hash alone not accepted): validator từ chối; finalizer từ chối trước khi ghi.
3. missing full record read: validator từ chối; finalizer từ chối trước khi ghi.
4. whitespace source condition: validator từ chối; finalizer từ chối trước khi ghi.
5. source verified truthy string: validator từ chối; finalizer từ chối trước khi ghi.
6. extra raw ID: validator từ chối; finalizer từ chối trước khi ghi.
7. duplicate bank ID: validator từ chối; finalizer từ chối trước khi ghi.
8. image truthy false flag: validator từ chối; finalizer từ chối trước khi ghi.
9. image unfinished status: validator từ chối; finalizer từ chối trước khi ghi.
10. image empty visible finding: validator từ chối; finalizer từ chối trước khi ghi.
11. image reviewed asset mismatch: validator từ chối; finalizer từ chối trước khi ghi.
12. image group mismatch: validator từ chối; finalizer từ chối trước khi ghi.
13. image published byte hash mismatch: validator từ chối; finalizer từ chối trước khi ghi.
14. unknown cross review status: validator từ chối; finalizer từ chối trước khi ghi.
15. unknown peer review status: validator từ chối; finalizer từ chối trước khi ghi.
16. cross final bank hash stale: validator từ chối; finalizer từ chối trước khi ghi.
17. cross final candidate hash stale: validator từ chối; finalizer từ chối trước khi ghi.
18. index forged question hash: validator từ chối; kiểm tra sai lệch sau tổng hợp.
19. index unapproved raw ledger path: validator từ chối; kiểm tra sai lệch sau tổng hợp.
20. raw changed after consolidation: validator từ chối; kiểm tra sai lệch sau tổng hợp.
21. peer history changed after consolidation: validator từ chối; kiểm tra sai lệch sau tổng hợp.

Validator thật sau tổng hợp: **926/926 bản ghi, 69 kiểm tra ảnh, 0 lỗi**. Bản đối chiếu trước–sau ghi nhận 720 câu thay nội dung hoặc mức; 511 câu thay tình huống/yêu cầu; 699 câu thay lựa chọn; 461 câu thay tham chiếu nguồn. Các con số là diff kỹ thuật, không thay cho đánh giá chất lượng.

Giới hạn: script kiểm tra sự nhất quán và ràng buộc bằng hash; không tự xác nhận đáp án y khoa, hành vi đọc của người rà soát hoặc độ khó đo bằng tâm trắc. Không thay nội dung câu hỏi hay các ledger tác giả trong lượt sửa script này.
