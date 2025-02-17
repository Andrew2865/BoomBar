import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:3001";

function Cart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const parsedCart = savedCart.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
    
    setCart(parsedCart);

    const total = parsedCart.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100;
    setTotalPrice(total.toFixed(2));
  }, []);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);

    const total = updatedCart.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100;
    setTotalPrice(total.toFixed(2));

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const checkout = async () => {
    if (!user) {
      alert("❌ Musisz się zalogować!");
      return;
    }

    try {
      await axios.post(`${API_URL}/order`, {
        userId: user.id,
        email: user.email,
        cart,
        totalPrice: parseFloat(totalPrice),
      });

      setOrderConfirmed(true);
      localStorage.removeItem("cart");
      setCart([]);
      setTotalPrice("0.00");
    } catch (err) {
      alert("❌ Błąd przy składaniu zamówienia!");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">🛒 Koszyk</h1>
      {orderConfirmed ? (
        <div className="text-center mt-4">
          <h2>✅ Dziękujemy za zamówienie!</h2>
          <p>Twoje zamówienie zostało pomyślnie złożone.</p>
        </div>
      ) : cart.length === 0 ? (
        <p className="text-center">Koszyk jest pusty</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{parseFloat(item.price).toFixed(2)} PLN</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(index)}
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
          <h3 className="mt-3">Razem: {totalPrice} PLN</h3>
          <button className="btn btn-success w-100 mt-3" onClick={checkout}>
            ✅ Złóż zamówienie
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
