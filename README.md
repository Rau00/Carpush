# CarPush

Plataforma web de compraventa de vehículos desarrollada como proyecto final del ciclo formativo de **DAW** en el IES Ana Luisa Benítez, Las Palmas de Gran Canaria.

------

### Descripción

CarPush es una aplicación web full-stack que permite explorar un catálogo de vehículos de 15 marcas internacionales, gestionar favoritos y carrito de compra, y completar el proceso de compra con generación automática de factura. Incluye un panel de administración protegido por rol y soporte de modo oscuro/claro con cambio de idioma español/inglés.

------

### Tecnologías utilizadas

| Capa               | Tecnología                          |
| ------------------ | ----------------------------------- |
| **Frontend**       | React 19 + Vite 6                   |
| **Estilos**        | Bootstrap 5.3.3 + CSS personalizado |
| **Backend**        | PHP 8.x (API REST sin framework)    |
| **Base de datos**  | MySQL 8.0 con PDO                   |
| **Autenticación**  | Tokens Bearer almacenados en MySQL  |
| **Servidor local** | PHP Server (VS Code) o XAMPP        |

------

### Estructura del proyecto

```
CARPUSH/
├── api/
│   ├── admin/
│   │   └── index.php       # CRUD de coches (solo admin)
│   ├── auth/
│   │   └── index.php       # Login, registro, logout, me
│   ├── cars/
│   │   └── index.php       # Catálogo y marcas (público)
│   ├── cart/
│   │   └── index.php       # Carrito del usuario
│   ├── favorites/
│   │   └── index.php       # Favoritos del usuario
│   └── orders/
│       └── index.php       # Checkout y facturas
├── config/
│   └── database.php        # Conexión PDO a MySQL
├── middleware/
│   ├── cors.php            # Cabeceras CORS
│   └── auth_token.php      # Verificación token Bearer
├── public/
│   └── img/                # Imágenes de los vehículos
├── src/
│   ├── App.jsx             # Componente raíz y todas las páginas
│   ├── App.css             # Estilos globales
│   ├── main.jsx            # Entry point de React
│   └── index.css           # Importación de fuentes
├── index.html              # HTML base de Vite
├── package.json            # Dependencias Node.js
├── vite.config.js          # Configuración de Vite
├── database.sql            # Esquema completo de la BD
```



------

### Requisitos previos

- Node.js 18 o superior
- PHP 8.0 o superior
- MySQL 8.0 o superior
- VS Code con la extensión **PHP Server** de *braphe*
- O bien XAMPP con Apache y MySQL activos

------

### Configuración de la base de datos

**1.** Abre phpMyAdmin (`http://localhost/phpmyadmin`) o tu cliente MySQL preferido.

**2.** Crea la base de datos e importa el esquema principal:

sql

```
CREATE DATABASE carpush CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Luego importa en este orden:

1. `database.sql` (tablas principales + 15 marcas + 45 coches)
2. Abre `config/database.php` y ajusta las credenciales si es necesario:

php

```
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // tu usuario MySQL
define('DB_PASS', '');     // tu contraseña
define('DB_NAME', 'carpush');
```

------

### Instalación y ejecución

##### Backend (PHP)

**Con PHP Server (VS Code):**

1. Abre la carpeta raíz del proyecto en VS Code.
2. Pulsa `Ctrl+Shift+P` → escribe `PHP Server: Serve project` → Enter.
3. El backend quedará disponible en `http://localhost:3000`.

**Con XAMPP:**

1. Copia la carpeta del proyecto dentro de `C:\xampp\htdocs\`.
2. Arranca Apache y MySQL desde el panel de XAMPP.
3. El backend estará en `http://localhost/CARPUSH/api/`.
4. Actualiza `const API` en `src/App.jsx` con la ruta correcta.

##### Frontend (React)

```
# Instalar dependencias
npm install

# Arrancar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**



------

### Credenciales por defecto

| Rol               | Email               | Contraseña |
| ----------------- | ------------------- | ---------- |
| **Administrador** | admin@carpush.com   | password   |
| **Usuario demo**  | usuario@carpush.com | usuario123 |

------

### Endpoints de la API

| Método | Ruta                                  | Descripción                                              | Auth |
| ------ | ------------------------------------- | -------------------------------------------------------- | ---- |
| GET    | `/api/cars/index.php`                 | Lista de coches (filtros: marca, tipo, precio, búsqueda) | No   |
| GET    | `/api/cars/index.php?action=marcas`   | Lista de marcas                                          | No   |
| POST   | `/api/auth/index.php?action=register` | Registro de usuario                                      | No   |
| POST   | `/api/auth/index.php?action=login`    | Login, devuelve token                                    | No   |
| POST   | `/api/auth/index.php?action=logout`   | Cierre de sesión                                         | Sí   |
| GET    | `/api/auth/index.php?action=me`       | Usuario autenticado actual                               | Sí   |
| GET    | `/api/favorites/index.php`            | Favoritos del usuario                                    | Sí   |
