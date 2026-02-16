import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { FavoritesList } from "../components/FavoritesList";
import { WeatherCard } from "../components/WeatherCard";
import { LocationService } from "../services/locationService";
import { WeatherService } from "../services/weatherService";
import type { SavedLocation, Forecast } from "../types/weather";

export function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<SavedLocation[]>([]);
  const [selectedFavorite, setSelectedFavorite] =
    useState<SavedLocation | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setFavorites(LocationService.getFavorites());
  };

  const handleFavoriteSelect = async (favorite: SavedLocation) => {
    setSelectedFavorite(favorite);
    setLoading(true);

    try {
      const point = await WeatherService.getPoint(
        favorite.latitude,
        favorite.longitude,
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button onClick={() => navigate("/")} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl mb-8">Favorite Locations</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Favorites List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl mb-4">Saved Locations</h2>
            <FavoritesList
              favorites={favorites}
              onSelect={handleFavoriteSelect}
              onUpdate={loadFavorites}
            />
          </div>

          {/* Weather Details */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {forecast && selectedFavorite && !loading && (
              <div>
                <h2 className="text-2xl mb-6">{selectedFavorite.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {forecast.properties.periods.map((period) => (
                    <WeatherCard key={period.number} period={period} />
                  ))}
                </div>
              </div>
            )}

            {!selectedFavorite && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Select a favorite location to view its weather forecast.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
