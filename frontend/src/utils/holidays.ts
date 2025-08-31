// 한국 공휴일 및 절기 데이터
export interface Holiday {
  date: string; // YYYY-MM-DD 형식
  name: string;
  type: 'national' | 'traditional' | 'memorial' | 'season'; // 공휴일, 전통명절, 기념일, 절기
  isNationalHoliday: boolean; // 실제 공휴일 여부
}

// 2024-2025년 한국 공휴일 및 기념일 데이터
export const koreanHolidays: Holiday[] = [
  // 2024년
  { date: '2024-01-01', name: '신정', type: 'national', isNationalHoliday: true },
  { date: '2024-02-09', name: '설날연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2024-02-10', name: '설날', type: 'traditional', isNationalHoliday: true },
  { date: '2024-02-11', name: '설날연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2024-02-12', name: '설날대체공휴일', type: 'traditional', isNationalHoliday: true },
  { date: '2024-03-01', name: '삼일절', type: 'national', isNationalHoliday: true },
  { date: '2024-04-10', name: '제22대 국회의원 선거', type: 'national', isNationalHoliday: true },
  { date: '2024-05-05', name: '어린이날', type: 'national', isNationalHoliday: true },
  { date: '2024-05-06', name: '어린이날대체공휴일', type: 'national', isNationalHoliday: true },
  { date: '2024-05-15', name: '부처님오신날', type: 'traditional', isNationalHoliday: true },
  { date: '2024-06-06', name: '현충일', type: 'memorial', isNationalHoliday: true },
  { date: '2024-08-15', name: '광복절', type: 'national', isNationalHoliday: true },
  { date: '2024-09-16', name: '추석연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2024-09-17', name: '추석', type: 'traditional', isNationalHoliday: true },
  { date: '2024-09-18', name: '추석연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2024-10-03', name: '개천절', type: 'national', isNationalHoliday: true },
  { date: '2024-10-09', name: '한글날', type: 'national', isNationalHoliday: true },
  { date: '2024-12-25', name: '성탄절', type: 'national', isNationalHoliday: true },

  // 2025년
  { date: '2025-01-01', name: '신정', type: 'national', isNationalHoliday: true },
  { date: '2025-01-28', name: '설날연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2025-01-29', name: '설날', type: 'traditional', isNationalHoliday: true },
  { date: '2025-01-30', name: '설날연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2025-03-01', name: '삼일절', type: 'national', isNationalHoliday: true },
  { date: '2025-05-05', name: '어린이날', type: 'national', isNationalHoliday: true },
  { date: '2025-05-13', name: '부처님오신날', type: 'traditional', isNationalHoliday: true },
  { date: '2025-06-06', name: '현충일', type: 'memorial', isNationalHoliday: true },
  { date: '2025-08-15', name: '광복절', type: 'national', isNationalHoliday: true },
  { date: '2025-10-05', name: '추석연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2025-10-06', name: '추석', type: 'traditional', isNationalHoliday: true },
  { date: '2025-10-07', name: '추석연휴', type: 'traditional', isNationalHoliday: true },
  { date: '2025-10-08', name: '추석대체공휴일', type: 'traditional', isNationalHoliday: true },
  { date: '2025-10-03', name: '개천절', type: 'national', isNationalHoliday: true },
  { date: '2025-10-09', name: '한글날', type: 'national', isNationalHoliday: true },
  { date: '2025-12-25', name: '성탄절', type: 'national', isNationalHoliday: true },

  // 기념일들 (공휴일 아님)
  { date: '2024-02-14', name: '밸런타인데이', type: 'memorial', isNationalHoliday: false },
  { date: '2024-03-14', name: '화이트데이', type: 'memorial', isNationalHoliday: false },
  { date: '2024-04-14', name: '블랙데이', type: 'memorial', isNationalHoliday: false },
  { date: '2024-05-08', name: '어버이날', type: 'memorial', isNationalHoliday: false },
  { date: '2024-05-15', name: '스승의날', type: 'memorial', isNationalHoliday: false },
  { date: '2024-10-31', name: '할로윈', type: 'memorial', isNationalHoliday: false },
  { date: '2024-11-11', name: '빼빼로데이', type: 'memorial', isNationalHoliday: false },
  { date: '2024-12-24', name: '크리스마스이브', type: 'memorial', isNationalHoliday: false },

  { date: '2025-02-14', name: '밸런타인데이', type: 'memorial', isNationalHoliday: false },
  { date: '2025-03-14', name: '화이트데이', type: 'memorial', isNationalHoliday: false },
  { date: '2025-04-14', name: '블랙데이', type: 'memorial', isNationalHoliday: false },
  { date: '2025-05-08', name: '어버이날', type: 'memorial', isNationalHoliday: false },
  { date: '2025-05-15', name: '스승의날', type: 'memorial', isNationalHoliday: false },
  { date: '2025-10-31', name: '할로윈', type: 'memorial', isNationalHoliday: false },
  { date: '2025-11-11', name: '빼빼로데이', type: 'memorial', isNationalHoliday: false },
  { date: '2025-12-24', name: '크리스마스이브', type: 'memorial', isNationalHoliday: false },

  // 24절기 중 주요 절기들
  { date: '2024-03-20', name: '춘분', type: 'season', isNationalHoliday: false },
  { date: '2024-06-21', name: '하지', type: 'season', isNationalHoliday: false },
  { date: '2024-09-22', name: '추분', type: 'season', isNationalHoliday: false },
  { date: '2024-12-21', name: '동지', type: 'season', isNationalHoliday: false },

  { date: '2025-03-20', name: '춘분', type: 'season', isNationalHoliday: false },
  { date: '2025-06-21', name: '하지', type: 'season', isNationalHoliday: false },
  { date: '2025-09-23', name: '추분', type: 'season', isNationalHoliday: false },
  { date: '2025-12-22', name: '동지', type: 'season', isNationalHoliday: false },
];

// 특정 날짜의 공휴일/기념일 정보 조회
export function getHolidayByDate(date: string): Holiday | undefined {
  return koreanHolidays.find(holiday => holiday.date === date);
}

// 특정 월의 모든 공휴일/기념일 조회
export function getHolidaysByMonth(year: number, month: number): Holiday[] {
  const monthString = `${year}-${String(month).padStart(2, '0')}`;
  return koreanHolidays.filter(holiday => holiday.date.startsWith(monthString));
}

// 공휴일인지 확인
export function isNationalHoliday(date: string): boolean {
  const holiday = getHolidayByDate(date);
  return holiday?.isNationalHoliday || false;
}

// 기념일인지 확인
export function isMemorialDay(date: string): boolean {
  const holiday = getHolidayByDate(date);
  return holiday !== undefined && !holiday.isNationalHoliday;
}

// 공휴일/기념일 타입에 따른 스타일 정보
export function getHolidayStyle(holiday: Holiday) {
  switch (holiday.type) {
    case 'national':
      return {
        color: '#dc2626', // red-600
        backgroundColor: '#fee2e2', // red-50
        borderColor: '#fca5a5', // red-300
      };
    case 'traditional':
      return {
        color: '#ea580c', // orange-600
        backgroundColor: '#fff7ed', // orange-50
        borderColor: '#fed7aa', // orange-200
      };
    case 'memorial':
      return {
        color: '#7c3aed', // violet-600
        backgroundColor: '#f3e8ff', // violet-50
        borderColor: '#c4b5fd', // violet-300
      };
    case 'season':
      return {
        color: '#059669', // emerald-600
        backgroundColor: '#ecfdf5', // emerald-50
        borderColor: '#86efac', // emerald-300
      };
    default:
      return {
        color: '#6b7280', // gray-500
        backgroundColor: '#f9fafb', // gray-50
        borderColor: '#d1d5db', // gray-300
      };
  }
}