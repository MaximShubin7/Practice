import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/index.scss";
import { Login } from "../Components/Pages/Login";
import { Profile } from "../Components/Pages/Profile";
import { Register } from "../Components/Pages/Register";
import { ProtectedRoute } from "../Components/ProtectedRoute";
import { AuthProvider } from "../Contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requireAuth>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAuth requireAdmin>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/profile" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
