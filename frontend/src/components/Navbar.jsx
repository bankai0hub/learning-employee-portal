import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <nav className="navbar">
            <h2>The Fools Club</h2>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <div>
                    <strong>{user?.name}</strong>
                    <br />
                    <small>{user?.role}</small>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;