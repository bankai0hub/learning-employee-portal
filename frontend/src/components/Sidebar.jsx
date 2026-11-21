import { Link } from "react-router-dom";

function Sidebar() {
    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Failed to parse user in Sidebar", e);
    }

    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    return (
        <div className="sidebar">
            <h3 style={{ marginBottom: "15px", opacity: 0.9 }}>
                {isAdmin ? "Admin Portal" : "Employee Portal"}
            </h3>

            <ul
                style={{
                    listStyle: "none",
                    padding: 0,
                }}
            >
                {isAdmin ? (
                    <>
                        <li>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin/users">Users</Link>
                        </li>
                        <li>
                            <Link to="/admin/programs">Programs</Link>
                        </li>
                        <li>
                            <Link to="/admin/registrations">Registrations</Link>
                        </li>
                        <li>
                            <Link to="/admin/attendance">Attendance</Link>
                        </li>
                        <li>
                            <Link to="/admin/assessments">Assessments</Link>
                        </li>
                        <li>
                            <Link to="/admin/feedback">Feedback</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/employee/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/employee/programs">Available Programs</Link>
                        </li>
                        <li>
                            <Link to="/employee/registrations">My Registrations</Link>
                        </li>
                        <li>
                            <Link to="/employee/attendance">My Attendance</Link>
                        </li>
                        <li>
                            <Link to="/employee/assessments">My Assessments</Link>
                        </li>
                        <li>
                            <Link to="/employee/feedback">My Feedback</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Sidebar;