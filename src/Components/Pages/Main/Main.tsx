import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import type { IProduct } from "../../Types/Product";
import { productService } from "../../../Services/ProductService";
import { Loader } from "../../UI/Loader";
import { Search } from "../../UI/Search";
import { ProductCard } from "../../Widgets/ProductCard";

function MainComponent() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart.map((item: IProduct) => item.id));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await productService.toggleLike(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch {
      //
    }
  };

  const handleAddToCart = (product: IProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: IProduct) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart.map((item: IProduct) => item.id));
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
                  isInCart={cartItems.includes(product.id)}
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
