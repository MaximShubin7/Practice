import { type JSX, memo, forwardRef, useId } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type RadioSize = "xs" | "sm" | "md" | "lg" | "xl";

interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: RadioSize;
  label?: string;
  error?: string;
}

function RadioComponent(
  { size = "md", label, error, className = "", id, ...props }: RadioProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const generatedId = useId();
  const radioId = id || generatedId;

  const classes = cn(
    styles.radio,
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
          id={radioId}
          type="radio"
          className={styles.input}
          {...props}
        />
        <label htmlFor={radioId} className={styles.label}>
          <span className={styles.customRadio}>
            <span className={styles.radioDot} />
          </span>
          {label && <span className={styles.labelText}>{label}</span>}
        </label>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export const Radio = memo(forwardRef(RadioComponent));
