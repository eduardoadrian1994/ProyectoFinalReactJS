import Notice from "../components/Notice.jsx";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ProductCard from "../components/ProductCard.jsx";

function Destacados({ products, isLoading, loadError, onCheckAvailability, notice, onCloseNotice }) {
  const featured = products.filter((product) => product.tag || product.rating >= 4.8);

  return (
    <>
      <Helmet>
        <title>Destacados | Norte Tech</title>
        <meta name="description" content="Descubrí una selección de productos destacados de Norte Tech." />
      </Helmet>
      <section className="catalog section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">Selección destacada</p><h2>Los favoritos de <span>nuestra comunidad.</span></h2></div>
          <p className="section-aside">Productos elegidos por su diseño, utilidad y valoración.</p>
        </div>
        {isLoading && <div className="catalog-message d-flex justify-content-center align-items-center" role="status"><Spinner animation="border" variant="success" size="sm" /><span className="visually-hidden">Preparando destacados…</span></div>}
        {!isLoading && loadError && <div className="catalog-message catalog-error" role="alert"><strong>No pudimos cargar destacados.</strong><span>{loadError}</span></div>}
        {!isLoading && !loadError && (
          <Container fluid className="p-0">
            <Row className="g-3 g-md-4">
              {featured.map((product, index) => (
                <Col xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard product={product} index={index} onCheckAvailability={onCheckAvailability} />
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </section>
      {notice && <Notice message={notice} onClose={onCloseNotice} />}
    </>
  );
}

export default Destacados;
