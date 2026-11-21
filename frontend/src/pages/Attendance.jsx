import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getAttendance } from "../api/attendanceApi";

function Attendance() {
    const [programId, setProgramId] = useState("");
    const [attendance, setAttendance] = useState([]);

    const loadAttendance = async () => {
        if (!programId.trim()) {
            alert("Please enter a valid Program ID");
            return;
        }

        try {
            const data = await getAttendance(programId);

            setAttendance(data.attendance || data || []);
        } catch (error) {
            console.error(error);

            alert("Failed to load attendance");
        }
    };

    return (
        <MainLayout>
            <h1>Attendance Management</h1>

            <br />

            <input
                type="number"
                placeholder="Enter Program ID"
                value={programId}
                onChange={(e) =>
                    setProgramId(e.target.value)
                }
            />

            <button
                onClick={loadAttendance}
                style={{ marginLeft: "10px" }}
            >
                Load Attendance
            </button>

            <br />
            <br />

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
                        {attendance.map((record) => (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>{record.name}</td>
                                <td>{record.email}</td>
                                <td>{record.attendance_date}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

export default Attendance;