import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Home";
import Dashboard from "./Dashboard";
import WebMonitor from "./WebMonitor";
import WebDetail from "./WebDetail.js";
import "./styles/base.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/server" element={<Dashboard />} />
        <Route path="/web" element={<WebMonitor />} />
        <Route path="/web/:id" element={<WebDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
