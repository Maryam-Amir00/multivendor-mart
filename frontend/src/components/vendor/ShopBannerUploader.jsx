import { useState } from "react";
import usePost from "../../hooks/usePost";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

export default function ShopBannerUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");

  const { postData, loading, error } = usePost();

  // Allowed formats
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;

    // -------------------------
    // VALIDATIONS
    // -------------------------
    if (!allowedTypes.includes(uploaded.type)) {
      alert("Only JPG and PNG files are allowed.");
      return;
    }

    if (uploaded.size > 3 * 1024 * 1024) {
      alert("File size must be less than 3MB.");
      return;
    }

    setFile(uploaded);
    setPreview(URL.createObjectURL(uploaded));
    setSuccess(""); // reset
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("banner", file);

    await postData("/auth/vendor/upload-banner/", formData);

    setSuccess("Banner uploaded successfully!");

    // Clear UI after upload
    setFile(null);
    setPreview(null);

    // (Optional) Auto-refresh section
    // window.location.reload();
  };

  return (
    <div className="space-y-4 p-4 border rounded shadow-sm bg-white">
      <h3 className="text-xl font-semibold">Shop Banner</h3>

      {/* Success Message */}
      {success && (
        <div className="p-3 rounded bg-green-100 border border-green-400 text-green-800">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorAlert message={error} />}

      {/* Banner Preview */}
      {preview && (
        <img
          src={preview}
          alt="Banner Preview"
          className="w-full h-40 object-cover rounded border shadow"
        />
      )}

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2"
      />

      {/* Upload Button */}
      <Button disabled={!file || loading} onClick={upload}>
        {loading ? "Uploading..." : "Upload Banner"}
      </Button>
    </div>
  );
}
