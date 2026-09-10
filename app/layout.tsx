import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aetasham Digital Seva',
  description: 'Private digital assistance and online service centre',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
