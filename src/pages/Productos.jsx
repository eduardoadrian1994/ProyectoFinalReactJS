import Notice from "../components/Notice.jsx";
import ProductList from "../components/ProductList.jsx";
import { Helmet } from "react-helmet";
import { Spinner } from "react-bootstrap";

function Productos({ products, isLoading, loadError, onCheckAvailability, notice, onCloseNotice, hasMore, isLoadingMore, onLoadMore, onShowLess, productsPerPage }) {
  return (
    <>
      <Helmet>
        <title>Productos | Norte Tech</title>
        <meta name="description" content="Explorá productos tecnológicos disponibles, filtrados por categoría y búsqueda." />
      </Helmet>
      <section className="catalog section-shell" id="catalogo">
        <div className="section-heading">
          <div><p className="eyebrow">Un mundo de posibilidades</p><h2>Encontrá tu próximo <span>favorito.</span></h2></div>
          <p className="section-aside">Tecnología útil, diseño cuidado y una selección que vale la pena.</p>
        </div>
        {isLoading && <div className="catalog-message d-flex justify-content-center align-items-center" role="status"><Spinner animation="border" variant="success" size="sm" /><span className="visually-hidden">Preparando una selección para vos…</span></div>}
        {!isLoading && loadError && <div className="catalog-message catalog-error" role="alert"><strong>No pudimos abrir el catálogo.</strong><span>{loadError}</span></div>}
        {!isLoading && !loadError && (
          <ProductList
            products={products}
            onCheckAvailability={onCheckAvailability}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            onShowLess={onShowLess}
            productsPerPage={productsPerPage}
          />
        )}
      </section>
      {notice && <Notice message={notice} onClose={onCloseNotice} />}
    </>
  );
}

export default Productos;
