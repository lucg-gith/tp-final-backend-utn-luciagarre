# Backend - Librería Virtual API

API REST desarrollada con TypeScript, Express y MongoDB para gestión de una librería de libros de autores argentinos.

## 🚀 Tecnologías

- **Node.js** con **TypeScript**
- **Express.js** v5.1.0 - Framework web
- **MongoDB** con **Mongoose** v8.19.1 - Base de datos
- **JWT** (jsonwebtoken v9.0.2) - Autenticación
- **bcryptjs** v3.0.2 - Hashing de contraseñas
- **Zod** v4.1.12 - Validación de datos
- **Morgan** v1.10.1 - Logger HTTP
- **express-rate-limit** v8.2.0 - Limitación de peticiones
- **CORS** - Habilitado para todas las origins

## 📋 Requisitos Previos

- Node.js v16 o superior
- MongoDB Atlas account (o MongoDB local)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/lucg-gith/tp-final-backend-utn-luciagarre.git
cd tp-final-backend-utn-luciagarre/backend_utn
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raíz del backend:
```env
PORT=3000
JWT_SECRET=tu-secreto-jwt-super-seguro
URI_DB=mongodb+srv://usuario:password@cluster.mongodb.net/booksGallery
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
```

4. Compilar TypeScript:
```bash
npm run build
```

## 🏃 Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo con hot-reload
npm run build    # Compilar TypeScript a JavaScript
npm start        # Ejecutar versión compilada en producción
```

## 📚 Endpoints de la API

### Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota:** El token expira en 1 hora.

---

### Libros

#### Obtener Todos los Libros
```http
GET /books
```

**Query Parameters (opcionales):**
- `name` - Filtrar por nombre o autor
- `category` - Filtrar por categoría
- `minPrice` - Precio mínimo
- `maxPrice` - Precio máximo

**Ejemplo:**
```http
GET /books?name=borges&minPrice=1000&maxPrice=5000
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ficciones",
      "author": "Jorge Luis Borges",
      "isbn": 9788499890524,
      "price": 3200,
      "category": "Ficción"
    }
  ]
}
```

#### Obtener Libro por ID
```http
GET /books/:id
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ficciones",
    "author": "Jorge Luis Borges",
    "isbn": 9788499890524,
    "price": 3200,
    "category": "Ficción"
  }
}
```

#### Crear Libro (Requiere Autenticación)
```http
POST /books
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Rayuela",
  "author": "Julio Cortázar",
  "isbn": 9788420674148,
  "price": 4500,
  "category": "Ficción"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rayuela",
    "author": "Julio Cortázar",
    "isbn": 9788420674148,
    "price": 4500,
    "category": "Ficción"
  }
}
```

#### Actualizar Libro (Requiere Autenticación)
```http
PATCH /books/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 5000
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rayuela",
    "author": "Julio Cortázar",
    "isbn": 9788420674148,
    "price": 5000,
    "category": "Ficción"
  }
}
```

#### Eliminar Libro (Requiere Autenticación)
```http
DELETE /books/:id
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rayuela"
  }
}
```

---

### Email

#### Enviar Email de Contacto
```http
POST /email/send
Content-Type: application/json

{
  "email": "usuario@example.com",
  "subject": "Consulta",
  "message": "Hola, tengo una pregunta..."
}
```

---

## 🔒 Seguridad

- **Rate Limiting:** Las rutas de autenticación están limitadas a 5 peticiones cada 15 minutos
- **JWT:** Tokens con expiración de 1 hora
- **Bcrypt:** Contraseñas hasheadas con 10 salt rounds
- **Validación:** Esquemas Zod para validar datos de entrada

## 📝 Logging

Morgan está configurado para guardar logs HTTP diarios en la carpeta `logs/`:
- Formato: `access-YYYY-MM-DD.log`
- Información registrada: IP, método, URL, status, tiempo de respuesta

## 🌐 Deploy

**Backend deployado en:** https://tp-final-backend-utn-luciagarre.onrender.com

## 📦 Estructura del Proyecto

```
backend_utn/
├── src/
│   ├── config/           # Configuraciones (DB, logger, email)
│   ├── controllers/      # Lógica de negocio
│   ├── middleware/       # Middlewares (auth, rate limit)
│   ├── model/           # Modelos de Mongoose
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios (email)
│   ├── validators/      # Schemas de validación Zod
│   ├── interfaces/      # Interfaces TypeScript
│   └── index.ts         # Punto de entrada
├── logs/               # Logs de Morgan
├── dist/               # TypeScript compilado
├── package.json
├── tsconfig.json
└── .env.example
```

## 🧪 Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 👤 Autor

Lucía Garre - [GitHub](https://github.com/lucg-gith)

## 📄 Licencia

ISC
