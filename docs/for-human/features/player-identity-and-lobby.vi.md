# Luồng identity người chơi và lobby

Trang này mô tả luồng đã triển khai từ trang chủ đến khi bắt đầu lobby. Xem đặc tả [authentication](../../../specs/05-features/authentication/flow.md) và [quản lý session](../../../specs/05-features/session-management/flow.md) để biết hợp đồng sản phẩm đầy đủ.

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    A[Trình duyệt Host yêu cầu tạo phòng]
    B{Kết nối loopback?}
    C[Server tạo LobbySession\nvà identity Host]
    D[Host nhận credential\nvà lobby view]
    E[Trình duyệt người chơi tham gia bằng tên\nhoặc tiếp tục bằng credential]
    F[Server gắn socket\nvới identity người chơi]
    G[Người chơi và Host nhận\nlobby view theo quyền]
    H[Host yêu cầu bắt đầu trận]
    I{Host, số người chơi\nvà xác nhận hợp lệ?}
    J[Bắt đầu thiết lập game]
    K[Trả lỗi an toàn;\ngiữ nguyên lobby]

    A --> B
    B -- có --> C --> D --> E --> F --> G --> H --> I
    B -- không --> K
    I -- có --> J
    I -- không --> K

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,C,D,E,F,G,H,J,K step;
    class B,I check;
```

1. Trang chủ render `LobbyScreen`; các lobby hook mở Socket.IO và hiển thị kết nối, identity cùng trạng thái phòng.
2. Trình duyệt tại máy Host có thể yêu cầu tạo phòng. Server chỉ chấp nhận kết nối loopback, tạo `LobbySession`, rồi cấp identity và credential Host.
3. Người chơi tham gia bằng tên hiển thị hoặc tiếp tục phiên bằng credential gửi lúc kết nối. Server gắn socket với identity tương ứng và trả về view theo quyền.
4. Lobby theo dõi người đang kết nối và đã ngắt kết nối. Kết nối lại khôi phục người chơi khi session trong bộ nhớ còn tồn tại.
5. Host bắt đầu trận. Server kiểm tra quyền Host, số người chơi và xác nhận số lượng thấp nếu cần trước khi thiết lập game.

Credential được trình duyệt lưu trong `localStorage`; đây không phải tài khoản người chơi. Dữ liệu phòng đang chạy nằm trong bộ nhớ nên khởi động lại Host sẽ kết thúc session. Xem [Đồng bộ thời gian thực](content-and-realtime.vi.md) về cách gửi snapshot.
