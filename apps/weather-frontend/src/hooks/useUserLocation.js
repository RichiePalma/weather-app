import { useEffect, useState, useRef } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const saved = localStorage.getItem("userLocation");

    if (saved) {
      setLocation(JSON.parse(saved));
      setLoading(false);
      return;
    }

    async function fetchLocation() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/v1/ipapi/json`,
        );
        const data = await res.json();
        const loc = {
          lat: data.latitude,
          lon: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country_name,
          source: "ip",
        };
        localStorage.setItem("userLocation", JSON.stringify(loc));
        setLocation(loc);
      } catch {
        setError("Unable to determine location");
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);

  return { location, loading, error };
}
