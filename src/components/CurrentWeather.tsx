import { AirPollutionData, GeocodingResponse, WeatherData } from "@/api/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Frown,
  Leaf,
  Skull,
  Smile,
  Wind,
} from "lucide-react";
import { FaMaskFace } from "react-icons/fa6";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
  airPollution?: AirPollutionData;
}

const CurrentWeather = ({
  data,
  locationName,
  airPollution,
}: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

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

  // Format Temperature
  function formatTemp(temp: number) {
    return `${Math.round(temp)}`;
  }

  // Get Air Quality
  const aqi = airPollution?.list?.[0]?.main?.aqi;

  // Get Air Quality Info
  function getAirQualityInfo(aqi: number | undefined) {
    switch (aqi) {
      case 1:
        return { category: "Good", icon: <Leaf className="text-green-600" /> };
      case 2:
        return {
          category: "Fair",
          icon: <Smile className="text-yellow-600" />,
        };
      case 3:
        return {
          category: "Moderate",
          icon: <Frown className="text-orange-600" />,
        };
      case 4:
        return {
          category: "Poor",
          icon: <FaMaskFace className="text-red-500" />,
        };
      case 5:
        return {
          category: "Very Poor",
          icon: <Skull className="text-red-600" />,
        };
      default:
        return { category: "Unknown", icon: <span>❓</span> };
    }
  }

  // m/s to km/h
  function masToKmh(speed: number) {
    return Math.round(speed * 3.6);
  }

  return (
    <Card>
      <CardContent>
        <div className="flex sm:flex-row space-y-0 sm:space-x-10 justify-between flex-col">
          {/* content */}
          <div className="space-y-5">
            {/* Location */}
            <div className="space-y-1 flex-col flex items-start justify-center ">
              <div className="flex items-end">
                {locationName?.name && (
                  <h2 className="text-3xl font-semibold">
                    {locationName?.name}
                  </h2>
                )}
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    , {locationName.state}
                  </span>
                )}
              </div>
              {locationName?.country && (
                <p className="text-muted-foreground uppercase">
                  {getCountryName(locationName?.country)}
                </p>
              )}
            </div>

            {/* Temperature */}
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-6xl sm:text-8xl font-semibold">
                {formatTemp(temp)}
                <span className="text-xl align-top">°C</span>
              </p>
              <div className="flex flex-col items-center space-y-2">
                <p className="text-muted-foreground sm:text-xl font-medium">
                  Feels like {formatTemp(feels_like)}
                  <span className="text-sm align-top">°C</span>
                </p>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="flex space-x-1 items-center justify-center text-blue-500">
                    <ArrowDown className="w-4 h-4" />
                    <div>
                      <span className="text-sm sm:text-lg">
                        {formatTemp(temp_min)}°
                      </span>
                    </div>
                  </span>
                  <span className="flex space-x-1 items-center justify-center text-red-500">
                    <ArrowUp className="w-4 h-4" />
                    <div>
                      <span className="text-sm sm:text-lg">
                        {formatTemp(temp_max)}°
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            {/* Humidity and wind  */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 place-items-start sm:place-items-start">
              {/* Humidity */}
              <div className="flex items-center space-x-3">
                <Droplets className="w-6 h-6 text-blue-500" />
                <div>
                  <p>Humidity</p>
                  <p className="text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              {/* wind */}
              <div className="flex items-center space-x-3">
                <Wind className="w-6 h-6 text-blue-500" />
                <div>
                  <p>Wind</p>
                  <p className="text-muted-foreground">
                    {masToKmh(speed)} km/h
                  </p>
                </div>
              </div>
              {/* air pollution */}
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 text-2xl">
                  {getAirQualityInfo(aqi).icon}
                </span>
                <div>
                  {aqi ? (
                    <>
                      <p>AQI</p>
                      <p className="text-muted-foreground">
                        {getAirQualityInfo(aqi).category}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Data not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex max-w-[200px] w-full items-center justify-center aspect-square">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="w-full h-full object-contain drop-shadow-neutral-300 dark:drop-shadow-neutral-500/50 drop-shadow-xl"
              />
            </div>
            <p className="capitalize text-lg font-semibold">
              {currentWeather.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
