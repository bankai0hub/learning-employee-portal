import API from "./axios";

export const getAttendance = async (programId) => {
    const response = await API.get(
        `/attendance/program/${programId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    return response.data;
};