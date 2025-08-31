'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import FloatingButton from '@/components/ui/floating-button';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
      <Footer />
      
      {/* 플로팅 버튼 */}
      <FloatingButton />
    </div>
  );
}