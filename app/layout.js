import './globals.css';
import AuthProvider from '@/components/SessionProvider'; 
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
  other: {
    'google-site-verification': 'sRnvIvrZfA2GB5-F0_x6WYLYNaIeQfztA5yh0QnB4Rs',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

