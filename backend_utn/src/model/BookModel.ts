// DEFINE EL ESQUEMA DE DATOS Y CREA EL MODELO
// EL MODELO:
// 1 - crea la colección en mongodb
// 2 - habilita los métodos de manipulación de data

import { model, Model, Schema } from "mongoose";
import IBook from "../interfaces/IBook";

const bookSchema = new Schema<IBook>(
  {
    name: { type: String, required: true },
    author: { type: String, default: "No tiene author" },
    isbn: { type: Number, default: 0, min: 0 },
    category: { type: String, default: "No tiene categoria" },
    price: { type: Number, default: 0, min: 0 },
    image: { type: String },
  },
  {
    versionKey: false,
  }
);

const Book: Model<IBook> = model("Book", bookSchema);

export default Book;
