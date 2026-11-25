
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const isPublicAuthRequest =
        path === "/auth/login" ||
        path === "/auth/register" ||
        path === "/auth/verify-registration" ||
        path === "/auth/forgot-password" ||
        path === "/auth/verify-otp" ||
        path === "/auth/reset-password";

    if (token && !isPublicAuthRequest) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let message = "";

        if (contentType?.includes("application/json")) {
            const data = await response.json();

            message =
                data.message ||
                data.detail ||
                data.title ||
                data.error ||
                (data.errors ? Object.values(data.errors).join(", ") : "");
        } else {
            message = await response.text();
        }

        if (response.status === 401 && path === "/auth/login") {
            message = "Incorrect username or password. Please try again.";
        }

        if (response.status === 409 && !message) {
            message = "This information is already registered.";
        }

        throw new Error(
            message || "Something went wrong. Please try again."
        );
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    return null;
}
