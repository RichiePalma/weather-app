import { WeatherDashboard } from "./components/WeatherDashboard.jsx";
import { mockWeeklyForecast } from "./data/mockWeeklyForecast.js";
import { mockHourlyForecast } from "./data/mockHourlyForecast.js";

export default function App() {
  return (
    <WeatherDashboard
      weeklyForecast={mockWeeklyForecast}
      hourlyForecast={mockHourlyForecast}
      location="Washington, DC"
    />
  );
}
