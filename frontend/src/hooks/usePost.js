import { useState } from "react";
import api from "../services/api";

export default function usePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postData = async (url, body) => {
    setLoading(true);
    try {
      const res = await api.post(url, body);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
}
