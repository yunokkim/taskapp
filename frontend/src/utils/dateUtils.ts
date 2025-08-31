// 한국 시간대 유틸리티 함수들

const KOREA_TIMEZONE = 'Asia/Seoul';

/**
 * 현재 한국 시간을 반환
 */
export function getKoreanDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: KOREA_TIMEZONE }));
}

/**
 * 주어진 Date를 한국 시간대로 변환
 */
export function toKoreanTime(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE }));
}

/**
 * 한국 시간대를 고려한 Date 생성
 */
export function createKoreanDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0): Date {
  // month는 0부터 시작하므로 주의
  const date = new Date(year, month, day, hour, minute);
  return new Date(date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE }));
}

/**
 * 한국 형식으로 날짜 포맷
 */
export function formatKoreanDate(date: Date): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * 한국 형식으로 날짜시간 포맷
 */
export function formatKoreanDateTime(date: Date): string {
  return new Date(date).toLocaleString('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * YYYY-MM-DD 형식으로 한국 날짜 반환
 */
export function toKoreanDateString(date: Date): string {
  const koreanDate = new Date(date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE }));
  const year = koreanDate.getFullYear();
  const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
  const day = String(koreanDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ISO 문자열을 한국 시간대로 파싱
 */
export function parseKoreanDate(isoString: string): Date {
  const date = new Date(isoString);
  return new Date(date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE }));
}

/**
 * 두 날짜가 한국 시간대 기준으로 같은 날인지 확인
 */
export function isSameKoreanDate(date1: Date, date2: Date): boolean {
  return toKoreanDateString(date1) === toKoreanDateString(date2);
}

/**
 * 오늘이 한국 시간대 기준인지 확인
 */
export function isToday(date: Date): boolean {
  return isSameKoreanDate(date, getKoreanDate());
}

/**
 * 한국 시간대 기준 시간 정보
 */
export const KOREAN_TIMEZONE_INFO = {
  timezone: KOREA_TIMEZONE,
  offset: '+09:00',
  name: '한국 표준시',
  abbreviation: 'KST'
} as const;