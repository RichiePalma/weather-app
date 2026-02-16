import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { WeatherService } from "../services/weatherService";

export function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const locations = await WeatherService.searchLocations(query);
      setResults(locations);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (location) => {
    onLocationSelect(location);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {results.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-0">
            <div className="divide-y">
              {results.map((location, index) => (
                <button
                  key={`${location.latitude}-${location.longitude}-${index}`}
                  onClick={() => handleSelect(location)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors text-left"
                >
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">{location.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.state} • {location.latitude.toFixed(4)},{" "}
                      {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
