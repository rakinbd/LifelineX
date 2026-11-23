import type { Metadata } from 'next';
import './globals.css';
import { EmergencyProvider } from '@/context/EmergencyContext';
import { RoleProvider } from '@/context/RoleContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EmergencyBanner from '@/components/layout/EmergencyBanner';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'LifeLink AI | Intelligent Emergency & Community Response Network',
  description: 'Global AI-powered emergency dispatch and mutual-aid network connecting distress calls with verified blood donors, ambulances, and first responders in real time.',
  keywords: ['Emergency Dispatch', 'Blood Donor Matching', 'CAD System', 'First Responders', 'Mutual Aid', 'Trauma Triage'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        <RoleProvider>
          <EmergencyProvider>
            <div className="flex flex-1 min-h-screen">
              {/* Left Navigation Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
                <Header />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </EmergencyProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
