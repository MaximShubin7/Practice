import { type JSX, memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "secondary";
type ButtonType = "button" | "submit" | "reset";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  fullWidth?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

function ButtonComponent({
  size = "md",
  variant = "primary",
  type = "button",
  fullWidth = false,
  rounded = false,
  children,
  className = "",
  disabled = false,
  ...props
}: ButtonProps): JSX.Element {
  const classes = cn(
    styles.button,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    {
      [styles.fullWidth]: fullWidth,
      [styles.rounded]: rounded,
      [styles.disabled]: disabled,
    },
    className,
  );

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
