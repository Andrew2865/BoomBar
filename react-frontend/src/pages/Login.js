import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`✅ Witaj, ${res.data.user.name}`);
      window.location.href = "/";
    } catch (err) {
      setError("❌ Błędne hasło lub email!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center">🔑 Logowanie</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <input type="email" className="form-control mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="form-control mb-3" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-primary w-100" onClick={login}>Zaloguj się</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;