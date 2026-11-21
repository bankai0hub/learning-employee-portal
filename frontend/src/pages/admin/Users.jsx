import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/userApi";
import { showToast } from "../../utils/toast";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

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
            .then((data) => setUsers(data.users || data || []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let ignore = false;
        getUsers()
            .then((data) => {
                if (!ignore) setUsers(data.users || data || []);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(addFormData);
            showToast("User created successfully!", "success");
            setAddFormData({ name: "", email: "", password: "", role: "EMPLOYEE" });
            setShowAddForm(false);
            loadUsers();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to create user", "error");
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
            showToast("User updated successfully!", "success");
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to update user", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            showToast("User deleted successfully!", "success");
            loadUsers();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to delete user", "error");
        }
    };

    const filteredUsers = (users || []).filter((user) => {
        const query = search.toLowerCase();
        const matchesQuery =
            (user.name || "").toLowerCase().includes(query) ||
            (user.email || "").toLowerCase().includes(query);
        const matchesRole = roleFilter === "" || (user.role || "").toUpperCase() === roleFilter;
        return matchesQuery && matchesRole;
    });

    return (
        <MainLayout>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Admin User Management</h1>
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Close Form" : "+ Add New User"}
                </button>
            </div>

            <br />

            {showAddForm && (
                <div className="table-container" style={{ marginBottom: "20px" }}>
                    <h3>Add New User</h3>
                    <br />
                    <form onSubmit={handleAddSubmit}>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={addFormData.name}
                            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={addFormData.email}
                            onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                            required
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={addFormData.password}
                            onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                            required
                        />

                        <label>Role</label>
                        <select
                            value={addFormData.role}
                            onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
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
                <div className="table-container" style={{ marginBottom: "20px", borderLeft: "4px solid #2563eb" }}>
                    <h3>Edit User #{editingUser.id}</h3>
                    <br />
                    <form onSubmit={handleEditSubmit}>
                        <label>Name</label>
                        <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            required
                        />

                        <label>Role</label>
                        <select
                            value={editFormData.role}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                        >
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>

                        <br /><br />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setEditingUser(null)} style={{ background: "#64748b" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search User by Name or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "300px" }}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ width: "180px" }}
                >
                    <option value="">All Roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
            </div>

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
                                        No matching users found.
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
                                                    background: (user.role || "").toUpperCase() === "ADMIN" ? "#dbeafe" : "#f1f5f9",
                                                    color: (user.role || "").toUpperCase() === "ADMIN" ? "#1e40af" : "#475569",
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

export default AdminUsers;
