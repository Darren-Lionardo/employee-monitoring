import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFull from "@/assets/react.svg";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      if (user?.role == "HRD") {
        navigate("/employees");
      } else {
        navigate("/attendance");
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await AuthService.login(formData.email, formData.password);

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

    await refreshUser();

    toast({
      title: "Success",
      description: result.message,
    });

    if (user?.role == "HRD") {
      navigate("/employees");
    } else {
      navigate("/attendance");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-gray-50 to-amber-200 relative overflow-hidden">
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-white/50 backdrop-blur-3xl">
        <div className="w-full h-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-8">
            <Link to="/" className="flex justify-center mb-8">
              <img
                src={logoFull}
                alt="Lionity AI"
                className="h-10 w-auto rounded-sm"
              />
            </Link>

            <div className="text-center mb-8">
              <div className="text-xl font-bold text-black">
                Employee Attendance Tracker
              </div>
              <p className="text-gray-700 mt-2">
                Don't forget to clock in everyday!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div>Email</div>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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

              <Button type="submit" className="w-full mt-3" isLoading={loading}>
                <div className="flex gap-2 items-center justify-center font-bold">
                  Sign In
                  <ArrowRight size={18} />
                </div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
