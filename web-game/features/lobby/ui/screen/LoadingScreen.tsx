import Image from 'next/image';

interface LoadingScreenProps {
  audience: 'host' | 'player';
}

const bounceDelays = [
  '[animation-delay:0ms]',
  '[animation-delay:80ms]',
  '[animation-delay:160ms]',
  '[animation-delay:240ms]',
  '[animation-delay:320ms]',
  '[animation-delay:400ms]',
];

function LoadingText({ children, className }: { children: string; className: string }) {
  const characterOccurrences = new Map<string, number>();

  return <p className={className} role="status">
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{Array.from(children, (character) => {
      const occurrence = characterOccurrences.get(character) ?? 0;
      characterOccurrences.set(character, occurrence + 1);
      return <span
        className={`inline-block motion-safe:animate-bounce motion-reduce:animate-none ${bounceDelays[occurrence % bounceDelays.length]}`}
        key={`${character}-${occurrence}`}
      >{character === ' ' ? '\u00a0' : character}</span>;
    })}</span>
  </p>;
}

export function LoadingScreen({ audience }: LoadingScreenProps) {
  if (audience === 'host') return <main className="relative z-[1] flex min-h-dvh flex-col items-center justify-start px-6 pt-[clamp(6rem,17.3vh,12rem)] text-center" aria-busy="true">
    <Image className="w-[min(600px,86vw)]" src="/assets/splash-image.png" alt="Sói và Cừu" width={600} height={300} sizes="(max-width: 697px) 86vw, 600px" />
    <LoadingText className="mt-8 mb-0 text-white font-type-display text-[length:clamp(1.5rem,2.5vw,2.125rem)] leading-tight">Đang tải, vui lòng đợi trong giây lát</LoadingText>
  </main>;

  return <main className="relative z-[1] min-h-dvh" aria-busy="true">
    <div className="absolute right-5 bottom-[max(28px,env(safe-area-inset-bottom))] left-5 flex items-center gap-4">
      <Image className="size-[64px] shrink-0 object-contain" src="/assets/logo-without-bg.png" alt="Sói và Cừu" width={304} height={272} />
      <LoadingText className="m-0 text-[#8d3440] font-type-display text-[length:clamp(1.125rem,5vw,1.5rem)] leading-tight">Đang tải...</LoadingText>
    </div>
  </main>;
}
