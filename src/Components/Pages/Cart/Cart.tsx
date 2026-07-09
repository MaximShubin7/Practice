import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import { Popup } from "../../Layouts/Popup";
import type { IProduct } from "../../Types/Product";
import { Button } from "../../UI/Button";
import { Loader } from "../../UI/Loader";

interface CartItem extends IProduct {
  quantity: number;
}

function CartComponent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = () => {
      const items = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(items);
      setLoading(false);
    };
    loadCart();
  }, []);

  const handleRemove = (id: string) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    const updated = cartItems.filter((item) => item.id !== deleteId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) {
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
                  key={item.id}
                  className={styles.item}
                  onClick={() => handleProductClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.image}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.name}</h3>
                    <p className={styles.price}>
                      {item.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className={styles.controls}>
                    <button
                      className={styles.qtyButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity - 1);
                      }}
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.qtyButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
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
