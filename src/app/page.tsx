'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hook/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        if (user.roles?.includes('ADMIN')) {
          router.replace('/admin');
        } else if (user.roles?.includes('MANAGER')) {
          router.replace('/manager');
        } else {
          router.replace('/user');
        }
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-lg text-gray-700">Đang kiểm tra đăng nhập...</p>
      </div>
    </div>
  );
}