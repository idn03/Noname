const RUNES = [
  'tytiincaafty',
  'abjiitewabjio',
  'hunzaykovbuji',
  'vyt aikcaafty',
  'ydbnaikovbuji',
  'xuykoonfty',
  'tytiincaafty',
] as const;

export function RuneField() {
  return (
    <div className="rune-field" aria-hidden="true">
      {RUNES.map((rune, index) => <span key={`${rune}-${index}`}>{rune}</span>)}
    </div>
  );
}
