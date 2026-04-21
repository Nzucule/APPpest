import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carrega usuário do localStorage quando o app inicia
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });

    const usuario = res.data.user;
    const token = res.data.token;

    // salvar no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));

    // salvar no estado global
    setUser(usuario);

    return usuario;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
