import { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getPrograms,
    createProgram,
    deleteProgram,
} from "../api/programApi";

function Programs() {
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

    const loadPrograms = useCallback(() => {
        getPrograms()
            .then((data) => {
                setPrograms(data.programs || data || []);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        let ignore = false;
        getPrograms()
            .then((data) => {
                if (!ignore) {
                    setPrograms(data.programs || data || []);
                }
            })
            .catch((error) => {
                console.error(error);
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
            await createProgram(formData);

            alert("Program Created Successfully");

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
            alert("Failed to create program");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete Program?")) return;

        try {
            await deleteProgram(id);
            loadPrograms();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredPrograms = (programs || []).filter((program) => {
        const matchesSearch =
            (program.title || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "" ||
            program.status === statusFilter;

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
                    />

                    <br /><br />

                    <input
                        type="text"
                        name="trainer_name"
                        placeholder="Trainer Name"
                        value={formData.trainer_name}
                        onChange={handleChange}
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

                    <button type="submit">
                        Add Program
                    </button>
                </form>
            </div>

            <br />

            <div className="table-container">
                <h3>Program List</h3>

                <br />

                <input
                    type="text"
                    placeholder="Search Program..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <br /><br />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>

                <br /><br />

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
                        {filteredPrograms.map((program) => (
                            <tr key={program.id}>
                                <td>{program.id}</td>
                                <td>{program.title}</td>
                                <td>{program.trainer_name}</td>
                                <td>{program.capacity}</td>
                                <td>{program.status}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleDelete(program.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

export default Programs;