import { useState, useEffect } from "react";

const STORAGE_KEY = "learnlink_resources";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Load resources once ON PAGE OPEN
  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setResources(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error loading from storage:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // ✅ Save resources to localStorage whenever resources change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    }
  }, [resources, isLoaded]);

  // Add new resource
  const addResource = () => {
    if (!title || !link) {
      alert("Please fill in at least the title and link!");
      return;
    }

    const newItem = {
      id: Date.now(),
      title,
      link,
      desc,
      tags: tags.split(",").map((t) => t.trim()).filter(t => t),
      likes: 0,
    };

    setResources([...resources, newItem]);

    // Clear fields
    setTitle("");
    setLink("");
    setDesc("");
    setTags("");
  };

  const like = (id) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, likes: r.likes + 1 } : r
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        Learning Resources 📚
      </h1>

      {/* Input Section */}
      <input
        className="w-full p-3 border rounded-lg mb-3 bg-gray-100"
        placeholder="Resource Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded-lg mb-3 bg-gray-100"
        placeholder="Resource Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <textarea
        className="w-full p-3 border rounded-lg mb-3 bg-gray-100"
        placeholder="Short Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded-lg mb-4 bg-gray-100"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button
        onClick={addResource}
        className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
      >
        Add Resource
      </button>

      {/* Resource List */}
      <div className="mt-8 space-y-4">
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No resources yet. Add your first one above!</p>
        ) : (
          resources.map((r) => (
            <div key={r.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900">{r.title}</h2>
              <a href={r.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Visit Resource
              </a>
              <p className="mt-2 text-gray-700">{r.desc}</p>

              {r.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {r.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => like(r.id)}
                className="mt-3 px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                ❤️ {r.likes}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}