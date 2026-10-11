# Kiểm tra bản rà soát toàn bộ926 câu — 11/10/2026

Phiên bản ngân hàng: **`2026.10-cbb5eadfe4e0`**. SHA-256 JSON chuẩn hóa: `cbb5eadfe4e070a5914094f7f0f0b512aacc6d213da668a820882214f7cf4aff`. Đề chuẩn90 câu/90 phút,15câu/topic,9/9/36/36 theo mức độ,18 nhóm hình khác nhau. Kết quả ghi số đúng/tổng, không có thang điểm hoặc tự luận.

## Nội dung và nguồn

Toàn bộ926 ID có hồ sơ `closed`, đọc đầy đủ câu/bốn phương án/bốn lý do/đáp án và điều kiện nguồn. Xem[`content/reaudit-summary.md`](content/reaudit-summary.md), sổ từng ID[`content/reaudit-index.json`](content/reaudit-index.json) và ba sổtopic.69 câu hình dùng27 tệp/nhóm, có bệnh cảnh cụ thể, nhiệm vụ rõ, hình thực tế và nguồn/quyền sử dụng. Không còn cờ nội dung đã xác định chờ sửa trong các sổ cuối.

Mức độ dựa vào nhiệm vụ nhận thức thực;721 câu ở mức vận dụng/vận dụng cao. Đối chiếu nguồn và đọc chéo củaCodex chưa tương đương nghiệm thu bởi hội đồng lâm sàng hoặc đo độ khó từ người làm bài. Không dùng kết quả kiểm tra cấu trúc/tương đồng làm bằng chứng duy nhất về chuyên môn hoặc không trùng ý.

## Kiểm tra tự động trên ngân hàng cuối

- `pnpm assemble`:tổng hợp đủ926 câu, phiên bản được tạo từ nội dung.
- `pnpm validate`:nguồn/ảnh/ID/lựa chọn/mức độ/quyền tài sản và ma trận ngân hàng đạt. Nhật ký ở[`content/validation-report.json`](content/validation-report.json).
- `pnpm validate:audit`:bao phủ926 ID, hash ngân hàng/từngcâu, điều kiện nguồn và kiểm tra69 bệnh cảnh–ảnh–nhiệm vụ đạt. Kiểm tra đọc lạiRAWledger để chặn nhật ký stale.
- `pnpm test`:**17/17 đạt**. Bộ ngân hàng thật kiểm500 seed:90 ID riêng,15/topic,9/9/36/36,18 nhóm ảnh và không lặp tệp hình. Các bộ khác kiểm tra chia sẻ, chấm/lưu bài, hạn giờ, IndexedDB và nhập/xuất.
- `pnpm build`:TypeScript và Vite production đạt, ServiceWorker tạo cache toàn tài nguyên. Cảnh báo bundle lớn củaVite là cảnh báo kích thước, không phải lỗi build.

Kiểm tra âm tính của audit dùng bản sao tạm: thay nội dungbank trong khi giữledger cũ, hoặc xóa điều kiện đọc nguồn trongRAW, phải làm kiểm tra thất bại. Đã kiểm tra 21 tình huống âm tính, tất cả bị từ chối đúng lý do; finalizer lỗi giữ nguyên index thử nghiệm. Chi tiết ở [báo cáo toàn vẹn](content/reaudit-integrity.md).

## Phát hành và kiểm tra trình duyệt

Website:[Phụ khoa — Góc học lâm sàng](https://nha4ngyt-afk.github.io/phu-khoa-master/). Workflow[Publish static website](https://github.com/nha4ngyt-afk/phu-khoa-master/actions) kiểmtra install,assemble,bankvalidator,auditvalidator,test,build rồiDeployPages.

Báo cáo này ghi kiểm thử cục bộ đã thực hiện trước bước phát hành. Kết quảworkflow và kiểm tra công khai của đúng phiên bản sẽ được bổ sung sau deploy; không dùng workflow hoặc ảnh phiên bản cũ để xác nhận bản mới.

Các luồngUI lưu/hết giờ/ngoại tuyến/chia sẻ/responsive đã kiểm ở phiên bản trước được lưu riêng tại[`content/previous-release-test-report.md`](content/previous-release-test-report.md). Lượt hiện tại tập trung ngân hàng mới, kiểm thử tự động và kiểmtraUI công khai sau deploy; không nhận đã lặp mọi tổhợp trên mọi trình duyệt/điện thoại.

Nếu đã sửa ngân hàng trên thiết bị, hãy sao lưu rồi dùng **Cài đặt → Khôi phục ngân hàng gốc** sau khi hoàn tất bài đang làm để nhận bản chung. Website giữ bản chụp câu cũ của lịch sử/bài đang làm. Nếu Service Worker còn giữ bản trước, đóng các tab website rồi mở lại khi có mạng.
