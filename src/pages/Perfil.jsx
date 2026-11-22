import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Perfil() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    clearCart();
    navigate("/", { replace: true });
  }

  return (
    <section className="profile-page section-shell">
      <div className="profile-card">
        <p className="eyebrow">Mi cuenta</p>
        <h1>¡Hola de nuevo, <span>{user.email}!</span></h1>
        <p>Tu sesión está activa y tu rol es <strong>{user.rol === "admin" ? "administrador" : "usuario"}</strong>.</p>
        <button className="auth-submit" type="button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}

export default Perfil;
