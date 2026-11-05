'use client';

import { TeamInstructionScreen } from '@/features/lobby/ui/screen/TeamInstructionScreen';

type Team = 'wolf' | 'sheep';

export function TeamInstructionRoute({ team }: { team: Team }) {
  return <div className="relative isolate mx-auto min-h-dvh w-[min(100%,402px)] overflow-visible bg-black">
    <TeamInstructionScreen team={team} />
  </div>;
}
