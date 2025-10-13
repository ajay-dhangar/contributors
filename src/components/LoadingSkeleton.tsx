import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function ContributorCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-5 w-24 mx-auto" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ContributorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <ContributorCardSkeleton key={i} />
      ))}
    </div>
  );
}
