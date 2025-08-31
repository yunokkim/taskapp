'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function GoogleAuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Button disabled>로딩중...</Button>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Google 연동됨: {session.user?.email}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => signOut()}
        >
          연동 해제
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => signIn('google')}
      className="bg-[#4285f4] hover:bg-[#3367d6] text-white"
    >
      📅 Google Calendar 연동
    </Button>
  );
}