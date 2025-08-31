import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const icsEvents = [
  // Weekday Daily Blocks
  {
    title: '개발자 Deep Work (공부·코딩)',
    personaName: '개발자',
    start: '06:00',
    end: '08:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  {
    title: '기자·칼럼니스트 — 기사/칼럼 작성',
    personaName: '기자',
    start: '08:00',
    end: '09:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  {
    title: '학자 — 논문 수정/연구',
    personaName: '연구자',
    start: '09:00',
    end: '11:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  {
    title: '투자자 — 시황 점검 & 기록',
    personaName: '투자자',
    start: '14:00',
    end: '15:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  {
    title: '엄마 — 가족과 함께하는 시간',
    personaName: '엄마',
    start: '18:00',
    end: '20:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  {
    title: '리플렉션 & 기록',
    personaName: '연구자',
    start: '21:00',
    end: '22:00',
    repeat: 'WEEKLY',
    days: ['MO', 'TU', 'WE', 'TH', 'FR']
  },
  // Saturday Focus
  {
    title: "Developer's Day — 개발 프로젝트 집중 몰입",
    personaName: '개발자',
    start: '09:00',
    end: '13:00',
    repeat: 'WEEKLY',
    days: ['SA']
  },
  // Sunday Planning
  {
    title: '투자자 — 한 주 투자 리뷰 & 다음 주 전략',
    personaName: '투자자',
    start: '10:00',
    end: '11:30',
    repeat: 'WEEKLY',
    days: ['SU']
  },
  {
    title: '칼럼·학술 콘텐츠 기획',
    personaName: '기자',
    start: '13:00',
    end: '15:00',
    repeat: 'WEEKLY',
    days: ['SU']
  },
  {
    title: '엄마 — 가족과 휴식',
    personaName: '엄마',
    start: '18:00',
    end: '20:00',
    repeat: 'WEEKLY',
    days: ['SU']
  },
  // Quarterly Reviews
  {
    title: '분기 점검 — 칼럼 시리즈 진행 점검',
    personaName: '기자',
    start: '09:00',
    end: '10:00',
    repeat: 'MONTHLY',
    interval: 3
  },
  {
    title: '분기 점검 — 논문/학회 발표 준비',
    personaName: '연구자',
    start: '10:00',
    end: '11:00',
    repeat: 'MONTHLY',
    interval: 3
  },
  {
    title: '분기 점검 — 투자 포트폴리오 점검',
    personaName: '투자자',
    start: '11:00',
    end: '12:00',
    repeat: 'MONTHLY',
    interval: 3
  },
  {
    title: '분기 목표 — 개발 프로젝트 1개 완료',
    personaName: '개발자',
    start: '13:00',
    end: '14:00',
    repeat: 'MONTHLY',
    interval: 3
  },
  // Annual Review
  {
    title: '연말 리뷰 — 페르소나 성과 & 내년 우선순위 설정',
    personaName: '연구자',
    start: '10:00',
    end: '11:30',
    repeat: 'YEARLY'
  }
];

async function importIcsEvents() {
  try {
    // 기본 페르소나들 생성
    const defaultPersonas = [
      { name: '기자', color: '#3B82F6', description: '기사·칼럼 작성' },
      { name: '엄마', color: '#EC4899', description: '가족과의 시간' },
      { name: '연구자', color: '#10B981', description: '논문·연구 활동' },
      { name: '개발자', color: '#8B5CF6', description: '개발·코딩 작업' },
      { name: '투자자', color: '#F59E0B', description: '투자·시황 분석' }
    ];

    for (const personaData of defaultPersonas) {
      const { data: existingPersona } = await supabase
        .from('personas')
        .select('id')
        .eq('name', personaData.name)
        .single();

      if (!existingPersona) {
        await supabase.from('personas').insert(personaData);
      }
    }

    console.log('Default personas created/updated');

    // 페르소나 조회
    const { data: personas } = await supabase.from('personas').select('*');
    const personaMap = Object.fromEntries(
      personas?.map(p => [p.name, p.id]) || []
    );

    // 일주일치 일정만 생성 (2025년 9월 1일-7일)
    const weekDays = [
      { date: '2025-09-01', day: 'MO' }, // Monday
      { date: '2025-09-02', day: 'TU' }, // Tuesday  
      { date: '2025-09-03', day: 'WE' }, // Wednesday
      { date: '2025-09-04', day: 'TH' }, // Thursday
      { date: '2025-09-05', day: 'FR' }, // Friday
      { date: '2025-09-06', day: 'SA' }, // Saturday
      { date: '2025-09-07', day: 'SU' }  // Sunday
    ];

    for (const { date, day } of weekDays) {
      for (const eventData of icsEvents) {
        // 요일별 필터링
        if (eventData.days && !eventData.days.includes(day)) {
          continue;
        }

        const personaId = personaMap[eventData.personaName];
        if (!personaId) {
          console.warn(`Persona not found: ${eventData.personaName}`);
          continue;
        }

        const startDateTime = new Date(`${date}T${eventData.start}:00+09:00`);
        const endDateTime = new Date(`${date}T${eventData.end}:00+09:00`);

        await supabase.from('events').insert({
          title: eventData.title,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          persona_id: personaId,
          repeat: eventData.repeat,
          tags: ['루틴', '반복일정']
        });
      }
    }

    console.log('One week of ICS events imported successfully');
  } catch (error) {
    console.error('Error importing ICS events:', error);
  }
}

importIcsEvents();