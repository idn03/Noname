const RUNES = Array.from({ length: 8 }, (_, index) =>
  `/assets/backgrounds/rune-${String(index + 1).padStart(2, '0')}.png`,
);

const MOBILE_RUNES = Array.from({ length: 3 }, (_, index) =>
  `/assets/backgrounds/rune-mobile-${String(index + 1).padStart(2, '0')}.png`,
);

export function RuneField() {
  return (
    <div className="rune-field" aria-hidden="true">
      {RUNES.map((src, index) => <img className={`rune-mark rune-mark--${index + 1}`} key={src} src={src} alt="" />)}
      {MOBILE_RUNES.map((src, index) => <img className={`rune-mark rune-mark--mobile-${index + 1}`} key={src} src={src} alt="" />)}
    </div>
  );
}
