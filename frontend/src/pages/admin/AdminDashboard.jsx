// src/pages/admin/AdminDashboard.jsx
import VendorApprovalTable from "../../components/admin/VendorApprovalTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">
        User Management
      </h2>

      <p className="text-slate-600">
        Review vendor applications and manage platform users.
      </p>

      <div className="bg-white rounded-lg shadow p-6 border border-slate-100">
        <VendorApprovalTable />
      </div>
    </div>
  );
}
