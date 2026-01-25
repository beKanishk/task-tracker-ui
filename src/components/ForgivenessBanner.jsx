import api from "../api/axios";


export default function ForgivenessBanner({ onDecision }) {
  async function accept() {
    await api.post("/api/streak/forgiveness/accept");
    onDecision();
  }

  async function decline() {
    await api.post("/api/streak/forgiveness/decline");
    onDecision();
  }

  return (
    <div className="bg-yellow-900/40 border border-yellow-600 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <p className="font-semibold text-yellow-300">
          ⚠ You missed a day
        </p>
        <p className="text-sm text-gray-300">
          You can use forgiveness to keep your streak alive — or reset it.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={accept}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
        >
          Use Forgiveness
        </button>

        <button
          onClick={decline}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Reset Streak
        </button>
      </div>
    </div>
  );
}
