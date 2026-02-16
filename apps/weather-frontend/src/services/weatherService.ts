// Weather service for connecting to NestJS backend
// This uses mock data but can be easily connected to your NestJS app

import type {
  Point,
  Forecast,
  GridpointData,
  Location,
} from "../types/weather";

const MOCK_MODE = true; // Set to false when connecting to your NestJS backend
const BACKEND_URL = "http://localhost:3000/api"; // Your NestJS backend URL

// Mock data based on NWS API structure
const mockForecast: Forecast = {
  properties: {
    updated: new Date().toISOString(),
    units: "us",
    forecastGenerator: "Mock Forecast Generator",
    generatedAt: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    validTimes: `${new Date().toISOString()}/P7D`,
    elevation: {
      value: 100,
      unitCode: "wmoUnit:m",
    },
    periods: [
      {
        number: 1,
        name: "Today",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        isDaytime: true,
        temperature: 72,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "5 to 10 mph",
        windDirection: "SW",
        icon: "https://api.weather.gov/icons/land/day/few?size=medium",
        shortForecast: "Sunny",
        detailedForecast:
          "Sunny, with a high near 72. Southwest wind 5 to 10 mph.",
      },
      {
        number: 2,
        name: "Tonight",
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isDaytime: false,
        temperature: 58,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "5 mph",
        windDirection: "S",
        icon: "https://api.weather.gov/icons/land/night/few?size=medium",
        shortForecast: "Mostly Clear",
        detailedForecast: "Mostly clear, with a low around 58.",
      },
      {
        number: 3,
        name: "Tuesday",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        isDaytime: true,
        temperature: 75,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "5 to 10 mph",
        windDirection: "SW",
        icon: "https://api.weather.gov/icons/land/day/sct?size=medium",
        shortForecast: "Partly Cloudy",
        detailedForecast: "Partly cloudy, with a high near 75.",
      },
      {
        number: 4,
        name: "Tuesday Night",
        startTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        isDaytime: false,
        temperature: 60,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "5 mph",
        windDirection: "S",
        icon: "https://api.weather.gov/icons/land/night/sct?size=medium",
        shortForecast: "Partly Cloudy",
        detailedForecast: "Partly cloudy, with a low around 60.",
      },
      {
        number: 5,
        name: "Wednesday",
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(),
        isDaytime: true,
        temperature: 78,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "10 mph",
        windDirection: "SW",
        icon: "https://api.weather.gov/icons/land/day/bkn?size=medium",
        shortForecast: "Mostly Cloudy",
        detailedForecast: "Mostly cloudy, with a high near 78.",
      },
      {
        number: 6,
        name: "Wednesday Night",
        startTime: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        isDaytime: false,
        temperature: 62,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "5 to 10 mph",
        windDirection: "S",
        icon: "https://api.weather.gov/icons/land/night/rain_showers,40?size=medium",
        shortForecast: "Chance Rain Showers",
        detailedForecast:
          "A chance of rain showers. Mostly cloudy, with a low around 62.",
      },
      {
        number: 7,
        name: "Thursday",
        startTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 84 * 60 * 60 * 1000).toISOString(),
        isDaytime: true,
        temperature: 70,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "10 to 15 mph",
        windDirection: "W",
        icon: "https://api.weather.gov/icons/land/day/rain_showers,60?size=medium",
        shortForecast: "Rain Showers Likely",
        detailedForecast:
          "Rain showers likely. Mostly cloudy, with a high near 70.",
      },
    ],
  },
};

const mockPoint: Point = {
  properties: {
    gridId: "MTR",
    gridX: 85,
    gridY: 105,
    forecast: "https://api.weather.gov/gridpoints/MTR/85,105/forecast",
    forecastHourly:
      "https://api.weather.gov/gridpoints/MTR/85,105/forecast/hourly",
    forecastGridData: "https://api.weather.gov/gridpoints/MTR/85,105",
    observationStations:
      "https://api.weather.gov/gridpoints/MTR/85,105/stations",
    relativeLocation: {
      properties: {
        city: "San Francisco",
        state: "CA",
      },
    },
  },
};

export class WeatherService {
  /**
   * Get point data for a location (grid coordinates)
   * TODO: Connect to your NestJS backend endpoint: GET /weather/points/{latitude},{longitude}
   */
  static async getPoint(latitude: number, longitude: number): Promise<Point> {
    if (MOCK_MODE) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        ...mockPoint,
        properties: {
          ...mockPoint.properties,
          relativeLocation: {
            properties: {
              city: this.getCityForCoordinates(latitude, longitude),
              state: this.getStateForCoordinates(latitude, longitude),
            },
          },
        },
      };
    }

    const response = await fetch(
      `${BACKEND_URL}/weather/points/${latitude},${longitude}`,
    );
    if (!response.ok) throw new Error("Failed to fetch point data");
    return response.json();
  }

  /**
   * Get forecast for a location
   * TODO: Connect to your NestJS backend endpoint: GET /weather/forecast/{gridId}/{gridX},{gridY}
   */
  static async getForecast(
    gridId: string,
    gridX: number,
    gridY: number,
  ): Promise<Forecast> {
    if (MOCK_MODE) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockForecast;
    }

    const response = await fetch(
      `${BACKEND_URL}/weather/forecast/${gridId}/${gridX},${gridY}`,
    );
    if (!response.ok) throw new Error("Failed to fetch forecast");
    return response.json();
  }

  /**
   * Get gridpoint data (detailed hourly data)
   * TODO: Connect to your NestJS backend endpoint: GET /weather/gridpoints/{gridId}/{gridX},{gridY}
   */
  static async getGridpointData(
    gridId: string,
    gridX: number,
    gridY: number,
  ): Promise<GridpointData> {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Return mock gridpoint data
      const now = new Date();
      return {
        properties: {
          updateTime: now.toISOString(),
          validTimes: `${now.toISOString()}/P7D`,
          elevation: {
            value: 100,
            unitCode: "wmoUnit:m",
          },
          temperature: {
            values: Array.from({ length: 48 }, (_, i) => ({
              validTime: new Date(
                now.getTime() + i * 60 * 60 * 1000,
              ).toISOString(),
              value: 15 + Math.sin(i / 4) * 5 + Math.random() * 2,
            })),
          },
          relativeHumidity: {
            values: Array.from({ length: 48 }, (_, i) => ({
              validTime: new Date(
                now.getTime() + i * 60 * 60 * 1000,
              ).toISOString(),
              value: 60 + Math.random() * 20,
            })),
          },
          windSpeed: {
            values: Array.from({ length: 48 }, (_, i) => ({
              validTime: new Date(
                now.getTime() + i * 60 * 60 * 1000,
              ).toISOString(),
              value: 5 + Math.random() * 10,
            })),
          },
          windDirection: {
            values: Array.from({ length: 48 }, (_, i) => ({
              validTime: new Date(
                now.getTime() + i * 60 * 60 * 1000,
              ).toISOString(),
              value: Math.floor(Math.random() * 360),
            })),
          },
        },
      };
    }

    const response = await fetch(
      `${BACKEND_URL}/weather/gridpoints/${gridId}/${gridX},${gridY}`,
    );
    if (!response.ok) throw new Error("Failed to fetch gridpoint data");
    return response.json();
  }

  /**
   * Search for locations by city name
   * TODO: Connect to your NestJS backend endpoint: GET /weather/search?q={query}
   */
  static async searchLocations(query: string): Promise<Location[]> {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock location search results
      const mockLocations: Location[] = [
        {
          latitude: 37.7749,
          longitude: -122.4194,
          city: "San Francisco",
          state: "CA",
        },
        {
          latitude: 40.7128,
          longitude: -74.006,
          city: "New York",
          state: "NY",
        },
        {
          latitude: 34.0522,
          longitude: -118.2437,
          city: "Los Angeles",
          state: "CA",
        },
        {
          latitude: 41.8781,
          longitude: -87.6298,
          city: "Chicago",
          state: "IL",
        },
        {
          latitude: 29.7604,
          longitude: -95.3698,
          city: "Houston",
          state: "TX",
        },
        {
          latitude: 33.4484,
          longitude: -112.074,
          city: "Phoenix",
          state: "AZ",
        },
        {
          latitude: 39.7392,
          longitude: -104.9903,
          city: "Denver",
          state: "CO",
        },
        {
          latitude: 47.6062,
          longitude: -122.3321,
          city: "Seattle",
          state: "WA",
        },
      ];

      return mockLocations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(query.toLowerCase()) ||
          loc.state.toLowerCase().includes(query.toLowerCase()),
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/weather/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("Failed to search locations");
    return response.json();
  }

  // Helper methods for mock data
  private static getCityForCoordinates(lat: number, lon: number): string {
    // Simple mock city mapping
    if (lat > 40 && lat < 42 && lon > -75 && lon < -73) return "New York";
    if (lat > 37 && lat < 38 && lon > -123 && lon < -122)
      return "San Francisco";
    if (lat > 33 && lat < 35 && lon > -119 && lon < -117) return "Los Angeles";
    return "Unknown City";
  }

  private static getStateForCoordinates(lat: number, lon: number): string {
    if (lat > 40 && lat < 42 && lon > -75 && lon < -73) return "NY";
    if (lat > 37 && lat < 38 && lon > -123 && lon < -122) return "CA";
    if (lat > 33 && lat < 35 && lon > -119 && lon < -117) return "CA";
    return "XX";
  }
}
