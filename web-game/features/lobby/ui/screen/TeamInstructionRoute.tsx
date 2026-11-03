'use client';

import { useRouter } from 'next/navigation';
import { TeamInstructionScreen } from '@/features/lobby/ui/screen/TeamInstructionScreen';

type Team = 'wolf' | 'sheep';

export function TeamInstructionRoute({ team }: { team: Team }) {
  const router = useRouter();

  return <div className="lobby-shell lobby-shell--player team-instruction-shell">
    <TeamInstructionScreen team={team} onBack={() => router.push('/')} />
  </div>;
}
