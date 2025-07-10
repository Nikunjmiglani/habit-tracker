import './globals.css';
import AuthProvider from '@/components/SessionProvider'; 
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';


export const metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
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
