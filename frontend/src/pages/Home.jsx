import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const { token } = useAuth();

  return (
    <div className="text-center mt-16 px-4">
      <h1 className="text-4xl font-bold">
        Learn <span className="text-pink-500">Together</span>, Grow{" "}
        <span className="text-pink-500">Faster</span> 🚀
      </h1>

      <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
        A student community where you collaborate, join study groups, share
        resources, and track your learning progress.
      </p>

      {/* If not logged in, show Join + Login buttons */}
      {!token && (
        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/register"
            className="bg-pink-500 text-white px-6 py-3 rounded-xl shadow hover:bg-pink-600"
          >
            Register
          </Link>

          <Link
            to="/login"
            className="border border-pink-500 text-pink-500 px-6 py-3 rounded-xl hover:bg-pink-50"
          >
            Login
          </Link>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">

        <Link
          to={token ? "/resources" : "/login"}
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">📚 Curated Resources</h2>
          <p className="text-gray-600">
            Find helpful videos, articles, roadmaps, and shared learning content.
          </p>
        </Link>

        <Link
          to={token ? "/groups" : "/login"}
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">👥 Study Groups</h2>
          <p className="text-gray-600">
            Join high-energy study groups and chat in real time.
          </p>
        </Link>

        <Link
          to={token ? "/dashboard" : "/login"}
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Progress Dashboard</h2>
          <p className="text-gray-600">
            Keep track of your learning over time.
          </p>
        </Link>

      </div>
    </div>
  );
}
