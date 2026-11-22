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

UI hiện tại đã hoàn thiện. Không thêm thành phần ngoài phạm vi hiệu ứng; cho phép dùng LoadingPage làm trạng thái chuyển tiếp giữa các màn.

## Phương án kỹ thuật đề xuất

- **Tailwind CSS utilities:** mặc định cho transition/animation đơn giản và trạng thái tương tác ngay trong component.
- **`motion/react`:** dùng khi cần điều phối nhiều phần tử, stagger, spring, hoặc enter/exit gắn với phase/state của React.
- **CSS thuần:** chỉ dùng cho keyframes hoặc quy tắc chuyển động dùng chung khó diễn đạt gọn bằng utilities; đặt ở global/theme, không tạo stylesheet riêng theo màn.
- Hiệu ứng gameplay chỉ chạy theo state/event đã được server xác nhận. Với reduced motion, hiệu ứng trang trí lặp lại thì tắt; hiệu ứng biểu đạt trạng thái thì rút ngắn hoặc chuyển tức thời và vẫn để trạng thái cuối hiển thị.

## Mô tả hiệu ứng và tương tác

Thêm hiệu ứng chuyển cảnh chung cho toàn bộ dự án khi chuyển giữa các giai đoạn trong game. **Phương án:** Hiển thị LoadingPage trong lúc xử lý và trước khi vào màn đích. Bắt đầu từ:
    Home -> LoadingPage -> Lobby -> ... (tương tự)

- Bắt đầu xử lý ngay khi người dùng thực hiện thao tác; hiệu ứng không trì hoãn việc gửi yêu cầu lên server.
- Màn đích chỉ xuất hiện sau khi có xác nhận từ server. Nếu xử lý hoàn tất trước 1 giây, giữ LoadingPage đến khi đủ 1 giây tính từ lúc bắt đầu thao tác rồi chuyển trang.
- Nếu xử lý lâu hơn 1 giây, chuyển trang ngay khi nhận xác nhận từ server, nhưng thời gian chờ xác nhận tối đa là 3 giây tính từ lúc bắt đầu thao tác.
- LoadingPage chờ xác nhận tối đa 3 giây. Nếu hết thời gian vẫn chưa có xác nhận, kết thúc trạng thái chờ, giữ màn cuối đã được xác nhận và hiện lỗi; vẫn tiếp nhận state đến muộn từ server. Không tự chuyển sang phase chưa được server xác nhận.
- Với cập nhật phase từ server không gắn với thao tác tại máy người chơi, hiển thị LoadingPage tối thiểu 1 giây trước màn đích.
- Reduced motion tắt chuyển động của rune và fade nhưng vẫn giữ LoadingPage tối thiểu 1 giây; vẫn phải đợi xác nhận server và không vượt giới hạn chờ 3 giây.

### Home / Join
HOST:
- Thêm hiệu ứng xuất hiện cho tất cả phần chữ, xuất hiện sau background 1s với hiệu ứng Float-in và Fly-in. Chi tiết (xuất hiện theo thứ tự):
    1. Heading "SÓI VÀ CỪU" hiệu ứng Fly-in từ trái qua (start from left) — **Tailwind utilities**.
    2. "Luật chơi", "Đội Cừu", "Đội Sói" hiệu ứng Float-in từ dưới lên — **Tailwind utilities**, dùng delay theo thứ tự.
    3. Nội dung luật chung, luật cho từng đội hiệu ứng Float-in từ dưới lên — **Tailwind utilities**, dùng delay theo thứ tự.
    4. Nút TẠO, chuyển từ ghost/disabled sang default/enable trong 1s, nảy một lần — **Tailwind utilities** cho transition; chỉ dùng `motion/react` nếu cần đồng bộ thành chuỗi với các mục chữ.

PLAYER:
- Thêm hiệu ứng xuất hiện cho tất cả phần chữ, xuất hiện sau background 1s. Chi tiết (xuất hiện theo thứ tự):
    1. Heading "SÓI VÀ CỪU" hiệu ứng Fly-in từ trái qua (start from left) — **Tailwind utilities**.
    2. Input bar và các components xuất hiện từ phải qua với cùng hiệu ứng — **Tailwind utilities**, stagger theo thứ tự.

### Lobby
HOST: Không cần nâng cấp

PLAYER: Không cần nâng cấp

### Chia đội
HOST: Dùng chuyển cảnh chung từ Lobby sang chia đội; giữ nguyên hiệu ứng đội hình hiện có.

PLAYER: Thêm hiệu ứng xuất hiện fade cho ĐỘI SÓI hoặc ĐỘI CỪU và danh sách thành viên sau khi HOST bấm chia đội. **Phương án:** `motion/react` cho stagger roster nếu cần; Tailwind utilities cho fade đơn giản. Bắt đầu khi client nhận phase/phân đội đã xác nhận từ server.

### Chọn card
HOST: Không cần nâng cấp

PLAYER: Khi máy chủ xác nhận CHỌN, GameCard của Sói hoặc Cừu nâng lên 12px trong 400ms và giữ ở đó. Khi máy chủ xác nhận BỎ CHỌN, thẻ hạ về vị trí ban đầu trong 400ms. Thẻ dùng vị trí tuyệt đối trong ô carousel để các thành phần khác đứng yên. Không thêm viền. Với reduced motion, thẻ đổi vị trí tức thì.

### Gameplay
PLAYER: Thêm hiệu ứng cho tính năng Lật Thẻ cho GameCard khi người chơi bấm vào thẻ (Áp dụng cho thẻ đang được đem ra tấn công) — **Tailwind utilities** (flip 3D đơn giản; hiện đã có nền tảng).
- Khi tấn công thất bại, thêm hiệu ứng phá hủy thẻ tấn công — **`motion/react`** nếu cần chuỗi nhiều nhịp; nếu chỉ fade/scale thì Tailwind utilities.
- Sau khi tấn công thành công, thêm hiệu ứng slash và rung trên Đội Cừu như vừa chịu sát thương — **Tailwind utilities/CSS keyframes dùng chung**; `motion/react` nếu cần đồng bộ slash và rung thành chuỗi.
- Sau khi tấn công/phòng thủ mới đến hiệu ứng cho việc cộng điểm. Thêm hiệu ứng cộng điểm — **Tailwind utilities** cho nhấn mạnh điểm; `motion/react` nếu cần điều phối sau hiệu ứng combat. Chỉ chạy sau kết quả server xác nhận.

### Quản lý trận của Host
HOST:
- Sau khi bấm Thành Công, thêm hiệu ứng phá hủy thẻ tấn công — **dùng chung hiệu ứng với Player**, `motion/react` nếu cần chuỗi; chỉ chạy sau khi server xác nhận.
- Sau khi bấm Thất Bại hoặc không có thẻ phòng thủ, thêm hiệu ứng slash và rung trên Đội Cừu như vừa chịu sát thương — **dùng chung hiệu ứng với Player**, Tailwind utilities/CSS keyframes hoặc `motion/react` cho chuỗi; trạng thái không có phòng thủ phải dựa trên dữ liệu server.
- Sau khi tấn công/phòng thủ mới đến hiệu ứng cho việc cộng điểm. Thêm hiệu ứng cộng điểm — **dùng chung hiệu ứng với Player**, ưu tiên Tailwind utilities; chỉ chạy sau kết quả server xác nhận.

### Kết quả
HOST: Không cần nâng cấp

PLAYER: Không cần nâng cấp

### Thành phần dùng chung
- Sheet: Thêm hiệu ứng xuất hiện fly-in từ dưới lên (chỉ bao gồm phần SheetView, không bao gồm overlay) — **Tailwind utilities**, áp dụng cho panel; tôn trọng side hiện tại của Sheet.
- Dialog: Thêm hiệu ứng xuất hiện fly-in từ dưới lên (chỉ bao gồm phần Dialog, không bao gồm overlay) — **Tailwind utilities**.
- Button: Thêm transition-duration: 500ms cho tất cả component nút — **Tailwind utilities** trong shared Button. Hiệu ứng chi tiết:
    - Disabled (ghost) → enabled: hiệu ứng nảy lên một lần — **Tailwind utilities**.
    - Hover variant `default`: border-bottom 4px, border-top 2px, border opacity 1 (#FFFFFF 100%), thêm margin-top 6px — **Tailwind utilities**.
    - Hover variant `small`: bản kế hoạch nêu hai giá trị border-bottom khác nhau (2px và 1px); cần xác nhận giá trị/variant dự định trước triển khai. Cách áp dụng sau khi chốt: **Tailwind utilities**.

### Hiệu ứng hoặc tương tác khác
- Lưu ý: Dùng chung hiệu ứng phá hủy thẻ và hiệu ứng gây sát thương cho cả Host và Player — **ưu tiên component/variant motion dùng chung**; hiệu ứng đơn giản dùng chung Tailwind classes, chuỗi phức tạp dùng `motion/react`.

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
