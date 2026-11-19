# Luồng chia đội

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TD
    A[Host yêu cầu bắt đầu]
    B{Host, lobby và số\nngười chơi hợp lệ?}
    C[Trả lỗi; giữ nguyên lobby]
    D[Chuẩn bị pool thử thách\nvà game state ban đầu]
    E[Game Engine chia\nđội cân bằng]
    F[Tạo view Host và người chơi\nđúng quyền truy cập]
    G[Hiển thị giai đoạn chia đội\ntrong 10 giây]
    H[Đến hạn kết thúc chia đội]
    I[Mở vòng chọn thẻ\nvà bắt đầu timer]

    A --> B
    B -- không --> C
    B -- có --> D --> E --> F --> G --> H --> I

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,C,D,E,F,G,H,I step;
    class B check;
```

`LobbySession.start` kiểm tra identity Host, số người chơi đang kết nối và xác nhận số lượng thấp. `prepareGameSetup` chuẩn bị pool thử thách của phiên rồi gọi lệnh bắt đầu trong Game Engine, dùng thao tác chia đội. Host chỉ quan sát; người chơi tham gia nhận đội và trạng thái có slot thẻ hay không.

Server giữ giai đoạn chia đội trong mười giây bằng deadline trong bộ nhớ. Trình duyệt render giai đoạn và countdown hiện tại. Khi hết hạn, session thiết lập thời gian chọn thẻ và view chuyển sang chọn thẻ. Nếu setup lỗi, server trả lỗi mà không công bố trận đã chia đội dở dang.

Hợp đồng sản phẩm quy định thêm hiệu ứng roster và cách khôi phục thời gian khi kết nối lại. Hãy kiểm tra view và screen hiện có trước khi dựa vào các chi tiết đó; chuyển trạng thái chính và deadline mười giây do server quản lý. Xem [đặc tả chia đội](../../../specs/05-features/team-assignment/flow.md).
