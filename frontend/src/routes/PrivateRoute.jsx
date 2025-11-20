import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // No token → Block access
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Token exists → Allow entry
  return children;
}
