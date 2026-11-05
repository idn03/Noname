# Kế hoạch tái cấu trúc UI/UX

## Mục tiêu và phạm vi

Xây dựng giao diện nhất quán, dễ bảo trì cho trò chơi Noname bằng cách dùng
Tailwind CSS làm phương thức tạo kiểu mặc định, dùng chung hệ thống typography,
và dùng nền tảng shadcn được tùy chỉnh theo dự án cho Button, Dialog và Sheet.
Chỉ giữ CSS tùy chỉnh khi utility không phù hợp, chẳng hạn artwork lá bài phức
tạp hoặc phần trang trí cảnh trò chơi cần định vị đặc biệt. Hạn chế gradient và
shadow. Giữ nguyên định hướng kinh dị, tính dễ đọc, độ rõ ràng của gameplay,
khả năng thích ứng với màn hình, accessibility và toàn bộ hành vi hiện tại.

Kế hoạch này bao gồm nền tảng dùng chung và mọi màn hình trình duyệt hiện có.
Không bổ sung tính năng gameplay hoặc tự tạo hành vi sản phẩm còn thiếu. Hợp
đồng sản phẩm vẫn được quy định trong [Hệ thống thiết kế UX](../../specs/02-ux/design-system.md),
các yêu cầu màn hình nằm trong [Trang và trạng thái UI](../../specs/02-ux/pages.md).
Lựa chọn triển khai được mô tả trong [Hướng dẫn triển khai UI](../ui-guidelines.md).

## Phát hiện và giả định làm việc

- Đã có `components.json` và các wrapper nội bộ cho Button, Dialog, Sheet.
  Trước khi chuyển đổi, cần kiểm tra wrapper và API primitive đã cài đặt; tránh
  thay toàn bộ hoặc thêm dependency khi không cần thiết.
- Dự án cũng có một Button dùng chung riêng, dẫn đến trùng vai trò với wrapper
  Button dựa trên shadcn. Hợp nhất thành một API Button dùng chung duy nhất.
- CSS hiện nằm trong `globals.css` và nhiều file CSS theo màn hình. Tailwind đã
  được import, nhưng phần lớn triển khai hiện tại dựa vào selector CSS tùy chỉnh.
- Typography đang pha trộn Arial, Judson, Georgia và các cỡ chữ riêng theo trang.
  Giữ nét riêng của font khi có chủ ý, nhưng định nghĩa và tái sử dụng vai trò
  chữ cùng token font có tên trên tất cả màn hình.
- Mã hiện tại có Home/Join, Lobby, phân đội Host, chọn lá bài, hướng dẫn đội,
  Results và route xem trước chọn Wolf. Màn hình gameplay cùng một số luồng đã
  mô tả có thể chưa hoàn thiện hoặc chưa được nối vào ứng dụng; cần xác minh route
  và hành vi trước khi xếp lịch chuyển đổi. Coi route xem trước là chỉ dành cho
  phát triển trừ khi yêu cầu sản phẩm quy định khác.
- Hợp đồng UI hiện có yêu cầu bảo vệ ranh giới thông tin, dùng trạng thái có thẩm
  quyền từ server, hỗ trợ giảm chuyển động, hiển thị focus, xử lý status/error
  accessible và dùng được trên điện thoại, tablet, desktop. Phải giữ nguyên các
  yêu cầu này trong quá trình chỉnh sửa giao diện.

## Quy tắc UI mục tiêu

1. Mặc định dùng Tailwind utilities cho layout, spacing, responsive, typography, màu sắc, border và các trạng thái tương tác thông thường.
2. Chỉ dùng nền tảng shadcn cho Button, Dialog và Sheet. Tùy chỉnh variant, kích thước và giao diện theo Noname thông qua props và lớp component dùng chung. Không xem các loại component shadcn khác là lựa chọn mặc định.
3. Dùng một API Button dùng chung trên mọi màn hình. Cung cấp các kích thước và variant của dự án mà không tạo Button riêng cho từng màn hình.
4. Định nghĩa một lần các font family dùng chung và vai trò chữ theo ngữ nghĩa (display, tiêu đề trang, tiêu đề mục, nội dung, chữ hỗ trợ và nhãn). Mỗi trang chọn vai trò phù hợp, không tự định nghĩa lại thang cỡ chữ hoặc cặp font.
5. Đặt giá trị thiết kế có thể tái sử dụng trong token CSS/Tailwind dùng chung. Ưu tiên bố cục phẳng và khoảng trắng. Chỉ dùng gradient, shadow và hiệu ứng trang trí ở mức tiết chế, khi chúng hỗ trợ bầu không khí hoặc thứ bậc thị giác.
6. Chỉ giữ CSS tùy chỉnh cho artwork, animation hoặc layout thực sự phức tạp, khó diễn đạt hoặc khó đọc bằng utilities. Giới hạn trong component/màn hình và ghi ngắn gọn lý do trong phần review triển khai.
7. Không vô tình thay đổi bảng màu, yêu cầu UX, trạng thái có thẩm quyền từ server hoặc quyền riêng tư giữa các đội trong lúc chuyển đổi styling. Cập nhật đặc tả hệ thống thiết kế UX nếu hành vi thị giác cấp sản phẩm thay đổi.

## Các giai đoạn triển khai theo thứ tự

Mỗi giai đoạn là một thay đổi riêng, có thể review. Tuân theo workflow của repo: lập kế hoạch, triển khai, review, kiểm thử, xác thực rồi checkpoint. Không bắt đầu giai đoạn phụ thuộc trước khi giai đoạn tiên quyết hoàn tất.

### 1. Hợp đồng và kiểm kê hiện trạng

- Đối chiếu kế hoạch này với `specs/02-ux/design-system.md` và `docs/ui-guidelines.md`; nêu rõ ranh giới component, Tailwind mặc định và việc tái sử dụng typography trong đặc tả hệ thống thiết kế có thẩm quyền.
- Kiểm kê route truy cập được, root của màn hình, control dùng chung, CSS import, inline style, khai báo typography và trạng thái tương tác hiện tại.
- Ghi lại hành vi và hiện trạng thị giác ở kích thước điện thoại hẹp và desktop. Xác định UI không còn dùng hoặc chỉ dành cho preview, không coi đó là màn hình sản phẩm.
- **Điều kiện hoàn tất:** hợp đồng dùng chung rõ ràng; phạm vi và thứ tự chuyển đổi dựa trên màn hình thực tế; không bắt đầu triển khai khi quyền sở hữu component còn mơ hồ.

### 2. Token dùng chung và typography

- Thiết lập palette, font family, vai trò chữ theo ngữ nghĩa, thang cỡ chữ đáp ứng, quy ước spacing/radius, focus ring và màu trạng thái thành token dùng chung được Tailwind sử dụng.
- Ánh xạ các cỡ chữ trong design system hiện tại vào từng vai trò; xử lý font không nhất quán mà không làm giảm khả năng đọc challenge hoặc tên người chơi.
- Loại bỏ quy tắc typography global trùng lặp khi các thành phần chuyển đổi; không tạo thêm thang chữ riêng theo trang.
- **Điều kiện hoàn tất:** mỗi vai trò chỉ có một định nghĩa và mục đích sử dụng được ghi rõ; các màn hình hiện tại dùng được vai trò chung mà vẫn giữ cỡ chữ thích ứng.

### 3. Primitive tương tác dùng chung

- Dùng wrapper Button dựa trên shadcn làm API Button dùng chung duy nhất; định nghĩa variant dự án, kích thước desktop/mobile, focus, disabled và pending.
- Giữ wrapper Dialog và Sheet dựa trên nền tảng shadcn; đồng bộ token, quản lý focus, hành vi đóng và cách hiển thị thích ứng.
- Dùng HTML ngữ nghĩa và Tailwind cho field biểu mẫu thông thường như ô nhập tên; không thêm shadcn Input chỉ để đồng nhất.
- Liên kết label, nội dung trợ giúp và lỗi với control. Giữ nguyên hành vi xác nhận, hủy và xóa.
- **Điều kiện hoàn tất:** mọi Button/Dialog/Sheet hiện tại dùng wrapper chung; không còn triển khai Button trùng lặp; hành vi bàn phím và cảm ứng nhất quán.

### 4. Home, Join và hướng dẫn đội

- Chuyển Home/Join, tạo phòng cho Host, form tên và hướng dẫn Wolf/Sheep sang
  token dùng chung, vai trò typography và cách tạo kiểu ưu tiên Tailwind.
- Giữ nguyên tạo phòng chỉ dành cho Host, join/resume, phản hồi validation và
  điều hướng quay lại. Chỉ giữ CSS nền/artwork thật sự cần thiết.
- **Điều kiện hoàn tất:** bố cục hoạt động trên điện thoại và desktop; giữ nguyên
  accessibility của form và điều hướng hiện có; bỏ override typography riêng
  khi đã có vai trò chung phù hợp.

### 5. Lobby và phân đội Host

- Chuyển lần lượt Lobby người chơi, Lobby Host và giao diện phân đội.
- Chuẩn hóa typography của danh sách người chơi, kết nối, phase, số lượng, action
  và status; giữ riêng control Host với thông tin người chơi được phép thấy.
- Chỉ giữ cách định vị tùy chỉnh cho bố cục bản đồ đội/danh sách người chơi nếu
  dùng utility sẽ thiếu ổn định hoặc khó hiểu.
- **Điều kiện hoàn tất:** action và typography dùng chung nhất quán; bố cục
  responsive vẫn giữ mọi control và status bắt buộc.

### 6. Chọn lá bài và Sheet thử thách

- Chuyển màn hình chọn bài của người chơi và Host, lá bài, trạng thái sẵn sàng,
  bộ đếm thời gian và Sheet thử thách. Dùng vai trò chữ chung cho nhãn thời gian,
  tiêu đề lá bài, nội dung thử thách và thông tin hỗ trợ.
- Khi cần, giữ artwork và bố cục chính xác của mặt lá bài trong CSS có phạm vi;
  dùng Tailwind cho layout xung quanh và quy tắc responsive thông thường.
- Giữ ranh giới thông tin Wolf/Sheep, quyền chỉnh sửa, countdown, trạng thái gửi
  và chế độ chỉ quan sát của Host.
- **Điều kiện hoàn tất:** luồng chọn bài và quyền riêng tư khớp đặc tả tính năng;
  Sheet dùng primitive chung; styling tùy chỉnh chỉ còn cho phần trình bày lá bài.

### 7. Gameplay và Results

- Trước tiên xác minh route Gameplay/Manage Game đã triển khai và truy cập được
  hay chưa. Chuyển đổi màn hình hiện có; nếu chưa có, ghi chúng thành yêu cầu áp
  dụng trong tương lai và không tạo hành vi gameplay trong đợt refactor này.
- Chuyển Results và các màn gameplay hiện có sang vai trò chữ, token, layout ưu
  tiên Tailwind và control dùng chung.
- Giữ nguyên điểm số có thẩm quyền, action hợp lệ, kết quả challenge, replay,
  hủy trận và trạng thái hoàn tất.
- **Điều kiện hoàn tất:** màn hình đã triển khai đáp ứng yêu cầu page/feature hiện
  có; màn hình còn thiếu được ghi rõ là ngoài phạm vi.

### 8. Hợp nhất và đánh giá chất lượng

- Sau khi mọi nơi sử dụng đã chuyển đổi, xóa CSS màn hình cũ và khai báo trùng.
  Giữ CSS global cho cấu hình Tailwind, reset, token và quy tắc component thực sự
  dùng chung. Tránh viết lại toàn bộ stylesheet trong một lần.
- Review từng trạng thái đã triển khai trên điện thoại, tablet và desktop; kiểm
  tra điều hướng bàn phím, focus, label, thông báo, tương phản, vùng chạm, giảm
  chuyển động và lỗi console/network trên trình duyệt.
- Review tính nhất quán thị giác: tái sử dụng vai trò typography, một API Button,
  chỉ ba nền tảng shadcn đã chỉ định, Tailwind là mặc định và styling trang trí
  tùy chỉnh ở mức tối thiểu.
- Chạy kiểm tra hành vi trọng tâm và validation repo đã cấu hình cho từng giai
  đoạn. Kiểm tra bị thiếu hoặc không chạy được không được tính là đạt. Ghi bằng
  chứng và checkpoint các giai đoạn hoàn tất theo `RULES.md`.
- **Điều kiện hoàn tất:** mọi quality gate trong phạm vi đều đạt, không còn hồi
  quy đã biết, và mọi màn hình trì hoãn hoặc ngoại lệ styling đều có lý do rõ ràng.

## Tiêu chí hoàn thành

- Đặc tả UX và hướng dẫn triển khai thể hiện cùng ranh giới component,
  typography và styling như kế hoạch này.
- Button, Dialog và Sheet dùng nền tảng shadcn đã tùy chỉnh; không có loại
  component shadcn nào khác được đưa vào làm giải pháp styling mặc định.
- Tailwind là phương thức tạo kiểu thông thường; CSS tùy chỉnh còn lại có phạm
  vi rõ ràng và có lý do là nhu cầu thị giác phức tạp.
- Mọi màn hình đã triển khai tái sử dụng vai trò typography và token dùng chung.
- Điều hướng, gameplay, quyền riêng tư, accessibility và yêu cầu responsive hiện
  có tiếp tục đạt các quality gate liên quan.
