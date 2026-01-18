// src/components/heatmap/YearlyHeatmap.jsx

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function YearlyHeatmap({ yearData }) {
  if (!Array.isArray(yearData)) {
    return <div className="text-gray-400">No yearly data</div>;
  }

  // Normalize → always 12 months
  const normalized = MONTHS.map((name, index) => {
    const monthNumber = index + 1;
    const found = yearData.find(m => m.month === monthNumber);

    return {
      name,
      activity: found?.activity ?? new Array(31).fill(0),
    };
  });

  return (
    <div className="space-y-6 overflow-x-auto">
      {normalized.map(month => (
        <div key={month.name} className="flex gap-4 items-center">
          
          {/* Month label */}
          <div className="w-24 text-sm text-gray-400">
            {month.name}
          </div>

          {/* Heat cells */}
          <div className="flex items-center">
            {month.activity.map((value, day) => {
              const isWeekEnd = (day + 1) % 7 === 0;

              return (
                <div
                  key={day}
                  className={`w-3 h-3 rounded-sm transition
                    ${
                      value === 0
                        ? "bg-gray-700"
                        : value < 2
                        ? "bg-green-400/70"
                        : "bg-green-500"
                    }
                  `}
                  style={{
                    marginRight: isWeekEnd ? "8px" : "2px",
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
