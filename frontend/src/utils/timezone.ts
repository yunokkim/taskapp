// 한국시간(KST/UTC+9) 유틸리티 함수들

/**
 * 날짜와 시간 문자열을 한국시간 기준으로 결합하여 Date 객체 생성
 * 로컬 시간대를 무시하고 입력된 시간을 한국시간으로 간주
 */
export function combineKSTDateTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // 날짜 부분을 YYYY-MM-DD 형태로 추출
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timeStr = timeString.padStart(5, '0');
  
  // 한국시간으로 해석하여 Date 객체 생성
  const kstDateTime = `${year}-${month}-${day}T${timeStr}:00+09:00`;
  return new Date(kstDateTime);
}

/**
 * UTC Date를 한국시간으로 변환하여 표시 (로컬 시간대에서 올바르게 표시되도록)
 */
export function convertUTCToKST(date: Date): Date {
  // 한국시간대로 변환된 시간을 로컬 시간대의 동일한 시간으로 생성
  // 예: UTC 00:00 -> KST 09:00 -> 로컬에서 09:00으로 표시
  const koreanTime = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
  return koreanTime;
}

/**
 * Date 객체에서 한국시간 기준 시간 문자열 추출 (HH:MM 형태)
 */
export function getKSTTimeString(date: Date): string {
  // UTC 시간을 한국시간으로 변환하여 시간 문자열 추출
  const kstDate = convertUTCToKST(date);
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Date 객체에서 한국시간 기준 날짜 객체 생성 (시간은 00:00:00)
 */
export function getKSTDateOnly(date: Date): Date {
  const kstDate = convertUTCToKST(date);
  return new Date(kstDate.getFullYear(), kstDate.getMonth(), kstDate.getDate());
}