import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>

      <p className="text-xl mb-2">Something went wrong</p>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        The page doesn’t exist or your session may have expired.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold"
      >
        Go to Login
      </button>
    </div>
  );
}
