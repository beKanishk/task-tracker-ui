export default function Heatmap({ activity }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {activity.map((count, idx) => (
        <div
          key={idx}
          className={`w-4 h-4 rounded ${
            count === 0
              ? "bg-gray-800"
              : count < 3
              ? "bg-green-600"
              : "bg-green-400"
          }`}
        />
      ))}
    </div>
  );
}
