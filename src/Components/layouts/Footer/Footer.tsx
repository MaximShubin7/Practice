import { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./Styles.module.scss";

function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>🛒 Магазин</h3>
          <p className={styles.description}>Лучшие товары по лучшим ценам</p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.subtitle}>Информация</h4>
          <ul className={styles.links}>
            <li>
              <Link to="/about">О нас</Link>
            </li>
            <li>
              <Link to="/delivery">Доставка</Link>
            </li>
            <li>
              <Link to="/contacts">Контакты</Link>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.subtitle}>Покупателям</h4>
          <ul className={styles.links}>
            <li>
              <Link to="/cart">Корзина</Link>
            </li>
            <li>
              <Link to="/favorites">Избранное</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.subtitle}>Контакты</h4>
          <ul className={styles.links}>
            <li>📞 +7 (999) 123-45-67</li>
            <li>📧 shop@example.com</li>
            <li>📍 Екатеринбург, ул. Примерная, 1</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.container}>
          <span>© 2026 Магазин. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);
