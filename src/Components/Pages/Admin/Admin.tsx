import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import styles from "./Styles.module.scss";
import type { IProduct, ProductFormData } from "../../Types/Product";
import { productService } from "../../../Services/ProductService";
import { Popup } from "../../Layouts/Popup";
import { Button } from "../../UI/Button";
import { Card } from "../../UI/Card";
import { Input } from "../../UI/Input";
import { Loader } from "../../UI/Loader";
import { productSchema } from "./Schema";

function AdminComponent() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: "",
      description: "",
      characteristics: [{ name: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "characteristics",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch {
        setErrorMessage("Ошибка загрузки товаров");
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      const newProduct = await productService.add(data);
      setProducts([newProduct, ...products]);
      reset();
      setSelectedImage(null);
      setShowSuccessPopup(true);
    } catch {
      setErrorMessage("Ошибка при добавлении товара");
      setShowErrorPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await productService.delete(deleteId);
      setProducts(products.filter((p) => p.id !== deleteId));
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch {
      setErrorMessage("Ошибка удаления товара");
      setShowErrorPopup(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    reset({
      name: "",
      price: 0,
      image: "",
      description: "",
      characteristics: [{ name: "", value: "" }],
    });
    setSelectedImage(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
  };

  const handleGoToMain = () => {
    setShowSuccessPopup(false);
    navigate("/");
  };

  const handleAddMore = () => {
    setShowSuccessPopup(false);
    reset({
      name: "",
      price: 0,
      image: "",
      description: "",
      characteristics: [{ name: "", value: "" }],
    });
    setSelectedImage(null);
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Админ панель</h1>

          <Card size="lg" padding="lg" fullWidth className={styles.formCard}>
            <h2 className={styles.formTitle}>Добавить товар</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
              }}
              className={styles.form}
            >
              <div className={styles.imageUpload}>
                {selectedImage ? (
                  <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="Preview" />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => {
                        setSelectedImage(null);
                        setValue("image", "");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={styles.imageDropzone}>
                    <label className={styles.uploadLabel}>
                      <span>📁 Выберите изображение</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.fileInput}
                      />
                    </label>
                  </div>
                )}
                {errors.image && (
                  <span className={styles.error}>{errors.image.message}</span>
                )}
              </div>

              <Input
                size="md"
                label="Название товара"
                placeholder="Введите название"
                error={errors.name?.message}
                fullWidth
                {...register("name")}
              />

              <Input
                size="md"
                label="Цена"
                type="number"
                placeholder="Введите цену"
                error={errors.price?.message}
                fullWidth
                {...register("price")}
              />

              <Input
                size="md"
                label="Описание"
                placeholder="Введите описание"
                error={errors.description?.message}
                fullWidth
                {...register("description")}
              />

              <div className={styles.characteristicsSection}>
                <div className={styles.characteristicsHeader}>
                  <h3>Характеристики</h3>
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={() => append({ name: "", value: "" })}
                  >
                    + Добавить
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className={styles.characteristicRow}>
                    <Input
                      size="sm"
                      placeholder="Название"
                      error={errors.characteristics?.[index]?.name?.message}
                      fullWidth
                      {...register(`characteristics.${index}.name`)}
                    />
                    <Input
                      size="sm"
                      placeholder="Значение"
                      error={errors.characteristics?.[index]?.value?.message}
                      fullWidth
                      {...register(`characteristics.${index}.value`)}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      type="button"
                      onClick={() => remove(index)}
                      className={styles.removeCharButton}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                {errors.characteristics && (
                  <span className={styles.error}>
                    {errors.characteristics.message}
                  </span>
                )}
              </div>

              <div className={styles.formButtons}>
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
                  disabled={submitting}
                >
                  {submitting ? "Добавление..." : "Добавить товар"}
                </Button>
              </div>
            </form>
          </Card>

          <div className={styles.productsList}>
            <h2 className={styles.productsTitle}>Список товаров</h2>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <Card
                  key={product.id}
                  size="md"
                  padding="md"
                  className={styles.productCard}
                >
                  <div className={styles.productInfo}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/60x60?text=No+Image";
                      }}
                    />
                    <div className={styles.productDetails}>
                      <h4>{product.name}</h4>
                      <p className={styles.productPrice}>
                        {product.price.toLocaleString()} ₽
                      </p>
                      <p className={styles.productDesc}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDeleteClick(product.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        size="sm"
        title="Товар добавлен"
      >
        <p className={styles.popupText}>Товар успешно добавлен!</p>
        <div className={styles.popupButtons}>
          <Button
            size="md"
            variant="secondary"
            onClick={handleAddMore}
            fullWidth
          >
            Добавить еще
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={handleGoToMain}
            fullWidth
          >
            На главную
          </Button>
        </div>
      </Popup>

      <Popup
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        size="sm"
        title="Ошибка"
      >
        <p className={styles.popupText}>{errorMessage}</p>
        <div className={styles.popupButtons}>
          <Button
            size="md"
            variant="primary"
            onClick={() => setShowErrorPopup(false)}
            fullWidth
          >
            Закрыть
          </Button>
        </div>
      </Popup>

      <Popup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        size="sm"
        title="Подтверждение удаления"
      >
        <p className={styles.popupText}>
          Вы уверены, что хотите удалить этот товар?
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

export const Admin = AdminComponent;
