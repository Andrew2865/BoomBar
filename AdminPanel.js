import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:3001";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    price: "", 
    category: "", 
    image_url: "", 
    description: "" 
  });
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image_url || !newProduct.description) {
      setError("❌ Uzupełnij wszystkie pola produktu!");
      return;
    }
    try {
      await axios.post(`${API_URL}/products`, newProduct);
      alert("✅ Produkt dodany!");
      setNewProduct({ name: "", price: "", category: "", image_url: "", description: "" });
      fetchProducts();
      setError("");
    } catch (err) {
      setError("❌ Błąd podczas dodawania produktu!");
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (productName) => {
    try {
        await axios.delete(`${API_URL}/products/name/${productName}`);
        alert("✅ Produkt usunięty!");
        fetchProducts();
    } catch (err) {
        console.error("Error deleting product:", err);
    }
};

  const addCategory = async () => {
    if (!newCategory) {
      setError("❌ Podaj nazwę kategorii!");
      return;
    }
    try {
      await axios.post(`${API_URL}/categories`, { name: newCategory });
      alert("✅ Kategoria dodana!");
      setNewCategory("");
      fetchCategories();
      setError("");
    } catch (err) {
      setError("❌ Błąd podczas dodawania kategorii!");
      console.error("Error adding category:", err);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      alert("✅ Kategoria usunięta!");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">📋 Panel Administratora</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mt-4">
        <div className="col-md-6">
          <h3>🛒 Produkty</h3>
          <form className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nazwa produktu"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Cena produktu"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="URL obrazu"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Opis produktu"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            ></textarea>
            <select
              className="form-control mb-2"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="">Wybierz kategorię</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-primary w-100" onClick={addProduct}>
              ➕ Dodaj produkt
            </button>
          </form>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Ładowanie...</span>
              </div>
            </div>
          ) : (
            <ul className="list-group">
              {products.map((product) => (
                <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {product.name} - {product.price} PLN
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.name)}>
                         🗑 Usuń
                    </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-md-6">
          <h3>📂 Kategorie</h3>
          <form className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nazwa kategorii"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="button" className="btn btn-primary w-100" onClick={addCategory}>
              ➕ Dodaj kategorię
            </button>
          </form>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Ładowanie...</span>
              </div>
            </div>
          ) : (
            <ul className="list-group">
              {categories.map((category) => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {category.name}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(category.id)}>
                    🗑 Usuń
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;