import { useState } from "react";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import Loader from "../common/Loader";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorAlert from "../common/ErrorAlert";

export default function UpdateProfileForm() {
  const { data, loading, error } = useFetch("/auth/profile/");
  const { postData, loading: saving, error: saveError } = usePost();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    await postData("/auth/profile/", form);
    alert("Profile updated!");
  };

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-4">
      <Input
        label="Username"
        value={form.username || data.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <Input
        label="Email"
        value={form.email || data.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label="New Password (optional)"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {saveError && <ErrorAlert message={saveError} />}

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
