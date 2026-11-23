import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){

    const {isAuthenticated, logout, user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", {replace : true});
    };

    return(
        <nav className="navbar">

            <Link to = {isAuthenticated ? "/students" :"/login" } className = "navbar-logo">Student Management</Link>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>

                        <span className="navbar-username">Welcome, {user?.username || "User"}</span>
                        <Link to = "/students">Students</Link>

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>

                    </>
                ) : (
                    <>
                        <Link to = "/login">Login</Link>
                        <Link to = "/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;