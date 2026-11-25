
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthSidebar from "../components/AuthSidebar";

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {

        event.preventDefault();
        setError("");
        setLoading(true);

        try {

            await login({
                username,
                password
            });

            navigate("/dashboard", { replace: true });

        } catch (err) {

            setError(err.message || "Login failed");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-container">

            <AuthSidebar />

            <form className="auth-form" onSubmit={handleLogin}>

                <h1>Welcome Back</h1>

                <p>Login to your student dashboard</p>

                <label>Username</label>

                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>Password</label>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ flex: 1 }}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            background: "transparent",
                            color: "inherit",
                            border: "none"
                        }}
                    >
                        {showPassword
                            ? <EyeOff size={20} />
                            : <Eye size={20} />
                        }
                    </button>

                </div>

                <p style={{
                    textAlign: "right",
                    marginTop: "8px"
                }}>
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </form>

        </div>
    );
}

export default LoginPage;
