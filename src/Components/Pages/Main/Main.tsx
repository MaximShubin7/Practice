import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import { cartService } from "../../../Services/CartService";
import { favoritesService } from "../../../Services/FavoritesService";
import { productService } from "../../../Services/ProductService";
import { useAuth } from "../../Hooks/useAuth";
import type { IProduct } from "../../Types/Product";
import { Loader } from "../../UI/Loader";
import { Search } from "../../Widgets/Search";
import { ProductCard } from "../../Widgets/ProductCard";

function MainComponent() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, favIds, cart] = await Promise.all([
          productService.getAll(),
          isAuthenticated
            ? favoritesService.getFavorites()
            : Promise.resolve([]),
          isAuthenticated ? cartService.getCart() : Promise.resolve([]),
        ]);

        setProducts(productsData);
        setFavoriteIds(favIds);
        setCartProductIds(cart.map((item) => item.productId));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const newState = await favoritesService.toggleFavorite(id);
      if (newState) {
        setFavoriteIds((prev) => [...prev, id]);
      } else {
        setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Товары</h1>
          <span className={styles.count}>
            {filteredProducts.length} товаров
          </span>
        </div>

        <div className={styles.searchWrapper}>
          <Search onSearch={handleSearch} placeholder="Поиск товаров..." />
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <p>Товары не найдены</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map((product) => (
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
                  isLiked={favoriteIds.includes(product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const Main = MainComponent;
