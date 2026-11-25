
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import {
    register,
    verifyRegistration
} from "../services/authService";

import AuthSidebar from "../components/AuthSidebar";

function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [step, setStep] = useState("register");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const passwordRules = [
        {
            label: "At least 8 characters",
            valid: password.length >= 8
        },
        {
            label: "At least one uppercase letter",
            valid: /[A-Z]/.test(password)
        },
        {
            label: "At least one lowercase letter",
            valid: /[a-z]/.test(password)
        },
        {
            label: "At least one number",
            valid: /[0-9]/.test(password)
        },
        {
            label: "At least one special character",
            valid: /[^A-Za-z0-9]/.test(password)
        }
    ];

    const passwordValid = passwordRules.every(rule => rule.valid);

    const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const usernameValid =
        username.trim().length >= 3 &&
        username.trim().length <= 50;

    const handleRegister = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!usernameValid) {
            setError("Username must contain 3 to 50 characters.");
            return;
        }

        if (!emailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!passwordValid) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {

            await register({
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            setStep("otp");

            setSuccess(
                "OTP sent successfully. Please check your email."
            );

        } catch (err) {

            setError(
                err.message || "Unable to start registration."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleVerifyOtp = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {

            await verifyRegistration(
                email.trim().toLowerCase(),
                otp
            );

            alert(
                "Email verified and registration completed successfully! Please log in."
            );

            navigate("/login");

        } catch (err) {

            setError(
                err.message || "OTP verification failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-container">

            <AuthSidebar />

            <form
                className="auth-form"
                onSubmit={
                    step === "register"
                        ? handleRegister
                        : handleVerifyOtp
                }
            >

                {step === "register" ? (

                    <>

                        <h1>Create Account</h1>

                        <p>
                            Register for Student Management System
                        </p>

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            minLength={3}
                            maxLength={50}
                            required
                        />

                        {username.length > 0 && !usernameValid && (
                            <small style={{ color: "red" }}>
                                Username must contain 3 to 50 characters.
                            </small>
                        )}

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {email.length > 0 && !emailValid && (
                            <small style={{ color: "red" }}>
                                Please enter a valid email address.
                            </small>
                        )}


                        <label>Password</label>

                        <div style={{
                            position: "relative",
                            width: "100%",
                            marginBottom: "10px"
                        }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    display: "block",
                                    width: "100%",
                                    minWidth: "0",
                                    boxSizing: "border-box",
                                    padding: "13px 45px 13px 13px",
                                    marginBottom: "0",
                                    color: "#111827",
                                    WebkitTextFillColor: "#111827",
                                    backgroundColor: "#ffffff"
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    padding: "5px",
                                    background: "transparent",
                                    border: "none",
                                    color: "#111827",
                                    cursor: "pointer"
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div style={{
                            marginTop: "8px",
                            fontSize: "13px"
                        }}>
                            {passwordRules.map((rule, index) => (
                                <p
                                    key={index}
                                    style={{
                                        color: rule.valid ? "green" : "#777",
                                        margin: "5px 0"
                                    }}
                                >
                                    {rule.valid ? "✓" : "○"} {rule.label}
                                </p>
                            ))}
                        </div>


                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p style={{ color: "green" }}>
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending OTP..."
                                : "Send Verification OTP"
                            }
                        </button>

                    </>

                ) : (

                    <>

                        <h1>Verify Your Email</h1>

                        <p>
                            Enter the 6-digit OTP sent to
                        </p>

                        <strong>{email}</strong>

                        <label>Verification OTP</label>

                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            inputMode="numeric"
                            maxLength={6}
                            required
                        />

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p style={{ color: "green" }}>
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP & Create Account"
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep("register");
                                setOtp("");
                                setError("");
                                setSuccess("");
                            }}
                            style={{
                                marginTop: "10px",
                                background: "transparent",
                                color: "inherit"
                            }}
                        >
                            Back to Registration
                        </button>

                    </>

                )}

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </form>

        </div>

    );
}

export default RegisterPage;
