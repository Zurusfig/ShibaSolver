// Shared "nothing here" message so the Posts and Comments tabs match.
export default function ProfileEmptyState({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-32">
      <p className="text-white text-lg">{message}</p>
    </div>
  );
}
