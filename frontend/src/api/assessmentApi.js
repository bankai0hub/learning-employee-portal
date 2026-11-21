import API from "./axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getAssessments = async () => {
    const response = await API.get(
        "/assessments",
        getAuthConfig()
    );

    return response.data;
};

export const addAssessment = async (assessmentData) => {
    const response = await API.post(
        "/assessments",
        assessmentData,
        getAuthConfig()
    );

    return response.data;
};

export const updateAssessment = async (id, assessmentData) => {
    const response = await API.put(
        `/assessments/${id}`,
        assessmentData,
        getAuthConfig()
    );

    return response.data;
};