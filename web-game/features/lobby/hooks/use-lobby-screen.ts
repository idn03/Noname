'use client';

import { useState, type FormEvent } from 'react';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../../../../shared/lobby-contract';
import { emitLobbyCommand, errorText, type LobbyCommand } from '../services/lobby-command';
import { useLobbyConnection } from './use-lobby-connection';

export function useLobbyScreen() {
  const [name, setName] = useState('');
  const connection = useLobbyConnection();
  const { socket, lobby, error, setError, connected, pending, setPending, isLocalHost, selfId, setSelfId } = connection;

  const command = (event: LobbyCommand, payload: unknown, done?: (reply: LobbyCommandReply) => void) => {
    setPending(true);
    setError('');
    emitLobbyCommand(socket, event, payload, (reply, timedOut) => {
      setPending(false);
      if (timedOut) return setError('Máy chủ chưa phản hồi. Hãy kiểm tra kết nối rồi thử lại.');
      if (!reply?.ok) return setError(reply?.error ? errorText(reply.error.code) : 'Đã xảy ra lỗi. Vui lòng thử lại.');
      if (reply) done?.(reply);
    });
  };

  const createHost = () => command(LOBBY_EVENTS.hostCreate, {}, (reply) => setSelfId(reply.playerId ?? ''));
  const join = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    command(LOBBY_EVENTS.join, { name }, (reply) => setSelfId(reply.playerId ?? ''));
  };
  const start = (confirmed: boolean) => command(LOBBY_EVENTS.hostStart, { confirmLowPopulation: confirmed });
  const cancel = () => command(LOBBY_EVENTS.hostCancel, {});
  const deleteRoom = () => command(LOBBY_EVENTS.hostDeleteRoom, {});
  const players = lobby?.players ?? [];
  const connectedPlayers = players.filter((player) => player.connected && !player.isHost).length;
  const currentPlayer = players.find((player) => player.id === selfId);
  const host = Boolean(currentPlayer?.isHost);
  const roleClass = isLocalHost === null ? 'lobby-shell--resolving' : isLocalHost ? 'lobby-shell--host' : 'lobby-shell--player';

  return {
    name, setName, lobby, error, connected, pending, isLocalHost, selfId, host,
    players, connectedPlayers, currentPlayer, roleClass,
    createHost, join, start, cancel, deleteRoom,
  };
}
