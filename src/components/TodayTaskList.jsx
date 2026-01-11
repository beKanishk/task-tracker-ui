import TaskCard from "./TaskCard";

export default function TodayTaskList({ tasks, onLog, onUndo }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
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
