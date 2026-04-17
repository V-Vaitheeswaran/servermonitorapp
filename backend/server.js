const express = require("express");
const cors = require("cors");
const os = require("os");
const { exec } = require("child_process");
const https = require("https");
const http = require("http");

const app = express();
app.use(cors());

let history = [];

/* ================= CPU ================= */
function getCPUUsage() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (let type in core.times) total += core.times[type];
    idle += core.times.idle;
  });

  return 100 - Math.floor((idle / total) * 100);
}

/* ================= MEMORY ================= */
function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.floor(((total - free) / total) * 100);
}

/* ================= DISK ================= */
function getDisk(callback) {
  exec("df -h", (err, stdout) => {
    if (err) return callback(err);

    const lines = stdout.split("\n").slice(1).filter(Boolean);

    const disks = lines.map((line) => {
      const parts = line.split(/\s+/);
      return {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        available: parts[3],
        percent: parts[4],
        mount: parts[5],
      };
    });

    callback(null, disks);
  });
}

/* ================= METRICS ================= */
app.get("/metrics", (req, res) => {
  getDisk((err, disks) => {
    if (err) return res.status(500).send(err.message);

    res.json({
      cpu: getCPUUsage(),
      memory: getMemoryUsage(),
      disks,
      time: new Date().toLocaleTimeString(),
    });
  });
});

/* ================= HISTORY ================= */
app.get("/history", (req, res) => {
  res.json(history);
});

/* ================= COLLECT DATA ================= */
function collectData() {
  getDisk((err) => {
    if (!err) {
      history.push({
        cpu: getCPUUsage(),
        memory: getMemoryUsage(),
        time: new Date().toLocaleTimeString(),
      });

      if (history.length > 100) history.shift();
    }
  });
}

// run immediately
collectData();

// run every 5 min
setInterval(collectData, 5 * 60 * 1000);

/* ================= URL CHECK ================= */

function normalizeUrl(url) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

function checkWebsite(rawUrl, redirects = 0) {
  const url = normalizeUrl(rawUrl);
  const parsedUrl = new URL(url);
  const lib = parsedUrl.protocol === "https:" ? https : http;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const request = lib.request(
      parsedUrl,
      {
        method: "GET",
        headers: {
          "User-Agent": "monitorserverapp/1.0",
          Accept: "*/*",
        },
      },
      (response) => {
        response.resume();

        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location &&
          redirects < 5
        ) {
          const redirectedUrl = new URL(response.headers.location, parsedUrl);
          return resolve(checkWebsite(redirectedUrl.toString(), redirects + 1));
        }

        resolve({
          status: response.statusCode < 500 ? "UP" : "DOWN",
          code: response.statusCode,
          responseTime: Date.now() - start,
          checkedUrl: parsedUrl.toString(),
          time: new Date().toLocaleTimeString(),
        });
      }
    );

    request.on("error", (err) => {
      reject(err);
    });

    request.setTimeout(5000, () => {
      request.destroy(new Error("Timeout"));
    });

    request.end();
  });
}

app.get("/check", async (req, res) => {
  const url = req.query.url;

  if (!url) return res.status(400).send("URL required");

  try {
    const result = await checkWebsite(url);
    res.json(result);
  } catch (err) {
    res.json({
      status: "DOWN",
      error: err.message,
      time: new Date().toLocaleTimeString(),
    });
  }
});

app.listen(3001, () => {
  console.log("🔥 Backend running at http://localhost:3001");
});
