# Nguồn và quyền sử dụng

Các tài liệu PDF/Word gốc do người dùng cung cấp không được phát hành cùng website. Tên tài liệu và trang được giữ ở câu hỏi để đối chiếu tại thư mục nguồn.

Hình chẩn đoán thuộc tác giả/nhà xuất bản gốc. Mỗi bản ghi ảnh có `sourceUrl`, `credit`, `license` và có thể có `licenseUrl`. Danh mục tổng hợp được tạo tại `public/data/image-credits.json`. Một số nguồn dùng giấy phép CC BY-NC: sử dụng giáo dục phi thương mại phải giữ dẫn nguồn và điều kiện giấy phép; không dùng bản website này để bán ngân hàng hình hoặc suy diễn quyền sử dụng thương mại.

Không áp một giấy phép chung lên ảnh, tài liệu gốc hoặc các trích đoạn nguồn. Khi bổ sung ảnh, chỉ sử dụng ảnh có quyền dùng được xác định và giữ nguyên dẫn nguồn. Nguồn có ảnh xem được công khai nhưng chưa rõ quyền tái phát hành phải được loại khỏi bản build.

Các thư viện phần mềm React, React DOM, Vite, TypeScript và KaTeX giữ giấy phép mã nguồn mở tương ứng của chúng. Chúng được cài từ registry và đóng gói tại chỗ; font KaTeX cũng được phân phối trong bản build.

Bản giấy phép nguyên văn của các thư viện có trong tài nguyên website được giữ tại `public/licenses/react-LICENSE.txt`, `public/licenses/react-dom-LICENSE.txt` và `public/licenses/katex-LICENSE.txt`. Các công cụ phát triển giữ giấy phép trong gói dependency tương ứng khi cài bằng pnpm.
