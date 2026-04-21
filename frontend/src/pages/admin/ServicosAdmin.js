import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin";
import "../../styles/ServicosAdmin.css";
import api from "../../api";

export default function ServicosAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "Sob consulta",
    duracao: "2-4 horas",
    tipo_servico: "Para residências, empresas e indústrias",
    categoria: "fumigacao",
    imagem: null
  });

  // Carregar serviços
  const carregarServicos = async () => {
    try {
      const res = await api.get("/servicos");
      setServicos(res.data);
    } catch (err) {
      console.log("Erro ao carregar serviços:", err);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const abrirModalCriar = () => {
    setEditando(null);
    setErro("");
    setForm({
      nome: "",
      descricao: "",
      preco: "Sob consulta",
      duracao: "2-4 horas",
      tipo_servico: "Para residências, empresas e indústrias",
      categoria: "fumigacao",
      imagem: null
    });
    setPreviewImg(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (s) => {
    setEditando(s.id);
    setErro("");
    setForm({
      nome: s.nome || "",
      descricao: s.descricao || "",
      preco: s.preco || "Sob consulta",
      duracao: s.duracao || "2-4 horas",
      tipo_servico: s.tipo_servico || "Para residências, empresas e indústrias",
      categoria: s.categoria || "fumigacao",
      imagem: null
    });
    setPreviewImg(s.imagem_url);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, imagem: file });

    if (file) {
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  // Criar / Atualizar
  const salvar = async () => {
    try {
      setErro("");
      
      // Validação básica
      if (!form.nome || !form.descricao) {
        setErro("Nome e descrição são obrigatórios");
        return;
      }

      const dados = new FormData();

      dados.append("nome", form.nome);
      dados.append("descricao", form.descricao);
      dados.append("preco", form.preco);
      dados.append("duracao", form.duracao);
      dados.append("tipo_servico", form.tipo_servico);
      dados.append("categoria", form.categoria);

      if (form.imagem) {
        dados.append("imagem", form.imagem);
      }

      let response;
      
      if (editando) {
        // Para edição, usar POST com _method PUT
        response = await api.post(`/servicos/${editando}?_method=PUT`, dados, {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Serviço atualizado:", response.data);
      } else {
        // Para criação
        response = await api.post("/servicos", dados, {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Serviço criado:", response.data);
      }

      setModalOpen(false);
      carregarServicos();
      
    } catch (err) {
      console.log("Erro detalhado:", err.response?.data);
      
      if (err.response?.data?.errors) {
        // Mostrar erros de validação do backend
        const mensagens = Object.values(err.response.data.errors).flat();
        setErro(mensagens.join(", "));
      } else if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else {
        setErro("Erro ao salvar serviço. Verifique os dados e tente novamente.");
      }
    }
  };

  const excluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servicos/${id}`);
      carregarServicos();
    } catch (err) {
      console.log("Erro ao excluir:", err);
      alert("Erro ao excluir serviço");
    }
  };

  // Função para obter cor da categoria
  const getCategoriaCor = (categoria) => {
    switch(categoria) {
      case 'fumigacao': return '#0B4F6C';
      case 'desratizacao': return '#2C3E50';
      case 'termico': return '#f39c12';
      default: return '#0B4F6C';
    }
  };

  // Função para obter ícone da categoria
  const getCategoriaIcon = (categoria) => {
    switch(categoria) {
      case 'fumigacao': return '💨';
      case 'desratizacao': return '🐀';
      case 'termico': return '🔥';
      default: return '🔬';
    }
  };

  return (
    <div className="dashboard">
      <SidebarAdmin mobileOpen={mobileMenuOpen} />

      <div className="main-content">
        <HeaderAdmin onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="header-pagina">
          <h2 className="titulo-pagina">Gerenciar Serviços</h2>
          <button className="btn-add" onClick={abrirModalCriar}>
            + Novo Serviço
          </button>
        </div>

        <div className="cards-container" style={{ marginBottom: '30px' }}>
          <div className="card-resumo" style={{ borderTop: '4px solid #0B4F6C' }}>
            <div className="card-content">
              <h4>Total de Serviços</h4>
              <p className="card-valor">{servicos.length}</p>
            </div>
          </div>
        </div>

        <table className="tabela-servicos">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Duração</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {servicos.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.imagem_url ? (
                    <img src={s.imagem_url} className="img-servico" alt={s.nome} />
                  ) : (
                    <div className="img-placeholder" style={{ background: getCategoriaCor(s.categoria) }}>
                      {getCategoriaIcon(s.categoria)}
                    </div>
                  )}
                </td>
                <td><strong>{s.nome}</strong></td>
                <td>
                  <span className="badge-categoria" style={{ 
                    background: getCategoriaCor(s.categoria) + '20',
                    color: getCategoriaCor(s.categoria)
                  }}>
                    {s.categoria === 'fumigacao' ? 'Fumigação' :
                     s.categoria === 'desratizacao' ? 'Desratização' : 'Tratamento Térmico'}
                  </span>
                </td>
                <td>{s.tipo_servico}</td>
                <td>{s.preco}</td>
                <td>{s.duracao}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(s)}>
                    Editar
                  </button>
                  <button className="btn-excluir" onClick={() => excluir(s.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal-bg" onClick={() => setModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>{editando ? "Editar Serviço" : "Novo Serviço"}</h3>
              
              {erro && (
                <div className="erro-mensagem" style={{
                  background: '#fee',
                  color: '#c00',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  {erro}
                </div>
              )}

              <div className="form-group">
                <label>Nome do Serviço *</label>
                <input
                  type="text"
                  placeholder="Ex: Fumigação Profissional"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="fumigacao">Fumigação</option>
                    <option value="desratizacao">Desratização</option>
                    <option value="termico">Tratamento Térmico</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo de Serviço *</label>
                  <select
                    value={form.tipo_servico}
                    onChange={(e) => setForm({ ...form, tipo_servico: e.target.value })}
                  >
                    <option value="Para residências, empresas e indústrias">
                      Para residências, empresas e indústrias
                    </option>
                    <option value="Apenas residências">Apenas residências</option>
                    <option value="Apenas empresas">Apenas empresas</option>
                    <option value="Apenas indústrias">Apenas indústrias</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço *</label>
                  <input
                    type="text"
                    placeholder="Ex: Sob consulta ou 2500 MT"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Duração *</label>
                  <input
                    type="text"
                    placeholder="Ex: 2-4 horas"
                    value={form.duracao}
                    onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  placeholder="Descrição completa do serviço"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Imagem</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <small style={{ color: '#64748B' }}>Tamanho máximo: 2MB</small>
              </div>

              {previewImg && (
                <div className="preview-container">
                  <img src={previewImg} className="preview-img" alt="preview" />
                </div>
              )}

              <div className="modal-buttons">
                <button className="btn-salvar" onClick={salvar}>
                  {editando ? "Atualizar" : "Salvar"}
                </button>
                <button className="btn-fechar" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}