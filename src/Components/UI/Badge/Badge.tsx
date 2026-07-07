import { type JSX, memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";
type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: BadgeSize;
  variant?: BadgeVariant;
  children: React.ReactNode;
}

function BadgeComponent({
  size = "md",
  variant = "primary",
  children,
  className = "",
  ...props
}: BadgeProps): JSX.Element {
  const classes = cn(
    styles.badge,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    className,
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export const Badge = memo(BadgeComponent);
