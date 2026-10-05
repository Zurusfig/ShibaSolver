// Mirrors ProfileContent's panel (same width, colour, tab bar and minimum
// height) so swapping to the real panel doesn't change the layout.
export default function ProfileContentSkeleton() {
  return (
    <div className="w-full flex flex-col items-center font-display mt-6 mb-10">
      <div className="w-full max-w-4xl pt-4 pl-8 pr-8 pb-8 bg-accent-400 rounded-xl flex flex-col">
        {/* Tab bar placeholder */}
        <div className="flex gap-8 h-12 items-center border-b border-black/10 px-4">
          <div className="h-4 w-14 bg-white/30 rounded animate-pulse" />
          <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
        </div>
        {/* Same min height as the lists, so there's no jump when they load */}
        <div className="min-h-[280px]" />
      </div>
    </div>
  );
}
