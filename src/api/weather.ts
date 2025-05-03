import { API_CONFIG } from "./config";
import { AirPollutionData, Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const endpoint = `${API_CONFIG.BASE_URL}weather`;

    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    };
    const url = this.createUrl(endpoint, params);
    return await this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const endpoint = `${API_CONFIG.BASE_URL}forecast`;

    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    };
    const url = this.createUrl(endpoint, params);
    return await this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> {
    const endpoint = `${API_CONFIG.GEO}reverse`;

    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    };
    const url = this.createUrl(endpoint, params);
    return await this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocation(query: string): Promise<GeocodingResponse[]> {
    const endpoint = `${API_CONFIG.GEO}direct`;

    const params = {
      q: query,
      limit: "5",
    };
    const url = this.createUrl(endpoint, params);
    return await this.fetchData<GeocodingResponse[]>(url);
  }

  async getAirPollution({lat, lon}: Coordinates): Promise<AirPollutionData> {
    const endpoint = `${API_CONFIG.BASE_URL}air_pollution`;

    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
    };

    const url = this.createUrl(endpoint, params);
    return await this.fetchData<AirPollutionData>(url);
  }
}


export const weatherAPI = new WeatherAPI();