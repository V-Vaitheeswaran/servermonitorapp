import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";

function Home() {
  const [metrics, setMetrics] = useState(null);
  const [webStats, setWebStats] = useState({
    total: 0,
    up: 0,
    down: 0,
    recent: [],
  });

  useEffect(() => {
    const fetchMetrics = () => {
      fetch("http://localhost:3001/metrics")
        .then((res) => res.json())
        .then(setMetrics)
        .catch(() => setMetrics(null));
    };

    const loadWebStats = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("web_urls")) || [];
        const urls = Array.isArray(saved) ? saved : [];

        setWebStats({
          total: urls.length,
          up: urls.filter((item) => item.status === "UP").length,
          down: urls.filter((item) => item.status === "DOWN").length,
          recent: urls.slice(0, 4),
        });
      } catch {
        setWebStats({
          total: 0,
          up: 0,
          down: 0,
          recent: [],
        });
      }
    };

    fetchMetrics();
    loadWebStats();

    const metricInterval = setInterval(fetchMetrics, 5000);
    const webInterval = setInterval(loadWebStats, 3000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(webInterval);
    };
  }, []);

  return (
    <div className="container home-shell">
      <section className="hero-panel">
        <p className="hero-kicker">Operations overview</p>
        <h1 className="hero-title">Monitoring Center</h1>
        <p className="hero-copy">
          Keep an eye on your machine and website checks from one place.
        </p>

        <div className="hero-actions">
          <Link className="hero-button hero-button-primary" to="/server">
            Open Server Monitor
          </Link>
          <Link className="hero-button hero-button-secondary" to="/web">
            Open Web Monitor
          </Link>
        </div>
      </section>

      <section className="overview-grid">
        <div className="overview-card accent-server">
          <div className="overview-card-head">
            <div>
              <p className="overview-label">Server monitor</p>
              <h2>System Health</h2>
            </div>
            <span className="overview-badge">
              {metrics ? "Live" : "Waiting"}
            </span>
          </div>

          <div className="overview-stats">
            <div className="overview-stat">
              <span>CPU</span>
              <strong>{metrics?.cpu ?? "--"}%</strong>
            </div>
            <div className="overview-stat">
              <span>Memory</span>
              <strong>{metrics?.memory ?? "--"}%</strong>
            </div>
            <div className="overview-stat">
              <span>Disk</span>
              <strong>
                {metrics?.disks?.[0]?.percent
                  ? parseInt(metrics.disks[0].percent, 10)
                  : "--"}
                {metrics?.disks?.[0]?.percent ? "%" : ""}
              </strong>
            </div>
          </div>

          <p className="overview-note">
            Last updated: {metrics?.time || "Backend not connected"}
          </p>
        </div>

        <div className="overview-card accent-web">
          <div className="overview-card-head">
            <div>
              <p className="overview-label">Website monitor</p>
              <h2>Website Checks</h2>
            </div>
            <span className="overview-badge">{webStats.total} tracked</span>
          </div>

          <div className="overview-stats">
            <div className="overview-stat">
              <span>Total</span>
              <strong>{webStats.total}</strong>
            </div>
            <div className="overview-stat">
              <span>Up</span>
              <strong>{webStats.up}</strong>
            </div>
            <div className="overview-stat">
              <span>Down</span>
              <strong>{webStats.down}</strong>
            </div>
          </div>

          <p className="overview-note">
            Healthy sites are counted from your saved Web Monitor list.
          </p>
        </div>
      </section>

      <section className="home-lower-grid">
        <div className="card home-card">
          <h2>Quick Actions</h2>
          <div className="quick-action-list">
            <Link className="quick-action-item" to="/server">
              <span>View live CPU, memory, and disk charts</span>
              <strong>Server Dashboard</strong>
            </Link>
            <Link className="quick-action-item" to="/web">
              <span>Add URLs and review uptime history</span>
              <strong>Web Monitor</strong>
            </Link>
          </div>
        </div>

        <div className="card home-card">
          <h2>Recent Websites</h2>
          {webStats.recent.length === 0 ? (
            <p className="empty-state">No websites added yet.</p>
          ) : (
            <div className="recent-site-list">
              {webStats.recent.map((site, index) => (
                <Link className="recent-site-item" key={site.url} to={`/web/${index}`}>
                  <div>
                    <strong>{site.url}</strong>
                    <span>{site.time || "No checks yet"}</span>
                  </div>
                  <span
                    className={`status ${
                      site.status === "UP"
                        ? "status-up"
                        : site.status === "DOWN"
                          ? "status-down"
                          : "status-checking"
                    }`}
                  >
                    {site.status || "Checking..."}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
