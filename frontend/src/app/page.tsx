import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/ui/floating-button';
import EventList from '@/components/event/EventList';
import FullCalendarView from '@/components/calendar/FullCalendarView';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="flex flex-col h-full">
            {/* 대시보드 헤더 */}
            <div className="p-6 pb-4 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                안녕하세요, 김윤옥님! 👋
              </h1>
              <p className="text-gray-600">
                오늘은 {getKoreanDate().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  timeZone: 'Asia/Seoul'
                })}입니다.
              </p>
            </div>

            {/* 캘린더 영역 */}
            <div className="flex-1 flex flex-col min-h-0 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">캘린더</h2>
              <div className="flex-1 bg-white rounded-lg shadow-sm border">
                <FullCalendarView />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 사이드바 - 일정 목록 */}
        <div className="w-96 border-l bg-gray-50/50 flex flex-col p-4 overflow-y-auto custom-scrollbar">
          {/* 일정 목록 */}
          <div className="flex flex-col h-full">
            <div className="h-12 flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">내 일정</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <EventList />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* 플로팅 버튼 */}
      <FloatingButton />
    </div>
  );
}
