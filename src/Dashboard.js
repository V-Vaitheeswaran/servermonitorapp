import { useEffect, useState } from "react";
import DonutChart from "./components/DonutChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  // Live data (5 sec)
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3001/metrics")
        .then((res) => res.json())
        .then(setData);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // History data
useEffect(() => {
  const fetchHistory = () => {
    fetch("http://localhost:3001/history")
      .then(res => res.json())
      .then(setHistory);
  };

  fetchHistory(); // initial load

  const interval = setInterval(fetchHistory, 5 * 60 * 1000); // every 5 min

  return () => clearInterval(interval);
}, []);

  return (
    <div style={page}>
      <h1 style={title}>🚀 Server Dashboard</h1>

      {/* 🍩 Donut Charts */}
      <div style={cardContainer}>
        <DonutChart value={data.cpu || 0} label="CPU" />
        <DonutChart value={data.memory || 0} label="Memory" />
        <DonutChart
          value={parseInt(data?.disks?.[0]?.percent) || 0}
          label="Disk"
        />
      </div>

      {/* 📊 Graph */}
      <h2 style={section}>CPU Usage (History)</h2>
      <LineChart width={700} height={250} data={history}>
        <CartesianGrid stroke="#444" />
        <XAxis dataKey="time" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Line type="monotone" dataKey="cpu" stroke="#00C49F" />
      </LineChart>

      {/* 💽 Disk Table */}
      <h2 style={section}>Disk Partitions</h2>
      <table style={table}>
        <thead>
          <tr>
            <th>Filesystem</th>
            <th>Size</th>
            <th>Used</th>
            <th>Available</th>
            <th>Usage</th>
            <th>Mount</th>
          </tr>
        </thead>
        <tbody>
          {data.disks &&
            data.disks.map((d, i) => (
              <tr key={i}>
                <td>{d.filesystem}</td>
                <td>{d.size}</td>
                <td>{d.used}</td>
                <td>{d.available}</td>
                <td>{d.percent}</td>
                <td>{d.mount}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 📜 History Table */}
      <h2 style={section}>History (5 min interval)</h2>
      <table style={table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>CPU</th>
            <th>Memory</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{h.time}</td>
              <td>{h.cpu}%</td>
              <td>{h.memory}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const page = {
  backgroundColor: "#0f172a",
  minHeight: "100vh",
  padding: "30px",
  color: "white",
};

const title = {
  marginBottom: "20px",
};

const section = {
  marginTop: "40px",
};

const cardContainer = {
  display: "flex",
  gap: "40px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  background: "#1e293b",
};

export default Dashboard;
