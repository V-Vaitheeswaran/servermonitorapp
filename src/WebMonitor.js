import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/WebMonitor.css";

function WebMonitor() {
  const [urls, setUrls] = useState([]);
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const urlsRef = useRef([]);
  const hasCheckedRef = useRef(false);
  const navigate = useNavigate();
  const stats = {
    total: urls.length,
    up: urls.filter((item) => item.status === "UP").length,
    down: urls.filter((item) => item.status === "DOWN").length,
  };

  /* LOAD */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("web_urls"));

      if (Array.isArray(saved)) {
        setUrls(saved);
      } else {
        setUrls([]);
      }
    } catch {
      setUrls([]);
    }

    setLoaded(true);
  }, []);

  /* SAVE */
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("web_urls", JSON.stringify(urls));
    }
  }, [urls, loaded]);

  useEffect(() => {
    urlsRef.current = urls;
  }, [urls]);

  /* ADD */
  const addUrl = () => {
    const nextUrl = input.trim();

    if (!nextUrl) return;
    if (urls.some((u) => u.url === nextUrl)) return;

    setUrls((prev) => [
      ...prev,
      {
        url: nextUrl,
        status: "Checking...",
        time: "",
        responseTime: null,
        history: [],
      },
    ]);

    setInput("");
  };

  /* DELETE */
  const removeUrl = (index) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  /* ✅ FIXED CHECK FUNCTION */
  const checkUrls = useCallback(async () => {
    const safeUrls = Array.isArray(urlsRef.current) ? urlsRef.current : [];

    const updated = await Promise.all(
      safeUrls.map(async (item) => {
        try {
          const res = await fetch(
            `http://localhost:3001/check?url=${encodeURIComponent(item.url)}`
          );

          if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
          }

          const data = await res.json();

          if (!data.status) {
            throw new Error("Invalid response from backend");
          }

          return {
            ...item,
            status: data.status,
            time: data.time,
            responseTime:
              typeof data.responseTime === "number" ? data.responseTime : null,
            history: [
              ...(item.history || []),
              {
                status: data.status,
                time: data.time,
                responseTime:
                  typeof data.responseTime === "number"
                    ? data.responseTime
                    : null,
              },
            ].slice(-20),
          };
        } catch {
          return {
            ...item,
            status: hasCheckedRef.current ? item.status : "Checking...",
            time: item.time,
            responseTime: item.responseTime ?? null,
            history: item.history || [],
          };
        }
      })
    );

    hasCheckedRef.current = true;
    setUrls(updated);
  }, []);

  /* RUN */
  useEffect(() => {
    if (!loaded || urls.length === 0) return;

    checkUrls(); // only run when urls exist

    const interval = setInterval(checkUrls, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkUrls, loaded, urls.length]);

  return (
    <div className="container page-shell web-page">
      <section className="page-hero web-hero">
        <p className="overview-label">Website monitor</p>
        <h1 className="page-title">Web Monitor</h1>
        <p className="page-subtitle">
          Track website availability, keep a short history, and jump into a
          detailed status page for each URL.
        </p>
      </section>

      <section className="summary-strip">
        <div className="summary-tile">
          <span>Tracked</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="summary-tile">
          <span>Up</span>
          <strong>{stats.up}</strong>
        </div>
        <div className="summary-tile">
          <span>Down</span>
          <strong>{stats.down}</strong>
        </div>
        <div className="summary-tile">
          <span>Polling</span>
          <strong>5 min</strong>
        </div>
      </section>

      <section className="card page-card input-card">
        <div className="section-head">
          <h2>Add Website</h2>
          <p>Enter a URL and the monitor will keep checking it automatically.</p>
        </div>
        <div className="input-box">
          <input
            placeholder="Enter URL (https://example.com)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={addUrl}>Add</button>
        </div>
      </section>

      <section className="card page-card">
        <div className="section-head">
          <h2>Tracked Websites</h2>
          <p>Click any row to open the detailed view and history chart.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Status</th>
              <th>Last Checked</th>
              <th>Response Time</th>
              <th>Checks</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {(Array.isArray(urls) ? urls : []).length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No URLs added
                </td>
              </tr>
            ) : (
              (Array.isArray(urls) ? urls : []).map((u, i) => (
                <tr
                  key={i}
                  onClick={() => navigate(`/web/${i}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{u.url}</td>

                  <td>
                    <span
                      className={`status ${
                        u.status === "UP"
                          ? "status-up"
                          : u.status === "DOWN"
                          ? "status-down"
                          : "status-checking"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td>{u.time || "-"}</td>

                  <td>
                    {typeof u.responseTime === "number"
                      ? `${u.responseTime} ms`
                      : "-"}
                  </td>

                  <td>{u.history?.length || 0}</td>

                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUrl(i);
                    }}
                  >
                    <button className="delete-btn">✖</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default WebMonitor;
