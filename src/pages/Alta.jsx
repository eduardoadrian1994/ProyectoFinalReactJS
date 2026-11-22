import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Spinner } from "react-bootstrap";
import Notice from "../components/Notice.jsx";
import ProductForm from "../components/ProductForm.jsx";
import { DeleteButton, EditButton } from "../components/StyledActions.jsx";

function Alta({ products, isLoading, loadError, onAddProduct, onUpdateProduct, onDeleteProduct, notice, onCloseNotice }) {
  const [productoAEditar, setProductoAEditar] = useState(null);

  return (
    <>
      <section className="add-product-section section-shell">
        <div className="add-product-copy">
          <p className="eyebrow">¿Tenés una novedad?</p>
          <h2>Sumala a la <span>selección.</span></h2>
          <p>Cargá un producto con sus datos y mirá cómo se incorpora al catálogo en el momento.</p>
          <div className="form-benefit"><span aria-hidden="true">↳</span> Se actualiza sin recargar la página</div>
        </div>
        {!isLoading && loadError ? (
          <div className="catalog-message catalog-error" role="alert"><strong>No se pudo cargar el catálogo.</strong><span>{loadError}</span></div>
        ) : (
          <ProductForm
            products={products}
            productoAEditar={productoAEditar}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onCancelEdit={() => setProductoAEditar(null)}
          />
        )}
      </section>
      <section className="product-management section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">Gestión del catálogo</p><h2>Productos <span>existentes.</span></h2></div>
          <p className="section-aside">{products.length} documentos disponibles en Firestore.</p>
        </div>
        {isLoading ? (
          <div className="catalog-message d-flex justify-content-center align-items-center" role="status">
            <Spinner animation="border" variant="success" size="sm" />
            <span className="visually-hidden">Cargando productos…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true">⌂</span><h3>No hay productos cargados</h3><p>Agregá el primer documento desde el formulario.</p></div>
        ) : (
          <div className="management-list">
            {products.map((product) => (
              <article className="management-row" key={product.id}>
                <img src={product.image} alt="" />
                <div className="management-info">
                  <strong>{product.name}</strong>
                  <span>{product.category} · Stock: {product.stock}</span>
                </div>
                <span className="management-price">
                  {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price)}
                </span>
                <div className="management-actions">
                  <EditButton
                    type="button"
                    onClick={() => setProductoAEditar(product)}
                  >
                    <FiEdit2 aria-hidden="true" /> Editar
                  </EditButton>
                  <DeleteButton
                    type="button"
                    onClick={() => onDeleteProduct(product)}
                  >
                    <FiTrash2 aria-hidden="true" /> Eliminar
                  </DeleteButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {notice && <Notice message={notice} onClose={onCloseNotice} />}
    </>
  );
}

export default Alta;
