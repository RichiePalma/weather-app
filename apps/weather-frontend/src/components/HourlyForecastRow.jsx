import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  Gauge,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function HourlyForecastRow({ period }) {
  const getWeatherIcon = () => {
    const forecast = period.shortForecast.toLowerCase();
    const size = "h-6 w-6";

    if (forecast.includes("snow")) {
      return <CloudSnow className={`${size} text-blue-300`} />;
    }
    if (forecast.includes("rain") || forecast.includes("shower")) {
      return <CloudRain className={`${size} text-blue-400`} />;
    }
    if (
      forecast.includes("cloud") ||
      forecast.includes("overcast") ||
      forecast.includes("fog")
    ) {
      return <Cloud className={`${size} text-gray-400`} />;
    }
    if (forecast.includes("sunny") || forecast.includes("clear")) {
      return <Sun className={`${size} text-yellow-400`} />;
    }
    return <Cloud className={`${size} text-gray-400`} />;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 border-b hover:bg-accent/50 transition-colors ${
        !period.isDaytime ? "bg-slate-50/50 dark:bg-slate-900/30" : ""
      }`}
    >
      {/* Time */}
      <div className="w-24 flex-shrink-0">
        <p className="font-medium">{formatTime(period.startTime)}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(period.startTime)}
        </p>
      </div>

      {/* Icon & Forecast */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getWeatherIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{period.shortForecast}</p>
        </div>
      </div>

      {/* Temperature */}
      <div className="w-16 text-center flex-shrink-0">
        <p className="text-xl">{period.temperature}°</p>
      </div>

      {/* Precipitation */}
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        {period.probabilityOfPrecipitation.value > 0 && (
          <Badge variant="secondary" className="text-xs">
            <Droplets className="h-3 w-3 mr-1" />
            {period.probabilityOfPrecipitation.value}%
          </Badge>
        )}
      </div>

      {/* Wind */}
      <div className="w-24 flex-shrink-0 flex items-center gap-1 text-sm text-muted-foreground">
        <Wind className="h-4 w-4" />
        <span className="truncate">{period.windSpeed}</span>
      </div>

      {/* Humidity (if available) */}
      {period.relativeHumidity && (
        <div className="w-16 flex-shrink-0 flex items-center gap-1 text-sm text-muted-foreground">
          <Gauge className="h-4 w-4" />
          <span>{Math.round(period.relativeHumidity.value)}%</span>
        </div>
      )}
    </div>
  );
}
