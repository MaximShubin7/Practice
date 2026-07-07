import { type JSX, memo, useEffect, useRef } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type PopupSize = "xs" | "sm" | "md" | "lg" | "xl";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  size?: PopupSize;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function PopupComponent({
  isOpen,
  onClose,
  size = "md",
  title,
  children,
  className = "",
}: PopupProps): JSX.Element | null {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const classes = cn(styles.popup, styles[`size-${size}`], className);

  return (
    <div className={styles.overlay}>
      <div ref={popupRef} className={classes}>
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export const Popup = memo(PopupComponent);
