function EventHeroSkeleton() {
  return (
    <div className="relative h-[500px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-3/4 h-12 bg-gray-300 rounded mb-8" />
      </div>
    </div>
  );
}

export default EventHeroSkeleton;
