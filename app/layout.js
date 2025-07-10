import './globals.css';
import AuthProvider from '@/components/SessionProvider'; 
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { ThemeProvider } from '@/components/ThemeProvider';


export const metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="google-site-verification" content="sRnvIvrZfA2GB5-F0_x6WYLYNaIeQfztA5yh0QnB4Rs" />
      </Head>
      <body>
        <ThemeProvider>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
