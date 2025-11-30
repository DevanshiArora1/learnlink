import { useState } from "react";
import { registerUser } from "../api/auth";

import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
  try {
    await registerUser({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    navigate("/login");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="flex justify-center mt-16">
  <div className="w-96 bg-white p-6 rounded-xl shadow">
    <h1 className="text-2xl font-bold mb-4">Create Account</h1>

    {error && <p className="text-red-500 mb-3">{error}</p>}

    <input
      className="w-full p-3 border rounded mb-3 bg-gray-100"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      className="w-full p-3 border rounded mb-3 bg-gray-100"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="w-full p-3 border rounded mb-3 bg-gray-100"
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      onClick={submit}
      className="w-full bg-pink-500 text-white py-3 rounded-lg"
    >
      Register
    </button>

    {/* Added text */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Already LearnLinked?{" "}
      <a href="/login" className="text-pink-600 font-semibold hover:underline">
        Login!
      </a>
    </p>

  </div>
</div>

  );
}
