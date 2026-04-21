import React, { useState } from "react";
import axios from "axios";
import "./../styles/register.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
  });

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errosCampos[e.target.name]) {
      setErrosCampos({ ...errosCampos, [e.target.name]: "" });
    }
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setErrosCampos({});
    setLoading(true);

    // Validação de senhas no frontend
    if (form.password !== form.confirmPassword) {
      setErro("As senhas não coincidem.");
      setErrosCampos({
        password: "As senhas não coincidem",
        confirmPassword: "As senhas não coincidem"
      });
      setLoading(false);
      return;
    }

    // Validação de tamanho da senha
    if (form.password.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      setErrosCampos({
        password: "Mínimo 6 caracteres"
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name: form.name,
        email: form.email,
        telefone: form.telefone,
        password: form.password,
        role: "cliente",
      });

      alert("✅ Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");

    } catch (error) {
      console.error("Erro detalhado:", error.response?.data);
      
      if (error.response?.data?.errors) {
        // Erros de validação do backend
        const backendErrors = error.response.data.errors;
        const mensagensErro = {};
        let primeiraMensagem = "";
        
        // Processa cada erro do backend
        Object.keys(backendErrors).forEach(campo => {
          const mensagem = backendErrors[campo][0];
          mensagensErro[campo] = mensagem;
          
          if (!primeiraMensagem) {
            primeiraMensagem = mensagem;
          }
        });
        
        setErrosCampos(mensagensErro);
        setErro(primeiraMensagem || "Por favor, corrija os erros no formulário.");
        
      } else if (error.response?.data?.message) {
        // Mensagem genérica do backend
        setErro(error.response.data.message);
      } else {
        // Erro de rede ou outro
        setErro("Erro ao conectar ao servidor. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2>Criar Conta</h2>
          <p className="subtitle">APP <span>Pest Protect</span></p>

          {erro && (
            <div className="erro-geral">
              <span className="erro-icon">⚠️</span>
              <p>{erro}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className={errosCampos.name ? 'erro-campo' : ''}
                disabled={loading}
              />
              {errosCampos.name && (
                <small className="mensagem-erro">{errosCampos.name}</small>
              )}
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={errosCampos.email ? 'erro-campo' : ''}
                disabled={loading}
              />
              {errosCampos.email && (
                <small className="mensagem-erro">{errosCampos.email}</small>
              )}
            </div>

            <div className="input-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                required
                value={form.telefone}
                onChange={handleChange}
                placeholder="+258 84 000 0000"
                className={errosCampos.telefone ? 'erro-campo' : ''}
                disabled={loading}
              />
              {errosCampos.telefone && (
                <small className="mensagem-erro">{errosCampos.telefone}</small>
              )}
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={errosCampos.password ? 'erro-campo' : ''}
                disabled={loading}
              />
              {errosCampos.password && (
                <small className="mensagem-erro">{errosCampos.password}</small>
              )}
            </div>

            <div className="input-group">
              <label>Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
                className={errosCampos.confirmPassword ? 'erro-campo' : ''}
                disabled={loading}
              />
              {errosCampos.confirmPassword && (
                <small className="mensagem-erro">{errosCampos.confirmPassword}</small>
              )}
            </div>

            <button 
              className="btn-register" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          <p className="login-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}