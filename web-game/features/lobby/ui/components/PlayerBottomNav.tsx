interface PlayerBottomNavProps {
  onOpenWolf: () => void;
  onOpenSheep: () => void;
  onComingSoon: (item: string) => void;
}

const tabs = [
  { label: 'Sách', asset: 'book-icon.png', action: 'soon' },
  { label: 'Thẻ bài', asset: 'card-icon.png', action: 'soon' },
  { label: 'Đội Sói', asset: 'wolf-icon.png', action: 'wolf' },
  { label: 'Đội Cừu', asset: 'sheep-icon.png', action: 'sheep' },
] as const;

export function PlayerBottomNav({ onOpenWolf, onOpenSheep, onComingSoon }: PlayerBottomNavProps) {
  return <nav className="player-bottom-nav" aria-label="Điều hướng người chơi">
    {tabs.map((tab) => <button
      className="player-bottom-nav__item"
      type="button"
      key={tab.label}
      aria-label={tab.action === 'soon' ? `${tab.label}, sắp ra mắt` : tab.label}
      onClick={() => {
        if (tab.action === 'wolf') onOpenWolf();
        else if (tab.action === 'sheep') onOpenSheep();
        else onComingSoon(tab.label);
      }}
    >
      <img src={`/assets/custom-icons/${tab.asset}`} alt="" aria-hidden="true" />
    </button>)}
  </nav>;
}
