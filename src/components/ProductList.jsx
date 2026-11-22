import { useMemo, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import ProductCard from "./ProductCard.jsx";

function ProductList({ products, onCheckAvailability, hasMore, isLoadingMore, onLoadMore, onShowLess, productsPerPage }) {
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [search, setSearch] = useState("");
  const categories = useMemo(
    () => ["Todo", ...new Set(products.map((product) => product.category))],
    [products],
  );
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todo" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        `${product.name} ${product.description} ${product.category}`
          .toLocaleLowerCase("es")
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, search]);

  return (
    <>
      <div className="catalog-controls">
        <div className="category-filters" aria-label="Filtrar por categoría">
          {categories.map((category) => (
            <button
              className={`filter-chip${activeCategory === category ? " is-active" : ""}`}
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="search-field">
          <span className="search-icon" aria-hidden="true"><FiSearch /></span>
          <span className="visually-hidden">Buscar productos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="¿Qué estás buscando?"
          />
          <kbd>/</kbd>
        </label>
      </div>
      <div className="catalog-meta">
        <span>{visibleProducts.length} productos para descubrir</span>
        <span className="catalog-meta-right"><span className="stock-dot" /> Stock actualizado</span>
      </div>
      {visibleProducts.length > 0 ? (
        <Container fluid className="p-0">
          <Row className="g-3 g-md-4">
            {visibleProducts.map((product, index) => (
              <Col xs={12} sm={6} lg={4} key={product.id}>
                <ProductCard
                  product={product}
                  index={index}
                  onCheckAvailability={onCheckAvailability}
                />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>No encontramos ese producto</h3>
          <p>Probá con otro nombre o elegí una categoría diferente.</p>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("Todo");
            }}
          >
            Limpiar filtros <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}
      {products.length > 0 && (
        <Col className="pagination-controls text-center d-flex justify-content-center align-items-center gap-2 mt-4">
          {products.length > productsPerPage && (
            <Button variant="secondary" type="button" onClick={onShowLess} aria-label="Mostrar la primera página de productos">
              Ver menos
            </Button>
          )}
          {hasMore ? (
            <Button variant="dark" type="button" onClick={onLoadMore} disabled={isLoadingMore} aria-label="Cargar más productos">
              {isLoadingMore ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Cargando…</span>
                </>
              ) : "Cargar más"}
            </Button>
          ) : products.length > productsPerPage ? (
            <Alert variant="light" className="m-0">No hay más productos para mostrar.</Alert>
          ) : null}
        </Col>
      )}
    </>
  );
}

export default ProductList;
