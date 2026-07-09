import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Styles.scss";
import { Admin } from "../Components/Pages/Admin";
import { Cart } from "../Components/Pages/Cart";
import { Favorites } from "../Components/Pages/Favorites";
import { Login } from "../Components/Pages/Login";
import { Main } from "../Components/Pages/Main";
import { Profile } from "../Components/Pages/Profile";
import { Register } from "../Components/Pages/Register";
import { ProtectedRoute } from "../Components/ProtectedRoute";
import { Footer } from "../Components/Widgets/Footer";
import { Header } from "../Components/Widgets/Header";
import { AuthProvider } from "../Contexts/AuthContext";
import { Product } from "../Components/Pages/Product";

function AppComponent() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/product/:id" element={<Product />} />
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
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export const App = AppComponent;
