'use client';

import { Holiday, getHolidayStyle } from '@/utils/holidays';

interface HolidayIndicatorProps {
  holiday: Holiday;
  isSmall?: boolean;
}

export default function HolidayIndicator({ holiday, isSmall = false }: HolidayIndicatorProps) {
  const style = getHolidayStyle(holiday);
  
  if (isSmall) {
    // 캘린더 셀 내 작은 표시용
    return (
      <div 
        className={`
          inline-flex items-center px-1 py-0.5 rounded-sm text-xs font-medium
          ${holiday.isNationalHoliday ? 'font-bold' : 'font-medium'}
        `}
        style={{
          color: style.color,
          backgroundColor: style.backgroundColor,
          border: `1px solid ${style.borderColor}`
        }}
        title={`${holiday.name} (${getHolidayTypeLabel(holiday.type)})`}
      >
        {getHolidayIcon(holiday.type)} {holiday.name}
      </div>
    );
  }

  // 일반 크기 표시용
  return (
    <div 
      className={`
        inline-flex items-center px-2 py-1 rounded-md text-sm
        ${holiday.isNationalHoliday ? 'font-bold' : 'font-medium'}
      `}
      style={{
        color: style.color,
        backgroundColor: style.backgroundColor,
        border: `1px solid ${style.borderColor}`
      }}
      title={`${holiday.name} (${getHolidayTypeLabel(holiday.type)})`}
    >
      <span className="mr-1">{getHolidayIcon(holiday.type)}</span>
      <span>{holiday.name}</span>
      {holiday.isNationalHoliday && <span className="ml-1 text-xs">🏛️</span>}
    </div>
  );
}

function getHolidayIcon(type: Holiday['type']): string {
  switch (type) {
    case 'national':
      return '🇰🇷';
    case 'traditional':
      return '🏮';
    case 'memorial':
      return '🎉';
    case 'season':
      return '🌸';
    default:
      return '📅';
  }
}

function getHolidayTypeLabel(type: Holiday['type']): string {
  switch (type) {
    case 'national':
      return '국정공휴일';
    case 'traditional':
      return '전통명절';
    case 'memorial':
      return '기념일';
    case 'season':
      return '절기';
    default:
      return '기타';
  }
}