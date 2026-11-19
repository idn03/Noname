# Luồng chọn thẻ

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    A[Người chơi chỉnh bản nháp thẻ]
    B[Gửi danh mục\nvà thử thách Sói nếu có]
    C[Socket handler kiểm tra identity\nvà cấu trúc request]
    D[LobbySession kiểm tra người chơi\nvà giai đoạn hiện tại]
    E[Game Engine kiểm tra\nvà áp dụng lựa chọn]
    F{Lệnh hợp lệ?}
    G[Lưu state có thẩm quyền tiếp theo]
    H[Trả lỗi domain;\nstate không đổi]
    I[Tạo view theo quyền\nvà phát snapshot]
    J{Đã đủ mọi slot thẻ?}
    L[Chuyển sang lượt chơi;\nhiện chi tiết thẻ được phép]
    K[Người chơi có thể gỡ thẻ đã gửi\nvà chọn lại khi vòng còn mở]

    A --> B --> C --> D --> E --> F
    F -- có --> G --> I --> J
    F -- không --> H
    J -- có --> L
    J -- chưa --> K --> A

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,B,C,D,E,G,H,I,J,L,M step;
    class F,K check;
```

Sau khi chia đội, view người chơi nhận danh mục được phép và trạng thái slot của chính họ. View Sói có lựa chọn thử thách; view Cừu chỉ có số lượng thử thách. Host thấy danh mục đã gửi và mức sẵn sàng, không thấy nội dung thử thách. Người không có slot được hiển thị trạng thái chờ.

Người chơi chỉnh bản nháp cục bộ trong giao diện chọn thẻ. Lệnh gửi và gỡ thẻ đi qua Socket.IO rồi được server và Game Engine kiểm tra. Có thể gỡ và thay slot đã gửi khi vòng chọn còn mở. Game Engine chỉ chuyển sang lượt chơi khi mọi slot đã hoàn tất; hết giờ không tự điền slot. Khi chuyển giai đoạn, view có quyền sẽ thấy thẻ đã chọn và nội dung thử thách.

Mã nguồn có cả chuyển trạng thái phía server và luồng giao diện chọn thẻ. Xem [đặc tả chọn thẻ](../../../specs/05-features/card-selection/flow.md) về quyền riêng tư và bất biến timer.
