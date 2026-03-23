import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import styles from "./Home.module.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/products/meta/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/products?category=${selectedCategory}`
      : "/api/products";
    axios.get(url).then(({ data }) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Welcome to DevShop</h1>
        <p>Quality products, deployed with Kubernetes ☸️</p>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${!selectedCategory ? styles.active : ""}`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
