import { useContext } from "react";
import type { AuthContextType } from "../../Contexts/Types";
import { AuthContext } from "../../Contexts/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
