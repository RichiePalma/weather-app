import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { WeeklyForecastCard } from "./WeeklyForecastCard";
import { HourlyForecastRow } from "./HourlyForecastRow";

export function WeatherDashboard({ weeklyForecast, hourlyForecast, location }) {
  const [activeTab, setActiveTab] = useState("weekly");
  const currentPeriod = weeklyForecast.properties.periods[0];
  const nextPeriod = weeklyForecast.properties.periods[1];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">
              {location?.city && location?.region
                ? `${location.city}, ${location.region}`
                : "Unknown Location"}
            </span>
            {location?.isDefault && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded">
                Failed to get location or location is in a region not covered by
                service.
              </span>
            )}
          </div>
          <h1 className="text-4xl mb-2">Weather Forecast</h1>
          <p className="text-sm text-muted-foreground">
            Updated:{" "}
            {new Date(weeklyForecast.properties.updateTime).toLocaleString()}
          </p>
        </div>

        {/* Current Weather Highlight */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Current Conditions</CardTitle>
            <CardDescription className="text-base">
              {currentPeriod.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-6xl mb-2">
                  {currentPeriod.temperature}°{currentPeriod.temperatureUnit}
                </p>
                <p className="text-xl mb-4">{currentPeriod.shortForecast}</p>
                <div className="flex flex-wrap gap-2">
                  {currentPeriod.probabilityOfPrecipitation.value > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      Precipitation:{" "}
                      {currentPeriod.probabilityOfPrecipitation.value}%
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-sm">
                    Wind: {currentPeriod.windSpeed}{" "}
                    {currentPeriod.windDirection}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Next:</p>
                  <p className="font-medium">{nextPeriod.name}</p>
                  <p className="text-sm">
                    {nextPeriod.temperature}° - {nextPeriod.shortForecast}
                  </p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm leading-relaxed">
                    {currentPeriod.detailedForecast}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              7-Day Forecast
            </TabsTrigger>
            <TabsTrigger value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hourly
            </TabsTrigger>
          </TabsList>

          {/* Weekly Forecast View */}
          <TabsContent value="weekly" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {weeklyForecast.properties.periods.map((period) => (
                <WeeklyForecastCard key={period.number} period={period} />
              ))}
            </div>
          </TabsContent>

          {/* Hourly Forecast View */}
          <TabsContent value="hourly" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Forecast</CardTitle>
                <CardDescription>
                  Detailed hour-by-hour forecast for the next{" "}
                  {Math.floor(hourlyForecast.properties.periods.length / 24)}{" "}
                  days
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="divide-y">
                    {hourlyForecast.properties.periods.map((period) => (
                      <HourlyForecastRow key={period.number} period={period} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Info Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Data Source:</strong> National Weather Service API
            (https://api.weather.gov/)
          </p>
          <p className="mb-2">
            <strong>Forecast Generator:</strong>{" "}
            {weeklyForecast.properties.forecastGenerator} (Weekly) •{" "}
            {hourlyForecast.properties.forecastGenerator} (Hourly)
          </p>
          <p>
            <strong>Elevation:</strong>{" "}
            {Math.round(weeklyForecast.properties.elevation.value * 3.28084)} ft
          </p>
        </div>
      </div>
    </div>
  );
}
