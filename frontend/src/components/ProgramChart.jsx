import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

function ProgramChart({ data }) {
    const chartData = data && data.length > 0 ? data : [
        { name: "Active", value: 0 },
        { name: "Completed", value: 0 },
        { name: "Upcoming", value: 0 },
    ];

    const COLORS = [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
    ];

    return (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "15px" }}>Programs Overview</h3>
            <PieChart width={400} height={260}>
                <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={90}
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default ProgramChart;