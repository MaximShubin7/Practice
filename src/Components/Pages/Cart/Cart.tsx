import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import { cartService } from "../../../Services/CartService";
import { productService } from "../../../Services/ProductService";
import { useAuth } from "../../Hooks/useAuth";
import { Popup } from "../../Layouts/Popup";
import type { IProduct } from "../../Types/Product";
import { Button } from "../../UI/Button";
import { Loader } from "../../UI/Loader";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: IProduct;
}

function CartComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const loadCart = async () => {
      try {
        const [cart, products] = await Promise.all([
          cartService.getCart(),
          productService.getAll(),
        ]);

        setCartItems(
          cart.map((item) => ({
            ...item,
            product: products.find((p) => p.id === item.productId)!,
          })),
        );
      } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, navigate]);

  const handleRemove = (id: string) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await cartService.removeFromCart(deleteId);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== deleteId),
      );
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateQuantity(id, quantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === id ? { ...item, quantity } : item,
        ),
      );
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (authLoading || loading) {
    return <Loader fullPage />;
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Корзина</h1>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p className={styles.emptyText}>Корзина пуста</p>
            <Link to="/" className={styles.emptyLink}>
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Корзина</h1>
          <div className={styles.content}>
            <div className={styles.items}>
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className={styles.item}
                  onClick={() => handleProductClick(item.productId)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.image}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.product.name}</h3>
                    <p className={styles.price}>
                      {item.product.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className={styles.controls}>
                    <button
                      className={styles.qtyButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.productId, item.quantity - 1);
                      }}
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.qtyButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.productId, item.quantity + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.productId);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Итого</h2>
              <div className={styles.summaryRow}>
                <span>Товары ({totalItems})</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>К оплате</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <button className={styles.checkoutButton}>Оформить заказ</button>
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        size="sm"
        title="Подтверждение удаления"
      >
        <p className={styles.popupText}>
          Вы уверены, что хотите удалить этот товар из корзины?
        </p>
        <div className={styles.popupButtons}>
          <Button
            size="md"
            variant="secondary"
            onClick={() => setShowDeletePopup(false)}
            fullWidth
          >
            Отмена
          </Button>
          <Button size="md" variant="danger" onClick={confirmDelete} fullWidth>
            Удалить
          </Button>
        </div>
      </Popup>
    </>
  );
}

export const Cart = CartComponent;
