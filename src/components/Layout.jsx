import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido-principal">Ir al contenido principal</a>
      <Header />
      <main id="contenido-principal">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
