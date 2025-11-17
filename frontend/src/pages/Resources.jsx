import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "learnlink_resources";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  // ref to indicate initial load done (don't save until load finished)
  const initializedRef = useRef(false);

  // Load saved resources once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("[Resources] localStorage.raw:", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        setResources(parsed);
        console.log("[Resources] Loaded from storage:", parsed);
      } else {
        console.log("[Resources] No data in storage yet.");
      }
    } catch (err) {
      console.error("[Resources] Error reading localStorage:", err);
    } finally {
      initializedRef.current = true;
    }
  }, []);

  // Save to localStorage whenever resources change (but only after initial load)
  useEffect(() => {
    if (!initializedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
      console.log("[Resources] Saved to storage:", resources);
    } catch (err) {
      console.error("[Resources] Error saving to localStorage:", err);
    }
  }, [resources]);

  const addResource = () => {
    if (!title.trim() || !link.trim()) {
      alert("Please enter at least a title and a link.");
      return;
    }
    const newItem = {
      id: Date.now(),
      title: title.trim(),
      link: link.trim(),
      desc: desc.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 0,
    };
    // prepend new item so newest appears on top
    setResources((prev) => [newItem, ...prev]);
    setTitle("");
    setLink("");
    setDesc("");
    setTags("");
  };

  const likeResource = (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
  };

  const deleteResource = (id) => {
    if (!confirm("Delete this resource?")) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Resources 📚</h1>

      <div className="space-y-3">
        <input
          className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white"
          placeholder="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white"
          placeholder="Resource Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <textarea
          className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white"
          placeholder="Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white"
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
      </div>

      <div className="mt-10 space-y-5">
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No resources yet.</p>
        ) : (
          resources.map((r) => (
            <div key={r.id} className="p-5 bg-gray-50 rounded-xl shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{r.title}</h2>
                  <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                    Visit Resource
                  </a>
                  <p className="mt-2 text-gray-700">{r.desc}</p>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.tags.map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <button
                    onClick={() => deleteResource(r.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    aria-label="Delete resource"
                  >
                    ✖
                  </button>

                  <button
                    onClick={() => likeResource(r.id)}
                    className="mt-1 px-4 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                  >
                    ❤️ {r.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
