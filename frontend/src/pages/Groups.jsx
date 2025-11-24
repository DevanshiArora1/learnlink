import { useState, useEffect } from "react";

const STORAGE_KEY = "learnlink_groups";

// Function to handle initial state loading from localStorage
const initializeGroups = () => {
  // Check for window to handle SSR environments
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // Ensure raw data is not null before parsing
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[Groups] Failed to read localStorage:", err);
    return [];
  }
};

export default function Groups() {
  // Load initial groups safely using initializer function
  const [groups, setGroups] = useState(initializeGroups);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  const canUseStorage = typeof window !== "undefined" && !!window.localStorage;

  // Save to storage when groups change (DEBOUNCED)
  useEffect(() => {
    if (!canUseStorage) return;

    // Set a timer to save the profile data after 500ms
    const handler = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (err) {
        console.error("[Groups] Error saving:", err);
      }
    }, 500); // 500ms delay

    // Cleanup: clear the previous timer if groups changes again
    return () => {
      clearTimeout(handler);
    };
  }, [groups, canUseStorage]);

  // Create a new group
  const createGroup = () => {
    if (!name.trim()) {
      alert("Group name is required!");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: name.trim(),
      desc: desc.trim(),
      createdAt: new Date().toLocaleString(),
      joined: false,
      members: 0,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    setGroups((prev) => [newGroup, ...prev]);
    setName("");
    setDesc("");
    setTags("");
  };

  // Toggle joining
  const toggleJoin = (id) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              joined: !g.joined,
              // Correctly increment/decrement members based on new joined state
              members: !g.joined ? g.members + 1 : g.members - 1,
            }
          : g
      )
    );
  };

  // Delete group
  const deleteGroup = (id) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Study Groups 👥
      </h1>

      {/* Input Section */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-xl shadow-inner border border-gray-200">
        <input
          className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-pink-400"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-pink-400"
          placeholder="Group Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-pink-400"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button
          onClick={createGroup}
          className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 shadow"
        >
          Create Group
        </button>
      </div>

      {/* Group List */}
      <div className="mt-8 space-y-4">
        {groups.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No groups yet. Create your first one!
          </p>
        ) : (
          groups.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-xl shadow bg-gray-50 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {g.name}
                  </h2>
                  <p className="text-gray-700 mt-1">{g.desc}</p>

                  {/* Tags */}
                  {g.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {g.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    Created: <b>{g.createdAt}</b>
                  </p>
                  <p className="text-sm text-gray-600">
                    Members: <b>{g.members}</b>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => deleteGroup(g.id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ✖
                  </button>

                  <button
                    onClick={() => toggleJoin(g.id)}
                    className={`px-4 py-2 rounded-lg text-white font-semibold ${
                      g.joined
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-pink-500 hover:bg-pink-600"
                    }`}
                  >
                    {g.joined ? "Leave Group" : "Join Group"}
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
