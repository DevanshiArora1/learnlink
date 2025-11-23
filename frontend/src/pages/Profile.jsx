import { useState, useEffect } from "react";

const STORAGE_KEY = "learnlink_profile";

/**
 * Synchronously reads, parses, and normalizes profile data from localStorage.
 * This function is used to lazily initialize the 'profile' state, avoiding
 * cascading renders on component mount.
 */
const initializeProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Return the default structure if nothing is saved
      return { name: "", bio: "", skills: [], goals: [] };
    }

    const parsed = JSON.parse(saved);

    const normalized = {
      name: parsed.name || "",
      bio: parsed.bio || "",
      skills: [],
      goals: [],
    };

    // --- Normalization Logic (Handles legacy string formats) ---

    // Normalize skills
    if (Array.isArray(parsed.skills)) {
      if (parsed.skills.length > 0 && typeof parsed.skills[0] === "string") {
        // If old string array format
        normalized.skills = parsed.skills.map((s) => ({
          name: s,
          level: "Intermediate",
        }));
      } else if (
        parsed.skills.length > 0 &&
        typeof parsed.skills[0] === "object"
      ) {
        // If modern object array format
        normalized.skills = parsed.skills;
      }
    } else if (typeof parsed.skills === "string") {
      // If comma-separated string format
      normalized.skills = parsed.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name, level: "Intermediate" }));
    }

    // Normalize goals
    if (Array.isArray(parsed.goals)) {
      if (parsed.goals.length > 0 && typeof parsed.goals[0] === "string") {
        // If old string array format
        normalized.goals = parsed.goals.map((text, idx) => ({
          id: idx + 1,
          text,
          completed: false,
        }));
      } else if (
        parsed.goals.length > 0 &&
        typeof parsed.goals[0] === "object"
      ) {
        // If modern object array format
        normalized.goals = parsed.goals;
      }
    } else if (typeof parsed.goals === "string") {
      // If newline-separated string format
      normalized.goals = parsed.goals
        .split("\n")
        .map((g) => g.trim())
        .filter(Boolean)
        .map((text, idx) => ({ id: idx + 1, text, completed: false }));
    }

    return normalized;
  } catch (err) {
    console.error("[Profile] Failed to initialize:", err);
    // Return default state on parse error
    return { name: "", bio: "", skills: [], goals: [] };
  }
};

export default function Profile() {
  // 1. LAZY INITIALIZATION: Load data once here to avoid useEffect/cascading renders
  const [profile, setProfile] = useState(initializeProfile);

  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [goalInput, setGoalInput] = useState("");

  // 2. DEBOUNCED SAVE: Use timeout to prevent writing to localStorage on every keystroke
  useEffect(() => {
    // Set a timer to save the profile data after 500ms
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {
        console.error("[Profile] Failed to save:", err);
      }
    }, 500); // Wait 500 milliseconds after the last change

    // Cleanup function: Clears the timer if 'profile' changes again before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [profile]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const getInitials = () => {
    if (!profile.name.trim()) return "LL";
    return profile.name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const addSkill = () => {
    const name = skillInput.trim().toLowerCase();
    if (!name) return;
    if (profile.skills.some((s) => s.name === name)) return;

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name, level: skillLevel }],
    }));
    setSkillInput("");
    setSkillLevel("Intermediate");
  };

  const removeSkill = (name) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== name),
    }));
  };

  const updateSkillLevel = (name, level) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.name === name ? { ...s, level } : s)),
    }));
  };

  const addGoal = () => {
    const text = goalInput.trim();
    if (!text) return;
    const newGoal = {
      id: Date.now(),
      text,
      completed: false,
    };
    setProfile((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
    setGoalInput("");
  };

  const toggleGoal = (id) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  };

  const removeGoal = (id) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const totalGoals = profile.goals.length;
  const completedGoals = profile.goals.filter((g) => g.completed).length;
  const goalPercent = totalGoals
    ? Math.round((completedGoals * 100) / totalGoals)
    : 0;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Profile 👤</h1>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl font-bold">
          {getInitials()}
        </div>
        <input
          className="flex-1 p-3 border rounded-lg bg-gray-100"
          placeholder="Your Name"
          name="name"
          value={profile.name}
          onChange={handleFieldChange}
        />
      </div>

      {/* Bio */}
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Bio
      </label>
      <textarea
        className="w-full p-3 border rounded-lg bg-gray-100 mb-4"
        placeholder="Short bio (who are you, what do you like learning?)"
        name="bio"
        value={profile.bio}
        onChange={handleFieldChange}
      />

      {/* Skills */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            className="flex-1 p-3 border rounded-lg bg-gray-100"
            placeholder="Skill name (e.g. react, dsa)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <select
            className="p-3 border rounded-lg bg-gray-100"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
          >
            Add Skill
          </button>
        </div>

        {profile.skills.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No skills added yet. Start by adding what you're learning.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full"
              >
                <span className="text-sm font-medium text-pink-700">
                  {s.name}
                </span>
                <select
                  className="text-xs bg-transparent border-none outline-none text-gray-700"
                  value={s.level}
                  onChange={(e) => updateSkillLevel(s.name, e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <button
                  onClick={() => removeSkill(s.name)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Learning Goals
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            className="flex-1 p-3 border rounded-lg bg-gray-100"
            placeholder="e.g. Finish React basics, Solve 50 DSA problems"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
          <button
            onClick={addGoal}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600"
          >
            Add Goal
          </button>
        </div>

        {profile.goals.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No goals yet. Add a few to track your progress.
          </p>
        ) : (
          <ul className="space-y-2">
            {profile.goals.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={g.completed}
                    onChange={() => toggleGoal(g.id)}
                  />
                  <span
                    className={
                      "text-sm " +
                      (g.completed ? "line-through text-gray-400" : "")
                    }
                  >
                    {g.text}
                  </span>
                </label>
                <button
                  onClick={() => removeGoal(g.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-1">
            Goal Progress: <span className="font-semibold">{goalPercent}%</span>{" "}
            ({completedGoals}/{totalGoals})
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-green-600 font-medium text-sm">Auto-saved ✅</p>
    </div>
  );
}
