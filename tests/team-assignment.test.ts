import { describe, expect, it } from 'vitest';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import type { GamePlayer } from '../web-game/game/game-types';

function players(count: number): GamePlayer[] {
  return [
    { id: 'host', name: 'Host', isHost: true },
    ...Array.from({ length: count }, (_, index) => ({ id: `p${index}`, name: `P${index}`, isHost: false })),
  ];
}

function assigned(count: number, oddTeamPick = 0) {
  let calls = 0;
  const result = prepareBalancedTeams(players(count), {
    nextInt: (upperBound) => ++calls === count ? oddTeamPick : 0 % upperBound,
  });
  if (!result.ok) throw new Error(result.error.message);
  return result.value.players;
}

describe('balanced team assignment', () => {
  it('splits six joining players evenly and leaves the Host unassigned', () => {
    const result = assigned(6);
    expect(result.filter((player) => player.team === 'wolf')).toHaveLength(3);
    expect(result.filter((player) => player.team === 'sheep')).toHaveLength(3);
    expect(result.find((player) => player.isHost)?.team).toBeUndefined();
  });

  it('gives an odd-count extra player to either randomly selected team', () => {
    const wolfExtra = assigned(7, 0);
    const sheepExtra = assigned(7, 1);
    expect(wolfExtra.filter((player) => player.team === 'wolf')).toHaveLength(4);
    expect(sheepExtra.filter((player) => player.team === 'sheep')).toHaveLength(4);
    expect(wolfExtra.filter((player) => player.team === 'wolf' && player.hasCardSlot)).toHaveLength(3);
    expect(sheepExtra.filter((player) => player.team === 'sheep' && player.hasCardSlot)).toHaveLength(3);
    expect(wolfExtra.filter((player) => player.hasCardSlot === false).map((player) => player.team)).toEqual(['wolf']);
    expect(sheepExtra.filter((player) => player.hasCardSlot === false).map((player) => player.team)).toEqual(['sheep']);
  });

  it('gives nine-player matches four card slots to each team and none to the extra teammate', () => {
    const result = assigned(9, 0);
    expect(result.filter((player) => player.team === 'wolf' && player.hasCardSlot)).toHaveLength(4);
    expect(result.filter((player) => player.team === 'sheep' && player.hasCardSlot)).toHaveLength(4);
    expect(result.filter((player) => player.hasCardSlot === false)).toHaveLength(1);
  });
});
