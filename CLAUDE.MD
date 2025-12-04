# Project Baseline Documentation

## Project Overview

This is a full-stack TypeScript/JavaScript e-commerce application consisting of:
- **Backend**: REST API built with Express.js, TypeScript, and MongoDB
- **Frontend**: React SPA built with Vite and React Router

The application provides product management capabilities with user authentication, CRUD operations, filtering, and email notifications.

---

## Project Structure

```
tp-final-backend-utn-luciagarre/
├── backend_utn/           # TypeScript Express API
├── frontend-utn/          # React frontend application
└── CLAUDE.MD              # This file
```

---

# Backend (backend_utn)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM v8.19.1
- **Authentication**: JWT (jsonwebtoken v9.0.2) + bcryptjs v3.0.2
- **Validation**: Zod v4.1.12
- **File Upload**: Multer v2.0.2
- **Email**: Nodemailer v7.0.11
- **Logging**: Morgan v1.10.1
- **Rate Limiting**: express-rate-limit v8.2.0

## Directory Structure

```
backend_utn/
├── src/
│   ├── config/               # Configuration files
│   │   ├── emailConfig.ts    # Nodemailer SMTP setup
│   │   ├── logger.ts         # Morgan logging config
│   │   └── mongodb.ts        # MongoDB connection
│   ├── controllers/          # Request handlers
│   │   ├── authController.ts # Register/login logic
│   │   └── productController.ts # Product CRUD
│   ├── middleware/
│   │   ├── authMiddleware.ts # JWT verification
│   │   ├── rateLimitMiddleware.ts # Rate limiting
│   │   └── uploadMiddleware.ts # Multer file upload
│   ├── model/               # Mongoose schemas
│   │   ├── UserModel.ts     # User schema
│   │   └── ProductModel.ts  # Product schema
│   ├── routes/              # API endpoints
│   │   ├── authRouter.ts    # /auth routes
│   │   └── productRoutes.ts # /products routes
│   ├── services/
│   │   └── emailService.ts  # Email sending logic
│   ├── templates/
│   │   └── emailTemplate.ts # HTML email template
│   ├── interfaces/          # TypeScript interfaces
│   │   ├── IUser.ts
│   │   ├── IProduct.ts
│   │   └── IUserTokenPayload.ts
│   ├── validators/
│   │   └── productValidator.ts # Zod schemas
│   └── index.ts             # App entry point
├── logs/                    # Daily access logs
├── uploads/                 # Product images
├── package.json
├── tsconfig.json
└── .env.example
```

## Data Models

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
}
```

### Product Model
```typescript
{
  name: string (required)
  description: string (default: "No tiene descripción")
  stock: number (min: 0, default: 0)
  category: string (default: "No tiene categoria")
  price: number (min: 0, default: 0)
  image: string (optional, file path)
}
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token (1 hour expiry)

### Products (`/products`)
- `GET /products` - Get all products with optional filters (name, stock, category, price range)
- `GET /products/:id` - Get single product by ID
- `POST /products` - Create product (protected, requires image upload)
- `PATCH /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)

### Email
- `POST /email/send` - Send contact form email

### Health
- `GET /` - Health check endpoint

## Authentication Flow

1. **Registration**: User provides email/password → Password hashed with bcryptjs (10 rounds) → Stored in MongoDB
2. **Login**: Credentials verified → JWT generated with payload `{id, email}` → Token expires in 1 hour
3. **Protected Routes**: Token extracted from `Authorization: Bearer <token>` → Verified with JWT_SECRET → User data attached to `req.user`

## Environment Variables

Required in `.env`:
```
PORT=           # Server port
JWT_SECRET=     # JWT signing secret
URI_DB=         # MongoDB connection URI
EMAIL_USER=     # Gmail address
EMAIL_PASS=     # Gmail app password
```

## Key Features

- **Password Security**: bcryptjs hashing with 10 salt rounds
- **File Upload**: Multer middleware for product images (uploads/ directory)
- **Logging**: Morgan logs daily to logs/ directory
- **Validation**: Zod schemas for product data (min 4 chars name, min 10 chars description, min price 10)
- **Error Handling**: Try-catch blocks with consistent JSON error responses
- **CORS**: Enabled for all origins
- **Rate Limiting**: Configured (5 requests per 15 minutes)

## Development Commands

```bash
npm run dev      # Start development server with ts-node-dev
npm run build    # Compile TypeScript to dist/
```

---

# Frontend (frontend-utn)

## Tech Stack

- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.2.2
- **Routing**: React Router DOM v7.9.5
- **State Management**: React Context API
- **Styling**: Vanilla CSS
- **Linting**: ESLint v9.39.1

## Directory Structure

```
frontend-utn/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Images (react.svg)
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Page wrapper (header/nav/footer)
│   │   ├── ProtectedRoute.jsx # Route protection HOC
│   │   ├── ToastMessage.jsx # Notification component
│   │   └── UpdateProduct.jsx # Product edit modal
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state
│   ├── constants/
│   │   └── categories.js    # 17 product categories
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Product listing/filtering
│   │   ├── Login.jsx        # User login
│   │   ├── Register.jsx     # User registration
│   │   ├── AddProduct.jsx   # Create product form
│   │   ├── AboutUs.jsx      # About page
│   │   └── Contact.jsx      # Contact form
│   ├── router/
│   │   └── Router.jsx       # Route definitions
│   ├── services/
│   │   └── api.js           # Empty (direct fetch used)
│   ├── styles/
│   │   └── index.css        # Global CSS (266 lines)
│   └── main.jsx             # App entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Routes

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/` | Home | No | Product listing with filters |
| `/sobre-nosotros` | AboutUs | No | Company info |
| `/agregar-producto` | AddProduct | Yes | Create product |
| `/contacto` | Contact | No | Contact form |
| `/login` | Login | No | User login |
| `/registro` | Register | No | User registration |

## State Management

### AuthContext
- **State**: `token` (JWT in sessionStorage), `user` (decoded payload)
- **Methods**:
  - `login(token)`: Store token, decode and set user
  - `logout()`: Clear token and user
  - `decodeJWT()`: Manual base64 JWT decoding
- **Custom Hook**: `useAuth()` for accessing context

### Local State
- Form data managed with `useState` in individual components
- Product list and filters in Home.jsx
- Modal visibility in Home.jsx

## API Integration

**Authentication**: Bearer token in `Authorization` header

**Endpoints Used**:
- `POST /auth/register` - Registration
- `POST /auth/login` - Login
- `GET /products` - Fetch products with filters
- `POST /products` - Create product (auth required)
- `PATCH /products/:id` - Update product (auth required)
- `DELETE /products/:id` - Delete product (auth required)
- `POST /email/send` - Send contact email

**Note**: `src/services/api.js` is empty; all API calls use native `fetch()` directly

## Component Architecture

### Layout Component
- Wraps all pages with consistent header/nav/footer
- Conditional navigation based on authentication
- Unauthenticated: Home, About Us, Contact, Login, Register
- Authenticated: Home, About Us, Contact, Add Product, Logout

### ProtectedRoute Component
- HOC for route protection
- Checks `useAuth()` for user existence
- Redirects to `/login` if unauthorized

### ToastMessage Component
- Props: `msg`, `color`
- Fixed position notification with 5s slide animation

### UpdateProduct Component
- Modal form for editing products
- Props: `product`, `onClose`, `onUpdate`
- PATCH request to backend
- Form validation with number conversion

## Styling

**Approach**: Vanilla CSS with class-based styling

**Key Style Classes**:
- Layout: `.layout-header`, `.layout-nav`, `.layout-main`, `.layout-footer`
- Pages: `.page-banner`, `.page-section`
- Products: `.products-grid`, `.product-card`, `.cont-btn`
- Forms: `.form-container`, `.filters-form`, `.contact-form`
- Modal: `.modal-overlay`, `.modal-box`, `.close-btn`
- Notifications: `.toast`

**Color Scheme**:
- Dark: #111 (header/footer)
- Primary: #333 (buttons)
- Actions: yellow, red, green
- Neutrals: #ddd, #bbb, #eee

**Features**:
- Flexbox and CSS Grid layouts
- Toast slide animation (5s)
- Hover effects with opacity transitions
- Modal overlay with semi-transparent background

## Development Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Development Workflow

### Starting the Application

1. **Backend**:
```bash
cd backend_utn
npm install
# Create .env file from .env.example
npm run dev     # Runs on configured PORT
```

2. **Frontend**:
```bash
cd frontend-utn
npm install
npm run dev     # Typically http://localhost:5173
```

### Authentication Flow

1. User registers via `/registro` → `POST /auth/register`
2. User logs in via `/login` → `POST /auth/login` → JWT received
3. JWT stored in sessionStorage
4. JWT included in `Authorization: Bearer <token>` for protected requests
5. Backend verifies JWT via authMiddleware
6. Token expires after 1 hour

### Product Management Flow

1. **View Products**: Home page fetches `GET /products`
2. **Filter Products**: Query params (name, stock, category, minPrice, maxPrice)
3. **Add Product** (Auth required):
   - Navigate to `/agregar-producto`
   - Fill form with image upload
   - `POST /products` with FormData
4. **Update Product** (Auth required):
   - Click "Editar" on product card
   - Modal opens with UpdateProduct component
   - `PATCH /products/:id`
5. **Delete Product** (Auth required):
   - Click "Eliminar" on product card
   - `DELETE /products/:id`

---

## Important Notes

### Security Considerations

- JWT secret must be strong and kept secure
- Passwords are hashed before storage (never stored plain)
- CORS is currently open to all origins (consider restricting in production)
- File uploads accept only image MIME types
- Rate limiting configured but ensure it's applied to sensitive endpoints

### Known Patterns

- Backend uses TypeScript with strict typing
- Frontend uses JSX (not TypeScript)
- API service layer exists but is empty (direct fetch calls used)
- JWT decoding happens client-side without library
- Session storage (not localStorage) for auth token
- Spanish language used in routes and UI

### Database

- MongoDB Atlas connection
- Mongoose ODM for schema validation
- Unique constraint on user email
- Automatic timestamps can be enabled if needed
- No soft deletes implemented (hard DELETE)

### File Structure Conventions

- Backend: PascalCase for models/interfaces, camelCase for services/controllers
- Frontend: PascalCase for components, camelCase for utilities
- Routes use Spanish names (`/sobre-nosotros`, `/agregar-producto`, etc.)

---

## Common Tasks

### Adding a New API Endpoint

1. Define route in `backend_utn/src/routes/`
2. Create controller function in `backend_utn/src/controllers/`
3. Add validation schema in `backend_utn/src/validators/` if needed
4. Import and use in `backend_utn/src/index.ts`

### Adding a New Page

1. Create component in `frontend-utn/src/pages/`
2. Add route in `frontend-utn/src/router/Router.jsx`
3. Add navigation link in `frontend-utn/src/components/Layout.jsx` if needed

### Adding a New Model

1. Create interface in `backend_utn/src/interfaces/`
2. Create Mongoose schema in `backend_utn/src/model/`
3. Create controller for CRUD operations
4. Create routes
5. Add validation schema

---

## Dependencies Summary

### Backend Production Dependencies
- express, mongoose, jsonwebtoken, bcryptjs
- cors, dotenv, morgan, multer, nodemailer
- express-rate-limit, zod

### Frontend Production Dependencies
- react, react-dom, react-router-dom

### Development Dependencies
- Backend: typescript, ts-node-dev, @types/* packages
- Frontend: vite, eslint, @vitejs/plugin-react

---

## Quick Reference

### Backend Server
- Entry: `backend_utn/src/index.ts`
- Port: Environment variable `PORT`
- Database: MongoDB (URI_DB)

### Frontend App
- Entry: `frontend-utn/src/main.jsx`
- Dev Server: Vite (typically port 5173)
- Routes: Spanish localized

### Authentication
- Method: JWT Bearer tokens
- Storage: sessionStorage (frontend)
- Expiry: 1 hour
- Protected routes: Add/Update/Delete products

### File Uploads
- Location: `backend_utn/uploads/`
- Middleware: Multer
- Allowed: Image MIME types only
- Naming: `timestamp-uuid.extension`

---

This document serves as a baseline reference for working on this project. Update it as the architecture evolves.
