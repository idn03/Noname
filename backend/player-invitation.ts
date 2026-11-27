import { networkInterfaces } from 'node:os';
import QRCode from 'qrcode';

function isPrivateIpv4(address: string): boolean {
  const [first, second] = address.split('.').map(Number);
  return first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168);
}

export function playerJoinUrl(boundAddress: string, port: number): string | undefined {
  const wildcard = boundAddress === '0.0.0.0' || boundAddress === '::';
  const address = Object.values(networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && isPrivateIpv4(entry.address))
    .map((entry) => entry.address)
    .filter((address) => wildcard || address === boundAddress)
    .sort()[0];
  return address ? `http://${address}:${port}` : undefined;
}

export async function printPlayerInvitation(url: string | undefined, interactive: boolean): Promise<void> {
  if (!url) {
    console.info('LAN players: no private IPv4 address available on the listening interface.');
    return;
  }
  console.info(`LAN players: ${url}`);
  if (!interactive) return;

  try {
    const qr = await QRCode.toString(url, { type: 'terminal', small: true });
    console.info(`\n${qr}`);
  } catch (error) {
    console.error('Could not render player QR code', error);
  }
}
