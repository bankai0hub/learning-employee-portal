import { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getAssessments,
    addAssessment,
} from "../api/assessmentApi";

function Assessment() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        registration_id: "",
        score: "",
        max_score: "100",
        comments: "",
    });

    const loadAssessments = useCallback(() => {
        setLoading(true);
        getAssessments()
            .then((data) => {
                setAssessments(data.assessments || data || []);
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to load assessments");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let ignore = false;
        getAssessments()
            .then((data) => {
                if (!ignore) {
                    setAssessments(data.assessments || data || []);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
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

            alert("Assessment Submitted");

            setFormData({
                registration_id: "",
                score: "",
                max_score: "100",
                comments: "",
            });

            loadAssessments();
        } catch (error) {
            console.error(error);
            alert("Submission Failed");
        }
    };

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

                    <button type="submit">
                        Submit Assessment
                    </button>
                </form>
            </div>

            <br />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Registration ID</th>
                                <th>Score</th>
                                <th>Max Score</th>
                                <th>Comments</th>
                            </tr>
                        </thead>

                        <tbody>
                            {assessments.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.registration_id || item.registrationId || item.name}</td>
                                    <td>{item.score}</td>
                                    <td>{item.max_score || item.maxScore || 100}</td>
                                    <td>{item.comments || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default Assessment;
