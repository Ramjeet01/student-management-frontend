
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";
import CoursesPage from "./pages/CoursePage";
import FacultyPage from "./pages/FacultyPage";
import AttendancePage from "./pages/AttendencePage";

// Keep the old Navbar on the Students page only.
// Dashboard has its own navbar.
function AppRoutes() {
    const location = useLocation();

    return (
        <>


            <Routes>

                {/* Default page */}
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                {/* Public routes */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/students"
                        element={<StudentPage />}
                    />

                    <Route 
                        path="/courses" 
                        element={<CoursesPage />} 
                    />

                    <Route 
                        path="/faculty" 
                        element={<FacultyPage/>} 
                    />

                    <Route 
                        path="/attendance" 
                        element={<AttendancePage/>} 
                    />

                </Route>

                {/* Unknown routes */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
