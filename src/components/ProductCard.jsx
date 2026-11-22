import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function ProductCard({ product, index, onCheckAvailability }) {
  const { addToCart, getCantidadActual } = useCart();
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0);
  const [isFavorite, setIsFavorite] = useState(false);
  const outOfStock = product.stock === 0;
  const cartQuantity = getCantidadActual(product.id);
  const remainingStock = Math.max(0, product.stock - cartQuantity);
  const displayedQuantity = remainingStock === 0
    ? 0
    : Math.min(quantity, remainingStock);

  return (
    <Card
      as="article"
      className="product-card"
      style={{ "--card-index": index }}
    >
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
          type="button"
          aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((favorite) => !favorite)}
        >
          {isFavorite ? <FiHeart fill="currentColor" /> : <FiHeart />}
        </button>
        <span className={`availability-label${outOfStock ? " is-out" : ""}`}>
          <span /> {outOfStock ? "Sin stock" : "Disponible"}
        </span>
      </div>
      <div className="product-content">
        <div className="product-category">{product.category}<span>★ {product.rating || "Nuevo"}</span></div>
        <h3><Link className="product-title-link" to={`/productos-nacionales/${product.id}`}>{product.name}</Link></h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price-row">
          <strong>{currency.format(product.price)}</strong>
          <span>{outOfStock ? "Consultanos" : `${product.stock} disponibles`}</span>
        </div>
        <div className="product-actions">
          <div className="quantity-picker" aria-label={`Cantidad de ${product.name}`}>
            <button
              type="button"
              aria-label="Restar una unidad"
              disabled={outOfStock || cartQuantity >= product.stock || displayedQuantity <= 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              <FiMinus />
            </button>
            <span aria-live="polite">{displayedQuantity}</span>
            <button
              type="button"
              aria-label="Sumar una unidad"
              disabled={outOfStock || displayedQuantity >= remainingStock}
              onClick={() =>
                setQuantity((current) => Math.min(product.stock, current + 1))
              }
            >
              <FiPlus />
            </button>
          </div>
          <button
            className="availability-button"
            type="button"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product, displayedQuantity);
              onCheckAvailability(product, displayedQuantity);
            }}
          >
            {outOfStock ? "Agotado" : "Agregar"} <FiShoppingCart aria-hidden="true" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
