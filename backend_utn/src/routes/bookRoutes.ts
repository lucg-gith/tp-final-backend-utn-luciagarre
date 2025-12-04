// EL ROUTER VALIDA METODOS Y RUTAS PROPIAS DE LA ENTIDAD

// GET http://localhost:3000/product

import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import BookController from "../controllers/bookController";

const bookRouter = Router();

// TODAS LAS PETICIONES QUE LLEGAN AL BOOK ROUTER EMPIEZAN CON
// POST http://localhost:3000/books/

bookRouter.get("/", BookController.getAllBooks);
bookRouter.get("/:id", BookController.getBook);
bookRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  BookController.addBook
);
bookRouter.patch("/:id", authMiddleware, BookController.updateBook);
bookRouter.delete("/:id", authMiddleware, BookController.deleteBook);

export default bookRouter;
