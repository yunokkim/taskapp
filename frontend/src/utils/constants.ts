import { Persona } from '@/types';

// 기본 제공 페르소나
export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'journalist',
    name: '기자',
    color: '#3B82F6', // Blue
    description: '뉴스 취재 및 기사 작성 관련 업무'
  },
  {
    id: 'mother',
    name: '엄마',
    color: '#EC4899', // Pink
    description: '가족 돌봄 및 육아 관련 일정'
  },
  {
    id: 'researcher',
    name: '연구자',
    color: '#10B981', // Green
    description: '학술 연구 및 논문 작성 업무'
  },
  {
    id: 'developer',
    name: '개발자',
    color: '#8B5CF6', // Purple
    description: '프로그래밍 및 개발 프로젝트'
  },
  {
    id: 'investor',
    name: '투자자',
    color: '#F59E0B', // Orange
    description: '투자 분석 및 포트폴리오 관리'
  }
];

// 반복 옵션
export const REPEAT_OPTIONS = [
  { value: 'none', label: '반복 안함' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' }
];

// 알림 시간 옵션
export const NOTIFICATION_OPTIONS = [
  { value: 10, label: '10분 전' },
  { value: 30, label: '30분 전' },
  { value: 60, label: '1시간 전' },
  { value: 1440, label: '1일 전' }
];