
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>


            <Navbar/>
            <Routes>
                {/* Open login page when the app starts */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Public pages */}
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Protected student dashboard */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/students"
                        element={<StudentPage />}
                    />
                </Route>

                {/* Unknown URLs go to login */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
