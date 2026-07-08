import { useAuth } from "../../Hooks/useAuth";
import { Card } from "../../UI/Card";
import styles from "./Styles.module.scss";

function ProfileComponent() {
  const { user } = useAuth();

  if (!user) {
    return <div>Не авторизован</div>;
  }

  return (
    <div className={styles.page}>
      <Card size="lg" padding="lg" fullWidth className={styles.card}>
        <h1 className={styles.title}>Профиль</h1>
        <div className={styles.info}>
          <div className={styles.field}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Имя:</span>
            <span className={styles.value}>{user.firstName}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Фамилия:</span>
            <span className={styles.value}>{user.lastName}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Пол:</span>
            <span className={styles.value}>{user.gender}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Дата рождения:</span>
            <span className={styles.value}>{user.birthDate}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Роль:</span>
            <span className={styles.value}>
              {user.role === "admin" ? "Администратор" : "Пользователь"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export const Profile = ProfileComponent;
