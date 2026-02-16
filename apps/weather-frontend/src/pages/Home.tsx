import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MapPin, Star, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { WeatherCard } from "../components/WeatherCard";
import { LocationService } from "../services/locationService";
import { WeatherService } from "../services/weatherService";
import type { Location, Forecast } from "../types/weather";

export function Home() {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    // Try to get current location on mount
    requestLocation();
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      setLocationGranted(true);
      await loadWeather(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
      setLocationGranted(false);
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async (location: Location) => {
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

      // Update location with city/state from point data
      setCurrentLocation({
        ...location,
        city: point.properties.relativeLocation.properties.city,
        state: point.properties.relativeLocation.properties.state,
      });
    } catch (err) {
      setError("Failed to load weather data");
      console.error(err);
    }
  };

  const handleAddToFavorites = () => {
    if (currentLocation) {
      LocationService.addFavorite(currentLocation);
      alert("Location added to favorites!");
    }
  };

  const isFavorited = currentLocation
    ? LocationService.isFavorite(
        currentLocation.latitude,
        currentLocation.longitude,
      )
    : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Weather Forecast</h1>
            {currentLocation && locationGranted && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {currentLocation.city}, {currentLocation.state}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/search")} variant="outline">
              Search Locations
            </Button>
            <Button onClick={() => navigate("/favorites")} variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Favorites
            </Button>
          </div>
        </div>

        {/* Location Request */}
        {!locationGranted && !loading && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="mb-2">
                Enable location access to see weather for your current location.
              </p>
              <Button onClick={requestLocation} size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Weather Content */}
        {forecast && currentLocation && !loading && (
          <>
            {/* Current Weather */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">Current Weather</h2>
                {!isFavorited && (
                  <Button
                    onClick={handleAddToFavorites}
                    variant="outline"
                    size="sm"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forecast.properties.periods.slice(0, 3).map((period) => (
                  <WeatherCard key={period.number} period={period} />
                ))}
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-2xl mb-4">7-Day Forecast</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {forecast.properties.periods.slice(3).map((period) => (
                  <WeatherCard key={period.number} period={period} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!forecast && !loading && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>
              Enable location access or search for a city to see weather
              information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
