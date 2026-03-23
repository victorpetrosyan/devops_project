import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

// Simple session ID stored in localStorage
const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("session_id", id);
  }
  return id;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const sessionId = getSessionId();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`/api/cart/${sessionId}`);
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    await axios.post("/api/cart", { session_id: sessionId, product_id: productId, quantity });
    fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await axios.patch(`/api/cart/${cartItemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await axios.delete(`/api/cart/${cartItemId}`);
    fetchCart();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
