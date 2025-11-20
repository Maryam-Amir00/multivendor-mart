import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const { userRole, logout } = useAuth();

  if (userRole !== "ADMIN") return <Navigate to="/unauthorized" />;

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <ul className="space-y-4">
            <li><a href="/admin">User Management</a></li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
