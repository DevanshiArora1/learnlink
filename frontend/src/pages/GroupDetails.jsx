import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import GroupChat from "../components/GroupChat";

export default function GroupDetails() {
  const { id } = useParams(); // groupId from URL
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load group details
  useEffect(() => {
    async function loadGroup() {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data);
      } catch (err) {
        console.error("❌ Error loading group:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGroup();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading group...</p>;
  if (!group) return <p className="text-center mt-10">Group not found</p>;

  const isJoined = group.joinedUsers.includes(user.id);

  const handleJoin = async () => {
    try {
      const res = await api.put(`/groups/${id}/join`);
      setGroup(res.data);
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  const handleLeave = async () => {
    try {
      const res = await api.put(`/groups/${id}/leave`);
      setGroup(res.data);
    } catch (err) {
      console.error("Leave error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Group Info Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>

        {/* FIX: Your groups use "desc", not "description" */}
        <p className="text-gray-600 mt-2">{group.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {group.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Members + Join / Leave */}
        <div className="mt-4 flex items-center gap-4">
          <p className="text-gray-700 font-medium">
            Members: {group.joinedUsers.length}
          </p>

          {!isJoined ? (
            <button
              onClick={handleJoin}
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
            >
              Join Group
            </button>
          ) : (
            <button
              onClick={handleLeave}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Leave Group
            </button>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <GroupChat groupId={id} />
    </div>
  );
}
