import styles from "@/styles/Playground.module.css";
import { forwardRef } from "react";

const Caret = forwardRef<HTMLDivElement>((_, ref) => {
  return <div className={styles.caret} ref={ref}></div>;
});

Caret.displayName = "Caret";

export default Caret;
