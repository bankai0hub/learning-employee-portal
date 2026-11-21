import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getAssessments, addAssessment } from "../../api/assessmentApi";
import { showToast } from "../../utils/toast";

function AdminAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [resultFilter, setResultFilter] = useState("");

    const [formData, setFormData] = useState({
        registration_id: "",
        score: "",
        max_score: "100",
        comments: "",
    });

    const loadAssessments = () => {
        getAssessments()
            .then((data) => setAssessments(data.assessments || data || []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let ignore = false;
        getAssessments()
            .then((data) => {
                if (!ignore) setAssessments(data.assessments || data || []);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAssessment(formData);
            showToast("Assessment Submitted Successfully", "success");
            setFormData({
                registration_id: "",
                score: "",
                max_score: "100",
                comments: "",
            });
            loadAssessments();
        } catch (error) {
            console.error(error);
            showToast("Failed to submit assessment", "error");
        }
    };

    const filteredAssessments = (assessments || []).filter((item) => {
        const query = search.toLowerCase();
        const score = Number(item.score || 0);
        const maxScore = Number(item.max_score || item.maxScore || 100);
        const isPass = maxScore > 0 && (score / maxScore) * 100 >= 50;

        const matchesSearch =
            String(item.registration_id || item.registrationId || "").toLowerCase().includes(query) ||
            (item.comments || "").toLowerCase().includes(query) ||
            (item.name || "").toLowerCase().includes(query);

        const matchesResult =
            resultFilter === "" ||
            (resultFilter === "PASS" && isPass) ||
            (resultFilter === "FAIL" && !isPass);

        return matchesSearch && matchesResult;
    });

    return (
        <MainLayout>
            <h1>Assessments Management</h1>

            <br />

            <div className="table-container">
                <h3>Submit Assessment</h3>

                <br />

                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        name="registration_id"
                        placeholder="Registration ID"
                        value={formData.registration_id}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="score"
                        placeholder="Score"
                        value={formData.score}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="max_score"
                        placeholder="Max Score (default 100)"
                        value={formData.max_score}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <textarea
                        name="comments"
                        placeholder="Comments / Feedback"
                        value={formData.comments}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">Submit Assessment</button>
                </form>
            </div>

            <br />

            <div className="table-container">
                <h3>Assessment Records</h3>

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
                    <p>Loading assessments...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Registration ID</th>
                                <th>Score</th>
                                <th>Max Score</th>
                                <th>Result</th>
                                <th>Comments</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAssessments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                                        No assessments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAssessments.map((item) => {
                                    const score = Number(item.score || 0);
                                    const maxScore = Number(item.max_score || item.maxScore || 100);
                                    const isPass = maxScore > 0 && (score / maxScore) * 100 >= 50;

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.registration_id || item.registrationId}</td>
                                            <td>{item.score}</td>
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
                                            <td>{item.comments || "-"}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </MainLayout>
    );
}

export default AdminAssessments;
