export default function MiniHeatmap({ activity }) {
  return (
    <div className="flex gap-1">
      {activity.map((count, idx) => (
        <div
          key={idx}
          title={`Activity: ${count}`}
          className={`w-4 h-4 rounded ${
            count === 0
              ? "bg-gray-700"
              : count < 3
              ? "bg-green-600"
              : "bg-green-400"
          }`}
        />
      ))}
    </div>
  );
}
