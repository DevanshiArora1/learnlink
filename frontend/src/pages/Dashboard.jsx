import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllResources, getAllGroups } from "../api/resources";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    createdResources: 0,
    joinedGroups: 0,
    createdGroups: 0,
    topResource: null,
    monthlyActivity: [],
  });

  useEffect(() => {
    async function load() {
      const resources = await getAllResources();
      const groups = await getAllGroups();

      // Filter by current user
      const myResources = resources.filter(
        (r) => r.createdBy === user.id
      );

      const myCreatedGroups = groups.filter(
        (g) => g.createdBy === user.id
      );

      const myJoinedGroups = groups.filter((g) =>
        g.joinedUsers.includes(user.id)
      );

      // Top liked resource
      const topRes =
        myResources.length > 0
          ? myResources.reduce((max, r) =>
              r.likes > max.likes ? r : max
            )
          : null;

      // Activity timeline: last 6 months
      const months = Array(6)
        .fill(0)
        .map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString("default", { month: "short" });
        })
        .reverse();

      const monthly = months.map((m) => {
        return myResources.filter(
          (r) =>
            new Date(r.createdAt).toLocaleString("default", {
              month: "short",
            }) === m
        ).length;
      });

      setStats({
        createdResources: myResources.length,
        joinedGroups: myJoinedGroups.length,
        createdGroups: myCreatedGroups.length,
        topResource: topRes,
        monthlyActivity: {
          months,
          data: monthly,
        },
      });
    }

    load();
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard 📊</h1>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Resources Added</h2>
          <p className="text-3xl mt-2">{stats.createdResources}</p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Groups Joined</h2>
          <p className="text-3xl mt-2">{stats.joinedGroups}</p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold">Groups Created</h2>
          <p className="text-3xl mt-2">{stats.createdGroups}</p>
        </div>
      </div>

      {/* Top Resource */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-3">
          Most Liked Resource ❤️
        </h2>

        {!stats.topResource ? (
          <p className="text-gray-500">No resources added yet.</p>
        ) : (
          <div>
            <h3 className="text-xl font-bold">{stats.topResource.title}</h3>
            <a
              className="text-blue-600 underline block mt-1"
              href={stats.topResource.link}
              target="_blank"
            >
              Open Resource
            </a>
            <p className="mt-1 text-gray-700">{stats.topResource.desc}</p>
            <p className="mt-2 font-semibold">
              Likes: {stats.topResource.likes}
            </p>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Last 6 Months Activity</h2>

        <div className="grid grid-cols-6 gap-4 text-center">
          {stats.monthlyActivity.months?.map((m, i) => (
            <div key={i}>
              <div className="text-sm text-gray-600">{m}</div>
              <div className="mt-2 text-2xl font-bold">
                {stats.monthlyActivity.data[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
