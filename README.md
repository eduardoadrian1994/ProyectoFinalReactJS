# Norte Tech — E-commerce React

Proyecto de e-commerce desarrollado con React, Vite y Firebase. Incluye catálogo
con búsqueda y filtros, productos en oferta, detalle de producto, carrito con
Context API, autenticación, gestión de productos y cupones.

## Requisitos

- Node.js LTS y npm.
- Un proyecto Firebase con una aplicación web.
- Firestore y el proveedor Email/Password de Firebase Authentication habilitados.

## Instalación y ejecución local

Desde la carpeta del proyecto:

```powershell
npm install
Copy-Item .env.example .env.local
```

Editá `.env.local` y completá los valores de la aplicación web Firebase. Vite
requiere reiniciar el servidor después de modificar estas variables.

```powershell
npm run dev
```

Abrí la URL que informa Vite (normalmente `http://localhost:5173`).

## Configuración de Firebase

En Firebase Console:

1. Creá o seleccioná un proyecto y registrá una aplicación web.
2. Copiá su configuración en las variables `VITE_FIREBASE_*` de `.env.local`.
3. Habilitá **Authentication → Sign-in method → Email/Password**.
4. Creá la base de datos de **Cloud Firestore** y desplegá las reglas del archivo
   `firestore.rules`.
5. Cargá documentos de productos en `Productos nacionales` (o en `productos`).
   Los campos `name`, `category`, `description`, `price`, `stock`, `image`,
   `rating`, `tag` y `oferta` son usados por el catálogo. Para mostrar un producto
   en Inicio, `oferta` debe ser el booleano `true`.

Los usuarios registrados reciben el rol `user`. Para habilitar la administración,
un administrador debe asignar `rol: "admin"` al documento del usuario en la
colección `usuarios`, usando como ID el UID de Firebase Authentication. La app
no permite que un usuario se asigne ese rol a sí mismo.

Las variables `VITE_*` se incluyen en el código del navegador; no guardes claves
privadas ni credenciales de cuentas de servicio en ellas. La seguridad de los
datos se controla mediante Authentication y las reglas de Firestore.

## Comandos disponibles

```powershell
npm run dev       # Servidor local
npm run lint      # Análisis estático
npm run build     # Compilación de producción en dist/
npm run preview   # Vista local de la compilación
```

## Funcionalidades principales

- Inicio consulta en Firestore únicamente los productos con `oferta == true`.
- Catálogo paginado, búsqueda, filtros por categoría y detalle dinámico.
- Gestión de productos: crear, editar, eliminar y marcar si aparecen en ofertas.
- Cupones: creación y eliminación desde el panel de administración.
- Autenticación, rutas protegidas y carrito persistente con Context API.
- Equipo leído desde la colección `equipo` de Firestore.

## Despliegue

Configurá las mismas variables `VITE_FIREBASE_*` en el proveedor de hosting y
ejecutá `npm run build`. Firebase Hosting ya tiene una rewrite para servir la SPA;
Netlify usa `public/_redirects`. Para Vercel, configurá una rewrite equivalente a
`/index.html` para las rutas de la aplicación.
