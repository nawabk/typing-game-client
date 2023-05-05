import styles from "../../styles/Loader.module.css";

interface Props {
  text: string;
}

const Loader: React.FC<Props> = ({ text }) => {
  return (
    <>
      <div className={styles["loader-wrapper"]}>
        <p>{text}</p>
        <div className={styles["ellipsis-loader"]}>
          <div>.</div>
          <div>.</div>
          <div>.</div>
        </div>
      </div>
    </>
  );
};

export default Loader;
