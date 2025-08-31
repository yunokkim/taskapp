'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Logo from '@/components/ui/logo';
import { usePersonaStore } from '@/store/personaStore';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function Header() {
  const { personas } = usePersonaStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 임시 사용자 데이터
  const user = {
    name: '김윤옥',
    email: 'yun.kim@example.com',
    avatar: 'YK'
  };

  return (
    <header className="border-b sticky top-0 z-50 shadow-lg" style={{
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 30%, #fff3e0 70%, #f1f8e9 100%)'
    }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-3">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold text-gray-800">
              KYO&apos;s 일정관리
            </h1>
          </div>

          {/* 페르소나 선택 */}
          <div className="flex items-center gap-2">
            {personas.map((persona) => (
              <Badge
                key={persona.id}
                variant="outline"
                className="cursor-pointer hover:bg-white/60 transition-colors border-gray-300 text-gray-700"
                style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: persona.color }}
                />
                {persona.name}
              </Badge>
            ))}
          </div>

          {/* Google Calendar 연동 버튼 */}
          <div className="flex items-center gap-3">
            <GoogleAuthButton />
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center gap-3">
            <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 h-10 px-3 hover:bg-white/60 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end text-sm">
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-600">{user.email}</span>
                    </div>
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium border border-gray-200">
                      {user.avatar}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-8"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    👤 마이페이지
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-8"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    ⚙️ 설정
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-8"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    🔔 알림 설정
                  </Button>
                  
                  <div className="border-t pt-1 mt-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      🚪 로그아웃
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}