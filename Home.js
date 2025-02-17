import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => setProducts(res.data));
    axios.get(`${API_URL}/categories`).then((res) => setCategories(res.data));
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === Number(selectedCategory))
    : products;

  return (
    <div className="container mt-5">
      <h1 className="text-center">🛍 BoomBar</h1>

      <select
        className="form-select mb-3"
        onChange={(e) => setSelectedCategory(e.target.value || null)}
      >
        <option value="">Kategorie</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="row">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card p-3 mb-3 shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="card-img-top mb-3"
                style={{
                  height: "200px", 
                  width: "100%", 
                  objectFit: "cover", 
                  borderRadius: "8px",
                }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{product.price} zł</p>
              <button
                className="btn btn-primary w-100"
                onClick={() => addToCart(product)}
              >
                🛒 Dodaj
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export default Home;
