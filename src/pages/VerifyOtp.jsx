
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import AuthSidebar from "../components/AuthSidebar";

function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await verifyOtp(email, otp);

            navigate("/reset-password", {
                state: { email }
            });
        } catch (err) {
            setError(err.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="auth-container">
                <AuthSidebar />
                <div className="auth-form">
                    <h1>OTP Verification</h1>
                    <p>Please request an OTP first.</p>
                    <Link to="/forgot-password">Go back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <AuthSidebar />

            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Verify OTP</h1>
                <p>Enter the 6-digit OTP sent to {email}</p>

                <label>One-Time Password</label>
                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    inputMode="numeric"
                    required
                />

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p>
                    <Link to="/forgot-password">Request another OTP</Link>
                </p>
            </form>
        </div>
    );
}

export default VerifyOtp;
