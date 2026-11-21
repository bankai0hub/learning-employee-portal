import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminPrograms from "../pages/admin/Programs";
import AdminRegistrations from "../pages/admin/Registrations";
import AdminAttendance from "../pages/admin/Attendance";
import AdminAssessments from "../pages/admin/Assessments";
import AdminFeedback from "../pages/admin/Feedback";

// Employee Pages
import EmployeeDashboard from "../pages/employee/Dashboard";
import AvailablePrograms from "../pages/employee/AvailablePrograms";
import MyRegistrations from "../pages/employee/MyRegistrations";
import MyAttendance from "../pages/employee/MyAttendance";
import MyAssessments from "../pages/employee/MyAssessments";
import MyFeedback from "../pages/employee/MyFeedback";

function DynamicDashboard() {
    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error(e);
    }

    if (user?.role?.toUpperCase() === "ADMIN") {
        return <AdminDashboard />;
    }
    return <EmployeeDashboard />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            {/* General Dashboard Route (Resolves automatically based on Role) */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DynamicDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/programs" element={<AdminRoute><AdminPrograms /></AdminRoute>} />
            <Route path="/admin/registrations" element={<AdminRoute><AdminRegistrations /></AdminRoute>} />
            <Route path="/admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
            <Route path="/admin/assessments" element={<AdminRoute><AdminAssessments /></AdminRoute>} />
            <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />

            {/* Legacy/Shortcut Admin Aliases */}
            <Route path="/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/programs" element={<ProtectedRoute><AdminPrograms /></ProtectedRoute>} />
            <Route path="/registrations" element={<ProtectedRoute><AdminRegistrations /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AdminAttendance /></ProtectedRoute>} />
            <Route path="/assessments" element={<ProtectedRoute><AdminAssessments /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><AdminFeedback /></ProtectedRoute>} />

            {/* Employee Routes */}
            <Route path="/employee/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/programs" element={<ProtectedRoute><AvailablePrograms /></ProtectedRoute>} />
            <Route path="/employee/registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
            <Route path="/employee/attendance" element={<ProtectedRoute><MyAttendance /></ProtectedRoute>} />
            <Route path="/employee/assessments" element={<ProtectedRoute><MyAssessments /></ProtectedRoute>} />
            <Route path="/employee/feedback" element={<ProtectedRoute><MyFeedback /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default AppRoutes;