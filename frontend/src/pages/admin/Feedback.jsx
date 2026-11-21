import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getFeedback, submitFeedback } from "../../api/feedbackApi";
import { showToast } from "../../utils/toast";

function AdminFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");

    const [formData, setFormData] = useState({
        registration_id: "",
        quality_rating: "",
        trainer_rating: "",
        relevance_rating: "",
        comments: "",
    });

    const loadFeedback = () => {
        getFeedback()
            .then((data) => setFeedback(data.feedback || data || []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let ignore = false;
        getFeedback()
            .then((data) => {
                if (!ignore) setFeedback(data.feedback || data || []);
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
            await submitFeedback(formData);
            showToast("Feedback Submitted Successfully", "success");
            setFormData({
                registration_id: "",
                quality_rating: "",
                trainer_rating: "",
                relevance_rating: "",
                comments: "",
            });
            loadFeedback();
        } catch (error) {
            console.error(error);
            showToast("Submission Failed", "error");
        }
    };

    const filteredFeedback = (feedback || []).filter((item) => {
        const query = search.toLowerCase();
        const matchesSearch =
            (item.name || "").toLowerCase().includes(query) ||
            (item.title || "").toLowerCase().includes(query) ||
            (item.comments || "").toLowerCase().includes(query);

        const quality = String(item.quality_rating || "");
        const matchesRating = ratingFilter === "" || quality === ratingFilter;

        return matchesSearch && matchesRating;
    });

    return (
        <MainLayout>
            <h1>Feedback Management</h1>

            <br />

            <div className="table-container">
                <h3>Submit Feedback</h3>

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
                        name="quality_rating"
                        placeholder="Quality Rating (1-5)"
                        value={formData.quality_rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="trainer_rating"
                        placeholder="Trainer Rating (1-5)"
                        value={formData.trainer_rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="relevance_rating"
                        placeholder="Relevance Rating (1-5)"
                        value={formData.relevance_rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />

                    <br /><br />

                    <textarea
                        name="comments"
                        placeholder="Comments"
                        value={formData.comments}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">Submit Feedback</button>
                </form>
            </div>

            <br />

            <div className="table-container">
                <h3>All Feedback Records</h3>

                <br />

                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search Employee, Program, or Comments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "320px" }}
                    />

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        style={{ width: "180px" }}
                    >
                        <option value="">All Quality Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading feedback...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Program</th>
                                <th>Quality</th>
                                <th>Trainer</th>
                                <th>Relevance</th>
                                <th>Comments</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFeedback.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>
                                        No feedback entries found.
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedback.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name || "Employee"}</td>
                                        <td>{item.title || "Program"}</td>
                                        <td>{item.quality_rating} / 5</td>
                                        <td>{item.trainer_rating} / 5</td>
                                        <td>{item.relevance_rating} / 5</td>
                                        <td>{item.comments}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </MainLayout>
    );
}

export default AdminFeedback;
