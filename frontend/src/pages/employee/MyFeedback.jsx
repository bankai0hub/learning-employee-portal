import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getFeedback, submitFeedback } from "../../api/feedbackApi";
import { showToast } from "../../utils/toast";

function MyFeedback() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        registration_id: "",
        quality_rating: "5",
        trainer_rating: "5",
        relevance_rating: "5",
        comments: "",
    });

    const loadFeedback = () => {
        getFeedback()
            .then((data) => setFeedbackList(data.feedback || data || []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let ignore = false;
        getFeedback()
            .then((data) => {
                if (!ignore) setFeedbackList(data.feedback || data || []);
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
            showToast("Feedback Submitted Successfully!", "success");
            setFormData({
                registration_id: "",
                quality_rating: "5",
                trainer_rating: "5",
                relevance_rating: "5",
                comments: "",
            });
            loadFeedback();
        } catch (error) {
            console.error(error);
            showToast("Failed to submit feedback", "error");
        }
    };

    const filteredFeedback = (feedbackList || []).filter((item) => {
        const query = search.toLowerCase();
        return (
            (item.title || "").toLowerCase().includes(query) ||
            (item.comments || "").toLowerCase().includes(query)
        );
    });

    return (
        <MainLayout>
            <h1>My Course Feedback</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Share your feedback and ratings for completed courses</p>

            <br />

            <div className="table-container">
                <h3>Submit New Feedback</h3>

                <br />

                <form onSubmit={handleSubmit}>
                    <label>Registration ID</label>
                    <input
                        type="number"
                        name="registration_id"
                        placeholder="Enter Registration ID"
                        value={formData.registration_id}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <label>Course Quality Rating (1-5)</label>
                    <select name="quality_rating" value={formData.quality_rating} onChange={handleChange}>
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Average)</option>
                        <option value="2">⭐⭐ (2 - Poor)</option>
                        <option value="1">⭐ (1 - Terrible)</option>
                    </select>

                    <br /><br />

                    <label>Trainer Rating (1-5)</label>
                    <select name="trainer_rating" value={formData.trainer_rating} onChange={handleChange}>
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Average)</option>
                        <option value="2">⭐⭐ (2 - Poor)</option>
                        <option value="1">⭐ (1 - Terrible)</option>
                    </select>

                    <br /><br />

                    <label>Content Relevance Rating (1-5)</label>
                    <select name="relevance_rating" value={formData.relevance_rating} onChange={handleChange}>
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Average)</option>
                        <option value="2">⭐⭐ (2 - Poor)</option>
                        <option value="1">⭐ (1 - Terrible)</option>
                    </select>

                    <br /><br />

                    <label>Comments / Testimonial</label>
                    <textarea
                        name="comments"
                        placeholder="Write your thoughts about the course and instructor..."
                        value={formData.comments}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">Submit Feedback</button>
                </form>
            </div>

            <br />

            <div className="table-container">
                <h3>My Feedback Submissions</h3>

                <br />

                <input
                    type="text"
                    placeholder="Search Feedback Comments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "320px", marginBottom: "20px" }}
                />

                {loading ? (
                    <p>Loading feedback history...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Feedback ID</th>
                                <th>Program Title</th>
                                <th>Quality</th>
                                <th>Trainer</th>
                                <th>Relevance</th>
                                <th>Comments</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFeedback.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                                        No feedback submitted yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedback.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td>{item.title || "Web Development Track"}</td>
                                        <td>{item.quality_rating} / 5 ⭐</td>
                                        <td>{item.trainer_rating} / 5 ⭐</td>
                                        <td>{item.relevance_rating} / 5 ⭐</td>
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

export default MyFeedback;
