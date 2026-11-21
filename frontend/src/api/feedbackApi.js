import API from "./axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getFeedback = async () => {
    const response = await API.get(
        "/feedback",
        getAuthConfig()
    );

    return response.data;
};

export const submitFeedback = async (feedbackData) => {
    const response = await API.post(
        "/feedback",
        feedbackData,
        getAuthConfig()
    );

    return response.data;
};