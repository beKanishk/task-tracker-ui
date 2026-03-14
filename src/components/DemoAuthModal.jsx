import { useNavigate } from "react-router-dom";

export default function DemoAuthModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-sm w-full text-center border border-gray-700 shadow-xl">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2">Create an account to continue</h2>
        <p className="text-gray-400 text-sm mb-6">
          You're exploring the demo. Sign up to create your own tasks and start
          tracking your real habits.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold"
          >
            Sign up — it's free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
          >
            Sign in
          </button>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-sm mt-1"
          >
            Continue exploring demo
          </button>
        </div>
      </div>
    </div>
  );
}
