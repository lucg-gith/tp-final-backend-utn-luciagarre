import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    author: product.author,
    isbn: Number(product.isbn),
    price: Number(product.price),
    category: product.category,
  });

  const { token } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToUpdate = {
      ...formData,
      price: Number(formData.price),
      isbn: Number(formData.isbn),
    };

    try {
      setLoader(true);
      const response = await fetch(
        `http://localhost:3000/books/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el libro");
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el libro:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <section className="modal-overlay">
      <div className="modal-box">
        <h2>Editar libro</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="author"
            type="text"
            placeholder="Autor"
            value={formData.author}
            onChange={handleChange}
          />
          <input
            name="isbn"
            type="number"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="Precio"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
          />
          <button type="submit">{loader ? "Enviando..." : "Enviar"}</button>
        </form>
        <button className="close-btn" type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </section>
  );
};

export default UpdateProduct;
