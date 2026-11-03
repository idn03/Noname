import { notFound } from 'next/navigation';
import { WolfSelectionPreview } from '../../../features/game/ui/screen/WolfSelectionPreview';

export default function WolfSelectionPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <WolfSelectionPreview />;
}
