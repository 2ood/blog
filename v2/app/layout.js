import '../styles/globals.css';

import { Inter } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: '2oods blog',
    template: '%s | 2oods blog',
  },
  description: '2oods blog',
};

// Runs before first paint so dark-mode users don't see a flash of the light theme.
const themeScript = 'try{var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.classList.add(t)}catch(e){}';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
