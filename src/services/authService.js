import { apiRequest } from "./api";

//Registration
export async function register(userData){
    return await apiRequest(
        "/auth/register",
        {
            method: "POST",
            body:JSON.stringify(userData)
        }
     );

}


// Verify registration OTP
export async function verifyRegistration(email, otp) {
    return await apiRequest(
        "/auth/verify-registration",
        {
            method: "POST",
            body: JSON.stringify({ email, otp })
        }
    );
}


//Login
export async function login(credentials){
    return await apiRequest(
        "/auth/login",
        {
            method: "POST",
            body:JSON.stringify(credentials)
        }
    );
}

// Get currently authenticated user
export async function getCurrentUser() {
    return await apiRequest("/auth/me", {
        method: "GET"
    });
}

// Send OTP to email
export async function forgotPassword(email) {
    return await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
    });
}

// Verify OTP
export async function verifyOtp(email, otp) {
    return await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp })
    });
}

// Reset password
export async function resetPassword(email, newPassword) {
    return await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword })
    });
}

