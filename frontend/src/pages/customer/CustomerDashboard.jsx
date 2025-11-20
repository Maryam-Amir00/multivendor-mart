// src/pages/customer/CustomerDashboard.jsx
import UpdateProfileForm from "../../components/customer/UpdateProfileForm";

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">
        My Account
      </h2>

      <p className="text-slate-600">
        Manage your profile information and account settings.
      </p>

      <div className="bg-white rounded-lg shadow p-6 border border-slate-100">
        <UpdateProfileForm />
      </div>
    </div>
  );
}
