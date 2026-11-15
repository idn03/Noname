'use client';

import { useState, type FormEvent } from 'react';
import { LOBBY_EVENTS, type HostCreateMode, type LobbyCommandReply } from '../../../../shared/lobby-contract';
import { emitLobbyCommand, errorText, type LobbyCommand } from '../services/lobby-command';
import { useLobbyConnection } from './use-lobby-connection';

export function useLobbyScreen() {
  const [name, setName] = useState('');
  const connection = useLobbyConnection();
  const { socket, lobby, error, setError, connected, pending, setPending, animatePageTransitions, markFirstStateTransition, clearFirstStateTransition, isLocalHost, selfId, setSelfId } = connection;

  const command = (event: LobbyCommand, payload: unknown, done?: (reply: LobbyCommandReply) => void, timeoutMs = 8000) => {
    setPending(true);
    setError('');
    emitLobbyCommand(socket, event, payload, (reply, timedOut) => {
      setPending(false);
      if (timedOut) {
        clearFirstStateTransition();
        return setError('Máy chủ chưa phản hồi. Hãy kiểm tra kết nối rồi thử lại.');
      }
      if (!reply?.ok) {
        clearFirstStateTransition();
        return setError(reply?.error ? errorText(reply.error.code) : 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
      if (reply) done?.(reply);
    }, timeoutMs);
  };

  const createRoom = (mode: HostCreateMode) => {
    markFirstStateTransition();
    command(LOBBY_EVENTS.hostCreate, { mode }, (reply) => setSelfId(reply.playerId ?? ''), 3000);
  };
  const createHost = () => createRoom('regular');
  const createSandbox = () => createRoom('sandbox');
  const join = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markFirstStateTransition();
    command(LOBBY_EVENTS.join, { name }, (reply) => setSelfId(reply.playerId ?? ''), 3000);
  };
  const start = (confirmed: boolean) => command(LOBBY_EVENTS.hostStart, { confirmLowPopulation: confirmed }, undefined, 3000);
  const cancel = () => command(LOBBY_EVENTS.hostCancel, {}, undefined, 3000);
  const deleteRoom = () => command(LOBBY_EVENTS.hostDeleteRoom, {}, undefined, 3000);
  const replay = () => command(LOBBY_EVENTS.hostReplay, {}, undefined, 3000);
  const selectCard = (selection: { categoryId: string; challengeId?: string }) => command(LOBBY_EVENTS.selectCard, selection);
  const removeCard = () => command(LOBBY_EVENTS.removeCard, {});
  const attack = (round: number) => command(LOBBY_EVENTS.attack, { round });
  const defend = (round: number) => command(LOBBY_EVENTS.defend, { round });
  const recordOutcome = (round: number, succeeded: boolean) => command(LOBBY_EVENTS.recordChallengeOutcome, { round, succeeded });
  const players = lobby?.players ?? [];
  const connectedPlayers = players.filter((player) => player.connected && !player.isHost).length;
  const currentPlayer = players.find((player) => player.id === selfId);
  const host = Boolean(currentPlayer?.isHost);
  const roleClass = isLocalHost === null ? 'lobby-shell--resolving' : isLocalHost ? 'lobby-shell--host' : 'lobby-shell--player';

  return {
    name, setName, lobby, error, setError, connected, pending, animatePageTransitions, isLocalHost, host, selfId,
    players, connectedPlayers, currentPlayer, roleClass,
    createHost, createSandbox, join, start, cancel, deleteRoom, replay, selectCard, removeCard, attack, defend, recordOutcome,
  };
}
