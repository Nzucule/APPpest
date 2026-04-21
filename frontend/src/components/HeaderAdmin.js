import "../styles/HeaderAdmin.css";

export default function HeaderAdmin({ onMenuToggle }) {
  return (
    <header className="admin-header">
      <button className="menu-btn" onClick={onMenuToggle}>☰</button>
      <h3>Administração do APP All Pest Protect</h3>
    </header>
  );
}
