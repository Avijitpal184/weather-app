import CurrentWeather from "@/components/CurrentWeather";
import { FavoriteBtn } from "@/components/FavoriteBtn";
import HourlyTemp from "@/components/HourlyTemp";
import { WeatherSkeleton } from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import {
  useAirPollutionQuery,
  useForecastQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const cordinates = { lat, lon };
  // console.log(cordinates);

  const weatherQuery = useWeatherQuery(cordinates);
  const forecastQuery = useForecastQuery(cordinates);
  const airPollutionQuery = useAirPollutionQuery(cordinates);
  // console.log(weatherQuery.data);

  // Get full country name
  function getCountryName(countryCode?: string): string {
    if (!countryCode || countryCode.length !== 2) {
      return "Unknown";
    }

    try {
      const country = new Intl.DisplayNames(["en"], { type: "region" });
      return country.of(countryCode) || "Unknown";
    } catch {
      return "Unknown";
    }
  }

  if (weatherQuery.error || forecastQuery.error || airPollutionQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Faild to fetch weather data. Please retry.</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (
    !weatherQuery.data ||
    !forecastQuery.data ||
    !airPollutionQuery.data ||
    !params.cityName
  ) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-end">
          <h1 className="text-2xl font-semibold">{params.cityName}</h1>
          <p className="text-muted-foreground">
            , {getCountryName(weatherQuery.data.sys.country)}
          </p>
        </div>
        {/* favorite button */}
        <div>
          <FavoriteBtn data={{ ...weatherQuery.data, name: params.cityName }} />
        </div>
      </div>

      {/* Current and Hourly weather */}
      <div className="grid gap-6">
        <div className="flex lg:flex-row flex-col gap-4">
          {/* current weather */}
          <CurrentWeather
            data={weatherQuery.data}
            airPollution={airPollutionQuery.data}
          />
          {/* hourly weather */}
          <HourlyTemp data={forecastQuery.data} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
