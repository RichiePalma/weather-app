import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function WeeklyForecastCard({ period }) {
  const getWeatherIcon = () => {
    const forecast = period.shortForecast.toLowerCase();

    if (forecast.includes("snow")) {
      return <CloudSnow className="h-12 w-12 text-blue-300" />;
    }
    if (forecast.includes("rain") || forecast.includes("shower")) {
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    }
    if (forecast.includes("cloud") || forecast.includes("overcast")) {
      return <Cloud className="h-12 w-12 text-gray-400" />;
    }
    if (forecast.includes("sunny") || forecast.includes("clear")) {
      return <Sun className="h-12 w-12 text-yellow-400" />;
    }
    return <Cloud className="h-12 w-12 text-gray-400" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className={period.isDaytime ? "" : "bg-slate-50 dark:bg-slate-900"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{period.name}</CardTitle>
          {period.probabilityOfPrecipitation.value > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Droplets className="h-3 w-3 mr-1" />
              {period.probabilityOfPrecipitation.value}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(period.startTime)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {getWeatherIcon()}
            <div className="mt-3">
              <p className="text-4xl">
                {period.temperature}°{period.temperatureUnit}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {period.shortForecast}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wind className="h-4 w-4" />
            <span>
              {period.windSpeed} {period.windDirection}
            </span>
          </div>
          <p className="text-xs leading-relaxed">{period.detailedForecast}</p>
        </div>
      </CardContent>
    </Card>
  );
}
