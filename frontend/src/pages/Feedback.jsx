import { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getFeedback,
    submitFeedback,
} from "../api/feedbackApi";

function Feedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        registration_id: "",
        quality_rating: "",
        trainer_rating: "",
        relevance_rating: "",
        comments: "",
    });

    const loadFeedback = useCallback(() => {
        setLoading(true);
        getFeedback()
            .then((data) => {
                setFeedback(data.feedback || data || []);
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to load feedback");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let ignore = false;
        getFeedback()
            .then((data) => {
                if (!ignore) {
                    setFeedback(data.feedback || data || []);
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
            await submitFeedback(formData);

            alert("Feedback Submitted");

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
            alert("Submission Failed");
        }
    };

    return (
        <MainLayout>
            <h1>Feedback</h1>

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
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="quality_rating"
                        placeholder="Quality Rating (1-5)"
                        value={formData.quality_rating}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="trainer_rating"
                        placeholder="Trainer Rating (1-5)"
                        value={formData.trainer_rating}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="relevance_rating"
                        placeholder="Relevance Rating (1-5)"
                        value={formData.relevance_rating}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <textarea
                        name="comments"
                        placeholder="Comments"
                        value={formData.comments}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">
                        Submit Feedback
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
                                <th>Employee</th>
                                <th>Program</th>
                                <th>Quality</th>
                                <th>Trainer</th>
                                <th>Relevance</th>
                                <th>Comments</th>
                            </tr>
                        </thead>

                        <tbody>
                            {feedback.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.quality_rating}</td>
                                    <td>{item.trainer_rating}</td>
                                    <td>{item.relevance_rating}</td>
                                    <td>{item.comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default Feedback;