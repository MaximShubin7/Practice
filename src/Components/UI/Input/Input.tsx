import { type JSX, memo, forwardRef } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: InputSize;
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

function InputComponent(
  {
    size = "md",
    label,
    error,
    fullWidth = false,
    className = "",
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const classes = cn(
    styles.input,
    styles[`size-${size}`],
    {
      [styles.fullWidth]: fullWidth,
      [styles.error]: error,
    },
    className,
  );

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input ref={ref} className={classes} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export const Input = memo(forwardRef(InputComponent));
