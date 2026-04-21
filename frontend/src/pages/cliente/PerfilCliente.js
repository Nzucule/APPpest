import React, { useState, useEffect } from "react";
import SidebarCliente from "../../components/SidebarCliente";
import HeaderCliente from "../../components/HeaderCliente";
import axios from "../../api";
import "../../styles/PerfilCliente.css";

export default function PerfilCliente() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    password: "",
    password_confirmation: ""
  });

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const response = await axios.get("/perfil");
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          telefone: userData.telefone || "",
          password: "",
          password_confirmation: ""
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        telefone: userData?.telefone || "",
        password: "",
        password_confirmation: ""
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Validação de senha
    if (formData.password && formData.password.length < 6) {
      setMessage("❌ A senha deve ter no mínimo 6 caracteres.");
      setSaving(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setMessage("❌ As senhas não coincidem.");
      setSaving(false);
      return;
    }

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        telefone: formData.telefone
      };

      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }

      const response = await axios.put("/perfil", dataToSend);
      
      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setMessage("✅ Perfil atualizado com sucesso!");
        
        setFormData(prev => ({
          ...prev,
          password: "",
          password_confirmation: ""
        }));
      } else {
        setMessage("❌ " + (response.data.message || "Erro ao atualizar perfil."));
      }
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      
      if (error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        setMessage("❌ " + errors.join(", "));
      } else {
        setMessage("❌ Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <SidebarCliente mobileOpen={mobileMenuOpen} />
        <div className="main-content">
          <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <div className="perfil-container">
            <div className="loading-perfil">
              <div className="loading-spinner"></div>
              <p>Carregando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SidebarCliente mobileOpen={mobileMenuOpen} />
      <div className="main-content">
        <HeaderCliente onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="perfil-container">
          <div className="perfil-header">
            <div className="foto-placeholder">
              <div className="avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="perfil-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <p className="user-role">Cliente</p>
            </div>
          </div>

          {message && (
            <div className={`mensagem ${message.includes('✅') ? 'mensagem-sucesso' : 'mensagem-erro'}`}>
              {message}
            </div>
          )}

          <form className="perfil-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nome Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(+258) 84 123 4567"
                  disabled={saving}
                />
              </div>

              <div className="form-group full-width">
                <h3 className="section-senha">Alterar Senha</h3>
                <p className="help-text">Deixe em branco para manter a senha atual</p>
              </div>

              <div className="form-group">
                <label htmlFor="password">Nova Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_confirmation">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  disabled={saving}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-salvar"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="loading-btn"></div>
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}