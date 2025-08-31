'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
// import koLocale from '@fullcalendar/core/locales/ko';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEventStore } from '@/store/eventStore';
import { usePersonaStore } from '@/store/personaStore';
import EventFormModal from '@/components/event/EventFormModal';
import EventEditModal from '@/components/event/EventEditModal';
import HolidayIndicator from '@/components/calendar/HolidayIndicator';
import { koreanHolidays, getHolidayByDate } from '@/utils/holidays';
import { KOREAN_TIMEZONE_INFO } from '@/utils/dateUtils';

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export default function FullCalendarView() {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  
  const { events, fetchEvents } = useEventStore();
  const { getPersonaById, fetchPersonas } = usePersonaStore();

  // 캘린더 제목 업데이트 함수
  const updateTitle = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const title = calendarApi.view.title;
      setCurrentTitle(title);
    }
  }, []);

  // 컴포넌트 마운트 시 초기 제목 설정 및 데이터 로드
  useEffect(() => {
    fetchPersonas();
    fetchEvents();
    setTimeout(updateTitle, 100);
  }, [fetchPersonas, fetchEvents, updateTitle]);

  // 이벤트를 FullCalendar 형식으로 변환
  const calendarEvents = events.map((event) => {
    const persona = getPersonaById(event.personaId);
    
    // timeZone 설정이 활성화된 상태에서는 ISO 문자열로 전달
    // FullCalendar가 timeZone 설정에 따라 올바르게 표시함
    return {
      id: event.id,
      title: event.title,
      start: event.start.toISOString(), // ISO 문자열로 전달
      end: event.end?.toISOString(),
      backgroundColor: persona?.color || '#3B82F6',
      borderColor: persona?.color || '#3B82F6',
      textColor: '#FFFFFF',
      extendedProps: {
        description: event.description,
        personaId: event.personaId,
        personaName: persona?.name,
        tags: event.tags,
        repeat: event.repeat,
        notifications: event.notifications
      }
    };
  });

  // 공휴일을 FullCalendar 이벤트로 변환
  const holidayEvents = koreanHolidays.map((holiday) => {
    // 공휴일을 로컬 시간대의 자정으로 설정하여 올바른 날짜에 표시
    const [year, month, day] = holiday.date.split('-').map(Number);
    const holidayDate = new Date(year, month - 1, day);
    
    console.log('Processing holiday:', holiday.name, holiday.date, '->', holidayDate.toString());
    
    return {
      id: `holiday-${holiday.date}`,
      title: holiday.name,
      start: holidayDate, // 로컬 시간대 Date 객체로 전달
      allDay: true,
      display: 'background',
      backgroundColor: holiday.isNationalHoliday ? 'rgba(220, 38, 38, 0.1)' : 'rgba(124, 58, 237, 0.05)',
      borderColor: 'transparent',
      className: `holiday-event ${holiday.isNationalHoliday ? 'national-holiday' : 'memorial-day'}`,
      extendedProps: {
        isHoliday: true,
        holidayType: holiday.type,
        isNationalHoliday: holiday.isNationalHoliday
      }
    };
  });

  // 모든 이벤트 합치기
  const allEvents = [...calendarEvents, ...holidayEvents];

  // 날짜 클릭 시 새 일정 생성 모달 열기
  const handleDateClick = useCallback((info: { date: Date }) => {
    setSelectedDate(info.date);
    setIsEventModalOpen(true);
  }, []);

  // 이벤트 클릭 시 수정 모달 열기
  const handleEventClick = useCallback((info: { event: { id: string; extendedProps?: { isHoliday?: boolean } } }) => {
    const eventId = info.event.id;
    setEditingEventId(eventId);
  }, []);

  // 뷰 변경
  const changeView = (view: CalendarView) => {
    setCurrentView(view);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(view);
    setTimeout(updateTitle, 0); // 뷰 변경 후 제목 업데이트
  };

  // 네비게이션
  const goToToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    setTimeout(updateTitle, 0);
  };

  const goToPrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    setTimeout(updateTitle, 0);
  };

  const goToNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    setTimeout(updateTitle, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 캘린더 헤더 - 뷰 전환 및 네비게이션 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeView('dayGridMonth')}
          >
            월간
          </Button>
          <Button
            variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeView('timeGridWeek')}
          >
            주간
          </Button>
          <Button
            variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeView('timeGridDay')}
          >
            일간
          </Button>
          <Button
            variant={currentView === 'listWeek' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeView('listWeek')}
          >
            목록
          </Button>
        </div>

        {/* 현재 년월/기간 표시 */}
        <div className="flex-1 flex justify-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentTitle || '2024년 12월'}
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToPrev}>
            ‹ 이전
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            오늘
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            다음 ›
          </Button>
        </div>
      </div>

      {/* 범례 - 페르소나별 색상 */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b">
        {Array.from(new Set(events.map(e => e.personaId))).map(personaId => {
          const persona = getPersonaById(personaId);
          if (!persona) return null;
          
          return (
            <Badge
              key={personaId}
              variant="outline"
              className="text-xs bg-white"
              style={{ 
                borderColor: persona.color,
                color: persona.color 
              }}
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: persona.color }}
              />
              {persona.name}
            </Badge>
          );
        })}
      </div>

      {/* FullCalendar */}
      <div className="flex-1 overflow-hidden bg-white">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          initialDate="2025-09-01" // 임포트된 일정이 있는 9월로 설정
          // locale={koLocale}
          timeZone={KOREAN_TIMEZONE_INFO.timezone} // 한국 시간대 설정
          headerToolbar={false} // 커스텀 헤더 사용
          height="1000px"
          events={allEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={false} // 일단 비활성화, 추후 드래그 앤 드롭 추가
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3} // 최대 표시 이벤트 수 조정
          weekends={true}
          nowIndicator={true}
          firstDay={0} // 일요일부터 시작
          aspectRatio={1.35} // 캘린더 비율 조정
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          dayHeaderFormat={{
            weekday: 'short'
          }}
          // 추가 설정
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // 월-금
            startTime: '09:00',
            endTime: '18:00'
          }}
          eventDisplay="block"
          displayEventTime={true}
          displayEventEnd={false}
          fixedWeekCount={false} // 월별로 주 수 변경 허용
          showNonCurrentDates={true}
          dayCellClassNames={(info) => {
            const classes = [];
            if (info.date.getDay() === 0) classes.push('fc-day-sun');
            if (info.date.getDay() === 6) classes.push('fc-day-sat');
            
            // 공휴일 체크
            const dateStr = info.date.toISOString().split('T')[0];
            const holiday = getHolidayByDate(dateStr);
            if (holiday?.isNationalHoliday) {
              classes.push('fc-day-national-holiday');
            }
            
            return classes;
          }}
          dayCellContent={(info) => {
            const dateStr = info.date.toISOString().split('T')[0];
            const holiday = getHolidayByDate(dateStr);
            
            return (
              <div className="fc-daygrid-day-contents">
                <div className="fc-daygrid-day-number">{info.dayNumberText}</div>
                {holiday && (
                  <div className="fc-holiday-indicator">
                    <HolidayIndicator holiday={holiday} isSmall={true} />
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* 일정 등록 모달 */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate(undefined);
        }}
        initialDate={selectedDate}
      />

      {/* 일정 수정 모달 */}
      <EventEditModal
        isOpen={editingEventId !== null}
        onClose={() => setEditingEventId(null)}
        eventId={editingEventId}
      />
    </div>
  );
}