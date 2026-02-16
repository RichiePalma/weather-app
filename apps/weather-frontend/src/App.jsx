import { WeatherDashboard } from "./components/WeatherDashboard.jsx";
import { mockWeeklyForecast } from "./data/mockWeeklyForecast.js";
import { mockHourlyForecast } from "./data/mockHourlyForecast.js";
import { useUserLocation } from "./hooks/useUserLocation.js";

export default function App() {
  const { location, loading, error } = useUserLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading location...
      </div>
    );
  }

  let displayLocation = location;

  if (error || location == null || location?.country_code !== "US") {
    displayLocation = {
      latitude: 37.42301,
      longitude: -122.083352,
      city: "Mountain View",
      region: "California",
      region_code: "CA",
      country_name: "United States",
      country_code: "US",
      isDefault: true,
    };
  } else {
    displayLocation = location;
  }

  /* const displayLocation = location
    ? `${location.city}, ${location.region}`
    : "DEFAULT" */

  return (
    <WeatherDashboard
      weeklyForecast={mockWeeklyForecast}
      hourlyForecast={mockHourlyForecast}
      location={displayLocation}
    />
  );
}
