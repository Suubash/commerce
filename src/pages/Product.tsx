// Dynamic route
import React from "react";
import { useParams } from "react-router-dom";
import { ProductType } from "../components/Products";
import { Rating } from "react-simple-star-rating";

function Product() {
  const { id } = useParams<string>();

  const [product, setProduct] = React.useState<ProductType>();

  React.useEffect(() => {
    async function fetchProduct() {
      const product = await fetch(
        `https://fakestoreapi.com/products/${id}`
      ).then((res) => res.json());
      setProduct(product);
    }
    fetchProduct();
  }, [id]);

  return (
    <div className="container">
      <div className="">
        <div className="image-container">
          <img
            className="product-image"
            src={product?.image}
            alt={product?.title}
          />
        </div>
        <div className="product-content">
          <div className="rating-component">
            <Rating
              initialValue={0}
              readonly
              allowHalfIcon
              size={20}
              ratingValue={Number(product?.rating.rate) * 20}
            />
            <p className="rating-number">{product?.rating.rate}/5</p>
          </div>
          <h3 className="product-title">{product?.title}</h3>
          <p className="product-description">{product?.description}</p>
          <p className="product-price">${product?.price}</p>
          <p className="product-category">
            <strong>Category: </strong>
            {product?.category}
          </p>

          <button className="buy-button">Add to cart</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Product;
