import API from "./axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getRegistrations = async () => {
    const response = await API.get(
        "/registrations",
        getAuthConfig()
    );

    return response.data;
};