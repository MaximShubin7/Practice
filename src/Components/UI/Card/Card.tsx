import { type JSX, memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type CardSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  padding?: CardSize;
  interactive?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

function CardComponent({
  size = "md",
  padding = "md",
  interactive = false,
  fullWidth = false,
  children,
  className = "",
  ...props
}: CardProps): JSX.Element {
  const classes = cn(
    styles.card,
    styles[`size-${size}`],
    styles[`padding-${padding}`],
    {
      [styles.interactive]: interactive,
      [styles.fullWidth]: fullWidth,
    },
    className,
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export const Card = memo(CardComponent);
