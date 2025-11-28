// /src/context/AuthContext.js

import { createContext, useContext } from "react";

// 1. Define the Context
export const AuthContext = createContext(null);

// 2. Define the Hook
export const useAuth = () => useContext(AuthContext);