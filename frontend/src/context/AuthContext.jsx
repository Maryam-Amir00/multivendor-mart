import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // ----------------------------
  // GLOBAL STATE VALUES
  // ----------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);      // "CUSTOMER", "VENDOR", "ADMIN"
  const [userInfo, setUserInfo] = useState(null);      // object containing user data
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // ---------------------------------
  // LOAD AUTH STATE FROM LOCALSTORAGE
  // ---------------------------------
useEffect(() => {
  const savedAccess = localStorage.getItem("access");
  const savedRefresh = localStorage.getItem("refresh");
  const savedRole = localStorage.getItem("userRole");
  const savedUser = localStorage.getItem("userInfo");

  // Prevent JSON.parse(undefined) crash
  let parsedUser = null;
  if (savedUser) {
    try {
      parsedUser = JSON.parse(savedUser);
    } catch (err) {
      parsedUser = null; // fallback if corrupted JSON
    }
  }

  if (savedAccess && savedRole) {
    setIsAuthenticated(true);
    setAccessToken(savedAccess);
    setRefreshToken(savedRefresh);
    setUserRole(savedRole);
    setUserInfo(parsedUser);
  }
}, []);


  // ----------------------------
  // LOGIN FUNCTION
  // ----------------------------
  const login = (tokens, role, user) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserInfo(user);
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);

    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userInfo", JSON.stringify(user));
  };

  // ----------------------------
  // LOGOUT FUNCTION
  // ----------------------------
  const logout = () => {
  setIsAuthenticated(false);
  setUserRole(null);
  setUserInfo(null);
  setAccessToken(null);
  setRefreshToken(null);

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userInfo");

  window.location.href = "/"; // redirect to homepage
};

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userInfo,
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
