# Vai trò và luồng gọi

Mỗi vai trò có hướng dẫn riêng trong `agents/<role>.md`. `run-agent.sh` chỉ
chấp nhận danh sách role được khai báo trong script, xác nhận file hướng dẫn
tồn tại, rồi ghép hướng dẫn vai trò, `RULES.md` và yêu cầu thành prompt gửi tới
provider.

Các role hiện được script chấp nhận:

| Vai trò | Trách nhiệm chính |
| --- | --- |
| `coordinator` | Điều phối plan, stage, gate, sửa chữa có giới hạn, checkpoint và resumption |
| `researcher` | Điều tra chỉ đọc |
| `general-worker` | Xử lý một tác vụ nhỏ, cô lập |
| `implementer` | Sửa source trong phạm vi stage |
| `screen-implementer` | Sửa giao diện người dùng |
| `reviewer` | Đánh giá chỉ đọc |
| `tester` | Tạo và chạy test; chỉ sửa file test |
| `validator` | Gate chất lượng cuối, chỉ đọc |
| `design-validator` | Kiểm tra thiết kế khi stage có tham chiếu thiết kế |
| `archivist` | Ghi tri thức sau run thành công |

Các lệnh cấp cao thường khởi chạy coordinator. Prompt tương ứng yêu cầu
coordinator chọn specialist theo stage và chạy theo thứ tự workflow. Lệnh
archive khởi chạy archivist sau khi nhận kết quả run. `run-agent.sh` gọi trực
tiếp một role, nhưng bản thân lệnh này không thực thi toàn bộ workflow gate.

```text
plan-feature.sh / fix-bug.sh / implement-feature.sh
                         └── run-task.sh (trừ implement-feature)
                               └── run-agent.sh <role>
                                     ├── agents/<role>.md + RULES.md
                                     └── adapter Codex hoặc OpenCode

run-archivist.sh ── run-task.sh archivist ── run-agent.sh archivist
```

Workflow chuẩn là `plan → implement → review → test → validate → checkpoint`,
sau đó mới archive khi toàn bộ plan thành công. Gate, repair có giới hạn,
halting và resumption được quy định trong `specs/workflow.md`; scripts chuyển
yêu cầu cho coordinator chứ không tự xác nhận gate bằng nội dung tự thuật của
provider.
