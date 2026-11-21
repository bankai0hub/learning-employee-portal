import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAttendance } from "../../api/attendanceApi";
import { showToast } from "../../utils/toast";

function MyAttendance() {
    const [programId, setProgramId] = useState("1");
    const [attendance, setAttendance] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const loadAttendance = async () => {
        if (!programId.trim()) {
            showToast("Please enter a Program ID", "error");
            return;
        }

        try {
            const data = await getAttendance(programId);
            setAttendance(data.attendance || data || []);
            showToast("Attendance history updated", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to load attendance", "error");
        }
    };

    const filteredAttendance = (attendance || []).filter((record) => {
        const query = search.toLowerCase();
        const matchesSearch =
            (record.attendance_date || "").toLowerCase().includes(query) ||
            (record.status || "").toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "" || (record.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>My Attendance History</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Check your attendance records for enrolled programs</p>

            <br />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                    type="number"
                    placeholder="Program ID (e.g. 1)"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    style={{ width: "240px", margin: 0 }}
                />
                <button onClick={loadAttendance}>View Attendance</button>
            </div>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Filter by Date..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "300px" }}
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
                            <th>Record ID</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAttendance.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center", color: "#64748b" }}>
                                    No attendance records loaded. Enter a Program ID and click View Attendance.
                                </td>
                            </tr>
                        ) : (
                            filteredAttendance.map((record) => (
                                <tr key={record.id}>
                                    <td>#{record.id}</td>
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

export default MyAttendance;
