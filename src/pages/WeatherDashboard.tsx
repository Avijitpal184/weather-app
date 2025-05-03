import CurrentWeather from "@/components/CurrentWeather";
import { FavoriteCities } from "@/components/FavoriteCities";
import HourlyTemp from "@/components/HourlyTemp";
import { WeatherSkeleton } from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useAirPollutionQuery,
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  // console.log(coordinates);

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);
  const airPollutionQuery = useAirPollutionQuery(coordinates);
  // console.log(weatherQuery.data);
  // console.log(forecastQuery.data);
  // console.log(locationQuery.data);
  // console.log(airPollutionQuery.data);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
      airPollutionQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (!navigator.onLine) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Internet</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Check your network connection and try again.</p>
          <Button
            onClick={handleRefresh}
            variant={"outline"}
            className="w-fit bg-transparent border-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button
            onClick={handleRefresh}
            variant={"outline"}
            className="w-fit bg-transparent border-transparent"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location to see your local weather.</p>
          <Button
            onClick={handleRefresh}
            variant={"outline"}
            className="w-fit bg-transparent border-transparent"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];
  // console.log(airPollution);

  if (weatherQuery.error || forecastQuery.error || airPollutionQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Faild to fetch weather data. Please retry.</p>
          <Button
            onClick={handleRefresh}
            variant={"outline"}
            className="w-fit bg-transparent border-transparent"
          >
            <MapPin className="h-4 w-4 mr-1" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !airPollutionQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Location</h1>
        <Button
          variant={"outline"}
          className="duration-0"
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      {/* Current and Hourly weather */}
      <div className="grid gap-6">
        <div className="flex lg:flex-row flex-col gap-4">
          {/* current weather */}
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
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

export default WeatherDashboard;
