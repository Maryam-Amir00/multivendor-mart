import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterVendor() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    shop_name: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register-vendor/", form);
      navigate("/login");
    } catch (err) {
      setError("Vendor Registration Failed. Shop name or email already exists.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Vendor Registration
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            className="w-full border p-2 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={form.email}
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Shop Name"
            value={form.shop_name}
            onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          Already registered?
          <Link to="/login" className="ml-1 text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
