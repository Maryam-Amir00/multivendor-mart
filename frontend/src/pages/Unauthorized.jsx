// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-10 rounded-lg shadow text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-3 text-slate-600">
          You do not have permission to view this page.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
