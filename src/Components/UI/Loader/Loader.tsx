import { memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  fullPage?: boolean;
}

function LoaderComponent({
  size = "md",
  className = "",
  fullPage = false,
}: LoaderProps) {
  const classes = cn(
    styles.loader,
    styles[`size-${size}`],
    {
      [styles.fullPage]: fullPage,
    },
    className,
  );

  return (
    <div className={classes}>
      <div className={styles.spinner}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
}

export const Loader = memo(LoaderComponent);
