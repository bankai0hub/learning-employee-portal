import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAttendance } from "../../api/attendanceApi";
import { showToast } from "../../utils/toast";

function AdminAttendance() {
    const [programId, setProgramId] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const loadAttendance = async () => {
        if (!programId.trim()) {
            showToast("Please enter a valid Program ID", "error");
            return;
        }

        try {
            const data = await getAttendance(programId);
            setAttendance(data.attendance || data || []);
            showToast("Attendance loaded successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to load attendance", "error");
        }
    };

    const filteredAttendance = (attendance || []).filter((record) => {
        const query = search.toLowerCase();
        const matchesSearch =
            (record.name || "").toLowerCase().includes(query) ||
            (record.email || "").toLowerCase().includes(query) ||
            (record.attendance_date || "").toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "" || (record.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>Attendance Management</h1>

            <br />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                    type="number"
                    placeholder="Enter Program ID"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    style={{ width: "240px", margin: 0 }}
                />

                <button onClick={loadAttendance}>Load Attendance</button>
            </div>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by Employee, Email, or Date..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "320px" }}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: "180px" }}
                >
                    <option value="">All Status</option>
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAttendance.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                                    No attendance records found. Enter Program ID and click Load Attendance.
                                </td>
                            </tr>
                        ) : (
                            filteredAttendance.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.name}</td>
                                    <td>{record.email}</td>
                                    <td>{record.attendance_date}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                background: (record.status || "").toUpperCase() === "PRESENT" ? "#dcfce7" : "#fee2e2",
                                                color: (record.status || "").toUpperCase() === "PRESENT" ? "#15803d" : "#b91c1c",
                                            }}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

export default AdminAttendance;
