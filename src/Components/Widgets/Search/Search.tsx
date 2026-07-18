import { useState, memo } from "react";
import cn from "classnames";
import styles from "./Styles.module.scss";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchComponent({
  onSearch,
  placeholder = "Поиск...",
  className = "",
}: SearchProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form className={cn(styles.search, className)} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button type="button" onClick={handleClear} className={styles.clear}>
          ×
        </button>
      )}
      <button type="submit" className={styles.button}>
        🔍
      </button>
    </form>
  );
}

export const Search = memo(SearchComponent);
