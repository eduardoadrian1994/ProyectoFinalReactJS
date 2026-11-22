import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function Carrito() {
  const navigate = useNavigate();
  const {
    cart,
    clearCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  function finishPurchase() {
    clearCart();
    navigate("/", { replace: true });
  }

  if (cart.length === 0) {
    return (
      <section className="cart-page section-shell">
        <div className="empty-state cart-empty">
          <span aria-hidden="true">🛒</span>
          <h1>Tu carrito está vacío</h1>
          <p>Sumá tecnología y encontrá tu próximo favorito.</p>
          <Link className="button button-dark" to="/productos">
            Ir al catálogo <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page section-shell">
      <div className="section-heading cart-heading">
        <div>
          <p className="eyebrow">Tu selección</p>
          <h1>Carrito de compras</h1>
        </div>
        <button className="text-button" type="button" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <p className="cart-item-category">{item.category}</p>
                <h2>{item.name}</h2>
                <p>{currency.format(item.price)} por unidad</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-picker" aria-label={`Cantidad de ${item.name}`}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Restar una unidad de ${item.name}`}><FiMinus aria-hidden="true" /></button>
                  <span>{item.quantity}</span>
                  <button type="button" disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Sumar una unidad de ${item.name}`}><FiPlus aria-hidden="true" /></button>
                </div>
                <strong>{currency.format(item.price * item.quantity)}</strong>
                <button className="cart-remove" type="button" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name} del carrito`}>
                  <FiTrash2 aria-hidden="true" /> Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <p className="eyebrow">Resumen</p>
          <div><span>Productos</span><strong>{cart.reduce((total, item) => total + item.quantity, 0)}</strong></div>
          <div className="cart-total"><span>Total</span><strong>{currency.format(getCartTotal())}</strong></div>
          <button className="button button-dark cart-checkout" type="button" onClick={finishPurchase}>
            Finalizar compra <span aria-hidden="true">↗</span>
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Carrito;
