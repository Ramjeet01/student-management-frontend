
import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import { login as loginService, getCurrentUser } 
    from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(
        () => Boolean(localStorage.getItem("token"))
    );

    const isAuthenticated = Boolean(token);

    const roles = user?.roles || [];
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");

    // Fetch current user's profile whenever token changes
    useEffect(() => {

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchUser = async () => {
            setLoading(true);

            try {
                const userData = await getCurrentUser();

                if (!cancelled) {
                    setUser(userData);
                }

            } catch (error) {
                if (!cancelled) {
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            cancelled = true;
        };

    }, [token]);

    // Login function
    const login = async (credentials) => {

        const response = await loginService(credentials);

        if (!response?.accessToken) {
            throw new Error("Access token missing");
        }

        localStorage.setItem("token", response.accessToken);

        setToken(response.accessToken);

        return response;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                roles,
                isAdmin,
                isUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
