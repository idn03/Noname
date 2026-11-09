# Kế hoạch nâng cấp hiệu ứng và tương tác

## Mục tiêu

Nâng cấp chuyển động và phản hồi tương tác trên toàn bộ giao diện Noname theo hướng nhất quán, dễ hiểu và phù hợp với không khí game. Không để hiệu ứng che thông tin gameplay hoặc làm chậm thao tác.

## Nguyên tắc

- Chỉ dùng chuyển động khi giúp người chơi hiểu thay đổi trạng thái hoặc phản hồi thao tác.
- Giữ rõ phase, điểm số, trạng thái hành động và kết quả đã được máy chủ xác nhận.
- Tôn trọng cài đặt giảm chuyển động của hệ điều hành.
- Kiểm tra trên điện thoại và màn hình mục tiêu; ưu tiên chuyển động mượt, không gây xao nhãng.
- Giữ nguyên palette, kiểu chữ và bố cục hiện tại trừ khi có yêu cầu riêng.

## Phạm vi

Các khu vực cần xem xét: Home/Join, Lobby, chia đội, chọn card, gameplay, quản lý trận của Host, kết quả và các thành phần dùng chung như Button, Dialog, Sheet, thông báo/trạng thái.

UI hiện tại đã hoàn thiện toàn bộ, không thêm bất kỳ thành phần nào vào giao diện người dùng khi thực hiện nâng cấp trải nghiệm. Tập trung hoàn toàn vào nâng cấp hiệu ứng.

## Mô tả hiệu ứng và tương tác

### Home / Join
HOST:
- Thêm hiệu ứng xuất hiện cho tất cả phần chữ, xuất hiện sau background 1s với hiệu ứng Float-in và Fly-in. Chi tiết (xuất hiện theo thứ tự):
    1. Heading "SÓI VÀ CỪU" hiệu ứng Fly-in từ trái qua (start from left).
    2. "Luật chơi", "Đội Cừu", "Đội Sói" hiệu ứng Float-in từ dưới lên.
    3. Nội dung luật chung, luật cho từng đội hiệu ứng Float-in từ dưới lên.
    4. Nút TẠO, chuyền từ variant ghost (gán disable cho button) sang default trong 1s.

PLAYER:
- Thêm hiệu ứng xuất hiện cho tất cả phần chữ, xuất hiện sau background 1s. Chi tiết (xuất hiện theo thứ tự):
    1. Heading "SÓI VÀ CỪU" hiệu ứng Fly-in từ trái qua (start from left).


### Lobby


### Chia đội


### Chọn card


### Gameplay


### Quản lý trận của Host


### Kết quả


### Thành phần dùng chung
- Sheet:
- Dialog:
- Button:

### Hiệu ứng hoặc tương tác khác
- 


## Thứ tự triển khai đề xuất

1. Tổng hợp mô tả thủ công và xác định trạng thái kích hoạt, kết thúc, hủy hoặc ngắt của từng hiệu ứng.
2. Thống nhất quy ước chuyển động và phản hồi tương tác dùng chung.
3. Cải thiện phản hồi tương tác thường xuyên và trạng thái chọn card.
4. Cải thiện chuyển phase, chia đội, reveal card và kết quả trận.
5. Rà soát reduced motion, hiệu năng, thao tác nhanh liên tiếp và hiển thị trên thiết bị mục tiêu.

## Ràng buộc theo đặc tả dự án

- Chuyển động dùng tiết chế, chủ yếu cho đổi phase hoặc reveal card.
- Hoạt ảnh không được trì hoãn hay che kết quả chính thức của hành động.
- Chuyển động không được làm giảm khả năng đọc hoặc làm chậm nhịp chơi.
- Chia đội có hoạt ảnh roster; kết quả cần làm nổi bật và chúc mừng đội thắng nhất quán.

## Hoàn tất khi

- Các mô tả hiệu ứng và tương tác đã được thống nhất trước khi triển khai.
- Chuyển động nhất quán giữa các màn hình và có trạng thái reduced motion phù hợp.
- Mọi trạng thái gameplay vẫn dễ nhận biết khi hiệu ứng bị tắt hoặc bị ngắt.
