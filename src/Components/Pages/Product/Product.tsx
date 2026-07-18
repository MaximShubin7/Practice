import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./Styles.module.scss";
import { cartService } from "../../../Services/CartService";
import { favoritesService } from "../../../Services/FavoritesService";
import { productService } from "../../../Services/ProductService";
import { useAuth } from "../../Hooks/useAuth";
import type { IProduct } from "../../Types/Product";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { Loader } from "../../UI/Loader";

function ProductComponent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
        const [data, favIds, cart] = await Promise.all([
          productService.getById(id),
          isAuthenticated
            ? favoritesService.getFavorites()
            : Promise.resolve([]),
          isAuthenticated ? cartService.getCart() : Promise.resolve([]),
        ]);

        if (data) {
          setProduct(data);
          setIsInCart(cart.some((item) => item.productId === data.id));
          setIsLiked(favIds.includes(data.id));
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
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const newState = await favoritesService.toggleFavorite(product.id);
      setIsLiked(newState);
    } catch {
      // Ошибка обрабатывается тихо
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await cartService.addToCart(product.id);
      setIsInCart(true);
    } catch {
      // Ошибка обрабатывается тихо
    }
  };

  const handleGoToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
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
                className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
                onClick={handleLike}
              >
                {isLiked ? "❤️" : "🤍"}
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
