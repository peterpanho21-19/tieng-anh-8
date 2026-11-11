# Website Tiếng Anh 8 – Tự học HK II

Trang web tĩnh (HTML/CSS/JS thuần, không cần cài đặt gì), có nút Xem / Tải về cho từng Unit và bộ đếm lượt xem, lượt tải hiển thị công khai.

- Lưu trữ trang: **GitHub Pages** (miễn phí)
- Lưu số đếm: **Firebase Firestore** (gói miễn phí)

Bạn cần: một tài khoản GitHub và một tài khoản Google. Làm xong Bước 1 là trang đã chạy được, các ô đếm hiện dấu "–". Bước 2 mới bật bộ đếm.

## Cấu trúc thư mục

```
index.html          Trang chủ
style.css           Giao diện
app.js              Danh sách tài liệu + logic đếm
config.js           Cấu hình bộ đếm (điền ở Bước 2)
firestore.rules     Luật bảo vệ bộ đếm (dán vào Firebase ở Bước 2)
pdf/                Các file PDF đã tách theo Unit, kèm đáp án riêng
```

## Bước 1 – Đưa trang lên mạng (GitHub Pages)

1. Giải nén file zip trên máy.
2. Vào github.com, đăng nhập, chọn **New repository**. Đặt tên (ví dụ `tieng-anh-8`), chọn **Public**, bấm **Create repository**.
3. Bấm **uploading an existing file**, kéo toàn bộ file và thư mục `pdf` vào (kéo cả thư mục, không kéo file lẻ trong đó), bấm **Commit changes**.
4. Vào **Settings → Pages**. Ở mục Source chọn **Deploy from a branch**, Branch chọn `main`, thư mục `/ (root)`, bấm **Save**.
5. Đợi 1–2 phút. Địa chỉ trang có dạng `https://<tên-tài-khoản>.github.io/tieng-anh-8/`.

## Bước 2 – Bật bộ đếm (Firebase)

1. Vào console.firebase.google.com, bấm **Add project**, đặt tên, tắt Google Analytics, bấm **Create**.
2. Vào **Build → Firestore Database → Create database**. Chọn vị trí gần Việt Nam (ví dụ `asia-southeast1`), chế độ **production mode**.
3. Mở tab **Rules**, xóa nội dung cũ, dán toàn bộ nội dung file `firestore.rules`, bấm **Publish**.
4. Vào **Project settings** (biểu tượng bánh răng) → mục **Your apps** → chọn biểu tượng web `</>` → đặt tên → **Register app**. Màn hình hiện đoạn cấu hình, copy 4 giá trị: `apiKey`, `authDomain`, `projectId`, `appId`.
5. Trên GitHub, mở file `config.js`, bấm biểu tượng bút chì, dán 4 giá trị vào giữa hai dấu ngoặc kép, bấm **Commit changes**.
6. Đợi 1–2 phút, tải lại trang, bấm thử nút **Xem**. Số đếm tăng và trong Firebase console (Firestore → collection `stats`) thấy tài liệu xuất hiện là bộ đếm đã chạy.

**Khuyến nghị bảo mật:** `apiKey` của web app Firebase nằm công khai là bình thường, việc bảo vệ do `firestore.rules` đảm nhiệm. Bạn vẫn nên giới hạn khóa này: vào Google Cloud Console → APIs & Services → Credentials → chọn khóa của dự án → Application restrictions → HTTP referrers → thêm `https://<tên-tài-khoản>.github.io/*`.

## Thêm hoặc sửa tài liệu

1. Đặt file PDF vào thư mục `pdf/`.
2. Trong `app.js`, thêm một dòng vào danh sách `DOCS` (hoặc `EXTRA`). `id` trùng với tên file (không có `.pdf`), chỉ gồm chữ thường, số, dấu gạch ngang, tối đa 40 ký tự.
3. Không tạo tay các tài liệu trong collection `stats` trên Firebase. Trang tự tạo, và bộ luật yêu cầu mỗi tài liệu có đủ hai trường `views`, `downloads`.

## Giới hạn và lưu ý

- **Số đếm chỉ mang tính tham khảo.** Việc đếm chạy trên trình duyệt nên người biết kỹ thuật có thể làm tăng giả. Luật chỉ giới hạn mỗi lần ghi tăng tối đa 1 đơn vị, không ngăn được việc ghi lặp. Đừng dùng số này làm bằng chứng doanh thu hay báo cáo chính thức.
- Mỗi trình duyệt chỉ được tính 1 lần cho mỗi tài liệu và mỗi loại (xem, tải) trong 12 giờ. Người xóa dữ liệu trình duyệt sẽ được tính lại.
- Nếu số còn nhỏ, đặt `hienThiToiThieu: 10` trong `config.js` để chưa hiện số. Một bộ đếm ghi "3 lượt tải" làm người mới nghĩ tài liệu không ai dùng.
- Mọi file PDF (kể cả đáp án) công khai với bất kỳ ai biết đường link. Cách này không phù hợp nếu bạn muốn thu phí tài liệu.
- Trang không thu thông tin cá nhân. Nếu sau này thêm form thu thông tin học sinh, hãy xem quy định bảo vệ dữ liệu cá nhân của trẻ em trước.
- Hạn mức miễn phí của Firebase và GitHub Pages có thể thay đổi. Hãy kiểm tra trang giá và tài liệu chính thức của họ, tôi không xác minh số liệu hiện tại.
- Nếu trang không đếm được và Console trình duyệt báo lỗi tải module Firebase, đổi số phiên bản `10.12.2` trong `app.js` sang phiên bản mới nhất theo tài liệu Firebase.
- Footer của trang ghi tài liệu là bổ trợ tự biên soạn, không phải ấn phẩm chính thức của nhà xuất bản. Hãy tự quyết định cách dùng tên sách "Global Success" trong quảng cáo và đặt tên trang.
