"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChangePasswordRequest } from "@/model/user.model";
import { useChangePassword } from "@/hook/useAuth";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .refine((val) => val.trim() !== "", {
        message: "Mật khẩu mới không được để trống",
      }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = ChangePasswordRequest;

interface ChangePasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number;
  onSuccess?: () => void;
}

export default function ChangePasswordForm({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: ChangePasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { mutate: changePassword, isPending: loading } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleClose = () => {
    if (loading) return;
    form.reset();
    onClose();
  };

  const onSubmit = (data: ChangePasswordRequest) => {
    changePassword(
      {
        userId,
        data,
      },
      {
        onSuccess: () => {
          alert("Thành công: Đổi mật khẩu thành công!");
          onSuccess?.();
          handleClose();
        },
        onError: (error: unknown) => {
          let message = "Đổi mật khẩu thất bại";
          let statusCode: number | undefined;

          switch (statusCode) {
            case 2026:
              message = "Mật khẩu cũ không được để trống";
              break;
            case 2025:
              message = "Mật khẩu mới không được để trống";
              break;
            case 2202:
              message = "Mật khẩu cũ không đúng. Vui lòng kiểm tra lại";
              break;
            case 2002:
              message = "Mật khẩu phải có ít nhất 6 ký tự";
              break;
            default:
              message =
                "Đã xảy ra lỗi không xác định";
          }

          form.setError("root", { message });
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <Card className="relative w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu cũ và mật khẩu mới để cập nhật
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Mật khẩu cũ */}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu cũ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu cũ"
                          className="pr-10 rounded-xl"
                          disabled={loading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                        >
                          <i
                            className={
                              showOldPassword
                                ? "fas fa-eye-slash"
                                : "fas fa-eye"
                            }
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mật khẩu mới */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="pr-10 rounded-xl"
                          disabled={loading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                        >
                          <i
                            className={
                              showNewPassword
                                ? "fas fa-eye-slash"
                                : "fas fa-eye"
                            }
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hiển thị lỗi chung */}
              {form.formState.errors.root && (
                <div className="text-center">
                  <p className="text-sm font-medium text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu mật khẩu"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
