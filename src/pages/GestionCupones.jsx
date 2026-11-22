import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";

function GestionCupones() {
  const [cupones, setCupones] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCupones() {
      try {
        const snapshot = await getDocs(collection(db, "cupones"));
        if (!cancelled) {
          setCupones(snapshot.docs.map((document) => ({
            id: document.id,
            codigo: document.data().codigo,
            porcentaje: Number(document.data().porcentaje),
          })));
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "No se pudieron cargar los cupones.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCupones();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const codigoNormalizado = codigo.trim().toUpperCase();
    const porcentajeNumero = Number(porcentaje);

    if (!codigoNormalizado) {
      setError("Ingresá un código para el cupón.");
      return;
    }

    if (!Number.isFinite(porcentajeNumero) || porcentajeNumero <= 0 || porcentajeNumero > 100) {
      setError("El porcentaje debe ser mayor que 0 y no puede superar 100.");
      return;
    }

    if (cupones.some((cupon) => cupon.codigo.trim().toUpperCase() === codigoNormalizado)) {
      setError("Ya existe un cupón con ese código.");
      return;
    }

    setIsSaving(true);
    try {
      const document = await addDoc(collection(db, "cupones"), {
        codigo: codigoNormalizado,
        porcentaje: porcentajeNumero,
      });
      setCupones((current) => [
        ...current,
        { id: document.id, codigo: codigoNormalizado, porcentaje: porcentajeNumero },
      ]);
      setCodigo("");
      setPorcentaje("");
      setNotice(`El cupón ${codigoNormalizado} fue creado.`);
    } catch (saveError) {
      setError(saveError.message || "No se pudo crear el cupón.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(cupon) {
    if (!window.confirm(`¿Querés eliminar el cupón ${cupon.codigo}?`)) return;

    try {
      await deleteDoc(doc(db, "cupones", cupon.id));
      setCupones((current) => current.filter((item) => item.id !== cupon.id));
      setNotice(`El cupón ${cupon.codigo} fue eliminado.`);
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "No se pudo eliminar el cupón.");
    }
  }

  return (
    <section className="coupon-section section-shell">
      <div className="section-heading">
        <div><p className="eyebrow">Administración</p><h2>Cupones de <span>descuento.</span></h2></div>
        <p className="section-aside">Creá códigos y definí el porcentaje aplicado por cada promoción.</p>
      </div>

      <div className="coupon-layout">
        <form className="coupon-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <div><span className="form-step">NUEVO CUPÓN</span><h3>Agregar promoción</h3></div>
          </div>
          <div className="coupon-fields">
            <label className="form-field">
              <span>Código</span>
              <input
                type="text"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
                placeholder="Ej. NORTE10"
                maxLength={20}
                required
              />
            </label>
            <label className="form-field">
              <span>Porcentaje de descuento</span>
              <input
                type="number"
                value={porcentaje}
                onChange={(event) => setPorcentaje(event.target.value)}
                placeholder="10"
                min="1"
                max="100"
                step="1"
                required
              />
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="form-success" role="status">{notice}</p>}
          <button className="button button-dark submit-button" type="submit" disabled={isSaving}>
            {isSaving ? "Creando cupón…" : "Crear cupón"} <span aria-hidden="true">↗</span>
          </button>
        </form>

        <div className="coupon-list-panel">
          <div className="coupon-list-heading">
            <h3>Cupones activos</h3>
            <span>{cupones.length}</span>
          </div>
          {isLoading ? (
            <div className="catalog-message d-flex justify-content-center align-items-center" role="status">
              <Spinner animation="border" variant="success" size="sm" />
              <span className="visually-hidden">Cargando cupones…</span>
            </div>
          ) : cupones.length === 0 ? (
            <div className="empty-state coupon-empty"><span aria-hidden="true">%</span><h3>No hay cupones</h3><p>Creá el primer descuento con el formulario.</p></div>
          ) : (
            <div className="coupon-list">
              {cupones.map((cupon) => (
                <article className="coupon-row" key={cupon.id}>
                  <div>
                    <strong>{cupon.codigo}</strong>
                    <span>{cupon.porcentaje}% de descuento</span>
                  </div>
                  <button className="danger-button" type="button" onClick={() => handleDelete(cupon)} aria-label={`Eliminar cupón ${cupon.codigo}`}>
                    <FiTrash2 aria-hidden="true" /> Eliminar
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GestionCupones;
