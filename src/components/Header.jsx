import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { FiShoppingCart, FiUser } from "react-icons/fi";

function Header() {
  const { getCartQuantity, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartQuantity = getCartQuantity();

  async function handleLogout() {
    await logout();
    clearCart();
    navigate("/", { replace: true });
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Norte Tech, ir al inicio">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="brand-name">norte<span>tech</span><small>TECNOLOGÍA CON INTENCIÓN</small></span>
      </Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/destacados">Destacados</NavLink>
        {user?.rol === "admin" && <NavLink to="/alta">Gestión</NavLink>}
        {user?.rol === "admin" && <NavLink to="/admin/cupones">Cupones</NavLink>}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <Link className="profile-link" to="/perfil" title={user.email}>
              <FiUser aria-hidden="true" />
              <span>Perfil</span>
              <strong>{user.email}</strong>
            </Link>
            <button className="header-logout" type="button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link className="header-cta login-link" to="/login">Login</Link>
        )}
      </div>
      <Link className="header-cta cart-widget" to="/carrito" aria-label={`Ver carrito, ${cartQuantity} productos`}>
        <FiShoppingCart aria-hidden="true" />
        <span className="cart-widget-label">Carrito</span>
        <span className="cart-count">{cartQuantity}</span>
      </Link>
    </header>
  );
}

export default Header;
