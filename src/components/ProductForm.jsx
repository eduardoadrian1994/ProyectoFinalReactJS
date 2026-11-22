import { useEffect, useState } from "react";

const MAX_IMAGE_SIZE = 600 * 1024;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("No se pudo procesar la imagen seleccionada."));
      }
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));
    reader.readAsDataURL(file);
  });
}

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  image: null,
  oferta: false,
};

function ProductForm({ products, productoAEditar, onAddProduct, onUpdateProduct, onCancelEdit }) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [datosForm, setDatosForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (productoAEditar) {
        setDatosForm({
          name: productoAEditar.name ?? "",
          category: productoAEditar.category ?? "",
          description: productoAEditar.description ?? "",
          price: String(productoAEditar.price ?? ""),
          stock: String(productoAEditar.stock ?? ""),
          image: null,
          oferta: productoAEditar.oferta === true,
        });
        setError("");
      } else {
        setDatosForm(EMPTY_FORM);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [productoAEditar]);

  const nextId =
    products.reduce((highestId, product) => Math.max(highestId, Number(product.id) || 0), 0) + 1;
  const modoEdicion = Boolean(productoAEditar);

  function updateField(field, value) {
    setDatosForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const name = datosForm.name.trim();
    const category = datosForm.category.trim();
    const description = datosForm.description.trim();
    const price = Number(datosForm.price);
    const stock = Number(datosForm.stock);

    if (!name) {
      const message = "El nombre del producto no puede estar vacío.";
      setError(message);
      window.alert(message);
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      const message = "El precio debe ser un valor numérico mayor que cero.";
      setError(message);
      window.alert(message);
      return;
    }

    if (!category || !description) {
      const message = "Completá la categoría y la descripción.";
      setError(message);
      window.alert(message);
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      const message = "El stock no puede ser negativo y debe expresarse en unidades enteras.";
      setError(message);
      window.alert(message);
      return;
    }

    const imageFile = datosForm.image;
    let image = productoAEditar?.image ?? "";

    if (imageFile instanceof File) {
      if (imageFile.size === 0) {
        setError("Elegí una imagen válida para identificar el producto.");
        return;
      }

      if (!imageFile.type.startsWith("image/")) {
        setError("El archivo seleccionado debe ser una imagen.");
        return;
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        setError("La imagen debe pesar 600 KB o menos.");
        return;
      }
    } else if (!modoEdicion && !image) {
      setError("Elegí una imagen para identificar el producto.");
      return;
    }

    setIsSaving(true);
    try {
      if (imageFile instanceof File) {
        image = await readImage(imageFile);
      }

      const productoFinal = {
        id: modoEdicion ? productoAEditar.id : undefined,
        name,
        category,
        description,
        price,
        stock,
        rating: modoEdicion ? (productoAEditar.rating ?? null) : null,
        image,
        tag: modoEdicion ? (productoAEditar.tag ?? "") : "Recién llegado",
        oferta: datosForm.oferta,
      };

      if (modoEdicion) {
        await onUpdateProduct(productoFinal);
        onCancelEdit();
      } else {
        await onAddProduct({ ...productoFinal, id: nextId });
        setDatosForm(EMPTY_FORM);
      }
    } catch (readError) {
      const message = readError.message || "No se pudo guardar el producto.";
      setError(message);
      window.alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <span className="form-step">{modoEdicion ? "EDITANDO PRODUCTO" : "NUEVO PRODUCTO"}</span>
          <h3>{modoEdicion ? "Editar producto" : "Agregar nuevo producto"}</h3>
        </div>
        <span className="form-id">
          {modoEdicion ? `ID ${productoAEditar.id}` : `ID #${String(nextId).padStart(3, "0")}`}
        </span>
      </div>
      <div className="form-fields">
        <label className="form-field">
          <span>Nombre del producto</span>
          <input name="name" type="text" value={datosForm.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ej. Cámara compacta" required maxLength={70} />
        </label>
        <label className="form-field">
          <span>Categoría</span>
          <input name="category" type="text" value={datosForm.category} onChange={(event) => updateField("category", event.target.value)} placeholder="Ej. Fotografía" required maxLength={35} />
        </label>
        <label className="form-field">
          <span>Precio <small>ARS</small></span>
          <input name="price" type="number" value={datosForm.price} onChange={(event) => updateField("price", event.target.value)} placeholder="0" min="1" step="1" required />
        </label>
        <label className="form-field">
          <span>Unidades disponibles</span>
          <input name="stock" type="number" value={datosForm.stock} onChange={(event) => updateField("stock", event.target.value)} placeholder="0" min="0" step="1" required />
        </label>
        <label className="form-field form-field-wide">
          <span>Descripción breve</span>
          <input name="description" type="text" value={datosForm.description} onChange={(event) => updateField("description", event.target.value)} placeholder="¿Qué lo hace especial?" required maxLength={100} />
        </label>
        <label className="form-field form-field-wide offer-field">
          <input name="oferta" type="checkbox" checked={datosForm.oferta} onChange={(event) => updateField("oferta", event.target.checked)} />
          <span>Mostrar este producto en las ofertas de Inicio</span>
        </label>
        <label className="form-field form-field-wide upload-field">
          <span>Imagen del producto</span>
          <input name="image" type="file" accept="image/*" required={!modoEdicion} onChange={(event) => updateField("image", event.target.files?.[0] ?? null)} />
          <small>{modoEdicion ? "Dejá vacío para conservar la imagen actual" : "JPG, PNG o WebP · Hasta 600 KB"}</small>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button className="button button-dark submit-button" type="submit" disabled={isSaving}>
          {isSaving ? (modoEdicion ? "Actualizando producto…" : "Agregando producto…") : (modoEdicion ? "Actualizar producto" : "Guardar producto")}
          {!isSaving && <span aria-hidden="true">↗</span>}
        </button>
        {modoEdicion && (
          <button className="cancel-edit-button" type="button" onClick={onCancelEdit} disabled={isSaving}>
            Cancelar edición
          </button>
        )}
      </div>
      <p className="form-footnote">{modoEdicion ? "Los cambios se guardarán en Firestore." : "El producto aparecerá en la selección al instante."}</p>
    </form>
  );
}

export default ProductForm;
