import { ForecastData } from "@/api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface ForecastDataProps {
  data: ForecastData;
}

interface DailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  description: string;
}

const WeatherForecast = ({ data }: ForecastDataProps) => {
  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  const dailyForecast: DailyForecast[] = dailyData.map((item) => ({
    date: new Date(item.dt * 1000).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    temp_min: Math.round(item.main.temp_min),
    temp_max: Math.round(item.main.temp_max),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    description: item.weather[0].description,
  }));


  const formatWindSpeed = (speed: number) => {
    return Math.round(speed * 3.6);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md sm:text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 ">
          {dailyForecast.map((item) => (
            <div key={item.date} className="border rounded-lg p-4 flex justify-between sm:items-center items-start flex-col sm:flex-row gap-4 sm:gap-0">
              {/* date */}
              <div>
                <p>{item.date}</p>
                <p className="capitalize text-sm text-muted-foreground">{item.description}</p>
              </div>
              {/* details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
                <div className="flex items-center gap-1 text-blue-500">
                  <ArrowDown className=" w-5 h-5 sm:w-6 sm:h-6"/>
                  <span className="text-sm sm:text-base">{item.temp_min}°</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <ArrowUp className=" w-5 h-5 sm:w-6 sm:h-6"/>
                  <span className="text-sm sm:text-base">{item.temp_max}°</span>
                </div >
                <div className="flex items-center gap-1">
                  <Droplets className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{item.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">{formatWindSpeed(item.wind)} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
