import { useState } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Synchronously reads and processes all required data from localStorage.
 * This function is used for lazy state initialization to prevent cascading renders.
 */
const initializeDashboardData = () => {
  try {
    // --- Resources Processing ---
    const resources = JSON.parse(
      localStorage.getItem("learnlink_resources") || "[]"
    );
    const resourcesCount = resources.length;

    // Top liked resource
    let topResource = null;
    if (resourcesCount > 0) {
      let best = resources[0];
      for (const r of resources) {
        if ((r.likes || 0) > (best.likes || 0)) best = r;
      }
      if ((best.likes || 0) > 0) topResource = best;
    }

    // Tags
    const tagFreq = {};
    resources.forEach((r) => {
      (r.tags || []).forEach((t) => {
        tagFreq[t] = (tagFreq[t] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Timeline (last 6 months)
    const bucketMap = {};
    const timeline = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      bucketMap[key] = {
        key,
        label: `${monthNames[d.getMonth()]}`,
        count: 0,
      };
      timeline.push(bucketMap[key]);
    }

    resources.forEach((r) => {
      if (!r.addedAt) return;
      const d = new Date(r.addedAt);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (bucketMap[key]) {
        bucketMap[key].count += 1;
      }
    });

    // --- Groups Processing ---
    const groups = JSON.parse(localStorage.getItem("learnlink_groups") || "[]");
    const groupsCount = groups.length;
    const joinedGroups = groups.filter((g) => g.joined).length;

    // --- Profile Processing ---
    const profile = JSON.parse(
      localStorage.getItem("learnlink_profile") || "{}"
    );

    // --- Return Consolidated Data ---
    return {
      resourcesCount,
      groupsCount,
      joinedGroups,
      topTags,
      timeline,
      topResource,
      profile,
    };
  } catch (e) {
    console.error("Dashboard initialization error:", e);
    // Return default state on error
    return {
      resourcesCount: 0,
      groupsCount: 0,
      joinedGroups: 0,
      topTags: [],
      timeline: [],
      topResource: null,
      profile: { name: "" },
    };
  }
};

export default function Dashboard() {
  // 1. CONSOLIDATED LAZY INITIALIZATION: All stats loaded here, removing the need for useEffect to set initial state.
  const [data] = useState(initializeDashboardData);

  // The entire useEffect hook is removed, resolving the ESLint warning and cascading renders.

  const {
    resourcesCount,
    groupsCount,
    joinedGroups,
    topTags,
    timeline,
    topResource,
    profile,
  } = data;

  const engagementRate =
    groupsCount > 0 ? Math.round((joinedGroups * 100) / groupsCount) : 0;

  const nextActionText =
    resourcesCount === 0 && groupsCount === 0
      ? "Start by adding your first learning resource or creating a group."
      : resourcesCount === 0
      ? "You’ve created groups — now add your first resource to share with others."
      : groupsCount === 0
      ? "You’ve added resources — next, create or join a study group!"
      : "Keep the momentum going — share a new resource or engage in one of your groups today.";

  const maxTimelineCount = timeline.reduce(
    (max, b) => (b.count > max ? b.count : max),
    0
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard 📊</h1>

      <p className="text-lg text-gray-700 mb-6">
        Welcome back,{" "}
        <span className="font-semibold">{profile.name || "Learner"}</span>
        👋
      </p>

      {/* Top stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-5 bg-pink-50 border rounded-xl shadow text-center">
          <h2 className="text-3xl font-bold text-pink-600">{resourcesCount}</h2>
          <p className="font-medium text-gray-700">Resources Added</p>
        </div>

        <div className="p-5 bg-blue-50 border rounded-xl shadow text-center">
          <h2 className="text-3xl font-bold text-blue-600">{groupsCount}</h2>
          <p className="font-medium text-gray-700">Groups Created</p>
        </div>

        <div className="p-5 bg-green-50 border rounded-xl shadow text-center">
          <h2 className="text-3xl font-bold text-green-600">{joinedGroups}</h2>
          <p className="font-medium text-gray-700">Groups Joined</p>
        </div>
      </div>

      {/* Resource activity section */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {/* Timeline */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resources Added (Last 6 Months)
          </h2>
          {resourcesCount === 0 ? (
            <p className="text-gray-500 text-sm">
              No resources yet. Add some to see your activity here.
            </p>
          ) : (
            <div className="flex items-end gap-3 mt-4 h-32">
              {timeline.map((b) => (
                <div
                  key={b.key}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div className="w-full bg-pink-50 rounded-lg flex items-end justify-center overflow-hidden h-24">
                    <div
                      className="w-3/4 bg-pink-500 rounded-t-lg transition-all"
                      style={{
                        height:
                          maxTimelineCount > 0
                            ? `${(b.count / maxTimelineCount) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="mt-1 text-xs text-gray-600">{b.label}</span>
                  <span className="text-xs text-gray-500">{b.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top liked resource */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Top Liked Resource
          </h2>
          {!topResource ? (
            <p className="text-gray-500 text-sm">
              No liked resources yet. Start liking or adding resources!
            </p>
          ) : (
            <div className="p-4 bg-gray-50 border rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">
                {topResource.title}
              </h3>
              <a
                href={topResource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Visit Resource
              </a>
              <p className="mt-2 text-gray-700 text-sm">
                Likes: <b>{topResource.likes}</b>
              </p>
              {topResource.tags && topResource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topResource.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags + Engagement */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {/* Popular tags */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Popular Tags
          </h2>
          {topTags.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tags yet. Add tags to your resources to organize them.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3 mt-2">
              {topTags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                >
                  #{tag} — {count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Engagement */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Group Engagement
          </h2>
          <p className="text-sm text-gray-700 mb-2">
            Engagement Rate:{" "}
            <span className="font-semibold">{engagementRate}%</span>
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-green-500"
              style={{ width: `${engagementRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-700">{nextActionText}</p>
        </div>
      </div>
    </div>
  );
}
