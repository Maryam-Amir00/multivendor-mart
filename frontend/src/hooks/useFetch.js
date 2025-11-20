import { useState, useEffect } from "react";
import api from "../services/api";

export default function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(url)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, deps);

  return { data, loading, error };
}
