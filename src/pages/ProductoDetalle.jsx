import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config.js";
import Notice from "../components/Notice.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Helmet } from "react-helmet";
import { Spinner } from "react-bootstrap";

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function ProductoDetalle({ products, productCollectionName, isLoading, loadError, onCheckAvailability, notice, onCloseNotice }) {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setDetailLoading(true);
      setDetailError("");
      setFetchedProduct(null);

      try {
        const preferredCollection = productCollectionName || "Productos nacionales";
        const fallbackCollection = preferredCollection === "Productos nacionales" ? "productos" : "Productos nacionales";
        let documentSnapshot = await getDoc(doc(db, preferredCollection, id));

        if (!documentSnapshot.exists() && fallbackCollection !== preferredCollection) {
          documentSnapshot = await getDoc(doc(db, fallbackCollection, id));
        }

        if (!cancelled) {
          if (documentSnapshot.exists()) {
            const data = documentSnapshot.data();
            setFetchedProduct({
              id: documentSnapshot.id,
              name: data.name ?? data.nombre ?? "Producto sin nombre",
              category: data.category ?? data.categoria ?? "General",
              description: data.description ?? data.descripcion ?? "",
              price: Number(data.price ?? data.precio ?? 0),
              stock: Number(data.stock ?? 0),
              rating: data.rating ?? data.valoracion ?? null,
              image: data.image ?? data.imagen ?? "",
              tag: data.tag ?? data.etiqueta ?? "",
            });
          } else {
            setDetailError("El documento solicitado no existe.");
          }
        }
      } catch (error) {
        if (!cancelled) setDetailError(error.message || "No se pudo cargar el producto.");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    }

    if (id) loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id, productCollectionName]);

  const product = fetchedProduct ?? products.find((item) => String(item.id) === id);

  if (isLoading || detailLoading) return (
    <div className="catalog section-shell">
      <div className="catalog-message d-flex justify-content-center align-items-center" role="status">
        <Spinner animation="border" variant="success" size="sm" />
        <span className="visually-hidden">Cargando producto…</span>
      </div>
    </div>
  );
  if (loadError) return <div className="catalog section-shell"><div className="catalog-message catalog-error" role="alert"><strong>No se pudo cargar el producto.</strong><span>{loadError}</span></div></div>;
  if (detailError) return (
    <section className="empty-state section-shell">
      <span aria-hidden="true">404</span><h1>Producto no encontrado</h1><p>{detailError}</p>
      <Link className="button button-dark" to="/productos">Volver al catálogo</Link>
    </section>
  );
  if (!product) return (
    <section className="empty-state section-shell">
      <span aria-hidden="true">404</span><h1>Producto no encontrado</h1><p>No existe un producto con el ID solicitado.</p>
      <Link className="button button-dark" to="/productos">Volver al catálogo</Link>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Norte Tech`}</title>
        <meta name="description" content={product.description || `Conocé ${product.name} en Norte Tech.`} />
      </Helmet>
      <section className="product-detail section-shell">
        <Link className="text-button detail-back" to="/productos"><span aria-hidden="true">←</span> Volver al catálogo</Link>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-copy">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <strong className="product-detail-price">{currency.format(product.price)}</strong>
            <p className={`availability-text${product.stock === 0 ? " is-out" : ""}`}><span /> {product.stock === 0 ? "Sin stock" : `${product.stock} unidades disponibles`}</p>
            {product.stock > 0 && (
              <div className="detail-quantity-row">
                <div className="quantity-picker" aria-label={`Cantidad de ${product.name}`}>
                  <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Restar una unidad">−</button>
                  <span>{quantity}</span>
                  <button type="button" disabled={quantity >= product.stock} onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} aria-label="Sumar una unidad">+</button>
                </div>
                <button
                  className="button button-dark detail-button"
                  type="button"
                  onClick={() => {
                    addToCart(product, quantity);
                    onCheckAvailability(product, quantity);
                  }}
                >
                  Agregar al carrito <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {notice && <Notice message={notice} onClose={onCloseNotice} />}
    </>
  );
}

export default ProductoDetalle;
