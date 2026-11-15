interface LoadingScreenProps {
  audience: 'host' | 'player';
}

export function LoadingScreen({ audience }: LoadingScreenProps) {
  if (audience === 'host') return <main className="relative z-[1] flex min-h-dvh flex-col items-center justify-start px-6 pt-[clamp(6rem,17.3vh,12rem)] text-center" aria-busy="true">
    <img className="w-[min(600px,86vw)]" src="/assets/splash-image.png" alt="Sói và Cừu" />
    <p className="mt-8 mb-0 text-white font-type-display text-[length:clamp(1.5rem,2.5vw,2.125rem)] leading-tight" role="status">Đang tải, vui lòng đợi trong giây lát</p>
  </main>;

  return <main className="relative z-[1] min-h-dvh" aria-busy="true">
    <div className="absolute right-5 bottom-[max(28px,env(safe-area-inset-bottom))] left-5 flex items-center gap-4">
      <img className="size-[64px] shrink-0 object-contain" src="/assets/logo-without-bg.png" alt="Sói và Cừu" />
      <p className="m-0 text-[#8d3440] font-type-display text-[length:clamp(1.125rem,5vw,1.5rem)] leading-tight" role="status">Đang tải...</p>
    </div>
  </main>;
}
