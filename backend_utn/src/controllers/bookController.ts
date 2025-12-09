// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARÁN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express";
import { Types } from "mongoose";
import Book from "../model/BookModel";
import {
  createBookSchema,
  updatedBookSchema,
} from "../validators/bookValidator";

class BookController {
  static getAllBooks = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { name, isbn, category, minPrice, maxPrice } = req.query;
      console.log(req.query);

      const filter: any = {};

      // Search in both name and author fields
      if (name) {
        filter.$or = [
          { name: new RegExp(String(name), "i") },
          { author: new RegExp(String(name), "i") }
        ];
      }
      if (isbn) filter.isbn = Number(isbn);
      if (category) filter.category = new RegExp(String(category), "i");
      if (minPrice || maxPrice) {
        filter.price = {};
        // maxPrice -> si tengo precio máximo quiero un objeto con un precio menor
        if (minPrice) filter.price.$gte = minPrice;
        // minPrice -> si tengo un precio mínimo quiero un objeto con un precio mas grande.
        if (maxPrice) filter.price.$lte = maxPrice;
      }

      const books = await Book.find(filter);
      res.json({ success: true, data: books });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static getBook = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      const book = await Book.findById(id);

      if (!book) {
        return res
          .status(404)
          .json({ success: false, error: "Book no encontrado" });
      }

      res.status(200).json({ success: true, data: book });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static addBook = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { body, file } = req;

      const { name, author, price, category, isbn } = body;

      if (!name || !author || !price || !category || !isbn) {
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos" });
      }

      // VALIDACIONES DE INPUT
      // validar el tipo de data que recibo del front
      // 1 - si para la validación creo el booko
      // 2 - si no pasa la validación retorno una respuesta 400 al front

      const dataToValidate = {
        name,
        author,
        category,
        isbn: +isbn,
        price: +price,
        image: file?.path,
      };

      const validator = createBookSchema.safeParse(dataToValidate);

      if (!validator.success) {
        return res
          .status(400)
          .json({
            success: false,
            error: validator.error.flatten().fieldErrors,
          });
      }

      const newBook = new Book(validator.data);

      await newBook.save();
      res.status(201).json({ success: true, data: newBook });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static updateBook = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { body } = req;

      if (!Types.ObjectId.isValid(id))
        res.status(400).json({ succes: false, error: "ID Inválido" });

      const validator = updatedBookSchema.safeParse(body);

      if (!validator.success) {
        return res
          .status(400)
          .json({
            success: false,
            error: validator.error.flatten().fieldErrors,
          });
      }

      const updatedBook = await Book.findByIdAndUpdate(id, validator.data, {
        new: true,
      });

      if (!updatedBook) {
        return res
          .status(404)
          .json({ success: false, error: "Book no encontrado" });
      }

      res.json({ success: true, data: updatedBook });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static deleteBook = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const id = req.params.id;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        return res
          .status(404)
          .json({ success: false, error: "Book no encontrado" });
      }

      res.json({ success: true, data: deletedBook });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };
}

export default BookController;
