import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { PatientsPage } from "./pages/PatientsPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UsersPage } from "./pages/User.jsx";
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Se ejecuta una sola vez al cargar la app para validar si hay una cookie de sesión activa
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas (Envueltas por el componente Cadenero) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/user" element={<UsersPage />} />
            <Route path="/users" element={<UsersPage />} />
            {/* Futuras rutas privadas irán aquí */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
