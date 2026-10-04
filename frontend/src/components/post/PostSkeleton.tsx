// Placeholder shaped like a Post card (header tags, title, body, author row,
// top comment) so the feed keeps its layout while posts load.
function PostCardSkeleton() {
  return (
    <div className="w-full min-h-[30vh] bg-white rounded-2xl shadow-lg p-6 flex flex-col font-display animate-pulse">
      {/* Header: solved badge + tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-neutral-200 rounded-full" />
        <div className="h-6 w-24 bg-neutral-200 rounded-full" />
      </div>
      {/* Title + description */}
      <div className="h-7 w-3/4 bg-neutral-200 rounded mb-3" />
      <div className="h-4 w-full bg-neutral-200 rounded mb-2" />
      <div className="h-4 w-5/6 bg-neutral-200 rounded mb-6" />
      {/* Author + votes */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-neutral-200 rounded-full" />
        <div className="h-4 w-32 bg-neutral-200 rounded" />
        <div className="ml-auto h-6 w-24 bg-neutral-200 rounded" />
      </div>
      <hr className="my-4 border-gray-200/80" />
      {/* Top comment */}
      <div className="h-4 w-2/3 bg-neutral-200 rounded" />
    </div>
  );
}

export default function PostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="max-w-5xl mr-[2%]" aria-busy="true" aria-label="Loading posts">
      <div className="space-y-5">
        {Array.from({ length: count }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
