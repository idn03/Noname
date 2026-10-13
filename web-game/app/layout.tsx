import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noname',
  description: 'Trò chơi nhiều người trong mạng nội bộ.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
