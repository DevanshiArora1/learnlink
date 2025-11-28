// useAuth.js

import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Import context from the other file

export const useAuth = () => useContext(AuthContext);