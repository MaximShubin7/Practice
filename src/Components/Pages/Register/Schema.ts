import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup.string().email("Некорректный email").required("Введите email"),
  firstName: yup.string().min(2, "Минимум 2 символа").required("Введите имя"),
  lastName: yup
    .string()
    .min(2, "Минимум 2 символа")
    .required("Введите фамилию"),
  gender: yup
    .string()
    .oneOf(["Мужской", "Женский"], "Выберите пол")
    .required("Выберите пол"),
  birthDate: yup.string().required("Введите дату рождения"),
  password: yup
    .string()
    .min(6, "Минимум 6 символов")
    .required("Введите пароль"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),
  isAdmin: yup.boolean().default(false),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
