import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
