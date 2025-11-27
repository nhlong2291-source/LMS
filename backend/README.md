# LMS Backend - Nhật ký làm việc

## Tóm tắt các bước đã thực hiện

1. Khởi tạo dự án backend (Node.js/Express/MongoDB), frontend (React/Vite).
2. Cài đặt các thư viện cần thiết: express, mongoose, bcryptjs, multer, dotenv, jsonwebtoken...
3. Tạo các model: User, Course, Module, Lesson, LessonProgress, ShopItem, Notification, ...
4. Tạo các controller và route cho: user, admin, course, module, lesson, progress, shop, notification, ...
5. Tích hợp xác thực JWT, phân quyền admin, bảo vệ route.
6. Tích hợp mã hóa mật khẩu bằng bcryptjs.
7. Tạo API CRUD cho các entity chính (user, course, module, lesson, ...).
8. Tạo API cho phép tạo module/lesson trong course, lesson hỗ trợ video (url Vimeo) và quiz (file CSV, câu hỏi trắc nghiệm 4 đáp án).
9. Thêm trường kiểm soát tiến trình xem video, bắt buộc hoàn thành bài học/quizz mới được sang bài tiếp theo.
10. Tạo controller và route tặng GEM cho user khi hoàn thành toàn bộ khóa học.
11. Hướng dẫn kiểm thử API bằng Thunder Client/Postman: đăng ký, đăng nhập, tạo course/module/lesson, cập nhật tiến trình học, nhận GEM.
12. Hướng dẫn cách cập nhật tiến trình học cho user test để kiểm thử nhận GEM.

## Ghi chú

- Nếu gặp lỗi, kiểm tra log server, kiểm tra lại dữ liệu đầu vào, token, quyền truy cập.
- Để kiểm thử các chức năng, dùng Thunder Client/Postman với các API đã liệt kê ở trên.
- Để tiếp tục phát triển: có thể bổ sung API lấy danh sách module/lesson, API thống kê, API quản lý shop, ...

## TODO tiếp theo (gợi ý)

- Bổ sung API lấy danh sách module/lesson cho course.
- Bổ sung API thống kê tiến trình học, lịch sử giao dịch shop.
- Tích hợp upload file quiz CSV thực tế.
- Tối ưu hóa bảo mật, kiểm thử toàn bộ luồng đăng ký/đăng nhập/role.
- Viết test tự động cho các API quan trọng.

---

_File này dùng để ghi nhớ toàn bộ quá trình làm việc và định hướng cho các bước tiếp theo._
