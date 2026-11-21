import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getRegistrations } from "../../api/registrationApi";

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
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
            .catch((error) => console.error(error))
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const filteredRegistrations = (registrations || []).filter((reg) => {
        const query = search.toLowerCase();
        const matchesSearch =
            (reg.title || "").toLowerCase().includes(query) ||
            (reg.name || "").toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "" || (reg.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>My Enrolled Programs</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Programs you are currently registered in</p>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search My Programs..."
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
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                </select>
            </div>

            {loading ? (
                <p>Loading registrations...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Registration ID</th>
                                <th>Program Title</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                                        No registered programs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id}>
                                        <td>#{reg.id}</td>
                                        <td>{reg.title || "Web Development Track"}</td>
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
                                        <td>
                                            <button style={{ padding: "6px 12px" }}>
                                                View Course Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default MyRegistrations;
