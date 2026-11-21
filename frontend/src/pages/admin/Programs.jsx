import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getPrograms, createProgram, deleteProgram } from "../../api/programApi";
import { showToast } from "../../utils/toast";

function AdminPrograms() {
    const [programs, setPrograms] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        trainer_name: "",
        start_date: "",
        end_date: "",
        capacity: "",
    });

    const loadPrograms = () => {
        getPrograms()
            .then((data) => setPrograms(data.programs || data || []))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        let ignore = false;
        getPrograms()
            .then((data) => {
                if (!ignore) setPrograms(data.programs || data || []);
            })
            .catch((err) => console.error(err));
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
            await createProgram(formData);
            showToast("Program Created Successfully", "success");
            setFormData({
                title: "",
                description: "",
                trainer_name: "",
                start_date: "",
                end_date: "",
                capacity: "",
            });
            loadPrograms();
        } catch (error) {
            console.error(error);
            showToast("Failed to create program", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete Program?")) return;
        try {
            await deleteProgram(id);
            showToast("Program deleted successfully", "success");
            loadPrograms();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete program", "error");
        }
    };

    const filteredPrograms = (programs || []).filter((program) => {
        const matchesSearch =
            (program.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (program.trainer_name || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "" || (program.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            <h1>Programs Management</h1>

            <br />

            <div className="table-container">
                <h3>Add New Program</h3>

                <br />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Program Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="text"
                        name="trainer_name"
                        placeholder="Trainer Name"
                        value={formData.trainer_name}
                        onChange={handleChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button type="submit">Add Program</button>
                </form>
            </div>

            <br />

            <div className="table-container">
                <h3>Program List</h3>

                <br />

                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Search by Title or Trainer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "300px" }}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: "180px" }}
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>

                <br />

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Trainer</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPrograms.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>
                                    No matching programs found.
                                </td>
                            </tr>
                        ) : (
                            filteredPrograms.map((program) => (
                                <tr key={program.id}>
                                    <td>{program.id}</td>
                                    <td>{program.title}</td>
                                    <td>{program.trainer_name}</td>
                                    <td>{program.capacity}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                background: (program.status || "").toUpperCase() === "ACTIVE" ? "#dcfce7" : "#f1f5f9",
                                                color: (program.status || "").toUpperCase() === "ACTIVE" ? "#15803d" : "#475569",
                                            }}
                                        >
                                            {program.status || "ACTIVE"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(program.id)}
                                            style={{ background: "#ef4444", padding: "6px 12px" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

export default AdminPrograms;
