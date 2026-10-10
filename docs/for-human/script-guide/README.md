# Hướng dẫn scripts

Bộ scripts trong `scripts/` là giao diện dòng lệnh để gửi yêu cầu tới agent
qua Codex hoặc OpenCode. Các vai trò và phạm vi công việc được định nghĩa ở
`agents/`; script chọn file vai trò tương ứng và đưa nội dung đó vào yêu cầu.

## Các trang

- [Các lệnh người dùng](commands.md): chọn lệnh để lập kế hoạch, làm tính năng,
  sửa lỗi hoặc lưu tri thức sau run.
- [Vai trò và luồng gọi](roles-and-flow.md): cách vai trò từ `agents/` được
  nối vào các script.
- [Provider và tùy chọn](providers-and-options.md): chọn Codex/OpenCode, model,
  xem prompt và chạy dry run.

Workflow có thẩm quyền được mô tả trong [specs/workflow.md](../../../specs/workflow.md),
còn ranh giới provider trong [specs/providers.md](../../../specs/providers.md).
Các trang này giải thích cách dùng scripts hiện có; chúng không thay thế specs.
