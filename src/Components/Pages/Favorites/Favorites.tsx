import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Styles.module.scss";
import { cartService } from "../../../Services/CartService";
import { favoritesService } from "../../../Services/FavoritesService";
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
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const loadFavorites = async () => {
      try {
        const [products, favIds, cart] = await Promise.all([
          productService.getAll(),
          favoritesService.getFavorites(),
          cartService.getCart(),
        ]);

        setFavorites(products.filter((p) => favIds.includes(p.id)));
        setCartProductIds(cart.map((item) => item.productId));
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
      const newState = await favoritesService.toggleFavorite(id);
      if (!newState) {
        setFavorites((prev) => prev.filter((p) => p.id !== id));
      } else {
        const [products, favIds] = await Promise.all([
          productService.getAll(),
          favoritesService.getFavorites(),
        ]);
        setFavorites(products.filter((p) => favIds.includes(p.id)));
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleAddToCart = async (product: IProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await cartService.addToCart(product.id);
      const cart = await cartService.getCart();
      setCartProductIds(cart.map((item) => item.productId));
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
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
                isInCart={cartProductIds.includes(product.id)}
                isLiked={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Favorites = FavoritesComponent;
