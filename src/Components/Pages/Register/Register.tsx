import type { JSX } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Card } from "../../UI/Card/Card";
import { Select } from "../../UI/Select/Select";
import { registerSchema, type RegisterFormData } from "./Schema";
import styles from "./Styles.module.scss";

function RegisterComponent(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
    },
  });

  const genderOptions = [
    { value: "", label: "Выберите пол" },
    { value: "Мужской", label: "Мужской" },
    { value: "Женский", label: "Женский" },
  ];

  const onSubmit = (data: RegisterFormData) => {
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
          <h1 className={styles.title}>Регистрация</h1>
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
