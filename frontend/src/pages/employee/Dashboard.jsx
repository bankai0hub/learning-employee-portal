import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/StatCard";
import { getRegistrations } from "../../api/registrationApi";
import { getAssessments } from "../../api/assessmentApi";
import { getFeedback } from "../../api/feedbackApi";
import { FaBook, FaCheckCircle, FaGraduationCap, FaCommentAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function EmployeeDashboard() {
    const [user] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error(e);
            return null;
        }
    });

    const [stats, setStats] = useState({
        myRegistrations: 0,
        myAssessments: 0,
        myFeedback: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        Promise.allSettled([getRegistrations(), getAssessments(), getFeedback()])
            .then(([regRes, assRes, feedRes]) => {
                if (ignore) return;
                const regList = regRes.status === "fulfilled" ? (regRes.value?.registrations || regRes.value || []) : [];
                const assList = assRes.status === "fulfilled" ? (assRes.value?.assessments || assRes.value || []) : [];
                const feedList = feedRes.status === "fulfilled" ? (feedRes.value?.feedback || feedRes.value || []) : [];

                setStats({
                    myRegistrations: Array.isArray(regList) ? regList.length : 0,
                    myAssessments: Array.isArray(assList) ? assList.length : 0,
                    myFeedback: Array.isArray(feedList) ? feedList.length : 0,
                });
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <MainLayout>
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "25px" }}>
                <h1 style={{ color: "#0f172a" }}>Welcome back, {user?.name || "Employee"}! 👋</h1>
                <p style={{ color: "#64748b", marginTop: "6px" }}>
                    Track your learning progress, registered programs, attendance, and assessment performance.
                </p>
            </div>

            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <StatCard title="My Enrolled Programs" value={stats.myRegistrations} icon={<FaBook />} />
                        <StatCard title="My Attendance" value="Active" icon={<FaCheckCircle />} />
                        <StatCard title="My Assessment Results" value={stats.myAssessments} icon={<FaGraduationCap />} />
                        <StatCard title="My Feedback" value={stats.myFeedback} icon={<FaCommentAlt />} />
                    </div>

                    <br /><br />

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <h3>Quick Actions</h3>
                            <br />
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Link to="/employee/programs" style={{ color: "#2563eb", fontWeight: "bold" }}>
                                    &rarr; Browse & Register for Available Programs
                                </Link>
                                <Link to="/employee/assessments" style={{ color: "#2563eb", fontWeight: "bold" }}>
                                    &rarr; View My Assessment Scores
                                </Link>
                                <Link to="/employee/feedback" style={{ color: "#2563eb", fontWeight: "bold" }}>
                                    &rarr; Submit Training Feedback
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
}

export default EmployeeDashboard;
