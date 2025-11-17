export default function Home() {
  return (
    <div className="mt-16 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900">
        Learn <span className="text-pink-500">Together</span>,  
        Grow <span className="text-pink-500">Faster</span> 🚀
      </h1>

      <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
        A community-driven platform where students collaborate, share resources,  
        form study groups, and track their progress — all in one place.
      </p>

      <button className="mt-8 px-8 py-3 bg-pink-500 text-white rounded-xl shadow-lg hover:bg-pink-600 transition">
        Join the Community
      </button>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 px-10">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📚 Curated Resources</h2>
          <p className="text-gray-600">Find the best videos, articles, and roadmaps.</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">👥 Study Groups</h2>
          <p className="text-gray-600">Join or create learning groups in seconds.</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📊 Progress Dashboard</h2>
          <p className="text-gray-600">Track topics you've completed and what's left.</p>
        </div>
      </div>
    </div>
  );
}
