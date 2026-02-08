import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Employee from "./pages/Employee";
import Index from "./pages/Index";
import { Toaster } from "./components/ui/toaster";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
