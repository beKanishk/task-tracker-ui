import TaskCard from "./TaskCard";

export default function TodayTaskList({ tasks, onLog, onUndo }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-6 text-center text-gray-500">
        No tasks planned for today
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        Today’s Focus
      </h2>

      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onLog={onLog}
          onUndo={onUndo}
        />
      ))}
    </div>
  );
}
