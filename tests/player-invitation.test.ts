import { afterEach, expect, it, vi } from 'vitest';
import QRCode from 'qrcode';
import { playerJoinUrl, printPlayerInvitation } from '../backend/player-invitation';

vi.mock('node:os', () => ({
  networkInterfaces: () => ({
    wifi: [{ address: '192.168.1.10', family: 'IPv4', internal: false }],
    vpn: [{ address: '10.8.0.1', family: 'IPv4', internal: false }],
  }),
}));

afterEach(() => vi.restoreAllMocks());

it('selects a deterministic LAN address and respects specific interface bindings', () => {
  expect(playerJoinUrl('0.0.0.0', 3000)).toBe('http://10.8.0.1:3000');
  expect(playerJoinUrl('192.168.1.10', 8123)).toBe('http://192.168.1.10:8123');
  expect(playerJoinUrl('127.0.0.1', 3000)).toBeUndefined();
});

it('renders exactly the printed URL in an interactive terminal', async () => {
  const url = 'http://192.168.1.10:8123';
  const log = vi.spyOn(console, 'info').mockImplementation(() => {});
  await printPlayerInvitation(url, true);
  expect(log.mock.calls).toEqual([
    [`LAN players: ${url}`],
    ['\n' + await QRCode.toString(url, { type: 'terminal', small: true })],
  ]);
});

it('skips QR output for logs and missing addresses', async () => {
  const log = vi.spyOn(console, 'info').mockImplementation(() => {});
  await printPlayerInvitation('http://10.0.0.1:3000', false);
  await printPlayerInvitation(undefined, true);
  expect(log.mock.calls).toHaveLength(2);
  expect(log.mock.calls[1][0]).toContain('no private IPv4');
});

it('preserves the printed URL when rendering fails', async () => {
  const url = 'http://10.0.0.1:3000';
  const log = vi.spyOn(console, 'info').mockImplementation(() => {});
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(QRCode, 'toString').mockImplementation(() => { throw new Error('render failed'); });
  await printPlayerInvitation(url, true);
  expect(log).toHaveBeenCalledWith(`LAN players: ${url}`);
  expect(error).toHaveBeenCalledOnce();
});
