import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import StatCard from "../components/StatCard";

import ProgramChart from "../components/ProgramChart";

import AssessmentChart from "../components/AssessmentChart";

import { getDashboardStats } from "../api/dashboardApi";
import {
    FaUsers,
    FaBook,
    FaClipboardList,
} from "react-icons/fa";

function Dashboard() {
    const [stats, setStats] = useState({
        users: 0,
        programs: 0,
        registrations: 0,
    });

    useEffect(() => {
        let ignore = false;
        getDashboardStats().then((data) => {
            if (!ignore) {
                setStats(data);
            }
        });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <MainLayout>
            <h1>Dashboard</h1>

            <br />

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                <StatCard
                    title="Users"
                    value={stats.users}
                    icon={<FaUsers />}
                />

                <StatCard
                    title="Programs"
                    value={stats.programs}
                    icon={<FaBook />}
                />

                <StatCard
                    title="Registrations"
                    value={stats.registrations}
                    icon={<FaClipboardList />}
                />
            </div>

            <br />

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                <ProgramChart />

                <AssessmentChart />
            </div>
        </MainLayout>
    );
}

export default Dashboard;