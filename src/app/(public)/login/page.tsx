'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useLogin, useCurrentUser } from '@/hook/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

type ApiError = {
  response?: {
    data?: {
      statusCode?: number;
      message?: string;
    };
  };
};

// Schema xác thực form
const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();
  const { data: user, isLoading: isCheckingAuth } = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user && !isCheckingAuth) {
      if (user.roles?.includes('ADMIN')) {
        router.replace('/admin');
      } else if (user.roles?.includes('MANAGER')) {
        router.replace('/manager');
      } else {
        router.replace('/user');
      }
    }
  }, [user, isCheckingAuth, router]);

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
      },
    });
  };

  const getErrorMessage = () => {
    if (!error) return null;

    const errCode = (error as ApiError)?.response?.data?.statusCode;

    switch (errCode) {
      case 2200:
        return 'Tên đăng nhập hoặc mật khẩu không đúng';
      case 2201:
        return 'Bạn không có quyền truy cập';
      case 0:
        return 'Không thể kết nối đến server. Vui lòng kiểm tra mạng.';
      case 2999:
        return 'Lỗi server. Vui lòng thử lại sau.';
      default:
        return (error as ApiError)?.response?.data?.message || 'Đăng nhập thất bại';
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-orange-600">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nhập thông tin để truy cập hệ thống đặt lịch họp
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="nhập tên đăng nhập..."
                  {...register('username')}
                  disabled={isPending}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="nhập mật khẩu..."
                  {...register('password')}
                  disabled={isPending}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {getErrorMessage() && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage()}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}