interface PlayerBottomNavProps {
  onOpenWolf: () => void;
  onOpenSheep: () => void;
  onComingSoon: (item: string) => void;
}

const tabs = [
  { label: 'Sách', asset: 'book-icon.png', action: 'soon' },
  { label: 'Thẻ bài', asset: 'card-icon.png', action: 'soon' },
  { label: 'Đội Sói', asset: 'wolf-icon-white.png', action: 'wolf' },
  { label: 'Đội Cừu', asset: 'sheep-icon.png', action: 'sheep' },
] as const;

export function PlayerBottomNav({ onOpenWolf, onOpenSheep, onComingSoon }: PlayerBottomNavProps) {
  return <nav className="fixed z-[9999] bottom-[max(34px,env(safe-area-inset-bottom))] left-1/2 grid h-11 w-[min(calc(100vw-40px),360px)] -translate-x-1/2 grid-cols-4 m-0" aria-label="Điều hướng người chơi">
    {tabs.map((tab) => <button
      className="grid min-h-11 min-w-11 place-items-center border-0 bg-transparent p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
      type="button"
      key={tab.label}
      aria-label={tab.action === 'soon' ? `${tab.label}, sắp ra mắt` : tab.label}
      onClick={() => {
        if (tab.action === 'wolf') onOpenWolf();
        else if (tab.action === 'sheep') onOpenSheep();
        else onComingSoon(tab.label);
      }}
    >
      <img className="block max-h-6 max-w-6 object-contain" src={`/assets/custom-icons/${tab.asset}`} alt="" aria-hidden="true" />
    </button>)}
  </nav>;
}
