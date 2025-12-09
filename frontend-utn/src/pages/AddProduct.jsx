import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    price: "",
    isbn: "",
    category: "",
  });

  const navigate = useNavigate();

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      isbn: Number(formData.isbn),
    };

    console.log(token);

    try {
      const response = await fetch(`http://localhost:3000/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        alert("❌ Error al cargar el libro");
        return;
      }

      alert("✅ Éxito al guardar el nuevo libro");
      setFormData({
        name: "",
        author: "",
        price: "",
        isbn: "",
        category: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Error al agregar el libro:", error);
      alert("Error al agregar el libro. Por favor, intenta de nuevo.");
    }
  };

  const handleChange = (e) => {
    const nombreDeInput = e.target.name;
    setFormData({ ...formData, [nombreDeInput]: e.target.value });
  };

  return (
    <Layout>
      <div className="page-banner">Agregar Nuevo libro</div>

      <section className="page-section">
        <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Autor"
            name="author"
            minLength={3}
            maxLength={200}
            onChange={(e) => handleChange(e)}
            value={formData.author}
          />
          <input
            type="text"
            placeholder="ISBN"
            name="isbn"
            pattern="[0-9]*"
            inputMode="numeric"
            onChange={(e) => handleChange(e)}
            value={formData.isbn}
          />
          <input
            type="number"
            placeholder="Precio"
            name="price"
            min={0}
            onChange={(e) => handleChange(e)}
            value={formData.price}
          />
          <input
            type="text"
            placeholder="Categoría"
            name="category"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.category}
          />
          <button type="submit">Agregar</button>
        </form>
      </section>
    </Layout>
  );
};

export default AddProduct;
