export function normalizeYearHeatmap(yearHeatmaps, year) {
  const monthMap = new Map();

  // Existing months from backend
  yearHeatmaps.forEach(h => {
    monthMap.set(h.month, h);
  });

  // Build full 12 months
  const fullYear = [];

  for (let month = 1; month <= 12; month++) {
    if (monthMap.has(month)) {
      fullYear.push(monthMap.get(month));
    } else {
      fullYear.push({
        year,
        month,
        activity: generateEmptyMonth(year, month),
      });
    }
  }

  return fullYear;
}

function generateEmptyMonth(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array(daysInMonth).fill(0);
}
