import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "learnlink_groups";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const initializedRef = useRef(false);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("[Groups] localStorage.raw:", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        setGroups(parsed);
        console.log("[Groups] Loaded from storage:", parsed);
      } else {
        console.log("[Groups] No data in storage.");
      }
    } catch (err) {
      console.error("[Groups] Error reading localStorage:", err);
    } finally {
      initializedRef.current = true;
    }
  }, []);

  // save on change, but only after initial load
  useEffect(() => {
    if (!initializedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      console.log("[Groups] Saved to storage:", groups);
    } catch (err) {
      console.error("[Groups] Error saving groups:", err);
    }
  }, [groups]);

  const createGroup = () => {
    if (!name.trim()) {
      alert("Group name is required!");
      return;
    }
    const newGroup = {
      id: Date.now(),
      name: name.trim(),
      desc: desc.trim(),
      members: 0,
      joined: false,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setName("");
    setDesc("");
  };

  const toggleJoin = (id) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 }
          : g
      )
    );
  };

  const deleteGroup = (id) => {
    if (!confirm("Delete this group?")) return;
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Study Groups 👥</h1>

      <div className="space-y-3">
        <input className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white" placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full p-3 border rounded-lg bg-gray-100 focus:bg-white" placeholder="Group Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={createGroup} className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600">Create Group</button>
      </div>

      <div className="mt-8 space-y-4">
        {groups.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No groups yet. Create your first one!</p>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="p-5 rounded-xl shadow bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{g.name}</h2>
                  <p className="text-gray-700 mt-1">{g.desc}</p>
                  <p className="text-sm text-gray-600 mt-2">Members: <b>{g.members}</b></p>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <button onClick={() => deleteGroup(g.id)} className="text-red-500 hover:text-red-700 font-bold text-lg">✖</button>
                  <button onClick={() => toggleJoin(g.id)} className={`mt-1 px-4 py-2 rounded-lg text-white font-semibold ${g.joined ? "bg-gray-600 hover:bg-gray-700" : "bg-pink-500 hover:bg-pink-600"}`}>
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
