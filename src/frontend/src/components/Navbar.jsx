import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        🛍️ DevShop
      </Link>
      <Link to="/cart" className={styles.cartBtn}>
        🛒 Cart
        {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
      </Link>
    </nav>
  );
};

export default Navbar;
