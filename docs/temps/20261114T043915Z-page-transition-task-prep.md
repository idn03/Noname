# Chuẩn bị task chuyển cảnh giữa các màn

## Phạm vi

Theo `docs/plan/motion-upgrade-plan.md`, task này chỉ xử lý chuyển cảnh giữa các màn theo phase. Phạm vi dự kiến: Home → Lobby → Chia đội → Chọn thẻ → Gameplay/Quản lý trận → Kết quả. Không thêm thành phần giao diện và không gộp các hiệu ứng riêng như lock-in card, combat, điểm số, button, dialog hoặc sheet.

## Hiện trạng đã xác minh

- `motion` đã có trong dependencies; `RuneField` đang dùng `motion/react` và `useReducedMotion`.
- `LobbyScreen` là điểm chuyển màn chính: các nhánh theo `lobby.game.phase` trả về màn Chia đội, Chọn thẻ, Gameplay/Quản lý trận hoặc Kết quả. Home và Lobby cũng được chọn trong cùng component.
- Giao diện Host trong phase Chia đội vẫn là `HostLobbyLayout` với trạng thái `started`; giao diện người chơi dùng `TeamAssignmentScreen` riêng.
- Kết thúc chọn thẻ được server xác nhận mới mở Gameplay; phase `turns` bao gồm cập nhật round, vì vậy thay đổi round không nên phát lại chuyển cảnh cấp màn.
- Global CSS đã có quy tắc `prefers-reduced-motion`; một số hiệu ứng hiện tại cũng có xử lý reduced motion riêng.
- Các màn liên quan nằm ở `features/lobby/ui/screen/LobbyScreen.tsx`, `TeamAssignmentScreen.tsx`, `features/game/ui/components/PlayerCardSelection.tsx`, `HostCardSelection.tsx`, `features/game/ui/screen/PlayerGameScreen.tsx`, `ManageGameScreen.tsx` và `features/results/ui/screen/EndGameScreen.tsx`.

## Công việc đề xuất

1. **Chốt hợp đồng chuyển cảnh**
   - Chốt kiểu chuyển cảnh, hướng, thời lượng và easing trước khi code; motion plan hiện chưa quy định các giá trị này.
   - Xác định xử lý khi phase đổi liên tiếp, khi tải/khôi phục session đã ở giữa trận, và khi người dùng bật reduced motion.
   - Giữ nguyên bố cục, nội dung, trạng thái gameplay; không thêm overlay hay màn trung gian.

2. **Tạo điểm điều phối chuyển cảnh theo phase**
   - Điều phối tại `LobbyScreen`, nơi hiện chọn màn dựa trên phase server.
   - Dùng khóa ổn định theo màn/phase và role; không dùng round hoặc dữ liệu thường xuyên cập nhật làm khóa.
   - Giữ `RuneField` và nền dùng chung ổn định qua chuyển màn để tránh khởi động lại hiệu ứng nền.
   - Kiểm tra luồng Host Chia đội đang tái sử dụng `HostLobbyLayout`; tránh chạy đồng thời chuyển cảnh toàn màn và hiệu ứng chia đội hiện có theo cách gây chồng lấn.

3. **Áp dụng chuyển cảnh cho các trạng thái chính**
   - Home ↔ Lobby khi tạo phòng, tham gia, hủy trận hoặc xóa phòng theo phản hồi server.
   - Lobby → Chia đội → Chọn thẻ theo phase và countdown đã xác nhận.
   - Chọn thẻ → Gameplay/Quản lý trận sau khi server chuyển phase.
   - Gameplay/Quản lý trận → Kết quả sau khi engine hoàn tất trận.
   - Replay về Chọn thẻ theo phase server; không animate dự đoán khi bấm action.

4. **Reduced motion và khả năng phục hồi**
   - Với reduced motion, bỏ hoặc rút ngắn chuyển động và hiển thị ngay màn đích.
   - Refresh/reconnect vào phase hiện tại không được giả lập các phase trước đó.
   - Nội dung mới phải hiển thị, thao tác và thông tin accessibility không bị chặn bởi thời lượng animation; chuyển cảnh bị ngắt vẫn để lại trạng thái cuối.

5. **Review và xác minh**
   - Kiểm tra Home/Lobby, luồng Sandbox qua các phase, Host/player, refresh/reconnect, replay/cancel, reduced motion và đổi phase nhanh.
   - Rà soát kích thước màn hình điện thoại và desktop; đảm bảo chuyển cảnh không tạo scroll hoặc che action.
   - Chỉ cập nhật `specs/` nếu hợp đồng chuyển phase hoặc yêu cầu UX dùng chung thay đổi; giữ thay đổi spec ngắn gọn.

## Đề xuất hiệu ứng và cách làm

- Dùng **crossfade ngắn kèm dịch dọc nhẹ**: màn mới vào từ `opacity: 0`, `y: 6px` đến trạng thái rõ nét tại `y: 0`; màn cũ giảm opacity. Gợi ý easing `easeOut`, thời lượng vào khoảng 180ms và ra khoảng 140ms. Tránh scale, spring, blur và hướng trượt ngang vì các màn có bố cục khác nhau và chuyển động lớn dễ gây cảm giác giao diện đang di chuyển thay vì đổi phase.
- Dùng `motion/react` (`AnimatePresence` và `motion`) cho enter/exit tại lớp điều phối màn trong `LobbyScreen`. Đặt nội dung hai trạng thái trong cùng một grid cell khi chạy song song để không làm nhảy layout. Dùng `top` trên wrapper `position: relative` cho dịch chuyển 6px để không tạo containing block làm lệch các action `position: fixed`. Màn đang rời đi cần mất tương tác và bị ẩn khỏi accessibility tree; màn mới không bị khóa thao tác bởi animation.
- Giữ `RuneField`/nền ngoài vùng có key animation để không khởi động lại nền mỗi lần phase đổi. Tạo key từ tên màn + role; không đưa round, countdown, score hay dữ liệu card vào key.
- Dùng `initial={false}` để refresh hoặc hydrate thẳng vào phase hiện tại không chạy animation mở màn. Chỉ bắt đầu enter/exit khi phase/màn đã được xác nhận từ snapshot server mới.
- Với reduced motion, bỏ dịch chuyển và đặt thời lượng về 0; trạng thái đích vẫn xuất hiện ngay. Không chờ animation kết thúc mới cập nhật game state hay cho phép action.
- Nếu phần tử Host Chia đội đã có animation roster, giữ nó làm hiệu ứng nội dung của chính màn Lobby; tránh kích hoạt thêm enter animation cho toàn trang chỉ vì prop `started` đổi.

Đây là đề xuất để chốt trước implementation, không phải thông số bắt buộc của đặc tả hiện tại.

## Cổng bắt đầu implementation

Chưa bắt đầu implementation trong bước chuẩn bị này. Motion plan yêu cầu mô tả hiệu ứng được thống nhất trước khi triển khai; phần trên đề xuất crossfade kèm dịch dọc nhẹ với thời lượng ngắn để làm cơ sở chốt.
