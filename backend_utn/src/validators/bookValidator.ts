import { z } from "zod";

const bookSchemaValidator = z.object({
  name: z.string().min(4),
  author: z.string().min(10),
  price: z.number().min(10, "El valor debe ser mayor a 10"),
  category: z.string().min(2),
  isbn: z.number().positive(),
  image: z.string().default("No contiene imagen"),
});

export const createBookSchema = bookSchemaValidator;

export const updatedBookSchema = bookSchemaValidator.partial();
