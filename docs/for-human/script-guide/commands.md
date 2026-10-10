# Các lệnh scripts

Chạy lệnh từ thư mục gốc repository. Cần cài và đăng nhập CLI provider được
chọn. Mỗi lệnh nhận một yêu cầu đặt trong dấu ngoặc kép.

| Lệnh | Mục đích | Vai trò khởi chạy |
| --- | --- | --- |
| `bash scripts/plan-feature.sh "<epic>"` | Yêu cầu lập kế hoạch theo backlog và phụ thuộc | `coordinator` |
| `bash scripts/implement-feature.sh "<stage hoặc yêu cầu>"` | Chạy workflow cho stage: implement, review, test, validate và checkpoint | `coordinator` |
| `bash scripts/fix-bug.sh "<mô tả lỗi và cách tái hiện>"` | Điều tra và sửa lỗi qua workflow có các gate | `coordinator` |
| `bash scripts/run-archivist.sh "<đường dẫn kết quả hoặc tóm tắt>"` | Ghi tri thức sau khi run thành công | `archivist` |
| `bash scripts/run-agent.sh <role> "<yêu cầu>"` | Gọi trực tiếp một vai trò | Vai trò truyền vào |
| `bash scripts/run-task.sh <role> <prompt-file> "<task>"` | Ghép task với prompt file rồi gọi một vai trò | Vai trò truyền vào |

`implement-feature.sh` nhận thêm `--scope <đường-dẫn>` để tập trung vào spec
bên dưới `specs/`. Scope này không thay thế các hợp đồng workflow và spec bắt
buộc. `run-task.sh` yêu cầu prompt file tồn tại.

Các script tác vụ chấp nhận `--model <tên>`, `--verbose` và `--dry-run`.
`implement-feature.sh` cũng hỗ trợ các tùy chọn đó. `run-agent.sh` là điểm gọi
thấp hơn và chỉ nhận role cùng yêu cầu.

Để xem cú pháp tại terminal, chạy lệnh với `--help`, ví dụ:

```text
bash scripts/implement-feature.sh --help
```

Đầu ra thành công của provider chỉ cho biết tiến trình provider hoàn tất.
Hãy xem kết quả có cấu trúc và bằng chứng kiểm tra trước khi xem stage là hoàn
tất; workflow yêu cầu mọi gate bắt buộc phải pass và checkpoint thành công.
