# Kiểm tra bản rà soát toàn bộ 926 câu — 11/10/2026

Phiên bản ngân hàng: **`2026.10-cbb5eadfe4e0`**. SHA-256 JSON chuẩn hóa: `cbb5eadfe4e070a5914094f7f0f0b512aacc6d213da668a820882214f7cf4aff`. Đề chuẩn có 90 câu trong 90 phút, 15 câu/topic, phân bố 9/9/36/36 theo bốn mức độ và 18 nhóm hình khác nhau. Kết quả ghi số đúng/tổng số câu; không có thang điểm hoặc tự luận.

## Nội dung và nguồn

Toàn bộ 926 ID có hồ sơ `closed`, được đọc đầy đủ tình huống, yêu cầu, bốn phương án, bốn lý do, đáp án và điều kiện áp dụng nguồn. Xem [báo cáo tổng hợp](content/reaudit-summary.md), [sổ từng ID](content/reaudit-index.json) và ba sổ theo topic. Có 69 câu hình ảnh học sử dụng 27 tệp hình/nhóm ca; mỗi câu có bệnh cảnh cụ thể, nhiệm vụ rõ, hình thực tế và nguồn/quyền sử dụng. Không còn cờ nội dung đã xác định chờ sửa trong các sổ cuối.

Mức độ dựa vào nhiệm vụ nhận thức của câu; 721 câu thuộc mức vận dụng/vận dụng cao. Đối chiếu nguồn và đọc chéo của Codex chưa tương đương nghiệm thu bởi hội đồng lâm sàng hoặc đo độ khó từ dữ liệu người làm bài. Kiểm tra cấu trúc và tương đồng chỉ hỗ trợ phát hiện vấn đề, không thay thế việc đọc chuyên môn từng câu.

## Kiểm tra tự động trên ngân hàng cuối

- `pnpm assemble`: tổng hợp đủ 926 câu; phiên bản được tạo từ nội dung.
- `pnpm validate`: nguồn, ảnh, ID, lựa chọn, mức độ, quyền tài sản và ma trận ngân hàng đạt. Nhật ký ở [validation-report.json](content/validation-report.json).
- `pnpm validate:audit`: bao phủ 926 ID; đối chiếu hash ngân hàng, từng câu, điều kiện nguồn và 69 bộ bệnh cảnh–ảnh–nhiệm vụ đạt. Trình kiểm tra đọc lại sổ gốc để phát hiện nhật ký không còn khớp nội dung.
- `pnpm test`: **17/17 đạt**. Bộ ngân hàng thật kiểm tra 500 seed: 90 ID riêng, 15 câu/topic, phân bố 9/9/36/36, 18 nhóm ảnh và không lặp tệp hình. Các bộ khác kiểm tra chia sẻ, chấm/lưu bài, hạn giờ, IndexedDB và nhập/xuất.
- `pnpm build`: TypeScript và Vite production đạt; Service Worker tạo cache tài nguyên. Cảnh báo kích thước bundle của Vite không làm build thất bại.

Kiểm tra âm tính dùng bản sao tạm: sửa nội dung ngân hàng nhưng giữ nhật ký cũ, hoặc xóa điều kiện đọc nguồn trong sổ gốc, phải làm kiểm tra thất bại. Cả **21 tình huống âm tính** đều bị từ chối đúng lý do; finalizer lỗi giữ nguyên index thử nghiệm. Xem [báo cáo toàn vẹn](content/reaudit-integrity.md).

## Phát hành và kiểm tra trình duyệt

Website: [Phụ khoa — Góc học lâm sàng](https://nha4ngyt-afk.github.io/phu-khoa-master/). Commit nội dung: [`3d55395732f894e0bc73883a9bb2d766b83fe9bc`](https://github.com/nha4ngyt-afk/phu-khoa-master/commit/3d55395732f894e0bc73883a9bb2d766b83fe9bc). Workflow [Publish static website, run 38128228412](https://github.com/nha4ngyt-afk/phu-khoa-master/actions/runs/38128228412) **hoàn tất thành công**, gồm cài dependencies, tổng hợp, kiểm tra ngân hàng, kiểm tra sổ rà soát, test, build và deploy GitHub Pages. Cả job build và deploy đều có kết luận `success`.

Đã mở URL công khai trong **cửa sổ Safari riêng tư mới** sau deploy và quan sát:

- Trang chủ hiển thị đúng phiên bản `2026.10-cbb5eadfe4e0`, 926 câu và sáu topic.
- Bộ lọc “Có hình” trong ngân hàng hiển thị 69 câu.
- Câu `T3-145` hiển thị tình huống lâm sàng, yêu cầu xử trí tích hợp, ảnh MRI hai phần, bốn phương án, đáp án và giải thích. Mục nguồn mở được, có Agostinho et al. 2017, tài liệu Topic 3, SOGC 437, Figure 3 và giấy phép CC BY 4.0.
- Màn hình tạo đề có đủ sáu topic, 90 câu, 90 phút, tỉ lệ 10/10/40/40, 20% câu có hình (18 câu) và cách ghi kết quả “Số đúng / tổng câu”. Không bắt đầu bài thi trong phiên kiểm tra này.
- Đã lưu ảnh trang chủ và ca MRI làm bằng chứng trong gói bàn giao sau rà soát.

Các tab cũ trong trình duyệt tích hợp vẫn có thể đang được Service Worker phiên bản trước phục vụ. Việc kiểm tra Safari riêng xác nhận bản mới đã phát hành mà không xóa dữ liệu hoặc thay đổi bài làm trong các tab hiện có. Đóng các tab website rồi mở lại khi có mạng để nhận tài nguyên mới.

Các luồng giao diện lưu bài, hết giờ, ngoại tuyến, chia sẻ và responsive đã kiểm ở phiên bản trước được lưu riêng tại [previous-release-test-report.md](content/previous-release-test-report.md). Lượt hiện tại kiểm tra ngân hàng mới, kiểm thử tự động và các quan sát Safari nêu trên; không nhận đã lặp mọi tổ hợp trên mọi trình duyệt/điện thoại, hoặc đã kiểm tra console trong Safari bằng công cụ phát triển.

Nếu đã sửa ngân hàng trên thiết bị, hãy sao lưu rồi dùng **Cài đặt → Khôi phục ngân hàng gốc** sau khi hoàn tất bài đang làm để nhận bản chung. Website giữ bản chụp câu cũ trong lịch sử và bài đang làm.
