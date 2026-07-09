import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Введите название"),
  price: yup
    .number()
    .required("Введите цену")
    .positive("Цена должна быть положительной"),
  image: yup.string().required("Выберите изображение"),
  description: yup.string().required("Введите описание"),
  characteristics: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Введите название характеристики"),
        value: yup.string().required("Введите значение характеристики"),
      }),
    )
    .min(1, "Добавьте хотя бы одну характеристику")
    .required("Добавьте характеристики"),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
