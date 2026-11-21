import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    let user = null;

    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Failed to parse stored user", e);
    }

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!user || user.role?.toUpperCase() !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;
