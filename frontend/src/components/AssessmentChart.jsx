import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

function AssessmentChart({ data }) {
    const chartData = data && data.length > 0 ? data : [
        { result: "Pass", count: 0 },
        { result: "Fail", count: 0 },
    ];

    return (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "15px" }}>Assessment Results</h3>
            <BarChart
                width={450}
                height={260}
                data={chartData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="result" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                    dataKey="count"
                    fill="#2563eb"
                />
            </BarChart>
        </div>
    );
}

export default AssessmentChart;