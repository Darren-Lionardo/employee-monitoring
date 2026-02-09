import { useEffect, useState } from "react";
import { EmployeeService } from "@/api/employee.service";
import { AttendanceService } from "@/api/attendance.service";
import type { Employee } from "@/types/employee";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Pencil,
  Mail,
  Lock,
  EyeOff,
  Eye,
  User,
  Building,
  LogOut,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { Attendance } from "@/types/attendance";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/api";
import { useNavigate } from "react-router-dom";

const EmployeePage = () => {
  const { toast } = useToast();
  const { user, refreshUser, authLoading } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formDataAdd, setFormDataAdd] = useState({
    email: "",
    password: "",
    name: "",
    position: "",
  });
  const [selected, setSelected] = useState("");
  const [formDataEdit, setFormDataEdit] = useState({
    email: "",
    name: "",
    position: "",
  });

  const fetchEmployees = async () => {
    setLoading(true);
    const data = await EmployeeService.getEmployees();
    setEmployees(data.data ?? []);
    setLoading(false);
  };

  const fetchAttendances = async (id: string) => {
    setLoading(true);
    const data = await AttendanceService.find(id);
    setAttendances(data.data ?? []);
    setLoading(false);
  };

  const handleSubmitAdd = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await EmployeeService.createEmployee(formDataAdd);

    if (!result.success) {
      toast({
        title: "Error",
        description: Array.isArray(result.message)
          ? result.message[0]
          : result.message,
        variant: "destructive",
      });
      setLoading(false);

      return;
    }

    await fetchEmployees();

    toast({
      title: "Success",
      description: result.message,
    });

    setLoading(false);
    setOpenAdd(false);
  };

  const handleSubmitEdit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);

    const result = await EmployeeService.updateEmployee(selected, formDataEdit);

    if (!result.success) {
      toast({
        title: "Error",
        description: Array.isArray(result.message)
          ? result.message[0]
          : result.message,
        variant: "destructive",
      });
      setLoading(false);

      return;
    }

    await fetchEmployees();

    toast({
      title: "Success",
      description: result.message,
    });

    setLoading(false);
    setOpenEdit(false);
  };

  useEffect(() => {
    if (user) {
      if (user.role !== "HRD") {
        navigate("/attendance");
      }

      fetchEmployees();
    }
  }, [user]);

  useEffect(() => {
    const run = async () => {
      await refreshUser();

      if (!authLoading && !user) {
        navigate("/login");

        return;
      }
    };

    run();
  }, []);

  const handleViewAttendance = async (id: string) => {
    await fetchAttendances(id);
    setOpenAttendance(true);
  };

  const handleEdit = async (
    id: string,
    email: string,
    name: string,
    position: string,
  ) => {
    setSelected(id);
    setFormDataEdit({
      email,
      name,
      position,
    });
    setOpenEdit(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await EmployeeService.deleteEmployee(id);
      toast({ title: "Success", description: "Employee removed" });
      fetchEmployees();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast({ title: "Success", description: "Logout successful!" });
      await refreshUser();
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-gray-50 to-amber-200">
      <div className="w-full min-h-screen p-5 md:p-6 bg-white/50 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between py-2 md:py-6 gap-4">
            <div className="w-full">
              <div className="text-2xl md:text-4xl font-bold">Employees</div>
              <div className="text-gray-600 text-lg md:text-2xl">
                Manage employee data and positions
              </div>
            </div>
            <div className="md:hidden w-full border-gray-200 border-b" />
            <div className="flex gap-6 items-center justify-between md:justify-end w-full">
              <div className="text-sm md:text-base flex flex-col md:flex-row md:gap-1">
                Welcome back, <div className="font-bold">{user?.email}</div>
              </div>
              <div
                onClick={handleLogout}
                className="cursor-pointer group flex justify-end"
              >
                <LogOut
                  size={24}
                  className="text-red-700 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="py-2 flex justify-end">
            <Button
              onClick={() => setOpenAdd(true)}
              className="mt-2 flex gap-2 items-center justify-center"
            >
              <Plus size={16} />
              <div className="font-bold">Add Employee</div>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-300 p-3 md:p-6 overflow-x-auto">
            <table className="w-full max-md:table-fixed border-collapse text-center text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-500">
                  <th className="py-3 w-48">Name</th>
                  <th className="w-48">Email</th>
                  <th className="w-48">Position</th>
                  <th className="w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-300 last:border-b-0"
                  >
                    <td className="py-3 font-medium">{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.position}</td>
                    <td className="p-2 space-x-2 flex justify-center gap-1">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleViewAttendance(emp.id)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() =>
                          handleEdit(emp.id, emp.email, emp.name, emp.position)
                        }
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}

                {!employees.length && !loading && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add Employee"
        description="Insert employee data"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div className="space-y-2">
            <div>Email</div>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="email"
                placeholder="johndoe@example.com"
                className="pl-10"
                value={formDataAdd.email}
                onChange={(e) =>
                  setFormDataAdd({ ...formDataAdd, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>Password</div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={formDataAdd.password}
                onChange={(e) =>
                  setFormDataAdd({ ...formDataAdd, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {!showPassword ? (
                  <EyeOff size={18} className="cursor-pointer" />
                ) : (
                  <Eye size={18} className="cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>Name</div>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="name"
                placeholder="John Doe"
                className="pl-10"
                value={formDataAdd.name}
                onChange={(e) =>
                  setFormDataAdd({ ...formDataAdd, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>Position</div>
            <div className="relative">
              <Building
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="position"
                placeholder="Customer Service"
                className="pl-10"
                value={formDataAdd.position}
                onChange={(e) =>
                  setFormDataAdd({ ...formDataAdd, position: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-3" isLoading={loading}>
            <div className="flex gap-2 items-center justify-center font-bold">
              <Plus size={18} />
              Create
            </div>
          </Button>
        </form>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Employee"
        description="Update employee data"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div className="space-y-2">
            <div>Email</div>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="email"
                placeholder="johndoe@example.com"
                className="pl-10"
                value={formDataEdit.email}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>Name</div>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="name"
                placeholder="John Doe"
                className="pl-10"
                value={formDataEdit.name}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>Position</div>
            <div className="relative">
              <Building
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="position"
                placeholder="Customer Service"
                className="pl-10"
                value={formDataEdit.position}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, position: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-3" isLoading={loading}>
            <div className="flex gap-2 items-center justify-center font-bold">
              <Pencil size={18} />
              Edit
            </div>
          </Button>
        </form>
      </Modal>

      <Modal
        open={openAttendance}
        onClose={() => setOpenAttendance(false)}
        title="Employee Attendance"
        description="Viewing attendance data"
        width="xxl"
      >
        <table className="w-full border-collapse text-center text-xs md:text-base">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="py-3">Clock In</th>
              <th>Clock Out</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((att) => (
              <tr
                key={att.id}
                className="border-b border-gray-300 last:border-b-0"
              >
                <td className="py-2">
                  {new Date(att.clock_in).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "long",
                  })}
                </td>
                <td>
                  {att.clock_out
                    ? new Date(att.clock_out).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "long",
                      })
                    : "-"}
                </td>
                <td className="py-4 flex justify-center items-center">
                  {att.photo_url ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${att.photo_url}`}
                      className="w-32 aspect-square image-cover rounded-xl"
                    ></img>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}

            {!attendances.length && !loading && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No attendance found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default EmployeePage;
