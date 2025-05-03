import { WeatherData } from "@/api/types";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  // console.log(data);

  const { wind, sys, main } = data;

  const formatTime = (time: number) => {
    const date = new Date(time * 1000);
    const formattedTime = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

  const getWindDirection = (degree: number) => {
    const direction = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return direction[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise).toUpperCase(),
      icon: <Sunrise />,
      color: "text-yellow-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset).toUpperCase(),
      icon: <Sunset />,
      color: "text-orange-500",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: <Compass />,
      color: "text-blue-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: <Gauge />,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="h-max">
      <CardHeader>
        <CardTitle className="text-md sm:text-xl">Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {details.map((detail) => (
            <div
              className="flex items-center px-4 gap-4 py-3 border rounded-lg shadow-sm "
              key={detail.title}
            >
              <span className={`${detail.color} h-6 w-6`}>{detail.icon}</span>
              <div>
                <p>{detail.title}</p>
                <p className="text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
