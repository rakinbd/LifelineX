import type { Metadata } from 'next';
import './globals.css';
import { EmergencyProvider } from '@/context/EmergencyContext';
import { RoleProvider } from '@/context/RoleContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'LifeLineX | Emergency Blood Donation & Request Network',
  description: 'LifeLineX connects patients in need of emergency blood with verified nearby voluntary donors and blood banks in real time.',
  keywords: ['LifeLineX', 'Blood Donation', 'Blood Requests', 'Donor Matching', 'Blood Group Guide', 'Emergency Transfusion'],
  icons: {
    icon: '/logo.png',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF7F5] text-slate-800 flex flex-col font-sans antialiased selection:bg-rose-500 selection:text-white text-sm sm:text-base">
        <RoleProvider>
          <EmergencyProvider>
            <AppShell>
              {children}
            </AppShell>
          </EmergencyProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
