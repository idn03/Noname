'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { LOBBY_EVENTS, type LobbyErrorView, type LobbyView } from '../../../shared/lobby-contract';

const CREDENTIAL_KEY = 'noname.player-credential';

export function useLobbyConnection() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lobby, setLobby] = useState<LobbyView | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);
  const [isLocalHost, setIsLocalHost] = useState(false);
  const [selfId, setSelfId] = useState('');
  const credentialRejected = useRef(false);
  const connectionRef = useRef<Socket | null>(null);

  useEffect(() => {
    setIsLocalHost(['localhost', '127.0.0.1', '::1'].includes(window.location.hostname));
    const connection = io({ auth: { credential: window.localStorage.getItem(CREDENTIAL_KEY) } });
    connectionRef.current = connection;
    setSocket(connection);
    connection.on('connect', () => setConnected(true));
    connection.on('disconnect', () => {
      setConnected(false);
      setPending(false);
      setError('Đã mất kết nối. Khi máy chủ hoạt động lại, hãy thử lại.');
    });
    connection.on(LOBBY_EVENTS.identity, setSelfId);
    connection.on(LOBBY_EVENTS.state, (state: LobbyView) => {
      setLobby(state);
      setPending(false);
      setError(credentialRejected.current ? 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia phòng.' : '');
      credentialRejected.current = false;
    });
    connection.on(LOBBY_EVENTS.error, handleError);
    connection.on(LOBBY_EVENTS.credential, saveCredential);
    connection.on(LOBBY_EVENTS.ended, clearSession);
    return () => { connection.disconnect(); connectionRef.current = null; };
  }, []);

  function handleError(issue: LobbyErrorView) {
    if (issue.code === 'INVALID_CREDENTIAL' || issue.code === 'NO_ACTIVE_SESSION') {
      window.localStorage.removeItem(CREDENTIAL_KEY);
      if (connectionRef.current) connectionRef.current.auth = {};
    }
    credentialRejected.current = issue.code === 'INVALID_CREDENTIAL';
    setError(issue.message);
    setPending(false);
  }

  function saveCredential(value: string) {
    window.localStorage.setItem(CREDENTIAL_KEY, value);
    if (connectionRef.current) connectionRef.current.auth = { credential: value };
  }

  function clearSession() {
    window.localStorage.removeItem(CREDENTIAL_KEY);
    if (connectionRef.current) connectionRef.current.auth = {};
    setLobby(null);
    setSelfId('');
    setPending(false);
    setError('');
  }

  return { socket, lobby, setLobby, error, setError, connected, pending, setPending, isLocalHost, selfId, setSelfId };
}
