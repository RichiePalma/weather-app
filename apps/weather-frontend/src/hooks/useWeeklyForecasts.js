import { useEffect, useState, useRef } from "react";

export function useWeeklyForecasts(lat, lon) {
  const [weeklyForecasts, setForecasts] = useState(null);
  const [loadingWeekly, setLoading] = useState(true);
  const [weeklyError, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const saved = localStorage.getItem("weeklyForecasts");

    if (saved) {
      setForecasts(JSON.parse(saved));
      setLoading(false);
      return;
    }

    async function fetchForecasts() {
      try {
        console.log("Fetching with " + lat + " " + lon);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/v1/nws/points/${lat},${lon}/forecast`,
        );
        const data = await res.json();
        localStorage.setItem("weeklyForecasts", JSON.stringify(data));
        setForecasts(data);
      } catch {
        setError("Unable to determine Forecasts");
      } finally {
        setLoading(false);
      }
    }

    fetchForecasts();
  }, []);

  return { weeklyForecasts, loadingWeekly, weeklyError };
}
