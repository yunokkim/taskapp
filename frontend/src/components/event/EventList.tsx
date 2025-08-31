'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/store/eventStore';
import { usePersonaStore } from '@/store/personaStore';
import EventEditModal from './EventEditModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getKoreanDate, toKoreanDateString, parseKoreanDate } from '@/utils/dateUtils';

export default function EventList() {
  const { events, deleteEvent, fetchEvents, loading } = useEventStore();
  const { getPersonaById, fetchPersonas } = usePersonaStore();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonas();
    fetchEvents();
  }, [fetchPersonas, fetchEvents]);

  if (events.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-gray-500">
          <p className="mb-2">등록된 일정이 없습니다</p>
          <p className="text-sm">새로운 일정을 추가해보세요!</p>
        </div>
      </Card>
    );
  }

  // 오늘과 내일 일정만 필터링 (한국 시간 기준)
  const today = getKoreanDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const todayStr = toKoreanDateString(today);
  const tomorrowStr = toKoreanDateString(tomorrow);
  
  const todayTomorrowEvents = events.filter(event => {
    const eventKoreanDate = parseKoreanDate(event.start.toISOString());
    const eventDateStr = toKoreanDateString(eventKoreanDate);
    return eventDateStr === todayStr || eventDateStr === tomorrowStr;
  });

  // 페르소나별로 그룹핑하고 시간순 정렬
  const eventsByPersona = todayTomorrowEvents.reduce((acc, event) => {
    const personaId = event.personaId;
    if (!acc[personaId]) {
      acc[personaId] = [];
    }
    acc[personaId].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // 각 페르소나의 이벤트를 시간순으로 정렬
  Object.values(eventsByPersona).forEach(events => {
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  });

  return (
    <div className="space-y-4 pr-2">
      {Object.entries(eventsByPersona).map(([personaId, personaEvents]) => {
        const persona = getPersonaById(personaId);
        if (!persona) return null;
        
        return (
          <div key={personaId} className="space-y-2">
            {/* 페르소나 헤더 */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: persona.color }}
              />
              <h3 className="font-semibold text-gray-800">{persona.name}</h3>
              <Badge variant="outline" className="text-xs ml-auto">
                {personaEvents.length}개
              </Badge>
            </div>
            
            {/* 해당 페르소나의 일정들 */}
            {personaEvents.map((event) => (
              <Card key={event.id} className="p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>
                        📅 {format(parseKoreanDate(event.start.toISOString()), 'M월 d일 (E)', { locale: ko })}
                      </span>
                      <span>
                        ⏰ {format(parseKoreanDate(event.start.toISOString()), 'HH:mm')} - {event.end ? format(parseKoreanDate(event.end.toISOString()), 'HH:mm') : ''}
                      </span>
                      {event.repeat !== 'none' && (
                        <Badge variant="secondary" className="text-xs">
                          {event.repeat === 'daily' && '매일'}
                          {event.repeat === 'weekly' && '매주'}
                          {event.repeat === 'monthly' && '매월'}
                        </Badge>
                      )}
                    </div>
                    
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 flex-col">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => setEditingEventId(event.id)}
                    >
                      수정
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-red-500 hover:text-red-700 h-7"
                      onClick={() => {
                        if (confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) {
                          deleteEvent(event.id);
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      })}
      
      {/* 일정 수정 모달 */}
      <EventEditModal
        isOpen={editingEventId !== null}
        onClose={() => setEditingEventId(null)}
        eventId={editingEventId}
      />
    </div>
  );
}