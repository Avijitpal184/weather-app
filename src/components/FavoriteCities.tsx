import { useFavorite } from "@/hooks/use-favorite";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

export const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavorite();

  if (!favorites.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Favorites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex items-center gap-4 pb-1">
          {favorites.map((city) => {
            return (
              <FavoriteCityTablet
                key={city.id}
                {...city}
                onRemove={() => removeFavorite.mutate(city.id)}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
};

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
      className="relative flex flex-col min-w-[250px] bg-card rounded-lg p-4 shadow-sm border"
    >
      <Button
        variant={"ghost"}
        className="absolute top-1 right-2 w-6 h-6 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from favorites`);
        }}
      >
        {isLoading ? null : <X className="w-4 h-4" />}
      </Button>

      {isLoading ? (
        <div className="w-full h-[60px] flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center justify-between">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-12 h-12 object-contain drop-shadow-neutral-300 dark:drop-shadow-neutral-500/50 drop-shadow-lg"
            />
            <div className="flex items-center">
              <h2 className="mr-1 font-medium">{name},</h2>
              <p className="text-sm text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-blue-500">
              {Math.round(weather.main.temp)}
              <span className="align-top text-xs">&deg;C</span>{" "}
            </p>
            <p className="capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
