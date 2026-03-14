import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function isTokenValid(jwt) {
  if (!jwt) return false;
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getRolesFromToken(jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload.roles ?? [];
  } catch {
    return [];
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    if (!isTokenValid(stored)) {
      localStorage.removeItem("token");
      return null;
    }
    return stored;
  });

  const [demoMode, setDemoMode] = useState(() => {
    const stored = localStorage.getItem("token");
    return !isTokenValid(stored);
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const stored = localStorage.getItem("token");
    return isTokenValid(stored) ? getRolesFromToken(stored).includes("ADMIN") : false;
  });

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setIsAdmin(getRolesFromToken(jwt).includes("ADMIN"));
    setDemoMode(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAdmin(false);
    setDemoMode(true);
  };

  const enterDemo = () => setDemoMode(true);
  const exitDemo = () => setDemoMode(false);

  return (
    <AuthContext.Provider value={{ token, login, logout, demoMode, enterDemo, exitDemo, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
