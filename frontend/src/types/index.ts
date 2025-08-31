// 페르소나 타입 정의
export interface Persona {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// 일정 타입 정의
export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  personaId: string;
  tags?: string[];
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  notifications?: NotificationSetting[];
}

// 알림 설정
export interface NotificationSetting {
  type: 'email' | 'push';
  minutesBefore: number;
}

// 뷰 타입
export type ViewMode = 'calendar' | 'list';
export type CalendarView = 'month' | 'week' | 'day';

// 필터 옵션
export interface FilterOptions {
  personaIds: string[];
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  searchText?: string;
}

// NextAuth 세션 타입 확장
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}