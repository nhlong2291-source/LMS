# ---

# Nhật ký phiên làm việc gần nhất (28/11/2025)

## Tổng hợp các thay đổi và logic đã triển khai

- Tự động hóa phân quyền view cho 4 role (student, instructor, manager, admin) bằng middleware viewAccess.
- Tạo controller chi tiết cho từng view và từng role, trả về dữ liệu thực tế từ MongoDB.
- Tích hợp autoViewAccess để tự động kiểm tra quyền và phân nhánh controller theo role cho từng route.
- Sửa lỗi import/export, module.exports, require, OverwriteModelError cho các model Mongoose.
- Chuẩn hóa export model để tránh lỗi khi import nhiều lần.
- Sửa lỗi ES module (require/module.exports -> import/export const).
- Bổ sung logic thực tế cho các controller: course, forum, resource, exam, survey, shop, ...
- Đã test các API phân quyền, trả về dữ liệu đúng theo role.

## Các việc đang dở/chưa hoàn thành

- Một số controller mới chỉ trả về dữ liệu mẫu, chưa đầy đủ logic thực tế cho từng trường hợp đặc biệt (ví dụ: lọc theo phòng ban phức tạp, thống kê nâng cao, lịch sử giao dịch shop, leaderboard, ...).
- Chưa viết test tự động cho các API phân quyền và các luồng chính.
- Chưa tối ưu hóa bảo mật cho các route upload, import user, ...
- Chưa hoàn thiện API thống kê tiến trình học, lịch sử giao dịch shop, leaderboard tổng hợp.
- Chưa kiểm thử toàn bộ luồng đăng ký/đăng nhập/role với dữ liệu lớn.

## Gợi ý việc làm tiếp theo

1. Bổ sung logic chi tiết cho các controller còn trả về dữ liệu mẫu, đặc biệt các trường hợp lọc theo phòng ban, instructor, manager, admin.
2. Viết test tự động cho các API chính (user, course, resource, shop, ...).
3. Tối ưu hóa bảo mật cho các route upload, import, phân quyền nâng cao.
4. Bổ sung API thống kê tiến trình học, lịch sử giao dịch shop, leaderboard tổng hợp.
5. Kiểm thử toàn bộ hệ thống với dữ liệu lớn, nhiều user, nhiều role.
6. Hoàn thiện tài liệu hướng dẫn test API cho từng role, từng chức năng.

# ---

# LMS Backend - Nhật ký làm việc

## Tóm tắt các bước đã thực hiện

1. Khởi tạo dự án backend (Node.js/Express/MongoDB), frontend (React/Vite).
2. Cài đặt các thư viện cần thiết: express, mongoose, bcryptjs, multer, dotenv, jsonwebtoken...
3. Tạo các model: User, Course, Module, Lesson, LessonProgress, ShopItem, Notification, Resource...
4. Tạo các controller và route cho: user, admin, course, module, lesson, progress, shop, notification, resource...
5. Tích hợp xác thực JWT, phân quyền admin, bảo vệ route.
6. Tích hợp mã hóa mật khẩu bằng bcryptjs.
7. Tạo API CRUD cho các entity chính (user, course, module, lesson, ...).
8. Tạo API cho phép tạo module/lesson trong course, lesson hỗ trợ video (url Vimeo) và quiz (file CSV, câu hỏi trắc nghiệm 4 đáp án).
9. Thêm trường kiểm soát tiến trình xem video, bắt buộc hoàn thành bài học/quizz mới được sang bài tiếp theo.
10. Tạo controller và route tặng GEM cho user khi hoàn thành toàn bộ khóa học.
11. Hướng dẫn kiểm thử API bằng Thunder Client/Postman: đăng ký, đăng nhập, tạo course/module/lesson, cập nhật tiến trình học, nhận GEM.
12. Hướng dẫn cách cập nhật tiến trình học cho user test để kiểm thử nhận GEM.
13. Tích hợp refresh token cho hệ thống xác thực JWT.
14. Tạo script tạo tài khoản user hàng loạt từ email, logic sinh username từ email/phòng ban.
15. Sửa logic xác thực, kiểm tra trùng email/username khi import user.
16. Tạo model, controller, route cho thư viện tài liệu/video (Resource): hỗ trợ upload file pdf, doc, ppt, nhúng video Vimeo.
17. Thêm API thống kê số lượng từng loại tài liệu/video.
18. Sửa lỗi import middleware, lỗi khai báo lại hàm, lỗi import default/named.
19. Hướng dẫn chi tiết test API, mẫu request, mẫu login, mẫu upload file.

## Các API đã test thành công

### User

- Đăng ký, đăng nhập, đổi mật khẩu
- Lấy thông tin user, cập nhật thông tin cá nhân
- Đổi role user (chỉ admin)
- Reset mật khẩu về mặc định (chỉ admin)

### Admin

- Đăng nhập admin, xác thực bằng x-admin-token
- Đổi role user: `POST /admin/change-user-role`
- Reset mật khẩu user: `POST /admin/reset-user-password`
- Tạo tài liệu/video: `POST /admin/resource` hoặc `POST /resource/upload`
- Thống kê số lượng tài liệu/video: `GET /resource/stats`

### Course/Module/Lesson

- Tạo course, module, lesson
- Gán khóa học cho user
- Cập nhật tiến trình học, nhận GEM khi hoàn thành khóa học

### Import

- Import user từ file JSON
- Script tạo user hàng loạt từ email

### Notification

- Tạo, cập nhật, lấy danh sách thông báo

### Shop

- Lấy danh sách vật phẩm shop
- Mua vật phẩm shop
- Lưu vật phẩm vào giỏ hàng

### Resource (Thư viện tài liệu/video)

- Tạo mới, upload file pdf, doc, ppt
- Nhúng video từ Vimeo
- Lấy danh sách, lấy chi tiết tài liệu/video
- Thống kê số lượng từng loại

### Khác

- Upload file
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
