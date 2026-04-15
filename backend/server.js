const express = require("express");
const cors = require("cors");
const os = require("os");
const { exec } = require("child_process");

const app = express();
app.use(cors());

let history = [];

// CPU calculation
function getCPUUsage() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  return 100 - Math.floor((idle / total) * 100);
}

// Memory
function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.floor(((total - free) / total) * 100);
}

// Disk
function getDisk(callback) {
  exec("df -h", (err, stdout) => {
    if (err) return callback(err);

    const lines = stdout.split("\n").slice(1);
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

// API: current metrics
app.get("/metrics", (req, res) => {
  getDisk((err, disks) => {
    if (err) return res.status(500).send(err.message);

    const data = {
      cpu: getCPUUsage(),
      memory: getMemoryUsage(),
      disks,
      time: new Date().toLocaleTimeString(),
    };

    res.json(data);
  });
});

// API: history
app.get("/history", (req, res) => {
  res.json(history);
});

// Save every 5 minutes
setInterval(
  () => {
    getDisk((err, disks) => {
      if (!err) {
        history.push({
          cpu: getCPUUsage(),
          memory: getMemoryUsage(),
          time: new Date().toLocaleTimeString(),
        });

        if (history.length > 100) history.shift();
      }
    });
  },
  5 * 60 * 1000,
);

app.listen(3001, () => {
  console.log("🔥 Backend running at http://localhost:3001");
});
