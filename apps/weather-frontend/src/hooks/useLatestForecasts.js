import { useEffect, useState, useRef } from "react";

export function useLatestForecasts(lat, lon) {
  const [latestForecasts, setForecasts] = useState(null);
  const [loadingLatest, setLoading] = useState(true);
  const [latestError, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const saved = localStorage.getItem("latestForecasts");

    if (saved) {
      setForecasts(JSON.parse(saved));
      setLoading(false);
      return;
    }

    async function fetchForecasts() {
      try {
        console.log("Fetching with " + lat + " " + lon);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/v1/nws/points/${lat},${lon}/forecast/current`,
        );
        const data = await res.json();
        localStorage.setItem("latestForecasts", JSON.stringify(data));
        setForecasts(data);
      } catch {
        setError("Unable to determine Forecasts");
      } finally {
        setLoading(false);
      }
    }

    fetchForecasts();
  }, []);

  return { latestForecasts, loadingLatest, latestError };
}
