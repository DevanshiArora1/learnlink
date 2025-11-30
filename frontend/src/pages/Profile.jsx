import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getAllResources,getAllGroups } from "../api/resources";


export default function Profile() {
  const { user, logout } = useAuth();

  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [myResources, setMyResources] = useState([]);

  useEffect(() => {
    async function load() {
      const groups = await getAllGroups();
      const resources = await getAllResources();

      setMyGroups(groups.filter((g) => g.createdBy === user.id));
      setJoinedGroups(groups.filter((g) => g.joinedUsers.includes(user.id)));
      setMyResources(resources.filter((r) => r.createdBy === user.id));
    }

    load();
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">
        Welcome, <span className="text-pink-500">{user.name}</span> 👋
      </h1>

      {/* User Info Card */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-10">
        <h2 className="text-2xl font-semibold mb-3">Profile Details</h2>

        <p className="text-lg">
          <b>Name:</b> {user.name}
        </p>
        <p className="text-lg mt-1">
          <b>Email:</b> {user.email}
        </p>
      </div>

      {/* Groups Created */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Groups I Created</h2>

        {myGroups.length === 0 ? (
          <p className="text-gray-500">You haven't created any groups.</p>
        ) : (
          <div className="space-y-3">
            {myGroups.map((g) => (
              <div key={g._id} className="p-5 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-bold">{g.name}</h3>
                <p className="mt-1 text-gray-700">{g.desc}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Members: {g.joinedUsers.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Groups Joined */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Groups I Joined</h2>

        {joinedGroups.length === 0 ? (
          <p className="text-gray-500">You haven't joined any groups yet.</p>
        ) : (
          <div className="space-y-3">
            {joinedGroups.map((g) => (
              <div key={g._id} className="p-5 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-bold">{g.name}</h3>
                <p className="mt-1 text-gray-700">{g.desc}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Members: {g.joinedUsers.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resources Added */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Resources I Added</h2>

        {myResources.length === 0 ? (
          <p className="text-gray-500">You haven't added any resources yet.</p>
        ) : (
          <div className="space-y-3">
            {myResources.map((r) => (
              <div key={r._id} className="p-5 bg-gray-50 rounded-xl shadow">
                <h3 className="text-xl font-bold">{r.title}</h3>

                <a
                  href={r.link}
                  target="_blank"
                  className="text-blue-600 underline block mt-1"
                >
                  Open Resource
                </a>

                <p className="mt-2 text-gray-700">{r.desc}</p>

                <p className="text-sm mt-2 text-gray-600">Likes: {r.likes}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout Button */}
      <div className="text-right">
        <button
          onClick={logout}
          className="mt-10 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
