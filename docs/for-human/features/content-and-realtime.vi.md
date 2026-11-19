# Luồng nội dung game và cập nhật thời gian thực

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    subgraph CONTENT[Chuẩn bị nội dung lúc khởi động]
        direction LR
        Bundled[Danh mục và thử thách\nđóng gói]
        Seed[Migration và seed]
        DB[(SQLite\nqua Drizzle)]
        Validate[Đọc và kiểm tra]
        Setup[Tạo pool thử thách\ntheo phiên]
        Bundled --> Seed --> DB --> Validate --> Setup
    end

    Engine[Game Engine sử dụng\npool của phiên]
    Setup --> Engine

    subgraph REALTIME[Lệnh và cập nhật thời gian thực]
        direction LR
        Browser[Trình duyệt]
        Handler[Socket.IO\nhandler]
        Session[Kiểm tra và cập nhật\nLobbySession]
        View[Tạo snapshot\ntheo quyền]
        Browser -->|lệnh| Handler --> Session --> View
        View -->|view mới| Browser
    end

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef storage fill:#f8efe0,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class Bundled,Seed,Validate,Setup,Engine,Browser,Handler,Session,View step;
    class DB storage;
```

Khi khởi động, `openContentDatabase` mở `.data/noname.db`, chạy Drizzle migration, seed dữ liệu đóng gói và tải danh mục/thử thách đã kiểm tra. Game setup tạo pool theo phiên từ nội dung này. Database lưu nội dung, không lưu người chơi, session hay state trận đang hoạt động.

Socket.IO handler gắn mỗi kết nối với identity phía server. Khi tham gia hoặc tiếp tục phiên, server trả view hiện tại; với command hợp lệ, server cập nhật session và phát view mới. Mỗi view được tạo cho người nhận nên client không nhận dữ liệu bị ẩn với vai trò hoặc giai đoạn hiện tại. Ngắt kết nối cập nhật presence; kết nối lại có thể khôi phục từ session Host còn chạy bằng credential trình duyệt. Kết thúc phòng sẽ xóa credential và session.

Đây là một Host chạy trong một tiến trình; không có database server riêng hay đồng bộ đa node. Xem [nội dung tĩnh](../../../specs/05-features/static-game-content/flow.md) và [đồng bộ thời gian thực](../../../specs/05-features/realtime-synchronization/flow.md).
