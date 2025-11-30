import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-16 px-4">
      <h1 className="text-4xl font-bold">
        Learn <span className="text-pink-500">Together</span>, Grow{" "}
        <span className="text-pink-500">Faster</span> 🚀
      </h1>

      <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
        A community-driven platform where students collaborate, share resources,
        join study groups, and track their learning journey — all in one place.
      </p>

      <Link
        to="/register"
        className="inline-block bg-pink-500 text-white px-6 py-3 mt-6 rounded-xl shadow-lg hover:bg-pink-600 transition"
      >
        Join the Community
      </Link>

      {/* Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
        
        <Link
          to="/resources"
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">📚 Curated Resources</h2>
          <p className="text-gray-600">Find the best videos, articles, and roadmaps.</p>
        </Link>

        <Link
          to="/groups"
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">👥 Study Groups</h2>
          <p className="text-gray-600">Join or create learning groups instantly.</p>
        </Link>

        <Link
          to="/dashboard"
          className="p-6 bg-white shadow rounded-xl text-left hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Progress Dashboard</h2>
          <p className="text-gray-600">Track topics you've completed and what's left.</p>
        </Link>

      </div>
    </div>
  );
}
