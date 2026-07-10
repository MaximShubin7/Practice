import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import { productService } from "../../../Services/ProductService";
import { useAuth } from "../../Hooks/useAuth";
import type { IProduct } from "../../Types/Product";
import { Loader } from "../../UI/Loader";
import { ProductCard } from "../../Widgets/ProductCard";

function FavoritesComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const loadFavorites = async () => {
      try {
        const products = await productService.getAll();
        const likedProducts = products.filter((p) => p.isLiked);
        setFavorites(likedProducts);
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart.map((item: IProduct) => item.id));
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, navigate]);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await productService.toggleLike(id);
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleAddToCart = (product: IProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: IProduct) => item.id === product.id);

    if (!existingItem) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart.map((item: IProduct) => item.id));
    }
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (authLoading || loading) {
    return <Loader fullPage />;
  }

  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Избранное</h1>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>❤️</div>
            <p className={styles.emptyText}>Нет избранных товаров</p>
            <Link to="/" className={styles.emptyLink}>
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.grid}>
          {favorites.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard
                product={product}
                onLike={handleLike}
                onAddToCart={handleAddToCart}
                onGoToCart={handleGoToCart}
                isInCart={cartItems.includes(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Favorites = FavoritesComponent;
