# Monitor Server App

A full-stack monitoring app built with React and Express. It includes:

- a landing page with monitoring overview
- a server monitor for CPU, memory, and disk usage
- a website monitor for uptime checks
- website detail pages with status history and response-time trends

## Features

### Home Page

- Monitoring overview screen
- Quick navigation to server and website monitors
- Live server summary cards
- Website tracking summary cards

### Server Monitor

- Live CPU, memory, and disk usage
- Donut charts for current usage
- CPU and memory history charts
- Disk partition table
- History table
- Last 10 history points shown in charts and table

### Website Monitor

- Add and remove URLs
- Automatic URL checking through the backend
- Tracks current status as `UP`, `DOWN`, or `Checking...`
- Stores recent check history in `localStorage`
- Shows latest response time in the monitor table

### Website Detail

- Per-site detail page
- Status summary and latest response time
- Status trend graph
- Response time trend graph
- History table with response time
- Last 10 data points shown in graphs and history

## Tech Stack

### Frontend

- React
- React Router
- Recharts
- CSS

### Backend

- Node.js
- Express
- CORS
- `os`
- `child_process`
- `http` and `https`

## Project Structure

```text
monitorserverapp/
├── backend/
│   ├── package.json
│   └── server.js
├── public/
├── src/
│   ├── components/
│   │   ├── DonutChart.js
│   │   └── Navbar.js
│   ├── styles/
│   │   ├── base.css
│   │   ├── Dashboard.css
│   │   ├── Home.css
│   │   ├── Navbar.css
│   │   ├── WebDetail.css
│   │   └── WebMonitor.css
│   ├── App.js
│   ├── Dashboard.js
│   ├── Home.js
│   ├── WebDetail.js
│   └── WebMonitor.js
├── package.json
└── README.md
```

## How It Works

### Server Monitor

1. The backend collects CPU, memory, and disk information.
2. The frontend polls `/metrics` for live values.
3. The frontend polls `/history` for stored server history.
4. Charts and tables update automatically.

### Website Monitor

1. You add URLs in the Web Monitor page.
2. URLs are saved in browser `localStorage`.
3. The frontend calls the backend `/check` endpoint.
4. The backend checks the website and returns:
   - status
   - status code
   - response time
   - checked time
5. The frontend stores recent history and shows it in the detail page.

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/metrics` | Returns current CPU, memory, disk, and time |
| `/history` | Returns stored server history |
| `/check?url=...` | Checks a website and returns status and response time |

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start the backend

```bash
node server.js
```

Backend runs at:

```text
http://localhost:3001
```

### 4. Start the frontend

Open a new terminal in the project root and run:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

## Notes

- Website monitor data is stored in the browser, not in a database.
- Server history is kept in backend memory.
- Restarting the backend clears server history.
- Existing saved website entries may show `-` for response time until they are checked again.

## Possible Improvements

- Alerts for downtime or high usage
- Persistent storage with a database
- Authentication
- Multi-server support
- Configurable polling intervals
- Real-time updates with WebSockets

## Author

**Vaitheeswaran V**
