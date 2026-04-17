import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <h2>🚀 MonitorApp</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/web">Web Monitor</Link>
        <Link to="/server">Server Monitor</Link>
      </div>
    </div>
  );
}

export default Navbar;
