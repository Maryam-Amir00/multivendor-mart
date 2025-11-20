// src/components/common/PublicNavbar.jsx
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-blue-600">
          MultiVendorMart
        </Link>

        <div className="flex gap-6">
          <Link to="/login" className="text-slate-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            to="/register-customer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
