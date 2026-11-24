
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import AuthSidebar from "../components/AuthSidebar";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await forgotPassword(email);

            alert("If this email is registered, an OTP has been sent.");

            navigate("/verify-otp", {
                state: { email }
            });
        } catch (err) {
            setError(err.message || "Unable to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <AuthSidebar />

            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Forgot Password?</h1>
                <p>Enter your registered email to receive an OTP.</p>

                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <p>
                    Remember your password?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default ForgotPassword;
