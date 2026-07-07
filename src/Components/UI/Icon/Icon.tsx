import { type JSX, memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: IconSize;
  src: string;
  alt?: string;
}

function IconComponent({
  size = "md",
  src,
  alt = "",
  className = "",
  ...props
}: IconProps): JSX.Element {
  const classes = cn(styles.icon, styles[`size-${size}`], className);

  return <img className={classes} src={src} alt={alt} {...props} />;
}

export const Icon = memo(IconComponent);
