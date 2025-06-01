import '../styles/globals.css';

import { Inter } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '2oods blog',
  description: '2oods blog',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
