import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getRegistrations } from "../../api/registrationApi";

function AdminRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        let ignore = false;
        getRegistrations()
            .then((data) => {
                if (!ignore) {
                    setRegistrations(data.registrations || data || []);
                }
            })
            .catch((error) => console.error(error));
        return () => {
            ignore = true;
        };
    }, []);

    const filteredRegistrations = (registrations || []).filter((reg) => {
        const query = search.toLowerCase();
        const matchesSearch =
            (reg.name || "").toLowerCase().includes(query) ||
            (reg.email || "").toLowerCase().includes(query) ||
            (reg.title || "").toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "" || (reg.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>Registrations Management</h1>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search User, Email, or Program..."
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
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Program</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                                    No registrations found.
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{reg.id}</td>
                                    <td>{reg.name}</td>
                                    <td>{reg.email}</td>
                                    <td>{reg.title}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                background: (reg.status || "").toUpperCase() === "CONFIRMED" ? "#dcfce7" : "#fef3c7",
                                                color: (reg.status || "").toUpperCase() === "CONFIRMED" ? "#15803d" : "#b45309",
                                            }}
                                        >
                                            {reg.status || "CONFIRMED"}
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

export default AdminRegistrations;
