import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterVendor from "./pages/RegisterVendor";

import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Unauthorized from "./pages/Unauthorized";

// Example pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminLayout from "./layouts/AdminLayout";
import VendorLayout from "./layouts/VendorLayout";
import CustomerLayout from "./layouts/CustomerLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-vendor" element={<RegisterVendor />} />

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* CUSTOMER */}
        <Route
          path="/account"
          element={
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
        </Route>

        {/* VENDOR */}
        <Route
          path="/seller"
          element={
            <RoleRoute allowedRoles={["VENDOR"]}>
              <VendorLayout />
            </RoleRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* PROFILE (ROLE-AGNOSTIC) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
