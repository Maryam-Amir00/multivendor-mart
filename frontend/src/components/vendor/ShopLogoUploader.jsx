import { useState } from "react";
import usePost from "../../hooks/usePost";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

export default function ShopLogoUploader() {
  const [file, setFile] = useState(null);
  const { postData, loading, error } = usePost();

  const upload = async () => {
    const formData = new FormData();
    formData.append("logo", file);
    await postData("/auth/vendor/upload-logo/", formData);
    alert("Logo uploaded!");
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Upload Shop Logo</h3>
      {error && <ErrorAlert message={error} />}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button disabled={!file || loading} onClick={upload}>
        {loading ? "Uploading..." : "Upload Logo"}
      </Button>
    </div>
  );
}
