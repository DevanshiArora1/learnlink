import { useState, useEffect } from "react";
import {
  getResources,
  createResource,
  likeResource,
  deleteResourceAPI,
} from "../api/resources";

export default function Resources() {
  const [resources, setResources] = useState([]);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [linkError, setLinkError] = useState("");

  // Load from backend
  useEffect(() => {
    async function load() {
      const data = await getResources();
      setResources(data);
    }
    load();
  }, []);

  // Add resource to backend
  const addResource = async () => {
    if (!title.trim()) return alert("Title is required");

    let fixedLink = link.trim();
    if (!fixedLink.startsWith("http")) {
      fixedLink = "https://" + fixedLink;
    }

    try {
      new URL(fixedLink);
    } catch {
      setLinkError("Enter a valid link");
      return;
    }

    const newRes = await createResource({
      title: title.trim(),
      link: fixedLink,
      desc,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setResources((prev) => [newRes, ...prev]);

    setTitle("");
    setLink("");
    setDesc("");
    setTags("");
    setLinkError("");
  };

  // Like a resource
  const like = async (id) => {
    const updated = await likeResource(id);
    setResources((prev) =>
      prev.map((r) => (r._id === id ? updated : r))
    );
  };

  // Delete resource
  const deleteResource = async (id) => {
    if (!confirm("Delete this?")) return;
    await deleteResourceAPI(id);
    setResources((prev) => prev.filter((r) => r._id !== id));
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
        className="w-full p-3 border rounded-lg mb-1 bg-gray-100"
        placeholder="Resource Link (https://...)"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          setLinkError("");
        }}
      />

      {linkError && (
        <p className="text-red-500 text-sm mb-3">{linkError}</p>
      )}

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
        onChange={(e) => setTags(e.target.value)}
      />

      <button
        onClick={addResource}
        className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 mt-4"
      >
        Add Resource
      </button>

      {/* List */}
      <div className="mt-8 space-y-4">
        {resources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No resources yet.
          </p>
        ) : (
          resources.map((r) => (
            <div
              key={r._id}
              className="p-4 bg-gray-50 rounded-lg shadow relative border"
            >
              <button
                onClick={() => deleteResource(r._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold">{r.title}</h2>

              <a
                href={r.link}
                target="_blank"
                rel="noopener"
                className="text-blue-600 underline"
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
                onClick={() => like(r._id)}
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
