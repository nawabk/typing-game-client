import { useEffect, useState, forwardRef } from "react";
import ReactDOM from "react-dom";
import { isMobile } from "react-device-detect";
import styles from "@/styles/Playground.module.css";

interface Props extends React.DOMAttributes<HTMLInputElement> {}
const MobileInput = forwardRef<HTMLInputElement, Props>((_, ref) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      setShow(true);
    }
  }, []);

  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <input
      type="text"
      className={styles["mobile-input"]}
      ref={ref}
      autoFocus
    />,
    document.getElementById("playground")!
  );
});

MobileInput.displayName = "MobileInput";

export default MobileInput;
