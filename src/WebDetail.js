import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/WebDetail.css";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WebDetail() {
  const { id } = useParams();
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("web_urls")) || [];

        if (Array.isArray(saved)) {
          setUrlData(saved[id]);
        } else {
          setUrlData(null);
        }
      } catch {
        setUrlData(null);
      }
    };

    load();

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (!urlData) {
    return (
      <div className="container page-shell detail-page">
        <section className="page-hero detail-hero">
          <p className="overview-label">Website detail</p>
          <h1 className="page-title">URL Details</h1>
          <p className="page-subtitle">Loading website history...</p>
        </section>
      </div>
    );
  }

  const recentHistory = (urlData.history || []).slice(-10);
  const recentResponseHistory = recentHistory.filter(
    (item) => typeof item.responseTime === "number"
  );

  return (
    <div className="container page-shell detail-page">
      <section className="page-hero detail-hero">
        <p className="overview-label">Website detail</p>
        <h1 className="page-title">URL Details</h1>
        <p className="page-subtitle">{urlData.url}</p>
      </section>

      <section className="summary-strip">
        <div className="summary-tile">
          <span>Status</span>
          <strong>{urlData.status || "Checking..."}</strong>
        </div>
        <div className="summary-tile">
          <span>Last Checked</span>
          <strong>{urlData.time || "--"}</strong>
        </div>
        <div className="summary-tile">
          <span>Response Time</span>
          <strong>
            {typeof urlData.responseTime === "number"
              ? `${urlData.responseTime} ms`
              : "--"}
          </strong>
        </div>
        <div className="summary-tile">
          <span>Total Checks</span>
          <strong>{urlData.history?.length || 0}</strong>
        </div>
      </section>

      <section className="card page-card detail-info-card">
        <div className="detail-heading-row">
          <h2>{urlData.url}</h2>
          <span
            className={`status ${
              urlData.status === "UP"
                ? "status-up"
                : urlData.status === "DOWN"
                  ? "status-down"
                  : "status-checking"
            }`}
          >
            {urlData.status}
          </span>
        </div>
        <p>Last Checked: {urlData.time || "-"}</p>
        <p>
          Latest Response Time:{" "}
          {typeof urlData.responseTime === "number"
            ? `${urlData.responseTime} ms`
            : "-"}
        </p>
        <p>Total Checks: {urlData.history?.length || 0}</p>
      </section>

      <section className="card page-card">
        <h2>Status Trend</h2>

        {recentHistory.length === 0 ? (
          <p>No data yet...</p>
        ) : (
          <div className="responsive-chart detail-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentHistory}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={(d) => (d.status === "UP" ? 1 : 0)}
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card page-card">
        <h2>Response Time Trend</h2>

        {recentResponseHistory.length === 0 ? (
          <p>No response time data yet...</p>
        ) : (
          <div className="responsive-chart detail-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentResponseHistory}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`${value} ms`, "Response Time"]} />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card page-card">
        <h2>History</h2>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Status</th>
              <th>Response Time</th>
            </tr>
          </thead>

          <tbody>
            {recentHistory.map((h, i) => (
              <tr key={i}>
                <td>{h.time}</td>
                <td>
                  <span
                    className={`status ${
                      h.status === "UP" ? "status-up" : "status-down"
                    }`}
                  >
                    {h.status}
                  </span>
                </td>
                <td>
                  {typeof h.responseTime === "number"
                    ? `${h.responseTime} ms`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default WebDetail;
