import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser({
                email,
                password,
            });

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "350px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            >
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;