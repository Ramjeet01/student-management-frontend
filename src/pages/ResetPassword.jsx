
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import AuthSidebar from "../components/AuthSidebar";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
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
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                />

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
