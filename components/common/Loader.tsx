import styles from "../../styles/Loader.module.css";
import Backdrop from "./Backdrop";

interface Props {
  text: string;
  loaderWithBackdrop?: boolean;
}

const Loader: React.FC<Props> = ({ text, loaderWithBackdrop = true }) => {
  return (
    <>
      {loaderWithBackdrop && <Backdrop />}
      <div className={styles.loading}>{text}</div>
    </>
  );
};

export default Loader;
