import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cart, updateQuantity, removeItem, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <p>🛒 Your cart is empty.</p>
        <Link to="/" className={styles.shopBtn}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>
      <div className={styles.layout}>
        <div className={styles.items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <img src={item.image_url} alt={item.name} className={styles.image} />
              <div className={styles.info}>
                <Link to={`/product/${item.product_id}`}>
                  <h3 className={styles.name}>{item.name}</h3>
                </Link>
                <p className={styles.price}>${parseFloat(item.price).toFixed(2)}</p>
              </div>
              <div className={styles.qty}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p className={styles.subtotal}>
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
              <button className={styles.remove} onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn}>Checkout</button>
          <Link to="/" className={styles.continueBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
