// /src/context/AuthProvider.jsx

// Corrected import: We only need useState here now.
import { useState } from "react"; 
import api from "../api/axios";

// Import AuthContext from the separate context file
import { AuthContext } from "./AuthContext"; 

// Helper function to initialize user state lazily
const initializeUser = () => {
    const savedUser = localStorage.getItem("learnlink_user");
    return savedUser ? JSON.parse(savedUser) : null;
};

// Helper function to initialize loading state lazily
const initializeLoading = () => {
    const initialToken = localStorage.getItem("learnlink_token");
    return !!initialToken; 
};


export function AuthProvider({ children }) {
    // 1. LAZY INITIALIZATION 
    const [token, setToken] = useState(
        () => localStorage.getItem("learnlink_token") || ""
    );
    const [user, setUser] = useState(initializeUser);
    const [loading, setLoading] = useState(initializeLoading); 

    // The problematic useEffect hook is now correctly REMOVED.

    const login = (userData, tokenData) => {
    setToken(tokenData);
    setUser(userData);

    localStorage.setItem("learnlink_token", tokenData);
    localStorage.setItem("learnlink_user", JSON.stringify(userData));

    setLoading(false);
};


    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await api.post("/api/auth/register", { name, email, password });
            const { token: newToken, user: newUser } = res.data;

            setToken(newToken);
            setUser(newUser);

            localStorage.setItem("learnlink_token", newToken);
            localStorage.setItem("learnlink_user", JSON.stringify(newUser));
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken("");
        setUser(null);
        setLoading(false); 
        
        localStorage.removeItem("learnlink_token");
        localStorage.removeItem("learnlink_user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}