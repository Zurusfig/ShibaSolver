// Placeholder shaped like a Post card (header tags, title, body, author row,
// top comment) so the feed keeps its layout while posts load.
function PostCardSkeleton() {
  return (
    <div className="w-full min-h-[30vh] bg-white rounded-2xl shadow-lg p-6 flex flex-col font-display animate-pulse">
      {/* Header: solved badge + tags */}
      <div className="flex gap-2 mb-6">
        <div className="h-8 w-16 bg-neutral-200 rounded-md" />
        <div className="h-8 w-28 bg-neutral-200 rounded-md" />
        <div className="h-8 w-24 bg-neutral-200 rounded-md" />
      </div>
      {/* Title + description */}
      <div className="h-6 w-3/5 bg-neutral-200 rounded mb-4" />
      <div className="space-y-3 mb-6">
        <div className="h-3.5 w-1/4 bg-neutral-200 rounded" />
        <div className="h-3.5 w-full bg-neutral-200 rounded" />
        <div className="h-3.5 w-11/12 bg-neutral-200 rounded" />
        <div className="h-3.5 w-4/5 bg-neutral-200 rounded" />
        <div className="h-3.5 w-2/3 bg-neutral-200 rounded" />
      </div>
      {/* Author + votes */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-neutral-200 rounded-full" />
        <div className="h-4 w-28 bg-neutral-200 rounded" />
        <div className="ml-auto h-6 w-28 bg-neutral-200 rounded" />
      </div>
      <hr className="my-4 border-gray-200/80" />
      {/* Top comment */}
      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 bg-neutral-200 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 bg-neutral-200 rounded" />
          <div className="h-3.5 w-full bg-neutral-200 rounded" />
          <div className="h-3.5 w-full bg-neutral-200 rounded" />
          <div className="h-3.5 w-3/5 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function PostSkeleton({ count = 3 }: { count?: number }) {
  // w-full: the feed column aligns items to the start, so without it the
  // skeleton shrinks to its (text-less) content instead of matching real posts.
  return (
    <div className="w-full max-w-5xl mr-[2%]" aria-busy="true" aria-label="Loading posts">
      <div className="space-y-5">
        {Array.from({ length: count }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
