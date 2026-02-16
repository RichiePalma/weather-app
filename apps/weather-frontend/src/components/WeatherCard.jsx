import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Cloud, Wind, Droplets } from "lucide-react";

export function WeatherCard({ period, onClick }) {
  const getWeatherIcon = (shortForecast) => {
    const forecast = shortForecast.toLowerCase();
    if (forecast.includes("rain") || forecast.includes("shower")) {
      return <Droplets className="h-12 w-12 text-blue-500" />;
    }
    if (forecast.includes("cloud")) {
      return <Cloud className="h-12 w-12 text-gray-400" />;
    }
    if (forecast.includes("wind")) {
      return <Wind className="h-12 w-12 text-gray-600" />;
    }
    return <Cloud className="h-12 w-12 text-yellow-400" />;
  };

  return (
    <Card
      className={`${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{period.name}</CardTitle>
        <CardDescription>
          {new Date(period.startTime).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {getWeatherIcon(period.shortForecast)}
            <p className="text-3xl mt-2">
              {period.temperature}°{period.temperatureUnit}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {period.shortForecast}
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>{period.windSpeed}</span>
            </div>
            <div>
              <span>{period.windDirection}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
