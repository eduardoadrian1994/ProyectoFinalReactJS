import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="empty-state section-shell">
      <span aria-hidden="true">404</span>
      <h1>Página no encontrada</h1>
      <p>La ruta que buscás no existe en este proyecto.</p>
      <Link className="button button-dark" to="/">Volver al inicio</Link>
    </section>
  );
}

export default NotFound;
