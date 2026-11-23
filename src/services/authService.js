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