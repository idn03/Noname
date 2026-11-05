type Team = 'wolf' | 'sheep';

interface TeamInstructionScreenProps {
  team: Team;
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

export function TeamInstructionScreen({ team }: TeamInstructionScreenProps) {
  const content = teamContent[team];
  return <main className="mx-auto min-h-dvh w-[min(100%,402px)] overflow-visible bg-black pt-5 pb-8 text-white">
    <header className="flex min-h-[181px] flex-col items-center gap-[10px]">
      <img className="size-[60px] object-contain" src={content.icon} alt="" />
      <h1 className="m-0 font-judson text-[40px] font-bold leading-[1.2]">{content.name}</h1>
    </header>
    <img className="block h-[603px] w-full rounded-xl object-cover" src={content.portrait} alt={`Hình minh họa ${content.name}`} />
    <article className="px-[19px] pt-6 font-judson text-[14px] leading-[30px]" aria-label={`Hướng dẫn ${content.name}`}>
      {content.paragraphs.map((paragraph) => <p className="mb-6" key={paragraph}>{paragraph}</p>)}
    </article>
  </main>;
}
