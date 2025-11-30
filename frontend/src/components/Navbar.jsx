import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-pink-600">
        LearnLink
      </Link>

      <div className="flex gap-6 text-lg">
        <Link to="/">Home</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>

        {!token ? (
          <>
            <Link to="/login" className="text-pink-600 font-semibold">
              Login
            </Link>
            <Link to="/register" className="text-pink-600 font-semibold">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-red-500 font-semibold ml-4"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
