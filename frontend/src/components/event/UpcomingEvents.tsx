'use client';

import { useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/store/eventStore';
import { usePersonaStore } from '@/store/personaStore';
import { format, isAfter, isToday, isTomorrow, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function UpcomingEvents() {
  const { events, fetchEvents, loading } = useEventStore();
  const { personas, fetchPersonas, getPersonaById } = usePersonaStore();

  useEffect(() => {
    fetchPersonas();
    fetchEvents();
  }, [fetchPersonas, fetchEvents]);

  // 다가오는 일정 필터링 (오늘부터 7일 내)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = addDays(now, 7);
    
    return events
      .filter(event => {
        const eventStart = new Date(event.start);
        return isAfter(eventStart, now) && isAfter(weekFromNow, eventStart);
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5); // 최대 5개만 표시
  }, [events]);

  const formatEventTime = (date: Date) => {
    if (isToday(date)) {
      return `오늘 ${format(date, 'a h시', { locale: ko })}`;
    } else if (isTomorrow(date)) {
      return `내일 ${format(date, 'a h시', { locale: ko })}`;
    } else {
      return format(date, 'E요일 a h시', { locale: ko });
    }
  };

  const getPersonaColor = (personaId: string) => {
    const persona = getPersonaById(personaId);
    return persona?.color || '#6B7280';
  };

  const getPersonaName = (personaId: string) => {
    const persona = getPersonaById(personaId);
    return persona?.name || '알 수 없음';
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-gray-900">다가오는 일정</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-gray-900">다가오는 일정</h3>
      <div className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">다가오는 일정이 없습니다</p>
            <p className="text-xs mt-1">새로운 일정을 추가해보세요!</p>
          </div>
        ) : (
          upcomingEvents.map((event) => {
            const personaColor = getPersonaColor(event.personaId);
            const personaName = getPersonaName(event.personaId);
            const eventTime = formatEventTime(new Date(event.start));

            return (
              <div 
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ 
                  backgroundColor: `${personaColor}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${personaColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${personaColor}15`;
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mt-2" 
                  style={{ backgroundColor: personaColor }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-gray-500">{eventTime}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: personaColor }}
                    />
                    <span className="text-xs text-gray-600">{personaName}</span>
                  </div>
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${personaColor}20`,
                            color: personaColor
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                      {event.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{event.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {upcomingEvents.length > 0 && (
        <Button variant="ghost" className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800">
          전체 일정 보기
        </Button>
      )}
    </Card>
  );
}