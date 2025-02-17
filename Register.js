import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });
      setMessage({ text: response.data.message || "✅ Rejestracja powiodła sie!", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "❌ Błąd rejestracji!", type: "danger" });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center">📝 Rejestracja</h2>
            {message && <p className={`text-${message.type} text-center`}>{message.text}</p>}
            <input type="text" className="form-control mb-2" placeholder="Imie" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="form-control mb-3" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-success w-100" onClick={register}>Zarejestrować się</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;