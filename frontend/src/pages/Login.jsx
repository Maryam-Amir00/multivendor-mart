import { useState } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login/", { email, password });

      login(
        { access: res.data.access, refresh: res.data.refresh },
        res.data.role,
        { email, role: res.data.role }
      );

      if (res.data.role === "ADMIN") navigate("/admin");
      if (res.data.role === "VENDOR") navigate("/seller");
      if (res.data.role === "CUSTOMER") navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to MultiVendorMart
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-600 mt-4 text-sm">
          No account?
          <Link to="/register-customer" className="text-blue-600 ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
