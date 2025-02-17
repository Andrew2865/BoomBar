import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🛍 BoomBar
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  🏠 Główna
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  🛒 Koszyk
                </Link>
              </li>

              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">👤 {user.name}</span>
                  </li>
                  {user.role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        ⚙️ Panel Admina
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-outline-light" onClick={logout}>
                      🚪 Wyjść
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="btn btn-outline-light me-2" to="/login">
                      🔑 Logowanie
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-light" to="/register">
                      📝 Rejestracja
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminPanel />
            ) : (
              <h1 className="text-center mt-5">❌ Brak dostępu</h1>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;