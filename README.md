<h1 align="center">
  <img src="web-game/public/assets/splash-image.png" width="600" alt="Sói và Cừu — trò chơi thẻ bài nhiều người chơi">
</h1>

<h3 align="center">Trò chơi thẻ bài theo đội, chơi cùng nhau trên mạng nội bộ.</h3>

**Noname** là trò chơi nhiều người chơi theo lượt dành cho một nhóm đang ở
cùng địa điểm. Người chơi được chia thành hai đội Sói và Cừu, chọn bài theo
danh mục rồi lần lượt tấn công, phòng thủ và thực hiện thử thách. Một máy tính
làm Host điều khiển ván chơi; mọi người kết nối bằng trình duyệt qua cùng mạng
Wi-Fi hoặc LAN.

## Luật chơi

- Một ván cần **6–10 người chơi**; Host điều khiển ván và không tính vào số
  người chơi.
- Khi Host bắt đầu, máy chủ chia người chơi ngẫu nhiên và cân bằng vào đội Sói
  và đội Cừu.
- Hai đội chọn bài theo danh mục trước khi vào lượt chơi. Mỗi người quản lý ô
  bài của mình.
- Sói tấn công bằng một lá bài. Cừu chỉ có thể phòng thủ bằng lá bài chưa dùng
  thuộc cùng danh mục; người phòng thủ sẽ xử lý thử thách tương ứng.
- Nếu Cừu không phòng thủ được, Sói nhận **2 điểm**. Nếu Cừu phòng thủ đúng
  danh mục, Cừu nhận **1 điểm**; hoàn thành thử thách thành công được thêm
  **1 điểm**.
- Ván kết thúc sau số lượt đã định. Đội nhiều điểm hơn thắng; bằng điểm thì
  hòa.

## Cài đặt và chơi

### Yêu cầu

- Node.js 22 trở lên
- pnpm 10.32.0
- 6–10 người chơi (không tính Host) trong cùng mạng Wi-Fi hoặc LAN; mỗi người
  chơi dùng một trình duyệt

### Chạy trên máy Host

```sh
git clone https://github.com/idn03/Noname.git
cd Noname
pnpm install
pnpm dev
```

Mở `http://127.0.0.1:3000` trên máy Host để tạo phòng. Người chơi khác mở địa
chỉ LAN mà máy chủ hiển thị trong terminal, hoặc địa chỉ IP nội bộ của máy Host
kèm cổng `3000`. Nếu không kết nối được, hãy cho phép Node.js nhận kết nối qua
tường lửa của mạng nội bộ.

## Phát triển

```sh
pnpm test             # Unit và integration tests
pnpm run typecheck    # Kiểm tra TypeScript
pnpm run build        # Build ứng dụng
pnpm run test:e2e     # Kiểm tra luồng trên trình duyệt
```

GitHub Actions tự chạy các bước kiểm tra trên với pull request vào `main` và
mỗi lần push lên `main`. Workflow phát triển chi tiết nằm trong
[`specs/workflow.md`](specs/workflow.md); luật sản phẩm và luật chơi đầy đủ nằm
trong [`specs/`](specs/).
