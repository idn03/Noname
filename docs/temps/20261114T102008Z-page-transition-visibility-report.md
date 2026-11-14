# Báo cáo: hiệu ứng chuyển trang khó nhận thấy

## Phương pháp hiện tại

Giao diện dùng `motion/react` (`AnimatePresence` và `motion.div`) để chuyển giữa các màn hình được bọc bởi `PageTransitionFrame`. `getLobbyScreenKey` tạo key theo phase, role, trạng thái Host hoặc trạng thái đã tham gia. Khi key đổi, màn hình cũ fade out; màn hình mới fade in và dịch dọc 12px. Thời lượng vào là 220ms, thoát là 180ms.

Chuyển động chỉ được bật theo cờ `animatePageTransitions` từ `useLobbyConnection`. Snapshot đầu tiên sau khi tải trang và snapshot khi khôi phục kết nối không chạy hiệu ứng. Thao tác tạo phòng/tham gia đánh dấu snapshot đầu tiên là chuyển trạng thái để có thể chạy hiệu ứng. Khi hệ điều hành bật giảm chuyển động, màn hình hiện ngay với thời lượng 0ms.

Đặc tả liên quan: `specs/02-ux/pages.md` yêu cầu chuyển ngắn khi máy chủ xác nhận phase mới, tôn trọng reduced motion và không phát lại chuyển động khi tải lại hoặc kết nối lại.

## Ba vấn đề có thể gây ra việc người dùng không thấy hiệu ứng

1. **Kiểm tra TypeScript đang chặn build sạch.** Lần chạy `pnpm typecheck` trong phiên điều tra báo lỗi ở `PageTransitionFrame.tsx`: giá trị `ease: 'easeOut'` bị suy luận thành `string`, không tương thích kiểu `Variants` của Motion. Đây là lỗi đã xác nhận; cần sửa kiểu trước khi dùng bản build để đánh giá hiệu ứng. Lỗi này không tự chứng minh nguyên nhân khiến bản dev hiện tại không animate.

2. **Chuyển động có thể quá nhẹ để nhận ra.** Màn hình chỉ dịch 12px và fade trong 220ms. Trên màn hình lớn, hoặc khi đổi nội dung có nền và bố cục tương tự, chuyển cảnh có thể trông như thay nội dung tức thời. Đây là suy luận từ thông số hiện tại; cần quan sát trên thiết bị người dùng.

3. **Cờ animate có chủ ý tắt ở một số lần nhận state.** Snapshot đầu tiên, kết nối lại và thiết lập state ban đầu không animate. Ngoài ra, `prefers-reduced-motion` đặt thời lượng về 0ms. Nếu người dùng đang kiểm tra sau refresh/reconnect hoặc bật cài đặt giảm chuyển động, họ sẽ thấy màn hình đích xuất hiện ngay. Đây là hành vi thể hiện trực tiếp trong mã và phù hợp với đặc tả; cần xác nhận hoàn cảnh tái hiện của người dùng.

## Cách xác nhận khi tái hiện

- Kiểm tra console/build để xác định phiên bản đang chạy và lỗi TypeScript.
- Thử chuyển phase liên tiếp trong cùng một kết nối, không refresh; ghi nhận `screenKey`, `animatePageTransitions` và trạng thái reduced motion.
- Lặp lại sau refresh/reconnect và khi bật/tắt cài đặt giảm chuyển động để phân biệt hiệu ứng bị lỗi với trường hợp hiệu ứng được chủ ý bỏ qua.

## Giới hạn

Báo cáo dựa trên mã nguồn và kết quả typecheck; chưa quan sát trực tiếp animation trên trình duyệt hoặc thiết bị người dùng. Mục 2 là dự đoán về cảm nhận thị giác, không phải kết luận runtime.
