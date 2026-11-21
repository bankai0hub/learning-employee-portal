import API from "./axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getPrograms = async () => {
    const response = await API.get(
        "/programs",
        getAuthConfig()
    );

    return response.data;
};

export const createProgram = async (programData) => {
    const response = await API.post(
        "/programs",
        programData,
        getAuthConfig()
    );

    return response.data;
};

export const deleteProgram = async (id) => {
    const response = await API.delete(
        `/programs/${id}`,
        getAuthConfig()
    );

    return response.data;
};