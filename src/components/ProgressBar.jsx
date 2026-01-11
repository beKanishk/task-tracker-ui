export default function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-700 rounded h-2 mt-2">
      <div
        className="bg-green-500 h-2 rounded"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
