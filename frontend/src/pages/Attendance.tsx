import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoFull from "@/assets/react.svg";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AttendanceService, AuthService } from "@/api";
import { Modal } from "@/components/ui/Modal";
import { LogOut } from "lucide-react";
import type { Attendance } from "@/types/attendance";

const AttendancePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser, authLoading } = useAuth();

  const [now, setNow] = useState(new Date());
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    if (user) {
      if (user.role !== "EMPLOYEE") {
        navigate("/employees");
      }

      fetchAttendances(user.id);
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const run = async () => {
      await refreshUser();

      if (!authLoading && !user) {
        navigate("/login");

        return;
      }
    };

    run();

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    if (!user) return;

    setLoadingIn(true);

    const res = await AttendanceService.clockIn(photo);

    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: res.message,
      });

      await fetchAttendances(user.id);
    }

    setIsClockInOpen(false);
    setLoadingIn(false);
  };

  const handleClockOut = async () => {
    if (!user) return;

    setLoadingOut(true);

    const res = await AttendanceService.clockOut();

    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: res.message,
      });

      await fetchAttendances(user.id);
    }

    setLoadingOut(false);
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

  const fetchAttendances = async (id: string) => {
    setLoading(true);
    const data = await AttendanceService.find(id);
    setAttendances(data.data ?? []);
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-gray-50 to-amber-200 relative overflow-hidden">
      <div className="w-full min-h-screen p-5 md:p-6 bg-white/50 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between py-2 md:py-6 gap-4">
            <div className="w-full">
              <div className="text-2xl md:text-4xl font-bold">Attendance</div>
              <div className="text-gray-600 text-lg md:text-2xl">
                Don't forget to clock in and clock out on time!
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
          <div className="mx-auto w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-300 p-8">
            <div className="flex justify-center mb-6">
              <img
                src={logoFull}
                alt="Employee Attendance"
                className="h-10 w-auto rounded-sm"
              />
            </div>

            <div className="text-center mb-10">
              <div className="text-4xl font-extrabold tracking-widest text-black">
                {now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-gray-600 mt-2">
                {now.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                isLoading={loadingIn}
                onClick={() => setIsClockInOpen(true)}
              >
                Clock In
              </Button>

              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                isLoading={loadingOut}
                onClick={handleClockOut}
              >
                Clock Out
              </Button>
            </div>

            <div className="mt-8">
              <div className="text-lg font-bold mb-3">Attendance History</div>

              {loading && (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading attendance...
                </div>
              )}

              {!loading && !attendances.length && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No attendance records yet
                </div>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {attendances.map((att) => (
                  <div
                    key={att.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="text-sm font-semibold text-gray-700">
                      {new Date(att.clock_in).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-500">Clock In</div>
                        <div className="font-medium">
                          {new Date(att.clock_in).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-gray-500">Clock Out</div>
                        <div className="font-medium">
                          {att.clock_out
                            ? new Date(att.clock_out).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isClockInOpen}
        onClose={() => {
          setIsClockInOpen(false);
          setPhoto(null);
        }}
        title="Clock In"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <b>Optional:</b> Upload a photo
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setPhoto(e.target.files[0]);
              }
            }}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-black file:text-white
            hover:file:bg-gray-800"
          />

          {photo && (
            <div className="text-xs text-gray-500">Selected: {photo.name}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              isLoading={loadingIn}
              onClick={handleClockIn}
            >
              Clock In
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;
