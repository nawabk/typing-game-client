import { useEffect, useState, forwardRef } from "react";
import ReactDOM from "react-dom";
import { isMobile } from "react-device-detect";
import styles from "@/styles/Playground.module.css";

interface Props extends React.DOMAttributes<HTMLInputElement> {
  show: boolean;
  setShow: React.Dispatch<boolean>;
}
const MobileInput = forwardRef<HTMLInputElement, Props>(
  ({ show, setShow }, ref) => {
    useEffect(() => {
      if (isMobile) {
        setShow(true);
      }
    }, [setShow]);

    if (!show) {
      return null;
    }

    return ReactDOM.createPortal(
      <input type="text" className={styles["mobile-input"]} ref={ref} />,
      document.getElementById("playground")!
    );
  }
);

MobileInput.displayName = "MobileInput";

export default MobileInput;
