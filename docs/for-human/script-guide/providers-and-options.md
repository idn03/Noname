# Provider và tùy chọn

`run-agent.sh` chọn provider ở ranh giới adapter. Mặc định là Codex; đặt
`NONAME_PROVIDER=opencode` để dùng OpenCode:

```text
NONAME_PROVIDER=opencode bash scripts/plan-feature.sh "<epic>"
```

Giá trị được hỗ trợ là `codex` và `opencode`. `scripts/adapters/codex.sh` gọi
Codex CLI trong thư mục repository; `scripts/adapters/opencode.sh` gọi
OpenCode CLI tại thư mục đó. CLI tương ứng phải được cài và có thể chạy.

Chọn model bằng `--model <tên>` ở các lệnh tác vụ, hoặc đặt biến môi trường
`NONAME_MODEL`. Script chuyển model đến adapter; cú pháp gọi CLI theo provider
được giữ trong adapter.

`--verbose` in prompt đầy đủ ở các script tác vụ hỗ trợ tùy chọn này.
`--dry-run` dựng và hiển thị thông tin yêu cầu, rồi dừng trước khi khởi chạy
provider. Riêng `implement-feature.sh`, nếu không bật verbose thì chỉ in phần
đầu yêu cầu.

Lựa chọn provider là cấu hình tại biên tích hợp. Workflow và kết quả gate dùng
hợp đồng chung; provider thất bại hoặc thiếu bằng chứng không được tính là
workflow pass. Xem [specs/providers.md](../../../specs/providers.md) để biết
hợp đồng adapter.
