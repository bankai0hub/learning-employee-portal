import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../api/userApi";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [addFormData, setAddFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
    });

    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        role: "EMPLOYEE",
    });

    const loadUsers = () => {
        getUsers()
            .then((data) => {
                setUsers(data.users || data || []);
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to fetch users");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        let ignore = false;
        getUsers()
            .then((data) => {
                if (!ignore) {
                    setUsers(data.users || data || []);
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

    const handleAddChange = (e) => {
        setAddFormData({
            ...addFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(addFormData);
            alert("User created successfully!");
            setAddFormData({
                name: "",
                email: "",
                password: "",
                role: "EMPLOYEE",
            });
            setShowAddForm(false);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create user");
        }
    };

    const handleStartEdit = (user) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "EMPLOYEE",
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await updateUser(editingUser.id, editFormData);
            alert("User updated successfully!");
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to update user");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
            alert("User deleted successfully!");
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete user");
        }
    };

    const filteredUsers = (users || []).filter((user) => {
        const query = search.toLowerCase();
        return (
            (user.name || "").toLowerCase().includes(query) ||
            (user.email || "").toLowerCase().includes(query) ||
            (user.role || "").toLowerCase().includes(query)
        );
    });

    return (
        <MainLayout>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Users Management (Admin Only)</h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: "10px 16px",
                        fontWeight: "bold",
                    }}
                >
                    {showAddForm ? "Close Form" : "+ Add New User"}
                </button>
            </div>

            <br />

            {showAddForm && (
                <div className="table-container" style={{ marginBottom: "25px" }}>
                    <h3>Add New User</h3>
                    <br />
                    <form onSubmit={handleAddSubmit}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={addFormData.name}
                            onChange={handleAddChange}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="User Email"
                            value={addFormData.email}
                            onChange={handleAddChange}
                            required
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={addFormData.password}
                            onChange={handleAddChange}
                            required
                        />

                        <label>Role</label>
                        <select
                            name="role"
                            value={addFormData.role}
                            onChange={handleAddChange}
                        >
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>

                        <br /><br />
                        <button type="submit">Create User</button>
                    </form>
                </div>
            )}

            {editingUser && (
                <div className="table-container" style={{ marginBottom: "25px", borderLeft: "4px solid #2563eb" }}>
                    <h3>Edit User #{editingUser.id}</h3>
                    <br />
                    <form onSubmit={handleEditSubmit}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="User Email"
                            value={editFormData.email}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Role</label>
                        <select
                            name="role"
                            value={editFormData.role}
                            onChange={handleEditChange}
                        >
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>

                        <br /><br />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit">Save Changes</button>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                style={{ background: "#64748b" }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <input
                type="text"
                placeholder="Search User by Name, Email, or Role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: "10px",
                    width: "360px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginBottom: "20px",
                }}
            />

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    background: user.role?.toUpperCase() === "ADMIN" ? "#dbeafe" : "#f1f5f9",
                                                    color: user.role?.toUpperCase() === "ADMIN" ? "#1e40af" : "#475569",
                                                }}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => handleStartEdit(user)}
                                                    style={{ padding: "6px 12px", background: "#f59e0b" }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    style={{ padding: "6px 12px", background: "#ef4444" }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default Users;