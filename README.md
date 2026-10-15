# 💎 ExpenseFlow - Hệ Thống Quản Lý Chi Tiêu Cá Nhân

Hệ thống quản lý chi tiêu cá nhân hoàn chỉnh được xây dựng với **Backend NestJS + TypeORM + MySQL** và **Frontend React 19 + Vite**, hỗ trợ phân quyền hai luồng riêng biệt cho **Quản trị viên (Admin)** và **Người dùng (User)**.

---

## 🚀 Địa Chỉ Truy Cập Ứng Dụng

- **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Database**: MySQL `expense_manager` trên cổng `3306`

---

## 🔑 Tài Khoản Mẫu Trải Nghiệm (Tự Động Seed)

Trên trang Đăng nhập [http://localhost:5173/login](http://localhost:5173/login), hệ thống đã tích hợp sẵn **2 nút 1-click Demo** tiện lợi:

| Vai Trò | Email Đăng Nhập | Mật Khẩu | Mô Tả Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@expense.com` | `admin123` | Toàn quyền quản trị tài khoản, xem tất cả chi tiêu, phê duyệt/từ chối yêu cầu chỉnh sửa |
| **User** | `user@expense.com` | `user123` | Quản lý chi tiêu cá nhân, tìm kiếm, gửi yêu cầu chỉnh sửa để admin duyệt |

---

## 🌟 Các Tính Năng Đã Hoàn Thiện

### 👤 1. Flow Người Dùng (User Flow)
1. **Đăng ký & Đăng nhập**:
   - Form đăng ký tài khoản mới với mã hóa mật khẩu bcrypt (1 chiều an toàn).
   - Tự động cấp các danh mục chi tiêu mẫu khi vừa đăng ký (Ăn uống, Di chuyển, Mua sắm, Lương thưởng...).
2. **Bảng điều khiển cá nhân (Dashboard)**:
   - Thẻ thống kê: Tổng thu nhập, Tổng chi tiêu, Số dư khả dụng.
   - Biểu đồ cột Recharts so sánh Thu & Chi qua 12 tháng.
   - Biểu đồ tròn Recharts phân bổ tỷ trọng theo từng danh mục.
   - Danh sách 5 giao dịch gần nhất.
3. **Sổ chi tiêu & Tìm kiếm nâng cao**:
   - Thêm khoản chi tiêu / thu nhập (Số tiền, Mô tả, Ngày, Danh mục, Ghi chú).
   - **Tìm kiếm đa tiêu chí**: Từ khóa trong mô tả & ghi chú, lọc theo loại Thu/Chi, lọc theo Danh mục, lọc theo khoảng ngày (Từ ngày -> Đến ngày), lọc khoảng tiền.
   - Phân trang giao dịch mượt mà.
4. **Gửi yêu cầu chỉnh sửa chi tiêu (Edit Request Flow)**:
   - User không thể tùy tiện sửa trực tiếp để đảm bảo tính minh bạch.
   - Bấm nút **"Yêu cầu sửa"** trên bất kỳ khoản chi tiêu nào -> Mở modal nhập: Số tiền mới, Mô tả mới, Ngày mới, Danh mục mới, và **Lý do yêu cầu sửa (Bắt buộc)**.
   - Khoản chi tiêu tự động gắn nhãn trạng thái `Chờ duyệt sửa`.
5. **Theo dõi yêu cầu chỉnh sửa**:
   - Trang **"Yêu Cầu Chỉnh Sửa"** hiển thị danh sách các request đã gửi.
   - So sánh trực quan dữ liệu hiện tại vs dữ liệu mong muốn.
   - Xem lý do của bản thân và **lời nhắn phản hồi từ Admin**.
   - Cập nhật huy hiệu trạng thái: `Chờ duyệt`, `Đã duyệt & Áp dụng`, `Bị từ chối`.
6. **Quản lý danh mục cá nhân**:
   - Tự do tạo thêm danh mục mới với bảng chọn icon emoji sống động và màu sắc tùy biến.

---

### 🛡️ 2. Flow Quản Trị Viên (Admin Flow)
1. **Bảng điều khiển hệ thống (Admin Dashboard)**:
   - Thống kê toàn hệ thống: Tổng người dùng, Tổng số giao dịch, Tổng dòng tiền chi tiêu.
   - **Hộp cảnh báo yêu cầu chờ duyệt**: Thông báo số lượng yêu cầu chỉnh sửa cần giải quyết.
2. **Quản lý tài khoản người dùng**:
   - Xem danh sách toàn bộ người dùng và số lượng chi tiêu của từng người.
   - Thêm tài khoản mới (phân quyền Admin hoặc User).
   - Chỉnh sửa thông tin họ tên, email, mật khẩu, đơn vị tiền tệ, vai trò.
   - **Khóa / Mở khóa tài khoản**: Vô hiệu hóa tài khoản vi phạm (người dùng bị khóa sẽ không thể đăng nhập).
   - **Xóa tài khoản**: Xóa an toàn kèm xác thực chống tự xóa chính mình.
3. **Quản lý chi tiêu toàn hệ thống**:
   - Giám sát toàn bộ giao dịch của mọi người dùng trong hệ thống.
   - Lọc theo người dùng cụ thể, từ khóa, khoảng thời gian.
   - Quyền xóa các giao dịch không hợp lệ.
4. **Duyệt yêu cầu chỉnh sửa chi tiêu (Admin Review)**:
   - Xem danh sách yêu cầu cần duyệt, lọc theo trạng thái: Tất cả, Chờ duyệt, Đã duyệt, Đã từ chối.
   - Xem thông tin người gửi, đối chiếu dữ liệu cũ và dữ liệu mới kèm lý do người dùng gửi lên.
   - **Hành động Duyệt (Approve)**: Gửi phản hồi ghi chú -> **Hệ thống tự động cập nhật khoản chi tiêu tương ứng trong cơ sở dữ liệu**.
   - **Hành động Từ chối (Reject)**: Gửi phản hồi ghi chú lý do từ chối cho người dùng.

---

## 🎨 Thiết Kế Giao Diện (Rich Dark Glassmorphism)
- **Palette**: Nền Obsidian Dark `#070a12`, card thủy tinh mờ `backdrop-filter: blur(16px)`, hiệu ứng viền ánh sáng tinh tế.
- **Gradient**: Indigo/Purple gradient cho điểm nhấn chính, Emerald cho Thu nhập, Rose cho Chi tiêu, Amber cho Yêu cầu chờ duyệt.
- **Typography**: Google Fonts hiện đại `Plus Jakarta Sans` & `Outfit`.
- **Responsive**: Thích ứng hoàn hảo trên mọi độ phân giải màn hình.
