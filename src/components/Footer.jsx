import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";

function Footer() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTeam() {
      const snapshot = await getDocs(collection(db, "equipo"));
      if (!cancelled) {
        setTeam(snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })));
      }
    }

    loadTeam().catch(() => {
      if (!cancelled) setTeam([]);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="site-footer" id="equipo">
      <div className="footer-main">
        <div className="footer-about">
          <Link className="brand footer-brand" to="/" aria-label="Norte Tech, ir al inicio">
            <span className="brand-mark" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="brand-name">norte<span>tech</span><small>TECNOLOGÍA CON INTENCIÓN</small></span>
          </Link>
          <p>Creemos que la tecnología correcta no te distrae de tus ideas: te ayuda a hacerlas realidad.</p>
          <a className="footer-email" href="mailto:hola@nortetech.com.ar">
            hola@nortetech.com.ar <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="team-area">
          <div className="team-heading">
            <div>
              <p className="eyebrow">Personas detrás de cada detalle</p>
              <h2>Un equipo que <span>te entiende.</span></h2>
            </div>
            <span className="team-count">{String(team.length).padStart(2, "0")} / EQUIPO</span>
          </div>
          <div className="team-grid">
            {team.map((person) => (
              <article className="team-card" key={person.id}>
                {person.fotoURL ? (
                  <img className="team-avatar" src={person.fotoURL} alt={person.nombre} />
                ) : (
                  <div className="team-avatar team-avatar-fallback" aria-hidden="true">
                    {person.nombre?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <h3>{person.nombre}</h3>
                  <p>{person.rol}</p>
                </div>
                {person.linkedinURL && (
                  <a
                    className="team-arrow"
                    href={person.linkedinURL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ver LinkedIn de ${person.nombre}`}
                  >
                    ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Norte Tech. Hecho con intención.</span>
        <span>Buenos Aires, Argentina <span className="footer-location-dot" /></span>
      </div>
    </footer>
  );
}

export default Footer;
