import { PieChart, Pie, Cell } from "recharts";

const DonutChart = ({ value, label }) => {
  const data = [
    { name: "Used", value: value },
    { name: "Free", value: 100 - value },
  ];

  const COLORS = ["#00C49F", "#1e1e1e"];

  return (
    <div style={container}>
      <PieChart
        width={180}
        height={180}
        style={{ background: "#1e293b", borderRadius: "50%" }}
      >
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <div style={centerText}>
        <h2>{value}%</h2>
        <p>{label}</p>
      </div>
    </div>
  );
};

const container = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#1e293b",
  borderRadius: "12px",
  padding: "20px",
  width: "220px",
  height: "220px",
  flexShrink: 0,
};

const centerText = {
  position: "absolute",
  textAlign: "center",
  color: "white",
};

export default DonutChart;
