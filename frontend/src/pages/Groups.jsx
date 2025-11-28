import { useState, useEffect } from "react";
import {
  getGroups,
  createGroupAPI,
  joinGroupAPI,
  leaveGroupAPI,
  deleteGroupAPI
} from "../api/groups";
import { useAuth } from "../context/AuthContext";

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  // Load groups
  useEffect(() => {
    async function load() {
      const data = await getGroups();
      setGroups(data);
    }
    load();
  }, []);

  // Create group
  const createGroup = async () => {
    if (!name.trim()) return alert("Group name required");

    const newGroup = await createGroupAPI({
      name,
      desc,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });

    setGroups((prev) => [newGroup, ...prev]);

    setName("");
    setDesc("");
    setTags("");
  };

  // Join or leave
  const toggleJoin = async (id, isJoined) => {
    const updated = isJoined
      ? await leaveGroupAPI(id)
      : await joinGroupAPI(id);

    setGroups((prev) => prev.map((g) => (g._id === id ? updated : g)));
  };

  // Delete group
  const deleteGroup = async (id) => {
    if (!confirm("Delete this group?")) return;
    await deleteGroupAPI(id);
    setGroups((prev) => prev.filter((g) => g._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Study Groups 👥</h1>

      {/* Create */}
      <div className="space-y-3 bg-gray-50 p-5 rounded-xl">
        <input
          className="w-full p-2 border rounded"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button
          onClick={createGroup}
          className="w-full py-2 bg-pink-500 text-white rounded"
        >
          Create Group
        </button>
      </div>

      {/* List */}
      <div className="mt-8 space-y-4">
        {groups.length === 0 ? (
          <p className="text-gray-500 text-center">No groups yet.</p>
        ) : (
          groups.map((g) => {
            const isJoined = g.joinedUsers?.includes(user.id);
            const members = g.joinedUsers?.length || 0;

            return (
              <div key={g._id} className="p-4 bg-gray-50 rounded shadow border">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{g.name}</h2>
                    <p>{g.desc}</p>

                    <p className="text-sm mt-2">
                      Members: <b>{members}</b>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {/* Delete only if creator */}
                    {g.createdBy === user.id && (
                      <button
                        onClick={() => deleteGroup(g._id)}
                        className="text-red-500 text-xl"
                      >
                        ✖
                      </button>
                    )}
                    <a
    href={`/groups/${g._id}`}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
  >
    View
  </a>
                    {/* Join / Leave */}
                    <button
                      onClick={() => toggleJoin(g._id, isJoined)}
                      className={`px-4 py-2 rounded text-white ${
                        isJoined ? "bg-gray-600" : "bg-pink-500"
                      }`}
                    >
                      {isJoined ? "Leave Group" : "Join Group"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
