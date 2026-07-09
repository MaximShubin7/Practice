import { memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Styles.module.scss";
import { useAuth } from "../../Hooks/useAuth";

function HeaderComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : "";
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🛒 Магазин
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${isActive("/")}`}>
            Главная
          </Link>
          <Link to="/cart" className={`${styles.navLink} ${isActive("/cart")}`}>
            Корзина
          </Link>
          <Link
            to="/favorites"
            className={`${styles.navLink} ${isActive("/favorites")}`}
          >
            Избранное
          </Link>
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>
                {user?.firstName} {user?.lastName}
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              </span>
              {isAdmin && (
                <Link to="/admin" className={styles.link}>
                  Панель
                </Link>
              )}
              <Link to="/profile" className={styles.link}>
                Профиль
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
              <Link to="/register" className={styles.link}>
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);
