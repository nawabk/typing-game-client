import { createPortal } from "react-dom";
import styles from "@/styles/Playground.module.css";
import { forwardRef } from "react";

const Caret = forwardRef<HTMLDivElement>((_, ref) => {
  if (!document) return null;
  return createPortal(
    <div className={styles.caret} ref={ref}></div>,
    document.getElementById("__next")!
  );
});

Caret.displayName = "Caret";

export default Caret;
