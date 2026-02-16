import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { LocationSearch } from "../components/LocationSearch";
import { WeatherCard } from "../components/WeatherCard";
import { WeatherService } from "../services/weatherService";
import { LocationService } from "../services/locationService";
import type { Location, Forecast } from "../types/weather";

export function Search() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    setLoading(true);

    try {
      const point = await WeatherService.getPoint(
        location.latitude,
        location.longitude,
      );
      const forecastData = await WeatherService.getForecast(
        point.properties.gridId,
        point.properties.gridX,
        point.properties.gridY,
      );
      setForecast(forecastData);
    } catch (error) {
      console.error("Failed to load weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (selectedLocation) {
      LocationService.addFavorite(selectedLocation);
      alert("Location added to favorites!");
    }
  };

  const isFavorited = selectedLocation
    ? LocationService.isFavorite(
        selectedLocation.latitude,
        selectedLocation.longitude,
      )
    : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl mb-6">Search Locations</h1>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading weather data...
          </div>
        )}

        {forecast && selectedLocation && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">
                {selectedLocation.city}, {selectedLocation.state}
              </h2>
              {!isFavorited && (
                <Button onClick={handleAddToFavorites} variant="outline">
                  Add to Favorites
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {forecast.properties.periods.map((period) => (
                <WeatherCard key={period.number} period={period} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
