import React from "react";
import LogoutButton from "../../components/LogoutButton";

function DashboardBarbeiro() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bem-vindo, {user.name} </h1>
      
      <LogoutButton />
    </div>
  );
}

export default DashboardBarbeiro;
