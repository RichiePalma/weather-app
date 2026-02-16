import type { SavedLocation, Location } from "../types/weather";

const STORAGE_KEY = "weather_favorites";

export class LocationService {
  /**
   * Get user's current location using Geolocation API
   */
  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Current Location",
            state: "",
          });
        },
        (error) => {
          reject(new Error(`Failed to get location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });
  }

  /**
   * Get all saved favorite locations from localStorage
   */
  static getFavorites(): SavedLocation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  }

  /**
   * Add a location to favorites
   */
  static addFavorite(location: Location, customName?: string): SavedLocation {
    const favorites = this.getFavorites();

    const newFavorite: SavedLocation = {
      ...location,
      id: `${location.latitude}-${location.longitude}-${Date.now()}`,
      name: customName || `${location.city}, ${location.state}`,
      addedAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

    return newFavorite;
  }

  /**
   * Remove a favorite location
   */
  static removeFavorite(id: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Check if a location is already favorited
   */
  static isFavorite(latitude: number, longitude: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(
      (fav) =>
        Math.abs(fav.latitude - latitude) < 0.01 &&
        Math.abs(fav.longitude - longitude) < 0.01,
    );
  }

  /**
   * Update a favorite's custom name
   */
  static updateFavoriteName(id: string, name: string): void {
    const favorites = this.getFavorites();
    const updated = favorites.map((fav) =>
      fav.id === id ? { ...fav, name } : fav,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}
