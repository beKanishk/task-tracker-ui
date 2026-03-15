export default function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-surface-border rounded-full h-1.5 mt-2">
      <div
        className="bg-gradient-to-r from-emerald-500 to-green-400 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
