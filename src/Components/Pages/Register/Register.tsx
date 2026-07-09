import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Styles.module.scss";
import { useAuth } from "../../Hooks/useAuth";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { Checkbox } from "../../UI/Checkbox";
import { Input } from "../../UI/Input";
import { Loader } from "../../UI/Loader";
import { Select } from "../../UI/Select";
import { type RegisterFormData, registerSchema } from "./Schema";

function RegisterComponent() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      gender: undefined,
      birthDate: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    },
  });

  const isAdmin = useWatch({
    control,
    name: "isAdmin",
    defaultValue: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const genderOptions = [
    { value: "", label: "Выберите пол" },
    { value: "Мужской", label: "Мужской" },
    { value: "Женский", label: "Женский" },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      birthDate: data.birthDate,
      password: data.password,
      role: data.isAdmin ? "admin" : "user",
    });

    if (result.success) {
      reset();
      navigate("/profile");
    } else {
      setError(result.message);
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
        <h1 className={styles.title}>Регистрация</h1>

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

          <div className={styles.row}>
            <Input
              size="md"
              label="Имя"
              type="text"
              placeholder="Иван"
              error={errors.firstName?.message}
              fullWidth
              {...register("firstName")}
            />
            <Input
              size="md"
              label="Фамилия"
              type="text"
              placeholder="Иванов"
              error={errors.lastName?.message}
              fullWidth
              {...register("lastName")}
            />
          </div>

          <div className={styles.row}>
            <Select
              size="md"
              label="Пол"
              options={genderOptions}
              error={errors.gender?.message}
              fullWidth
              {...register("gender")}
            />
            <Input
              size="md"
              label="Дата рождения"
              type="date"
              error={errors.birthDate?.message}
              fullWidth
              {...register("birthDate")}
            />
          </div>

          <Input
            size="md"
            label="Пароль"
            type="password"
            placeholder="Минимум 6 символов"
            error={errors.password?.message}
            fullWidth
            {...register("password")}
          />

          <Input
            size="md"
            label="Подтвердите пароль"
            type="password"
            placeholder="Повторите пароль"
            error={errors.confirmPassword?.message}
            fullWidth
            {...register("confirmPassword")}
          />

          <Checkbox
            size="md"
            label="Зарегистрироваться как администратор"
            checked={isAdmin}
            {...register("isAdmin")}
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
              {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </div>

          <div className={styles.footer}>
            <span>Уже есть аккаунт?</span>
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export const Register = RegisterComponent;
