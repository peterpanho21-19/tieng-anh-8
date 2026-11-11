// Cấu hình bộ đếm lượt xem / lượt tải.
// Để trống các giá trị firebase: trang vẫn chạy bình thường, chỉ hiện dấu "–" thay cho số đếm.
// Cách điền: xem README.md (Bước 2).
window.SITE_CONFIG = {
  firebase: {
    apiKey: "AIzaSyBtyc3kdeXLH8ImMW-52bXlUrrkf5A_-bo",
    authDomain: "eng8-53ba0.firebaseapp.com",
    projectId: "eng8-53ba0",
    appId: "1:350700042448:web:03b3794365a6c8843046d5"
  },
  // Chỉ hiện số đếm khi giá trị >= ngưỡng này. Đặt 0 để luôn hiện.
  // Gợi ý: nếu số còn nhỏ, đặt 10 để trang không trông vắng.
  hienThiToiThieu: 0
};
