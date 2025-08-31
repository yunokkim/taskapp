interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* 외부 테두리 */}
      <circle cx="24" cy="24" r="22" fill="url(#outerGradient)" />
      <circle cx="24" cy="24" r="20" fill="url(#innerGradient)" />
      
      {/* 5개 페르소나 원들 - 5각형 배치 */}
      <circle cx="24" cy="8" r="3" fill="#ffffff" opacity="0.95" />
      <circle cx="35.5" cy="16" r="3" fill="#ffffff" opacity="0.95" />
      <circle cx="32" cy="32" r="3" fill="#ffffff" opacity="0.95" />
      <circle cx="16" cy="32" r="3" fill="#ffffff" opacity="0.95" />
      <circle cx="12.5" cy="16" r="3" fill="#ffffff" opacity="0.95" />
      
      {/* 중앙 캘린더 */}
      <rect x="19" y="20" width="10" height="8" rx="1.5" fill="#ffffff" opacity="0.98" />
      <line x1="21" y1="18" x2="21" y2="23" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="18" x2="27" y2="23" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 캘린더 내부 격자 */}
      <line x1="21" y1="24" x2="27" y2="24" stroke="#6366f1" strokeWidth="0.8" opacity="0.6" />
      <circle cx="22" cy="25.5" r="0.8" fill="#3b82f6" />
      <circle cx="26" cy="25.5" r="0.8" fill="#8b5cf6" />
      <circle cx="24" cy="26.8" r="0.8" fill="#06d6a0" />
      
      {/* 페르소나들을 중앙으로 연결하는 선들 */}
      <g opacity="0.4">
        <line x1="24" y1="11" x2="24" y2="20" stroke="#ffffff" strokeWidth="1" />
        <line x1="32.5" y1="19" x2="27" y2="22" stroke="#ffffff" strokeWidth="1" />
        <line x1="29" y1="29" x2="26.5" y2="26" stroke="#ffffff" strokeWidth="1" />
        <line x1="19" y1="29" x2="21.5" y2="26" stroke="#ffffff" strokeWidth="1" />
        <line x1="15.5" y1="19" x2="21" y2="22" stroke="#ffffff" strokeWidth="1" />
      </g>
      
      {/* 그라디언트 정의 */}
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="30%" stopColor="#6366f1" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}