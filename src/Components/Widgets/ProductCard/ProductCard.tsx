import { memo, useState } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";
import type { IProduct } from "../../Types/Product";
import { Card } from "../../UI/Card";

interface ProductCardProps {
  product: IProduct;
  onLike: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (product: IProduct, e: React.MouseEvent) => void;
  onGoToCart?: (e: React.MouseEvent) => void;
  isInCart?: boolean;
  isLiked?: boolean;
  className?: string;
}

function ProductCardComponent({
  product,
  onLike,
  onAddToCart,
  onGoToCart,
  isInCart = false,
  isLiked = false,
  className = "",
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(product.id, e);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGoToCart) {
      onGoToCart(e);
    }
  };

  return (
    <Card
      size="md"
      padding="none"
      interactive
      className={cn(styles.card, className)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={
            imageError
              ? "https://via.placeholder.com/300x200?text=No+Image"
              : product.image
          }
          alt={product.name}
          className={styles.image}
          onError={() => setImageError(true)}
        />
        <button
          className={cn(styles.likeButton, { [styles.liked]: isLiked })}
          onClick={handleLike}
          aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
        >
          {isLiked ? "❤️" : "🤍"}
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>

        <div className={styles.characteristics}>
          {product.characteristics.slice(0, 3).map((char, index) => (
            <span key={index} className={styles.characteristic}>
              {char.name}: {char.value}
            </span>
          ))}
          {product.characteristics.length > 3 && (
            <span className={styles.more}>
              +{product.characteristics.length - 3}
            </span>
          )}
        </div>

        {isInCart ? (
          <button
            className={cn(styles.addButton, styles.inCart)}
            onClick={handleGoToCart}
          >
            🛒 Перейти в корзину
          </button>
        ) : (
          <button className={styles.addButton} onClick={handleAddToCart}>
            🛒 В корзину
          </button>
        )}
      </div>
    </Card>
  );
}

export const ProductCard = memo(ProductCardComponent);
