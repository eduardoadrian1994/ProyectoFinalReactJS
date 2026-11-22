import { Link } from "react-router-dom";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ProductCard from "../components/ProductCard.jsx";

function Inicio({ products, isLoading, loadError }) {
  return (
    <>
      <Helmet>
        <title>Inicio | Norte Tech</title>
        <meta name="description" content="Tecnología elegida para crear, trabajar y disfrutar cada día." />
      </Helmet>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Tecnología elegida para vos</p>
          <h1>Ideas grandes.<br /><span>Tecnología a tu ritmo.</span></h1>
          <p className="hero-description">
            Encontrá ese próximo compañero para crear, trabajar y disfrutar cada día.
          </p>
          <Link className="button button-dark hero-button" to="/productos">
            Explorar productos <span aria-hidden="true">↘</span>
          </Link>
        </div>
        <div className="hero-art" aria-label="Notebook abierta sobre un escritorio">
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=90" alt="Notebook sobre un escritorio" />
          <div className="hero-sticker"><span className="sticker-spark" aria-hidden="true">✳</span><span>Elegí bien.<br /><strong>Disfrutá más.</strong></span></div>
        </div>
        <div className="hero-vertical">NORTE TECH · BUENOS AIRES</div>
      </section>

      <section className="catalog section-shell">
        <div className="section-heading">
          <div><p className="eyebrow">Un mundo de posibilidades</p><h2>Encontrá tu próximo <span>favorito.</span></h2></div>
          <Link className="text-button" to="/destacados">Ver destacados <span aria-hidden="true">↗</span></Link>
        </div>
        {isLoading && <div className="catalog-message d-flex justify-content-center align-items-center" role="status"><Spinner animation="border" variant="success" size="sm" /><span className="visually-hidden">Preparando una selección para vos…</span></div>}
        {!isLoading && loadError && <div className="catalog-message catalog-error" role="alert"><strong>No pudimos abrir el catálogo.</strong><span>{loadError}</span></div>}
        {!isLoading && !loadError && (
          <Container fluid className="p-0">
            <Row className="g-3 g-md-4">
              {products.map((product, index) => (
                <Col xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard product={product} index={index} onCheckAvailability={() => {}} />
                </Col>
              ))}
            </Row>
            {products.length === 0 && (
              <p className="catalog-message">Todavía no hay productos marcados en oferta.</p>
            )}
          </Container>
        )}
      </section>
    </>
  );
}

export default Inicio;
