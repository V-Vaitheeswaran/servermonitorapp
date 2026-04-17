import { useEffect, useState } from "react";
import DonutChart from "./components/DonutChart";
import "./styles/Dashboard.css";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  // Live data
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

  // History
  useEffect(() => {
    const fetchHistory = () => {
      fetch("http://localhost:3001/history")
        .then((res) => res.json())
        .then(setHistory);
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 60000);

    return () => clearInterval(interval);
  }, []);

  const recentHistory = history.slice(-10);

  return (
    <div className="container page-shell server-page">
      <section className="page-hero server-hero">
        <p className="overview-label">Server monitor</p>
        <h1 className="page-title">Server Dashboard</h1>
        <p className="page-subtitle">
          Watch live system load, resource usage, and recent server history in
          one place.
        </p>
      </section>

      <section className="summary-strip">
        <div className="summary-tile">
          <span>CPU</span>
          <strong>{data.cpu ?? 0}%</strong>
        </div>
        <div className="summary-tile">
          <span>Memory</span>
          <strong>{data.memory ?? 0}%</strong>
        </div>
        <div className="summary-tile">
          <span>Disk</span>
          <strong>{parseInt(data?.disks?.[0]?.percent, 10) || 0}%</strong>
        </div>
        <div className="summary-tile">
          <span>Updated</span>
          <strong>{data.time || "--"}</strong>
        </div>
      </section>

      <section className="panel-group">
        <div className="section-head">
          <h2>Usage Rings</h2>
          <p>High-level resource view for the current machine state.</p>
        </div>

        <div className="donut-container">
          <DonutChart value={data.cpu || 0} label="CPU" />
          <DonutChart value={data.memory || 0} label="Memory" />
          <DonutChart
            value={parseInt(data?.disks?.[0]?.percent) || 0}
            label="Disk"
          />
        </div>
      </section>

      <section className="graph-grid">
        <div className="chart-card">
          <h3>CPU Usage</h3>
          <div className="responsive-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentHistory}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Memory Usage</h3>
          <div className="responsive-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentHistory}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card page-card">
        <h2>Disk Partitions</h2>
        <table>
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
      </section>

      <section className="card page-card">
        <h2>History</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>CPU</th>
              <th>Memory</th>
            </tr>
          </thead>
          <tbody>
            {recentHistory.map((h, i) => (
              <tr key={i}>
                <td>{h.time}</td>
                <td>{h.cpu}%</td>
                <td>{h.memory}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;
