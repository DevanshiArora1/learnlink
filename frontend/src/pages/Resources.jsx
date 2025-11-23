import { useState, useEffect } from "react";

const STORAGE_KEY = "learnlink_resources";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // ---------------- LOCAL STORAGE (UNCHANGED) ----------------
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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    }
  }, [resources, isLoaded]);
  // -------------------------------------------------------------

  // EXTRA UI STATES
  const [linkError, setLinkError] = useState("");
  const [titleError, setTitleError] = useState(""); // <-- NEW STATE FOR TITLE ERROR
  const [filteredTags, setFilteredTags] = useState([]);

  const SUGGESTED_TAGS = [
    "react",
    "javascript",
    "webdev",
    "frontend",
    "backend",
    "dsa",
    "cpp",
    "python",
    "machine-learning",
    "cloud",
    "system-design",
  ];

  // SIMPLE LINK VALIDATION (UNCHANGED from previous fix)
  const validateAndFixLink = (raw) => {
    // 1. Check for empty input FIRST
    if (!raw.trim()) return "empty";

    let fixed = raw.trim();

    // 2. Auto-add https://
    if (!fixed.startsWith("http://") && !fixed.startsWith("https://")) {
      fixed = "https://" + fixed;
    }

    // 3. Check if it's a valid URL format using the URL constructor
    try {
      new URL(fixed);
    } catch {
      return false;
    }

    // 4. STRICTER CHECK: Ensure it has at least one dot ('.') for a domain/TLD
    const domainPattern = /\.[a-z]{2,24}(\/|$)/i;
    const urlParts = fixed.replace(/https?:\/\//i, "");

    if (!domainPattern.test(urlParts)) {
      return false;
    }

    return fixed;
  };

  // Tag input logic (unchanged)
  const handleTagInput = (value) => {
    setTags(value);
    const last = value.split(",").pop().trim().toLowerCase();

    if (!last) {
      setFilteredTags([]);
      return;
    }

    const suggestions = SUGGESTED_TAGS.filter(
      (tag) =>
        tag.startsWith(last) && !value.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 6);

    setFilteredTags(suggestions);
  };

  const addTagSuggestion = (tag) => {
    let t = tags
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x);

    if (!t.includes(tag)) t.push(tag);

    setTags(t.join(", ") + ", ");
    setFilteredTags([]);
  };

  // ---------------- ADD RESOURCE (UPDATED) ----------------
  const addResource = () => {
    // 1. Title Validation (Now sets state instead of using alert)
    if (!title.trim()) {
      setTitleError("⚠ Title not entered. Please provide a title.");
      return;
    } else {
      setTitleError(""); // Clear title error if title is filled
    }

    const fixedLink = validateAndFixLink(link);

    // Clear link error when starting validation
    setLinkError("");

    // 2. Link Validation
    if (fixedLink === "empty") {
      setLinkError("⚠ Link not entered. Please provide a URL.");
      return;
    }

    if (fixedLink === false) {
      setLinkError(
        "⚠ Enter a valid link (must include a domain/TLD, like 'example.com')"
      );
      return;
    }

    const newItem = {
      id: Date.now(),
      title: title.trim(),
      link: fixedLink,
      desc,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t),
      likes: 0,
    };

    setResources([...resources, newItem]);

    // Clear fields
    setTitle("");
    setLink("");
    setDesc("");
    setTags("");
    setFilteredTags([]);
    setLinkError("");
  };

  const like = (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const deleteResource = (id) => {
    if (!confirm("Delete this resource?")) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        Learning Resources 📚
      </h1>

      {/* Inputs */}
      <input
        className="w-full p-3 border rounded-lg mb-1 bg-gray-100" // mb-3 changed to mb-1
        placeholder="Resource Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setTitleError(""); // Clear error when typing
        }}
      />
      {/* Title Error Display */}
      {titleError && <p className="text-red-500 text-sm mb-3">{titleError}</p>}

      <input
        className="w-full p-3 border rounded-lg mb-1 bg-gray-100"
        placeholder="Resource Link (example: leetcode.com)"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          setLinkError(""); // clear when typing
        }}
      />
      {linkError && <p className="text-red-500 text-sm mb-3">{linkError}</p>}

      <textarea
        className="w-full p-3 border rounded-lg mb-3 bg-gray-100"
        placeholder="Short Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded-lg bg-gray-100"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => handleTagInput(e.target.value)}
      />

      {/* Tag Suggestions */}
      {filteredTags.length > 0 && (
        <div className="mt-2 bg-white border rounded-lg shadow p-3">
          <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
              <button
                key={tag}
                onClick={() => addTagSuggestion(tag)}
                className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={addResource}
        className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 mt-4"
      >
        Add Resource
      </button>

      {/* Resource Cards */}
      <div className="mt-8 space-y-4">
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No resources yet. Add your first one above!
          </p>
        ) : (
          resources.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-gray-50 rounded-lg shadow relative border"
            >
              {/* Delete button */}
              <button
                onClick={() => deleteResource(r.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold text-gray-900">{r.title}</h2>

              <a
                href={r.link}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
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
