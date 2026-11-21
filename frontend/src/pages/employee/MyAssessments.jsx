import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAssessments } from "../../api/assessmentApi";

function MyAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [resultFilter, setResultFilter] = useState("");

    useEffect(() => {
        let ignore = false;
        getAssessments()
            .then((data) => {
                if (!ignore) {
                    setAssessments(data.assessments || data || []);
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

    const filteredAssessments = (assessments || []).filter((item) => {
        const query = search.toLowerCase();
        const score = Number(item.score || 0);
        const maxScore = Number(item.max_score || item.maxScore || 100);
        const isPass = maxScore > 0 && (score / maxScore) * 100 >= 50;

        const matchesSearch =
            String(item.registration_id || item.registrationId || "").toLowerCase().includes(query) ||
            (item.comments || "").toLowerCase().includes(query);

        const matchesResult =
            resultFilter === "" ||
            (resultFilter === "PASS" && isPass) ||
            (resultFilter === "FAIL" && !isPass);

        return matchesSearch && matchesResult;
    });

    return (
        <MainLayout>
            <h1>My Assessment Scores</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>View test scores and evaluation feedback</p>

            <br />

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by Registration ID or Comments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "320px" }}
                />

                <select
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                    style={{ width: "180px" }}
                >
                    <option value="">All Results</option>
                    <option value="PASS">PASS (Score &ge; 50%)</option>
                    <option value="FAIL">FAIL (Score &lt; 50%)</option>
                </select>
            </div>

            {loading ? (
                <p>Loading assessment scores...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Assessment ID</th>
                                <th>Registration ID</th>
                                <th>Score Obtained</th>
                                <th>Max Score</th>
                                <th>Status</th>
                                <th>Evaluator Feedback</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAssessments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                                        No assessment records available.
                                    </td>
                                </tr>
                            ) : (
                                filteredAssessments.map((item) => {
                                    const score = Number(item.score || 0);
                                    const maxScore = Number(item.max_score || item.maxScore || 100);
                                    const isPass = maxScore > 0 && (score / maxScore) * 100 >= 50;

                                    return (
                                        <tr key={item.id}>
                                            <td>#{item.id}</td>
                                            <td>#{item.registration_id || item.registrationId}</td>
                                            <td><strong>{item.score}</strong></td>
                                            <td>{maxScore}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        background: isPass ? "#dcfce7" : "#fee2e2",
                                                        color: isPass ? "#15803d" : "#b91c1c",
                                                    }}
                                                >
                                                    {isPass ? "PASS" : "FAIL"}
                                                </span>
                                            </td>
                                            <td>{item.comments || "Great performance!"}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default MyAssessments;
