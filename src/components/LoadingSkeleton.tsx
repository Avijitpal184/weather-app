import { Skeleton } from "./ui/skeleton";

export const WeatherSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Skeleton className="h-6 w-38 rounded-lg" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8  ">
          <Skeleton className="h-22 w-full rounded-lg" />
          <Skeleton className="h-22 hidden sm:block w-full rounded-lg" />
          <Skeleton className="h-22 hidden w-full md:block rounded-lg" />
          <Skeleton className="h-22 hidden w-full md:block rounded-lg" />
          <Skeleton className="h-22 hidden md:hidden lg:block w-full rounded-lg" />
          <Skeleton className="h-22 hidden md:hidden lg:block w-full rounded-lg" />
          <Skeleton className="h-22 hidden md:hidden lg:block w-full rounded-lg" />
          <Skeleton className="h-22 hidden md:hidden lg:block w-full rounded-lg" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-[300px] w-full lg:w-[40%] rounded-lg" />
          <Skeleton className="h-[300px] w-full lg:flex-1 rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
