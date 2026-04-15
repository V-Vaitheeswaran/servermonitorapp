# 🚀 Server Monitoring Dashboard

A full-stack server monitoring dashboard that tracks **CPU, Memory, and Disk usage** in real time, with historical data visualization and a clean dark UI.

---

## 📌 Features

- 📊 **Real-time Metrics**
  - CPU Usage
  - Memory Usage
  - Disk Usage

- 🍩 **Donut Charts**
  - Visual representation of system health
  - Dynamic updates every few seconds

- 📈 **History Graph**
  - CPU usage trends over time

- 💽 **Disk Partition Table**
  - Filesystem details (size, used, available, mount point)

- 📜 **Historical Data Table**
  - Stores metrics every 5 minutes
  - Displays past system performance

- 🔄 **Auto Refresh**
  - Live data updates every 5 seconds
  - History updates periodically

- 🌙 **Dark Mode UI**
  - Clean and modern dashboard design

---

## 🛠️ Tech Stack

### Frontend

- React (Hooks, useEffect)
- Recharts (Charts & Donut Graphs)
- CSS (Dark theme UI)

### Backend

- Node.js
- Express.js
- child_process (Linux system commands)

---

## ⚙️ How It Works

1. Backend executes Linux system commands to fetch metrics
2. Data is exposed via REST APIs
3. React frontend fetches data periodically
4. Charts and tables update dynamically

---

## 📁 Project Structure

```
servermonitorapp/
├── backend/
│   └── server.js
├── src/
├── public/
├── package.json
└── README.md
```

---

## ▶️ Getting Started

### 1. Clone the repository

```
git clone https://github.com/V-Vaitheeswaran/servermonitorapp.git
cd servermonitorapp
```

---

### 2. Start Backend

```
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:3001
```

---

### 3. Start Frontend

```
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📡 API Endpoints

| Endpoint   | Description                         |
| ---------- | ----------------------------------- |
| `/metrics` | Get current CPU, memory, disk usage |
| `/history` | Get stored historical data          |

---

## 🧠 Key Concepts Used

- CORS (Cross-Origin Resource Sharing)
- REST API integration
- Polling (setInterval)
- System monitoring using OS commands
- Data visualization

---

## 🚀 Future Improvements

- 🔔 Alerts (CPU > 80%)
- 🌐 Multi-server monitoring
- 💾 Database integration (MongoDB)
- 🔐 Authentication system
- 📡 Real-time updates using WebSockets

---

## 👨‍💻 Author

**Vaitheeswaran V**
