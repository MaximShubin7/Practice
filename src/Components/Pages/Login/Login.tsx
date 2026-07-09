import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Styles.module.scss";
import { useAuth } from "../../Hooks/useAuth";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { Input } from "../../UI/Input";
import { Loader } from "../../UI/Loader";
import { type LoginFormData, loginSchema } from "./Schema";

function LoginComponent() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const result = await login(data.email, data.password);

    if (result.success) {
      reset();
      navigate("/profile");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  const handleClear = () => {
    reset();
    setError("");
  };

  if (isLoading) {
    return <Loader fullPage />;
  }

  return (
    <div className={styles.page}>
      <Card size="lg" padding="lg" fullWidth className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

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
