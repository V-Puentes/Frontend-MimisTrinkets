# Frontend Webstore

Para comenzar se inicializa el entorno ejecutando "npm create vite@latest . -- --template react
npm install"
luego npm install react-router-dom axios jwt-decode sweetalert2

api.js dentro de la carpeta src/services/. Este script configurará Axios para que todas las peticiones apunten automáticamente al backend y adjunten el token JWT si el usuario ha iniciado sesión.

AuthContext.jsx dentro de la carpeta src/context/. Este archivo utilizará jwt-decode para leer el payload del token y exponer las funciones de login y logout a toda la aplicación.

Para asegurar que las vistas privadas (como el mantenedor de usuarios o el historial de compras) no sean accesibles mediante manipulación de la URL, se debe crear un interceptor a nivel de interfaz.

Crear el archivo ProtectedRoute.jsx dentro de la carpeta src/components/

Crear el archivo productoService.js dentro de la carpeta src/services/. Este archivo aislará la lógica de peticiones HTTP relacionada con el catálogo.