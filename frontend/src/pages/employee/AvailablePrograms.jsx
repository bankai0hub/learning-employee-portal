import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getPrograms } from "../../api/programApi";
import { showToast } from "../../utils/toast";

function AvailablePrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        let ignore = false;
        getPrograms()
            .then((data) => {
                if (!ignore) {
                    setPrograms(data.programs || data || []);
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

    const handleRegister = (program) => {
        showToast(`Successfully registered for ${program.title}!`, "success");
    };

    const filteredPrograms = (programs || []).filter((program) => {
        const matchesSearch =
            (program.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (program.trainer_name || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "" || (program.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>Available Training Programs</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Browse programs and register for upcoming courses</p>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search Programs by Title or Trainer..."
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
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>
            </div>

            {loading ? (
                <p>Loading programs...</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    {filteredPrograms.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No programs available matching your search.</p>
                    ) : (
                        filteredPrograms.map((program) => (
                            <div
                                key={program.id}
                                style={{
                                    background: "#ffffff",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h3 style={{ color: "#0f172a" }}>{program.title}</h3>
                                        <span
                                            style={{
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                                background: (program.status || "").toUpperCase() === "ACTIVE" ? "#dcfce7" : "#f1f5f9",
                                                color: (program.status || "").toUpperCase() === "ACTIVE" ? "#15803d" : "#475569",
                                            }}
                                        >
                                            {program.status || "ACTIVE"}
                                        </span>
                                    </div>
                                    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>
                                        {program.description || "Comprehensive learning track designed to upskill technical capabilities."}
                                    </p>
                                    <br />
                                    <small style={{ display: "block", color: "#475569" }}>
                                        <strong>Trainer:</strong> {program.trainer_name || "Assigned Trainer"}
                                    </small>
                                    <small style={{ display: "block", color: "#475569", marginTop: "4px" }}>
                                        <strong>Capacity:</strong> {program.capacity || 30} seats
                                    </small>
                                </div>

                                <br />

                                <button onClick={() => handleRegister(program)} style={{ width: "100%" }}>
                                    Register Now
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </MainLayout>
    );
}

export default AvailablePrograms;
