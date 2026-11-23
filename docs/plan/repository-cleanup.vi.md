# Kế hoạch dọn cấu trúc kho Noname

Mục tiêu là giữ một gói pnpm cho toàn dự án, đặt cấu hình theo phạm vi sử dụng và làm rõ ranh giới giữa giao diện, host và luật chơi. Mỗi PR có thể được review và kiểm tra độc lập.

## Cấu trúc đích

| Vị trí | Trách nhiệm |
| --- | --- |
| Root | Manifest, lockfile, cấu hình TypeScript và Biome toàn repo, README, RULES.md và AGENTS.md |
| `.github/workflows/` | CI |
| `web-game/` | Next.js, UI, state trình duyệt, tài nguyên tĩnh và cấu hình Next.js, PostCSS, shadcn, TypeScript của ứng dụng |
| `backend/` | Host HTTP và Socket.IO, phiên chơi và persistence trong `db/` |
| `game-engine/` | Trạng thái miền, luật chơi và chuyển trạng thái độc lập với giao diện, transport và database |
| `shared/` | Contract trao đổi giữa trình duyệt và host |
| `tests/` | Test suites, cấu hình Vitest và Playwright, E2E trong `e2e/` |
| `specs/`, `docs/`, `agents/` | Đặc tả, tài liệu dự án và hướng dẫn theo vai trò |

## PR 1 — Dọn file cục bộ và cache

- Bỏ theo dõi các file `.DS_Store` và bản backup SQLite đang nằm trong Git. Giữ bản backup và database trên đĩa.
- Ignore `.DS_Store` và pnpm store cục bộ. Chuyển cache typecheck ở root vào `node_modules/.cache/`.
- Xóa các `.gitkeep` trong thư mục đã có nội dung được theo dõi. Giữ recovery checkpoint trong `docs/temps/` để có thể dùng khi cần khôi phục.
- Kiểm tra danh sách file trong Git, quy tắc ignore và vị trí cache trong checkout sạch. Chạy lint, typecheck, test, build và E2E.

## PR 2 — Đặt cấu hình theo phạm vi

- Chuyển `components.json` vào `web-game/`, chỉnh đường dẫn CSS và ghi rõ cách chạy shadcn từ thư mục ứng dụng. Kiểm tra CLI nhận đúng CSS và alias.
- Chuyển cấu hình Vitest và Playwright vào `tests/`, cập nhật các script pnpm và đường dẫn alias, test, output, thư mục khởi chạy host.
- Đối chiếu danh sách test trước và sau. Chạy unit, integration và E2E với host do Playwright khởi động từ root để kiểm tra đúng vị trí SQLite.

## PR 3 — Tách Game Engine

- Chuyển `web-game/game/` sang `game-engine/`, giữ tên module và hành vi luật chơi. Cập nhật import, phạm vi lint trong CI và các đường dẫn trong tài liệu.
- Cập nhật đặc tả cấu trúc cùng thay đổi. Backend và UI sử dụng domain thông qua các module độc lập với React, Socket.IO và SQLite.
- Kiểm tra đường dẫn cũ trong mã và cấu hình. Chạy lint bao phủ `game-engine/`, typecheck, unit/integration test, production build và E2E.
