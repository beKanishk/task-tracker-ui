export function canLog(task) {
  if (!task) return false;
  console.log("canLog check for task:", task);
  

  if (task.taskType === "BOOLEAN") {
    return task.completedToday !== true;
  }

  if (task.taskType === "QUANTITATIVE") {
    return task.progressPercent !== 100;
  }

  return true;
}