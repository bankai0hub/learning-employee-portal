import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/StatCard";
import ProgramChart from "../../components/ProgramChart";
import AssessmentChart from "../../components/AssessmentChart";
import { getDashboardStats } from "../../api/dashboardApi";
import { FaUsers, FaBook, FaClipboardList, FaGraduationCap, FaCommentAlt } from "react-icons/fa";

function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        programs: 0,
        registrations: 0,
        assessments: 0,
        feedback: 0,
        programChartData: [],
        assessmentChartData: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        getDashboardStats()
            .then((data) => {
                if (!ignore) {
                    setStats(data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <MainLayout>
            <h1>Admin Dashboard</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>System Overview & Real-Time Analytics</p>

            <br />

            {loading ? (
                <p>Loading stats...</p>
            ) : (
                <>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <StatCard title="Total Users" value={stats.users} icon={<FaUsers />} />
                        <StatCard title="Programs" value={stats.programs} icon={<FaBook />} />
                        <StatCard title="Registrations" value={stats.registrations} icon={<FaClipboardList />} />
                        <StatCard title="Assessments" value={stats.assessments} icon={<FaGraduationCap />} />
                        <StatCard title="Feedback Received" value={stats.feedback} icon={<FaCommentAlt />} />
                    </div>

                    <br />
                    <br />

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                        <ProgramChart data={stats.programChartData} />
                        <AssessmentChart data={stats.assessmentChartData} />
                    </div>
                </>
            )}
        </MainLayout>
    );
}

export default AdminDashboard;
