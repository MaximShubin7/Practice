import { type JSX, memo, forwardRef } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  size?: SelectSize;
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

function SelectComponent(
  {
    size = "md",
    label,
    options,
    error,
    fullWidth = false,
    className = "",
    ...props
  }: SelectProps,
  ref: React.ForwardedRef<HTMLSelectElement>,
): JSX.Element {
  const classes = cn(
    styles.select,
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
      <select ref={ref} className={classes} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export const Select = memo(forwardRef(SelectComponent));
