'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* 좌측: Copyright 및 회사 정보 */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span>© {currentYear} (주)비아토 viator</span>
              <span className="hidden md:inline">•</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>powered by 메디콘솔(MediConSol)</span>
              <span className="hidden md:inline">•</span>
            </div>
            <a 
              href="https://mediconsol.co.kr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              mediconsol.co.kr
            </a>
          </div>

          {/* 우측: 관리자 정보 */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">관리자:</span>
              <span className="font-medium">Yunok Kim</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">📧</span>
              <a 
                href="mailto:viator2912@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                viator2912@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* 하단: 추가 정보 (옵션) */}
        <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div className="mb-2 md:mb-0">
            페르소나 기반 일정 관리 시스템 v1.0
          </div>
          <div className="flex space-x-4">
            <span>개인정보처리방침</span>
            <span>•</span>
            <span>이용약관</span>
            <span>•</span>
            <span>고객지원</span>
          </div>
        </div>
      </div>
    </footer>
  );
}