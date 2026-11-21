import { useState, useEffect } from "react";
import { setToastListener } from "../utils/toast";

function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        setToastListener((toast) => {
            setToasts((prev) => [...prev, toast]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 3500);
        });
        return () => {
            setToastListener(null);
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {toasts.map((toast) => {
                let bgColor = "#10b981"; // success green
                if (toast.type === "error") bgColor = "#ef4444"; // error red
                if (toast.type === "info") bgColor = "#3b82f6"; // info blue

                return (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: bgColor,
                            color: "#ffffff",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            minWidth: "260px",
                            maxWidth: "400px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            animation: "fadeInRight 0.3s ease-out",
                        }}
                    >
                        <span>{toast.message}</span>
                        <span style={{ marginLeft: "12px", opacity: 0.8, fontSize: "16px" }}>&times;</span>
                    </div>
                );
            })}
            <style>{`
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default ToastContainer;
