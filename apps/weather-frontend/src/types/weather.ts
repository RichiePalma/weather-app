// Types based on NWS API structure
// https://api.weather.gov/

export interface Point {
  properties: {
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

export interface Period {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface Forecast {
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: {
      value: number;
      unitCode: string;
    };
    periods: Period[];
  };
}

export interface GridpointData {
  properties: {
    updateTime: string;
    validTimes: string;
    elevation: {
      value: number;
      unitCode: string;
    };
    temperature: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
    relativeHumidity: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
    windSpeed: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
    windDirection: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export interface SavedLocation extends Location {
  id: string;
  name: string;
  addedAt: string;
}
