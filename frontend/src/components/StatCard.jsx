function StatCard({ title, value, icon }) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                minWidth: "220px",
            }}
        >
            <h3>
                {icon} {title}
            </h3>

            <h1
                style={{
                    marginTop: "10px",
                    color: "#2563eb",
                }}
            >
                {value}
            </h1>
        </div>
    );
}

export default StatCard;