import { useAppSelector, useAppDispatch } from "../hooks/reduxHook";
import { RootState } from "../redux/store";
import styles from "../styles/cart.module.css";
import { useNavigate } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
import KhaltiCheckout from "khalti-checkout-web";
import { ProductType } from "../components/Products";
import { useAuth0 } from "@auth0/auth0-react";

function Cart() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const navigate = useNavigate();

  const products = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();

  // Calculating total price
  const prices: Array<number> = [0];
  products.forEach((product) => prices.push(product.price * product.quantity));

  const total = prices.reduce((accumulator, current) => accumulator + current);

  const public_key = import.meta.env.VITE_KHALTI_PUBLIC_KEY;
  const secret_key = import.meta.env.KHALTI_SECRET_KEY;

  // khalti
  let config = {
    publicKey: public_key,
    productIdentity: "1234567890",
    productName: "Drogon",
    productUrl: "http://gameofthrones.com/buy/Dragons",
    eventHandler: {
      onSuccess(payload: ProductType) {
        // hit merchant api for initiating verfication
        console.log("Payload => ", payload);
      },
      // onError handler is optional
      onError(error: Error) {
        // handle errors
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
  };

  const checkout = new KhaltiCheckout(config);
  const handleCheckout = () => {
    if (isAuthenticated) {
      // amount on paisa
      checkout.show({ amount: 1000 });
    } else {
      localStorage.setItem("products", JSON.stringify(products));
      loginWithRedirect();
    }
  };

  return (
    <div className="container">
      {products.length > 0 && (
        <div className={styles.flexer}>
          <h2 className={styles.heading}>Your cart</h2>

          <button
            onClick={() => dispatch(clearCart())}
            className={styles.clearCartButton}
          >
            Empty cart
          </button>
        </div>
      )}
      {products.map((product) => (
        <div key={product.id} className={styles.productContainer}>
          <div className={styles.imageContainer}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h5 className={styles.title}>{product.title}</h5>
            <p className={styles.description}>{product.description}</p>
          </div>
          <div className={styles.price}>
            <p>${product.price}</p>

            <div className={styles.buttonContainer}>
              <button
                className={styles.decreaseQtyButton}
                onClick={() => dispatch(decreaseQuantity(product.id))}
              >
                -
              </button>
              <p>{product.quantity}</p>
              <button
                className={styles.increaseQtyButton}
                onClick={() => dispatch(increaseQuantity(product.id))}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {products.length > 0 ? (
        <div className={styles.priceCheckoutContainer}>
          <div className={styles.total}>
            <p className={styles.totalText}>Total Price: </p>
            <p className={styles.totalPrice}>${Math.ceil(total)}</p>
          </div>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to checkout
          </button>
        </div>
      ) : (
        <div className={styles.emptyCartWrapper}>
          <h4>No shopping yet!</h4>
          <button
            onClick={() => navigate("/")}
            className={styles.continueShoppingButton}
          >
            continue shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
