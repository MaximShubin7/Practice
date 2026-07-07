import { type JSX, memo, forwardRef, useId } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: CheckboxSize;
  label?: string;
  error?: string;
}

function CheckboxComponent(
  { size = "md", label, error, className = "", id, ...props }: CheckboxProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  const classes = cn(
    styles.checkbox,
    styles[`size-${size}`],
    {
      [styles.error]: error,
    },
    className,
  );

  return (
    <div className={styles.wrapper}>
      <div className={classes}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={styles.input}
          {...props}
        />
        <label htmlFor={checkboxId} className={styles.label}>
          <span className={styles.customCheckbox}>
            <svg
              className={styles.checkmark}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          {label && <span className={styles.labelText}>{label}</span>}
        </label>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export const Checkbox = memo(forwardRef(CheckboxComponent));
