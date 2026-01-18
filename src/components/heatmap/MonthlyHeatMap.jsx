export default function MonthlyHeatmap({ yearData }) {
  if (!Array.isArray(yearData) || yearData.length === 0) {
    return (
      <div className="text-gray-400">
        No monthly data available
      </div>
    );
  }

  const currentMonth = new Date().getMonth() + 1;

  const monthData =
    yearData.find(m => m.month === currentMonth) ||
    {
      month: currentMonth,
      activity: new Array(31).fill(0),
    };

  return (
    <div className="space-y-3">
      <h3 className="text-sm text-gray-400">
        Month {monthData.month}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {monthData.activity.map((value, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-md ${
              value === 0
                ? "bg-gray-700"
                : value < 2
                ? "bg-green-400/50"
                : "bg-green-500"
            }`}
            title={`Day ${i + 1}: ${value}`}
          />
        ))}
      </div>
    </div>
  );
}
