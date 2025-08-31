'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PersonaList from '@/components/persona/PersonaList';
import UpcomingEvents from '@/components/event/UpcomingEvents';

export default function Sidebar() {
  return (
    <aside className="w-80 border-r bg-gray-50/50 flex flex-col">
      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* 빠른 액션 */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-gray-900">빠른 액션</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              📋 오늘 할 일
            </Button>
            <Button variant="outline" className="w-full justify-start">
              🔍 일정 검색
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📊 일정 통계
            </Button>
          </div>
        </Card>

        {/* 페르소나별 필터 - 새로운 PersonaList 컴포넌트 사용 */}
        <PersonaList />

        {/* 다가오는 일정 - 실제 DB 데이터 연동 */}
        <UpcomingEvents />
      </div>
    </aside>
  );
}