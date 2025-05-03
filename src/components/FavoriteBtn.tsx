import { WeatherData } from "@/api/types";
import { useFavorite } from "@/hooks/use-favorite";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FavoriteBtnProps {
  data: WeatherData;
}

export const FavoriteBtn = ({ data }: FavoriteBtnProps) => {
  const { addfavorite, isFavorite, removeFavorite } = useFavorite();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favorites`);
    } else {
      addfavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to favorites`);
    }
  };

  return (
    <Button variant="ghost" className="" onClick={handleToggleFavorite}>
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "text-amber-500 fill-amber-500" : ""}`}
      />
    </Button>
  );
};
