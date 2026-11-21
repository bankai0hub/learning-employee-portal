import API from "./axios";

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getUsers = async () => {
    const response = await API.get("/users", getAuthConfig());
    return response.data;
};

export const createUser = async (userData) => {
    const response = await API.post("/users", userData, getAuthConfig());
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData, getAuthConfig());
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await API.delete(`/users/${id}`, getAuthConfig());
    return response.data;
};