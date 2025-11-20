import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import Loader from "../common/Loader";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

export default function VendorApprovalTable() {
  const { data, loading, error } = useFetch("/auth/admin/vendors/", []);
  const { postData, loading: approving, error: approveError } = usePost();

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  const approveVendor = async (id) => {
    await postData(`/auth/admin/vendors/${id}/approve/`);
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Vendor Approvals</h2>

      {approveError && <ErrorAlert message={approveError} />}

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Vendor</th>
            <th className="p-3">Shop</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.vendors.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{v.username}</td>
              <td className="p-3">{v.shop_name}</td>
              <td className="p-3">{v.approval_status}</td>
              <td className="p-3">
                {v.approval_status === "PENDING" && (
                  <Button onClick={() => approveVendor(v.id)} disabled={approving}>
                    {approving ? "Approving..." : "Approve"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
