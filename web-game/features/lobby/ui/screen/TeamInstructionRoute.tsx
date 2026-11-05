'use client';

import { TeamInstructionScreen } from '@/features/lobby/ui/screen/TeamInstructionScreen';

type Team = 'wolf' | 'sheep';

export function TeamInstructionRoute({ team }: { team: Team }) {
  return <div className="relative isolate min-h-dvh overflow-visible bg-black">
    <TeamInstructionScreen team={team} />
  </div>;
}
