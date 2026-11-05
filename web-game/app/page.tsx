import LobbyScreen from '../features/lobby/ui/screen/LobbyScreen';
import { SheepSelectionPreview } from '../features/game/ui/screen/SheepSelectionPreview';

export default function HomePage() {
  if (process.env.NODE_ENV === 'development') return <SheepSelectionPreview />;
  return <LobbyScreen />;
}
