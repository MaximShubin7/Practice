import { type JSX } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Card } from "../../UI/Card/Card";
import { loginSchema, type LoginFormData } from "./Schema";
import styles from "./Styles.module.scss";

function LoginComponent(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
    reset();
  };

  const handleClear = () => {
    reset();
  };

  return (
    <div className={styles.page}>
      <Card size="lg" padding="lg" fullWidth className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Вход</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            size="md"
            label="Email"
            type="email"
            placeholder="example@mail.com"
            error={errors.email?.message}
            fullWidth
            {...register("email")}
          />

          <Input
            size="md"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            error={errors.password?.message}
            fullWidth
            {...register("password")}
          />

          <div className={styles.buttons}>
            <Button
              size="md"
              variant="secondary"
              type="button"
              onClick={handleClear}
              fullWidth
            >
              Очистить
            </Button>
            <Button
              size="md"
              variant="primary"
              type="submit"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </div>

          <div className={styles.footer}>
            <span>Нет аккаунта?</span>
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export const Login = LoginComponent;
