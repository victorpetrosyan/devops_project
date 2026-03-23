import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.back}>← Back to shop</Link>
      <div className={styles.detail}>
        <img src={product.image_url} alt={product.name} className={styles.image} />
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
          <p className={styles.stock}>
            {product.stock > 0 ? `✅ In stock (${product.stock} left)` : "❌ Out of stock"}
          </p>
          <div className={styles.actions}>
            <div className={styles.qty}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button
              className={`${styles.addBtn} ${added ? styles.added : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? "✅ Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
