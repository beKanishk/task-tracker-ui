export default function CompletionBanner({ allCompleted }) {
  if (!allCompleted) return null;

  return (
    <div className="mt-6 bg-green-900/40 border border-green-700 rounded-xl p-4 text-center">
      🎉 <span className="font-semibold">All tasks completed today!</span>
      <div className="text-sm text-green-300 mt-1">
        You earned today’s streak — well done.
      </div>
    </div>
  );
}
