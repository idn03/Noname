const shellBase = 'relative isolate min-h-dvh overflow-hidden bg-[#080607] bg-[url(/assets/backgrounds/background.png)] bg-center bg-cover font-type-body [&>*]:relative [&>*]:z-[1] [&>div:first-child]:!absolute [&>div:first-child]:!z-0';

export function getLobbyShellClassName(isPlayer: boolean, isActive: boolean) {
  return [shellBase, isPlayer ? 'w-[min(100%,402px)] mx-auto bg-scroll' : 'bg-fixed', isPlayer && !isActive && 'rounded-[8px]', isActive && !isPlayer && 'max-[700px]:bg-scroll']
    .filter(Boolean)
    .join(' ');
}

const sharedHomeContent = 'relative grid w-full max-w-[1920px] min-h-dvh mx-auto';

export function getHomeContentClassName(isHost: boolean) {
  if (isHost) return `${sharedHomeContent} grid grid-cols-[minmax(220px,260px)_minmax(0,1fr)] content-start items-start gap-[clamp(36px,3vw,56px)] px-[clamp(28px,3.65vw,72px)] pt-[15vh] pb-[6vh] max-[700px]:grid-cols-1 max-[700px]:gap-7 max-[700px]:px-6 max-[700px]:py-[30px]`;
  return `${sharedHomeContent} grid grid-cols-[minmax(180px,.7fr)_minmax(0,2fr)] content-center items-center gap-[clamp(32px,8vw,150px)] p-[clamp(28px,6vw,96px)] max-[700px]:grid-cols-1 max-[700px]:content-start max-[700px]:gap-0 max-[700px]:px-5 max-[700px]:pt-[max(26px,env(safe-area-inset-top))] max-[700px]:pb-[max(100px,calc(env(safe-area-inset-bottom)+84px))]`;
}

export function getHomeTitleClassName(isHost: boolean) {
  const base = 'flex m-0 text-white font-type-display font-normal [text-shadow:0_4px_20px_rgb(0_0_0/.2)]';
  if (!isHost) return `${base} flex-col text-[length:clamp(var(--text-heading2),30vw,var(--text-heading1))] leading-[.97]`;
  return `${base} flex-col text-[length:clamp(var(--text-heading2),9vw,var(--text-heading1))] leading-[.98] max-[700px]:flex-row max-[700px]:gap-[.25em] max-[700px]:text-[length:clamp(var(--text-heading3),13vw,var(--text-heading2))]`;
}

export const playerHomeActionClassName = 'min-w-0 self-auto my-0 mt-[clamp(40px,11vh,112px)]';
