export default function FatigueWarning({ fatigue }) {
  if (fatigue.level !== "HIGH") return null;

  return (
    <div className="bg-red-900/30 border border-red-600 rounded-xl p-4 text-sm text-red-300">
      ⚠ You may be experiencing habit fatigue.  
      Consider lighter goals or a rest day.
    </div>
  );
}
