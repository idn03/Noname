# Đối chiếu kế hoạch nâng cấp motion

Ngày rà soát: 2026-11-12

## Kết luận

Codebase đã có nền tảng cho cả ba hướng: CSS thuần, `motion/react`, và animation qua Tailwind CSS v4. Tailwind utilities là cách phù hợp nhất làm mặc định vì đã là quy ước dự án; CSS thuần phù hợp cho quy tắc dùng chung nhỏ; `motion/react` nên dành cho hiệu ứng có điều khiển theo state, chuỗi hoặc spring. Không cần chọn một công nghệ duy nhất, nhưng cần thống nhất quy ước để tránh cùng hiệu ứng được triển khai theo nhiều cách.

Kế hoạch phù hợp với định hướng giao diện và các đặc tả UX ở mức mục tiêu. Phần lớn hiệu ứng cụ thể trong kế hoạch chưa được triển khai. Một số hạng mục đã tồn tại một phần, và kế hoạch còn một lỗi mô tả cần làm rõ trước khi thực hiện.

## Căn cứ từ đặc tả dự án

- `specs/03-technical/tech-stack.md`: frontend dùng Next.js, React, TypeScript và Tailwind CSS.
- `specs/02-ux/design-system.md`: yêu cầu style màn hình/component bằng Tailwind utilities trong JSX, giới hạn CSS toàn cục, dùng motion tiết chế, hỗ trợ reduced motion và không che kết quả chính thức.
- `specs/02-ux/pages.md`: yêu cầu animate roster Host khi chia đội; giao diện vẫn phải thể hiện phase, trạng thái, hành động và kết quả đã xác nhận.
- `specs/03-technical/architecture.md`: server là nguồn dữ liệu có thẩm quyền; animation không nên tự suy đoán hoặc thay đổi trạng thái game.

## Hiện trạng triển khai

| Khu vực | Hiện trạng quan sát được | So với kế hoạch |
|---|---|---|
| Thiết lập CSS/Tailwind | `web-game/app/globals.css` import Tailwind; `web-game/postcss.config.mjs` dùng plugin Tailwind v4; theme tokens ở `web-game/app/theme.css` | Sẵn sàng cho Tailwind animation utilities và CSS chung |
| CSS thuần | `globals.css` định nghĩa keyframes dialog và winner; `app/host-lobby.css` định nghĩa fade-in roster | Có sẵn, nhưng `host-lobby.css` là stylesheet cấp màn hình trái với quy ước design-system hiện tại |
| motion/react | `motion` dependency đã có; `components/shared/RuneField.tsx` dùng `motion.img` và `useReducedMotion` | Thư viện đã tích hợp nhưng đang giới hạn ở hiệu ứng rune nền |
| Tailwind animation | Dialog dùng arbitrary `animate-[...]`; Sheet dùng transition/state utilities; GameCard có flip 3D và `motion-reduce`; roster dùng Tailwind classes | Nhiều hiệu ứng hiện tại đã viết trực tiếp bằng utilities |
| Reduced motion | Có global media rule; RuneField có hook riêng; Sheet/Card/roster có một số lớp `motion-reduce` | Đã có nền tảng nhưng chính sách chưa nhất quán: rule toàn cục rút animation về thời lượng rất ngắn thay vì luôn bỏ decorative motion |
| Chuyển phase toàn app | `LobbyScreen` chọn màn theo phase server; chưa thấy transition wrapper hoặc hiệu ứng chuyển phase chung | Chưa triển khai |
| Home/Join | Có tiêu đề, form/actions; không thấy chuỗi fly-in/float-in theo thứ tự hoặc chuyển trạng thái nút tạo như kế hoạch | Chưa triển khai |
| Chia đội | Host có animation heading/roster; Player stage có transition vị trí roster; player team assignment có countdown | Đã có một phần, cần đối chiếu lại timing/reduced motion và hiệu ứng dành riêng sau khi server xác nhận chia đội |
| Chọn card | GameCard có viền trạng thái chọn và sheet thử thách; không thấy hiệu ứng lock-in riêng | Chưa triển khai |
| Gameplay | GameCard đã flip 3D khi bấm; không thấy hiệu ứng phá hủy, sát thương, rung đội Cừu hoặc cộng điểm | Flip đã có; phần combat/score chưa có |
| Host quản lý trận | Có GameCard và nút ghi nhận kết quả; không thấy chuỗi hiệu ứng theo kết quả đã được xác nhận | Chưa triển khai |
| Dialog/Sheet | Dialog có enter/exit cho overlay và content; Sheet trượt theo side, có overlay riêng | Đã có animation; Sheet chưa mặc định bay từ dưới nếu side khác bottom |
| Button | Shared Button dùng transition 220ms và active translate; các variant có khung viền khác nhau | Chưa đạt yêu cầu 500ms, bounce ghost→enabled hoặc hover border nêu trong kế hoạch |
| Kết quả | Có winner-celebration phát sáng lặp; tắt khi reduced motion | Đã có phản hồi kết quả đơn giản; kế hoạch nói không cần nâng cấp khu vực này |

## So sánh ba phương án

### 1. CSS thuần

**Ưu điểm:** không cần runtime JavaScript cho hiệu ứng, nhẹ và phù hợp với keyframes ổn định như fade, float, fly-in, shake/slash đơn giản. CSS media query xử lý `prefers-reduced-motion` trực tiếp.

**Hạn chế:** chuỗi animation theo state, hủy khi phase đổi nhanh, nhiều phần tử có stagger và đồng bộ với kết quả server sẽ cần class/state hoặc Web Animations API. Nếu thêm named keyframes/stylesheets cho từng màn sẽ xung đột với quy ước Tailwind trong `design-system.md`.

**Hợp với:** quy tắc dùng chung ít thay đổi (ví dụ keyframe hiệu ứng button hoặc dialog) nếu khai báo trong CSS toàn cục/theme; không nên mở rộng stylesheet riêng theo màn.

### 2. `motion/react`

**Ưu điểm:** đã có dependency và cách dùng mẫu trong `RuneField.tsx`; thuận tiện cho enter/exit, stagger, spring, variants, animation có điều kiện theo state và hủy theo vòng đời React. Có hook reduced-motion.

**Hạn chế:** thêm runtime và abstraction cho hiệu ứng đơn giản; cần bảo đảm không làm tăng thời gian phản hồi hành động hoặc animate state trước khi server xác nhận. Hiện `RuneField` tự giảm biên độ và vẫn chuyển động liên tục khi reduced motion, nên cần xem xét chính sách chung nếu dùng lại cách này.

**Hợp với:** chuyển màn/phase, lock-in card, hoặc chuỗi combat có nhiều phần tử và cần orchestration; dùng có chọn lọc thay vì thay toàn bộ transition CSS hiện có.

### 3. Tailwind CSS

**Ưu điểm:** phù hợp nhất với quy ước hiện hành và codebase đã sử dụng utilities cho dialog, sheet, GameCard, roster và trạng thái responsive. Hiệu ứng đơn giản ở gần component, dễ đọc cùng layout và giảm nhu cầu stylesheet riêng.

**Hạn chế:** chuỗi dài class arbitrary khó đọc; keyframes phức tạp và điều khiển timeline không nên nhồi vào một `className`. Việc lặp lại nhiều biến thể duration/easing có thể gây lệch chuẩn nếu thiếu token/quy ước.

**Hợp với:** hover/active/focus, fade/translate ngắn, reduced-motion variants và animation đơn giản theo trạng thái DOM. Đây nên là lựa chọn mặc định cho phần lớn hạng mục kế hoạch.

## Khuyến nghị phối hợp

1. Dùng Tailwind utilities cho trạng thái tương tác nhỏ và animation một bước; giữ style tại component theo design-system.
2. Dùng `motion/react` khi cần orchestration thực sự: stagger có thứ tự, presence/exit giữa phase, hoặc chuỗi hiệu ứng gắn với state đã được xác nhận.
3. Dùng CSS thuần ở global/theme cho keyframes/token dùng chung mà utility không diễn đạt gọn; tránh tạo thêm stylesheet theo màn.
4. Không phát hiệu ứng kết quả thắng/thua/điểm trước khi nhận state/event xác nhận từ server. Khi bị ngắt hoặc reduced motion, nội dung và trạng thái cuối vẫn phải hiển thị ngay.
5. Thống nhất chính sách reduced motion: decorative loop nên tắt; hiệu ứng truyền đạt trạng thái nên rút ngắn hoặc chuyển tức thời, không làm ẩn trạng thái cuối.

## Điểm kế hoạch cần làm rõ

- Mục Button ghi ba lần “hover variant small” với border-bottom lần lượt 2px, 2px và 1px. Có khả năng hai dòng cuối định nói về `outline` và `mobile`, nhưng không nên suy đoán khi triển khai.
- “Tạo hiệu ứng chuyển cảnh chung toàn bộ dự án” cần phân biệt chuyển route Home/Join và đổi phase do server cập nhật; hiện ứng dụng là flow một route theo phase, nên transition cần xử lý trường hợp refresh/reconnect và phase nhảy trực tiếp.
- Mỗi hiệu ứng gameplay cần điều kiện bắt đầu/kết thúc/hủy rõ: flip khi chủ thẻ phát động hay khi state active được xác nhận; phá hủy/thành công sau action server; damage và score theo thứ tự mà vẫn cập nhật nội dung ngay.
- Hiệu ứng “khóa Tướng” là tham chiếu phong cách, chưa xác định động tác, thời lượng, hướng, âm thanh (nếu có) hoặc trạng thái bỏ chọn/thay card.
- Kế hoạch yêu cầu giữ UI hiện tại; cần giới hạn thay đổi vào presentation và không thêm component/chỉ báo giao diện mới.

## Đánh giá sẵn sàng

| Phương án | Mức phù hợp với repo | Vai trò đề xuất |
|---|---:|---|
| Tailwind CSS | Cao | Mặc định cho interaction và hiệu ứng đơn giản |
| CSS thuần | Trung bình | Keyframes/token dùng chung, giữ ở global/theme |
| `motion/react` | Cao cho hiệu ứng phức tạp; thấp hơn cho hiệu ứng nhỏ | Orchestration/stagger/phase transition có kiểm soát |

Kế hoạch có thể tiến tới giai đoạn thống nhất quy ước sau khi sửa mô tả variant Button và chốt trigger/interrupt cho các hiệu ứng gameplay. Chưa có cơ sở để chọn một phương án duy nhất cho toàn bộ kế hoạch; cách phối hợp trên khớp nhất với kiến trúc và quy ước hiện có.
