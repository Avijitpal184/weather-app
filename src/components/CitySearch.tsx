import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { CircleX, Clock, Loader2, Search, Star } from "lucide-react";
import { useSearchLocationQuery } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const { data: locations, isLoading } = useSearchLocationQuery(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();

  function handleSelect(cityData: string) {
    const [lat, lon, name, country] = cityData.split("|");

    // Add to history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setQuery("");
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}}`);
  }

  const { favorites } = useFavorite();

  return (
    <>
      <Button
        variant="outline"
        className="duration-0 text-muted-foreground font-normal w-4/5 relative justify-start md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 mr-1" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} >
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {favorites.length > 0 && (
              <CommandGroup heading="Favorites">
                {favorites.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="w-4 h-4 mr-1 text-amber-500" />
                    <span>{location.name},</span>
                    {location.state && (
                      <span className="text-muted-foreground">
                        {" "}
                        {location.state},
                      </span>
                    )}
                    {location.country && (
                      <span className="text-muted-foreground">
                        {" "}
                        {location.country}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground ">
                    Recent Searches
                  </p>
                  <Button
                    className="text-xs"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <CircleX className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
                {history.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span>{location.name},</span>
                    {location.state && (
                      <span className="text-muted-foreground">
                        {" "}
                        {location.state},
                      </span>
                    )}
                    {location.country && (
                      <span className="text-muted-foreground">
                        {" "}
                        {location.country}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="w-4 h-4 mr-1" />
                  <span>{location.name},</span>
                  {location.state && (
                    <span className="text-muted-foreground">
                      {" "}
                      {location.state},
                    </span>
                  )}
                  {location.country && (
                    <span className="text-muted-foreground">
                      {" "}
                      {location.country}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
