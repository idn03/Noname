type Team = 'wolf' | 'sheep';

interface TeamInstructionScreenProps {
  team: Team;
  onBack: () => void;
}

const teamContent = {
  wolf: {
    name: 'Đội Sói',
    icon: '/assets/custom-icons/wolf-icon-white.png',
    portrait: '/assets/wolf-fortait.png',
    paragraphs: [
      'Sói, một loài sinh vật ranh mãnh và tàn bạo. Với chúng, giết chóc không đơn thuần là bản năng sinh tồn, mà còn là một thú vui méo mó. Chúng tận hưởng từng tiếng gào thét, từng khoảnh khắc tuyệt vọng của con mồi, biến những cuộc săn đẫm máu thành trò tiêu khiển.',
      'Thế nhưng, loài Sói không vội kết liễu nạn nhân. Chúng thích chơi đùa với con mồi, ban cho họ những thử thách, những cơ hội tưởng chừng có thể đổi lấy mạng sống. Chúng thích nhìn con mồi vùng vẫy, cầu xin và bấu víu vào chút hy vọng mong manh cuối cùng.',
      'Để rồi phải nhận ra rằng, không có cái kết nào là toàn vẹn khi đã bị Sói nhắm đến.',
    ],
  },
  sheep: {
    name: 'Đội Cừu',
    icon: '/assets/teams/sheep-icon.svg',
    portrait: '/assets/sheep-fortait.png',
    paragraphs: [
      'Mặc dù chỉ là những con cừu nhỏ bé, yếu ớt và tưởng chừng vô hại, chẳng ai trong làng dám nhìn quá lâu vào đôi mắt trống rỗng của chúng.',
      'Khi màn đêm buông xuống, cả đàn sẽ đứng bất động ngoài cánh đồng, đồng loạt hướng ánh mắt về những ngôi nhà vẫn còn sáng đèn. Không kêu, không di chuyển. Chúng chỉ nhìn. Đôi khi, giữa tiếng gió, người ta nghe thấy tiếng trẻ con khóc vọng lên từ phía đàn cừu. Tiếng khóc rất thật, đủ để khiến một người mở cửa bước ra ngoài kiểm tra.',
      'Và đó cũng là sai lầm cuối cùng của họ.',
      'Bởi lũ cừu đã học được cách giả tiếng trẻ em khóc, thứ mà chúng vẫn hay lén để lấp đầy chiếc bụng đói.',
    ],
  },
} satisfies Record<Team, { name: string; icon: string; portrait: string; paragraphs: string[] }>;

export function TeamInstructionScreen({ team, onBack }: TeamInstructionScreenProps) {
  const content = teamContent[team];
  return <main className={`team-instruction team-instruction--${team}`}>
    <button className="team-instruction__back" type="button" onClick={onBack}>
      <span aria-hidden="true">←</span> Trang chủ
    </button>
    <header className="team-instruction__heading">
      <img src={content.icon} alt="" />
      <h1>{content.name}</h1>
    </header>
    <img className="team-instruction__portrait" src={content.portrait} alt={`Hình minh họa ${content.name}`} />
    <article className="team-instruction__copy" aria-label={`Hướng dẫn ${content.name}`}>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </article>
  </main>;
}
