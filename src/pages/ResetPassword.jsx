
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { resetPassword } from "../services/authService";
import AuthSidebar from "../components/AuthSidebar";

function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordValid = password.length >= 8;
    const passwordsMatch =
        confirmPassword.length > 0 &&
        password === confirmPassword;

    const handleSubmit = async (event) => {

        event.preventDefault();
        setError("");

        if (!passwordValid) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await resetPassword(email, password);

            alert("Password reset successfully! Please log in.");

            navigate("/login", { replace: true });

        } catch (err) {

            setError(err.message || "Password reset failed");

        } finally {

            setLoading(false);

        }
    };

    if (!email) {

        return (
            <div className="auth-container">

                <AuthSidebar />

                <div className="auth-form">
                    <h1>Reset Password</h1>
                    <p>Please complete OTP verification first.</p>
                    <Link to="/forgot-password">Go back</Link>
                </div>

            </div>
        );
    }

    return (

        <div className="auth-container">

            <AuthSidebar />

            <form className="auth-form" onSubmit={handleSubmit}>

                <h1>Reset Password</h1>

                <p>Create a new password for {email}</p>

                <label>New Password</label>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ flex: 1 }}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle new password visibility"
                        style={{
                            padding: "10px",
                            background: "transparent",
                            color: "inherit",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {showPassword
                            ? <EyeOff size={20} />
                            : <Eye size={20} />
                        }
                    </button>

                </div>

                <p style={{
                    color: passwordValid ? "green" : "#777",
                    fontSize: "13px"
                }}>
                    {passwordValid ? "✓" : "○"}
                    {" "}Password must contain at least 8 characters.
                </p>

                <label>Confirm Password</label>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ flex: 1 }}
                        required
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label="Toggle confirm password visibility"
                        style={{
                            padding: "10px",
                            background: "transparent",
                            color: "inherit",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {showConfirmPassword
                            ? <EyeOff size={20} />
                            : <Eye size={20} />
                        }
                    </button>

                </div>

                {confirmPassword.length > 0 && (
                    <p style={{
                        color: passwordsMatch ? "green" : "red",
                        fontSize: "13px"
                    }}>
                        {passwordsMatch
                            ? "✓ Passwords match"
                            : "✗ Passwords do not match"}
                    </p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

            </form>

        </div>
    );
}

export default ResetPassword;
