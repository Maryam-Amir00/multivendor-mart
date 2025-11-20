import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function CustomerLayout() {
  const { userRole, logout } = useAuth();

  if (userRole !== "CUSTOMER") return <Navigate to="/unauthorized" />;

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">My Account</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <Outlet />
    </div>
  );
}
