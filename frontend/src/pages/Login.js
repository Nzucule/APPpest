import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirecionar por perfil
      switch (user.role) {
        case "cliente":
          navigate("/cliente/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError("Credenciais inválidas! Verifique seu email e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>APP All Pest Protect</h1>
          <p>Sistema de Controlo de Pragas e Desinfestação</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Acesse sua conta</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="form-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                </svg>
            </div>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <div className="form-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
               </svg>
            </div>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? <div className="loading"></div> : "Entrar no Sistema"}
          </button>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>Ainda não tem conta?</p>
            <a href="/register" className="create-account-link">
              Criar Conta
            </a>
          </div>
        </form>
      </div>

      <div className="system-info">
        <h3>APP All Pest Protect</h3>
        <p>Sua vida longe de pragas!</p>
      </div>
    </div>
  );
}

export default Login;