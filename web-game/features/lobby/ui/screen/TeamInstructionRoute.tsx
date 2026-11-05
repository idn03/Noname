'use client';

import { useRouter } from 'next/navigation';
import { TeamInstructionScreen } from '@/features/lobby/ui/screen/TeamInstructionScreen';

type Team = 'wolf' | 'sheep';

export function TeamInstructionRoute({ team }: { team: Team }) {
  const router = useRouter();

  return <div className="relative isolate min-h-dvh overflow-visible bg-black">
    <TeamInstructionScreen team={team} onBack={() => router.push('/')} />
  </div>;
}
