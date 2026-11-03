import LobbyScreen from '../features/lobby/ui/screen/LobbyScreen';
import { WolfSelectionPreview } from '../features/game/ui/screen/WolfSelectionPreview';

export default function HomePage() {
  if (process.env.NODE_ENV === 'development') return <WolfSelectionPreview />;
  return <LobbyScreen />;
}
