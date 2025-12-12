"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Loader2,
  Lock,
  User,
  Mail,
  Calendar as CalendarIcon,
  Building2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useChangePassword, useCurrentUser } from "@/hook/useAuth";
import { useGetAllDepartments } from "@/hook/useDepartment";
import { useUpdateProfile } from "@/hook/useAuth";
import { ApiError } from "@/model/api-error";
import { AxiosError } from "axios";
import ChangePasswordForm from "./ChangePasswordForm";

const profileSchema = z.object({
  firstname: z.string().min(1, "Họ không được để trống"),
  lastname: z.string().min(1, "Tên không được để trống"),
  dob: z.string().min(1, "Ngày sinh không được để trống"),
  departmentId: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: departmentsRes } = useGetAllDepartments();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const departments = departmentsRes?.data || [];

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      dob: "",
      departmentId: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        departmentId: user.department?.departmentId?.toString() || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormData) => {
    if (!user?.keycloakId) {
      setErrorMessage("Không tìm thấy thông tin người dùng");
      return;
    }

    const payload = {
      firstname: data.firstname,
      lastname: data.lastname,
      dob: data.dob,
      departmentId: data.departmentId ? Number(data.departmentId) : undefined,
    };

    updateProfile(
      { keycloakId: user.keycloakId, data: payload },
      {
        onSuccess: () => {
          setErrorMessage("");
          alert("Cập nhật thông tin thành công!");
          form.reset(data);
        },
        onError: (err: AxiosError<ApiError>) => {
          const msg = formatErrorMessage(err);
          setErrorMessage(msg);
        },
      }
    );
  };

  const formatErrorMessage = (error: AxiosError<ApiError>): string => {
    const code = error?.response?.data?.statusCode;
    const msg = error?.response?.data?.message;

    switch (code) {
      case 2003:
        return "Họ không được để trống";
      case 2004:
        return "Tên không được để trống";
      case 2005:
        return "Ngày sinh không được để trống";
      case 2006:
        return "Ngày sinh phải là ngày trong quá khứ";
      case 2200:
        return "Chưa xác thực";
      case 2201:
        return "Bạn không có quyền thực hiện hành động này";
      case 2999:
        return msg || "Đã xảy ra lỗi không xác định";
      default:
        return msg || "Không thể cập nhật thông tin";
    }
  };

  const hasChanges = () => {
    const values = form.getValues();
    const original = {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      departmentId: user?.department?.departmentId?.toString() || "",
    };
    return JSON.stringify(values) !== JSON.stringify(original);
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-2xl animate-spin" />
          </div>
          <p className="text-lg font-medium text-slate-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-slate-500">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Profile Card */}
        <Card className="border-slate-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/30 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật hồ sơ của bạn</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsChangePasswordOpen(true)}
                className="gap-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                <Lock className="h-4 w-4" />
                Đổi mật khẩu
              </Button>
              <ChangePasswordForm
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
                userId={user?.userId ?? ""}
              />
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {errorMessage && (
              <Alert variant="destructive" className="mb-6 rounded-xl">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* User Info */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Tên đăng nhập
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Họ
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn"
                            {...field}
                            className="rounded-xl border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Văn A"
                            {...field}
                            className="rounded-xl border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-slate-500" />
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="rounded-xl border-slate-200"
                        />
                      </FormControl>
                      {field.value && (
                        <p className="text-sm text-slate-500 mt-1">
                          {format(new Date(field.value), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        Phòng ban
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-slate-200">
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem
                              key={dept.departmentId}
                              value={dept.departmentId.toString()}
                            >
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isUpdating || !hasChanges()}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdating || !hasChanges()}
                    onClick={() => form.reset()}
                    className="rounded-xl"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
