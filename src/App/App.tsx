import type { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../Components/Pages/Login/Login.tsx";
import { Register } from "../Components/Pages/Register/Register.tsx";
import "./Styles.scss";

function AppComponent(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export const App = AppComponent;
