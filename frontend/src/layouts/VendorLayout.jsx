import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function VendorLayout() {
  const { userRole, logout } = useAuth();

  if (userRole !== "VENDOR") return <Navigate to="/unauthorized" />;

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Seller Center</h2>

          <ul className="space-y-4">
            <li><a href="/seller">Shop Settings</a></li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
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
