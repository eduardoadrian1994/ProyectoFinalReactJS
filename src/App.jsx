import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, startAfter, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase/config.js";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inicio = lazy(() => import("./pages/Inicio.jsx"));
const Productos = lazy(() => import("./pages/Productos.jsx"));
const Destacados = lazy(() => import("./pages/Destacados.jsx"));
const Alta = lazy(() => import("./pages/Alta.jsx"));
const ProductoDetalle = lazy(() => import("./pages/ProductoDetalle.jsx"));
const Carrito = lazy(() => import("./pages/Carrito.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const GestionCupones = lazy(() => import("./pages/GestionCupones.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Registro = lazy(() => import("./pages/Registro.jsx"));
const Perfil = lazy(() => import("./pages/Perfil.jsx"));

const PRODUCTOS_POR_PAGINA = 4;

function mapFirestoreProduct(document) {
  const data = document.data();
  return {
    id: document.id,
    name: data.name ?? data.nombre ?? "Producto sin nombre",
    category: data.category ?? data.categoria ?? "General",
    description: data.description ?? data.descripcion ?? "",
    price: Number(data.price ?? data.precio ?? 0),
    stock: Number(data.stock ?? 0),
    rating: data.rating ?? data.valoracion ?? null,
    image: data.image ?? data.imagen ?? "",
    tag: data.tag ?? data.etiqueta ?? "",
    oferta: data.oferta === true,
  };
}

function App() {
  const [products, setProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [productCollectionName, setProductCollectionName] = useState("Productos nacionales");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        let collectionName = "Productos nacionales";
        let snapshot = await getDocs(query(collection(db, collectionName), limit(PRODUCTOS_POR_PAGINA)));

        if (snapshot.empty) {
          collectionName = "productos";
          snapshot = await getDocs(query(collection(db, collectionName), limit(PRODUCTOS_POR_PAGINA)));
        }
        const offersSnapshot = await getDocs(query(
          collection(db, collectionName),
          where("oferta", "==", true),
        ));
        if (!cancelled) setProductCollectionName(collectionName);
        const lastDocument = snapshot.docs[snapshot.docs.length - 1] ?? null;
        if (!cancelled) {
          setProducts(snapshot.docs.map(mapFirestoreProduct));
          setOfferProducts(offersSnapshot.docs.map(mapFirestoreProduct));
          setLastVisible(lastDocument);
          setHasMore(snapshot.docs.length === PRODUCTOS_POR_PAGINA);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Ocurrió un error al cargar el catálogo.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMoreProducts() {
    if (!lastVisible || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, productCollectionName),
        startAfter(lastVisible),
        limit(PRODUCTOS_POR_PAGINA),
      ));
      const additionalProducts = snapshot.docs.map(mapFirestoreProduct);
      setProducts((currentProducts) => [...currentProducts, ...additionalProducts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] ?? lastVisible);
      setHasMore(snapshot.docs.length === PRODUCTOS_POR_PAGINA);
    } catch (error) {
      setLoadError(error.message || "No se pudieron cargar más productos.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function showInitialProducts() {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, productCollectionName),
        limit(PRODUCTOS_POR_PAGINA),
      ));
      setProducts(snapshot.docs.map(mapFirestoreProduct));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === PRODUCTOS_POR_PAGINA);
      setLoadError("");
    } catch (error) {
      setLoadError(error.message || "No se pudo reiniciar el catálogo.");
    } finally {
      setIsLoading(false);
    }
  }

  async function addProduct(product) {
    const document = await addDoc(collection(db, productCollectionName), {
      name: product.name,
      nombre: product.name,
      category: product.category,
      categoria: product.category,
      description: product.description,
      descripcion: product.description,
      price: product.price,
      precio: product.price,
      stock: product.stock,
      image: product.image,
      imagen: product.image,
      rating: product.rating,
      tag: product.tag,
      oferta: product.oferta,
    });

    setProducts((currentProducts) => [
      ...currentProducts,
      { ...product, id: document.id },
    ]);
    if (product.oferta) {
      setOfferProducts((currentProducts) => [...currentProducts, { ...product, id: document.id }]);
    }
    setNotice(`${product.name} ya forma parte del catálogo.`);
    toast.success(`${product.name} fue agregado al catálogo.`);
  }

  async function updateProduct(product) {
    await updateDoc(doc(db, productCollectionName, product.id), {
      name: product.name,
      nombre: product.name,
      category: product.category,
      categoria: product.category,
      description: product.description,
      descripcion: product.description,
      price: product.price,
      precio: product.price,
      stock: product.stock,
      image: product.image,
      imagen: product.image,
      rating: product.rating,
      tag: product.tag,
      oferta: product.oferta,
    });

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id ? { ...currentProduct, ...product } : currentProduct,
      ),
    );
    setOfferProducts((currentProducts) => {
      const updatedOffers = currentProducts.filter((currentProduct) => currentProduct.id !== product.id);
      return product.oferta
        ? [...updatedOffers, { ...product }]
        : updatedOffers;
    });
    setNotice(`${product.name} fue actualizado correctamente.`);
    toast.success(`${product.name} fue actualizado.`);
  }

  async function deleteProduct(product) {
    if (!window.confirm(`¿Querés eliminar "${product.name}" del catálogo?`)) return;

    try {
      await deleteDoc(doc(db, productCollectionName, product.id));
      setProducts((currentProducts) =>
        currentProducts.filter((currentProduct) => currentProduct.id !== product.id),
      );
      setOfferProducts((currentProducts) =>
        currentProducts.filter((currentProduct) => currentProduct.id !== product.id),
      );
      setNotice(`${product.name} fue eliminado del catálogo.`);
      toast.success(`${product.name} fue eliminado.`);
    } catch (error) {
      setNotice(error.message || `No se pudo eliminar ${product.name}.`);
    }
  }

  function showAvailability(product, quantity) {
    if (product.stock < quantity) {
      setNotice(`Solo quedan ${product.stock} unidades de ${product.name}.`);
      toast.warn(`Solo quedan ${product.stock} unidades de ${product.name}.`);
      return;
    }

    setNotice(
      `Se agregaron ${quantity} ${quantity === 1 ? "unidad" : "unidades"} de ${product.name} al carrito.`,
    );
    toast.success(`${quantity} ${quantity === 1 ? "unidad" : "unidades"} agregada(s) al carrito.`);
  }

  return (
    <>
      <Helmet>
        <title>Norte Tech | Tecnología elegida para vos</title>
        <meta name="description" content="Tecnología útil, diseño cuidado y una selección de productos pensada para tu día a día." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <ToastContainer position="bottom-right" autoClose={2800} />
      <Suspense fallback={<div className="auth-loading" role="status">Cargando…</div>}>
      <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={<Inicio products={offerProducts} isLoading={isLoading} loadError={loadError} />}
        />
        <Route
          path="productos"
          element={
            <Productos
              products={products}
              isLoading={isLoading}
              loadError={loadError}
              onCheckAvailability={showAvailability}
              notice={notice}
              onCloseNotice={() => setNotice("")}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMoreProducts}
              onShowLess={showInitialProducts}
              productsPerPage={PRODUCTOS_POR_PAGINA}
            />
          }
        />
        <Route
          path="destacados"
          element={
            <Destacados
              products={products}
              isLoading={isLoading}
              loadError={loadError}
              onCheckAvailability={showAvailability}
              notice={notice}
              onCloseNotice={() => setNotice("")}
            />
          }
        />
        <Route
          path="alta"
          element={
            <ProtectedRoute rolesPermitidos={["admin"]}>
              <Alta
                products={products}
                isLoading={isLoading}
                loadError={loadError}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                notice={notice}
                onCloseNotice={() => setNotice("")}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="productos-nacionales/:id"
          element={
            <ProductoDetalle
              products={products}
              productCollectionName={productCollectionName}
              isLoading={isLoading}
              loadError={loadError}
              onCheckAvailability={showAvailability}
              notice={notice}
              onCloseNotice={() => setNotice("")}
            />
          }
        />
        <Route
          path="producto/:id"
          element={
            <ProductoDetalle
              products={products}
              productCollectionName={productCollectionName}
              isLoading={isLoading}
              loadError={loadError}
              onCheckAvailability={showAvailability}
              notice={notice}
              onCloseNotice={() => setNotice("")}
            />
          }
        />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/cupones"
          element={
            <ProtectedRoute rolesPermitidos={["admin"]}>
              <GestionCupones />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
