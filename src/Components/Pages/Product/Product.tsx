import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import { productService } from "../../../Services/ProductService";
import type { IProduct } from "../../Types/Product";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { Loader } from "../../UI/Loader";

function ProductComponent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Товар не найден");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await productService.getById(id);

        if (data) {
          setProduct(data);
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          setIsInCart(cart.some((item: IProduct) => item.id === data.id));
        } else {
          setError("Товар не найден");
        }
      } catch {
        setError("Товар не найден");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleLike = async () => {
    if (!product) return;

    try {
      const updated = await productService.toggleLike(product.id);
      setProduct(updated);
    } catch {
      //
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: IProduct) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsInCart(true);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  if (loading) {
    return <Loader fullPage />;
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>{error || "Товар не найден"}</h2>
            <Link to="/" className={styles.backLink}>
              ← Вернуться к товарам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Назад к товарам
        </Link>

        <Card size="lg" padding="lg" fullWidth className={styles.card}>
          <div className={styles.product}>
            <div className={styles.imageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
              <button
                className={`${styles.likeButton} ${product.isLiked ? styles.liked : ""}`}
                onClick={handleLike}
              >
                {product.isLiked ? "❤️" : "🤍"}
              </button>
            </div>

            <div className={styles.content}>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
              <p className={styles.description}>{product.description}</p>

              <div className={styles.characteristics}>
                <h3 className={styles.charTitle}>Характеристики</h3>
                <div className={styles.charGrid}>
                  {product.characteristics &&
                  product.characteristics.length > 0 ? (
                    product.characteristics.map((char, index) => (
                      <div key={index} className={styles.charItem}>
                        <span className={styles.charName}>{char.name}</span>
                        <span className={styles.charValue}>{char.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noChars}>Нет характеристик</div>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {isInCart ? (
                  <Button
                    size="lg"
                    variant="success"
                    onClick={handleGoToCart}
                    fullWidth
                  >
                    🛒 Перейти в корзину
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={handleAddToCart}
                    fullWidth
                  >
                    🛒 Добавить в корзину
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  fullWidth
                >
                  Продолжить покупки
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Product = ProductComponent;
