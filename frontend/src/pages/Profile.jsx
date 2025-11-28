import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllGroups, getAllResources } from "../api/resources";

export default function Profile() {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [myResources, setMyResources] = useState([]);

  useEffect(() => {
    async function load() {
      const groups = await getAllGroups();
      const resources = await getAllResources();

      // Groups I created
      setMyGroups(groups.filter((g) => g.createdBy === user.id));

      // Groups I joined
      setJoinedGroups(
        groups.filter((g) => g.joinedUsers.includes(user.id))
      );

      // My added resources
      setMyResources(
        resources.filter((r) => r.createdBy === user.id)
      );
    }

    load();
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">My Profile 👤</h1>

      {/* Basic Info */}
      <div className="bg-gray-50 p-4 rounded mb-8 shadow-inner">
        <p className="text-lg">
          <b>Name:</b> {user.name}
        </p>
        <p className="text-lg">
          <b>Email:</b> {user.email}
        </p>
      </div>

      {/* Groups Created */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Groups I Created</h2>
        {myGroups.length === 0 ? (
          <p className="text-gray-500">You haven't created any groups.</p>
        ) : (
          <div className="space-y-3">
            {myGroups.map((g) => (
              <div key={g._id} className="p-4 bg-gray-50 rounded shadow">
                <h3 className="text-lg font-bold">{g.name}</h3>
                <p>{g.desc}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Members: {g.joinedUsers.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Joined Groups */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Groups I Joined</h2>
        {joinedGroups.length === 0 ? (
          <p className="text-gray-500">You haven't joined any groups.</p>
        ) : (
          <div className="space-y-3">
            {joinedGroups.map((g) => (
              <div key={g._id} className="p-4 bg-gray-50 rounded shadow">
                <h3 className="text-lg font-bold">{g.name}</h3>
                <p>{g.desc}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Members: {g.joinedUsers.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Resources */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Resources I Added</h2>
        {myResources.length === 0 ? (
          <p className="text-gray-500">No resources added yet.</p>
        ) : (
          <div className="space-y-3">
            {myResources.map((r) => (
              <div key={r._id} className="p-4 bg-gray-50 rounded shadow">
                <h3 className="text-lg font-bold">{r.title}</h3>
                <a
                  href={r.link}
                  target="_blank"
                  className="underline text-blue-600"
                >
                  Open Link
                </a>
                <p className="mt-1">{r.desc}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Likes: {r.likes}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
