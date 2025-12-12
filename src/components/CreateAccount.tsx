"use client";

import { useState } from "react";
import {
  Loader2,
  Plus,
  Search,
  UserPlus,
  Users,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  useGetAllDepartments,
  useCreateDepartment,
} from "@/hook/useDepartment";
import { useRegister, useAllUsers, useUsersRoles } from "@/hook/useAuth";
import { UserResponse, UserCreationRequest } from "@/model/user.model";
import { RoleRepresentation, RoleType } from "@/model/role.model";

interface ExtendedUser extends UserResponse {
  role: RoleType;
}

export default function CreateAccount() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  const [formData, setFormData] = useState<
    UserCreationRequest & { confirmPassword: string; role: RoleType }
  >({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    departmentId: undefined,
    role: RoleType.USER,
  });

  const { data: departmentsRes } = useGetAllDepartments();
  const { data: usersRes, refetch: refetchUsers } = useAllUsers();

  const registerMutation = useRegister();
  const createDeptMutation = useCreateDepartment();

  const departments = departmentsRes?.data || [];
  const rawUsers = usersRes?.data || [];

  const roleQueries = useUsersRoles(rawUsers);

  const users: ExtendedUser[] = rawUsers.map((user, index) => {
    const roles = roleQueries[index]?.data || [];

    const roleNames = roles.map((r: RoleRepresentation) => r.name);

    let mappedRole: RoleType = RoleType.USER;

    if (roleNames.includes(RoleType.ADMIN)) mappedRole = RoleType.ADMIN;
    else if (roleNames.includes(RoleType.MANAGER))
      mappedRole = RoleType.MANAGER;

    return { ...user, role: mappedRole };
  });

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return "Tên đăng nhập không được để trống";
    if (!formData.firstname.trim()) return "Họ không được để trống";
    if (!formData.lastname.trim()) return "Tên không được để trống";
    if (!formData.dob) return "Ngày sinh không được để trống";
    if (!formData.email.trim()) return "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Email không hợp lệ";
    if (!formData.password) return "Mật khẩu không được để trống";
    if (formData.password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (formData.password !== formData.confirmPassword)
      return "Mật khẩu xác nhận không khớp";
    if (formData.departmentId === undefined) return "Vui lòng chọn phòng ban";
    return null;
  };

  const handleCreateAccount = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const payload: UserCreationRequest = {
      username: formData.username.trim(),
      password: formData.password,
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      dob: formData.dob,
      email: formData.email.trim(),
      departmentId: formData.departmentId,
    };

    try {
      await registerMutation.mutateAsync(payload);
      toast.success("Tạo tài khoản thành công!");
      handleClearForm();
      refetchUsers();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Không thể tạo tài khoản");
    }
  };

  const handleCreateDepartment = () => {
    if (!newDeptName.trim()) {
      toast.error("Tên phòng ban không được để trống");
      return;
    }

    createDeptMutation.mutate(
      { name: newDeptName.trim() },
      {
        onSuccess: (data) => {
          toast.success("Thêm phòng ban thành công!");
          setFormData((prev) => ({
            ...prev,
            departmentId: Number(data.data.departmentId),
          }));
          setShowAddDept(false);
          setNewDeptName("");
        },
        onError: () => toast.error("Không thể tạo phòng ban"),
      }
    );
  };

  const handleClearForm = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      dob: "",
      email: "",
      departmentId: undefined,
      role: RoleType.USER,
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Quản lý tài khoản
        </h1>
        <p className="text-slate-500">Tạo và quản lý tài khoản người dùng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form tạo tài khoản */}
        <Card className="lg:col-span-2 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/30 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Tạo tài khoản mới</CardTitle>
                <CardDescription>
                  Điền thông tin để tạo tài khoản người dùng
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                  placeholder="Nguyễn"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.lastname}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                  placeholder="Văn A"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tên đăng nhập <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="nguyenvana"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@company.com"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-500" />
                Ngày sinh <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Phòng ban <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDept(!showAddDept)}
                  className="gap-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mới
                </Button>
              </div>
              <Select
                value={formData.departmentId?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, departmentId: Number(value) })
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
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
            </div>

            {showAddDept && (
              <div className="flex gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Input
                  placeholder="Tên phòng ban mới..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="rounded-xl"
                />
                <Button
                  onClick={handleCreateDepartment}
                  disabled={createDeptMutation.isPending || !newDeptName.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                >
                  {createDeptMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Tạo"
                  )}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value: RoleType) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Nhân viên</SelectItem>
                  <SelectItem value="MANAGER">Quản lý</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateAccount}
                disabled={registerMutation.isPending}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo tài khoản
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearForm}
                className="rounded-xl"
              >
                Xóa form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách người dùng */}
        <Card className="lg:col-span-3 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Danh sách người dùng
                  </CardTitle>
                  <CardDescription>{users.length} người dùng</CardDescription>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pr-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Họ tên</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phòng ban</TableHead>
                    <TableHead className="font-semibold">Vai trò</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-slate-500"
                      >
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">Không tìm thấy người dùng</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.keycloakId}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {user.department?.name || "Chưa có"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === RoleType.ADMIN
                                ? "destructive"
                                : user.role === RoleType.MANAGER
                                ? "default"
                                : "secondary"
                            }
                            className="font-semibold"
                          >
                            {user.role === RoleType.ADMIN
                              ? "🔑 Quản trị viên"
                              : user.role === RoleType.MANAGER
                              ? "👔 Quản lý"
                              : "👤 Nhân viên"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
