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
import { RoleRoute } from "./components/RoleRoute";
import { UsersPage } from "./pages/User.jsx";
import { HealthCentersPage } from "./pages/HealthCentersPage";
import { VaccinesPage } from "./pages/VaccinesPage.jsx";
import { CartillaPage } from "./pages/CartillaPage.jsx";
import { Campaigns } from "./pages/Campaigns";
 
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isChecking = useAuthStore((state) => state.isChecking);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isChecking) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }
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
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/user" element={<UsersPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path="/health-centers" element={<HealthCentersPage />} />
            <Route element={<RoleRoute allowedRoles={["admin", "nurse"]} />}>
              <Route path="/vaccines" element={<VaccinesPage />} />
            </Route>
            <Route path="/cartilla/:patientId" element={<CartillaPage />} />
            <Route path="/campaigns" element={<Campaigns />} />
            {/* Futuras rutas privadas irán aquí */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
