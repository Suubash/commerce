import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/products.module.css";
import Loader from "./Loader";

export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

function Products() {
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await fetch("https://fakestoreapi.com/products").then(
        (res) => res.json()
      );
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className={styles.products}>
      {loading && <Loader />}
      {/* <Loader /> */}
      {products.slice(0, 4).map((product: ProductType) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <div className={styles.product}>
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={product.image}
                alt={product.title}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{product.title}</h3>
              <p className={`${styles.description} truncate-3`}>
                {product.description}
              </p>
              <p className={styles.price}>${product.price}</p>
            </div>
          </div>
        </Link>
      ))}

      <div className={styles.ad}>
        <img
          className={styles.adImage}
          src="https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2021/CML_Holiday21/Fashion/LANDING_PAGES/headers/CML_HOL21_LP-HEADER_XCAT-M_DT._CB1634600139_.jpg"
          alt="amazon ad"
        />
      </div>

      {products.slice(4, products.length).map((product: ProductType) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <div className={styles.product}>
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={product.image}
                alt={product.title}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{product.title}</h3>
              <p className={`${styles.description} truncate-3`}>
                {product.description}
              </p>
              <p className={styles.price}>${product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Products;
