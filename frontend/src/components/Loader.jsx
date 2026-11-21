function Loader({ text = "Loading..." }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}
        >
            <div
                style={{
                    width: "36px",
                    height: "36px",
                    border: "4px solid #e2e8f0",
                    borderTop: "4px solid #2563eb",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }}
            />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <p style={{ marginTop: "12px", color: "#64748b" }}>{text}</p>
        </div>
    );
}

export default Loader;
