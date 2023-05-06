import styles from "../../styles/Loader.module.css";

interface Props {
  text: string;
  wrapperClass?: string;
  loaderClass?: string;
}

const Loader: React.FC<Props> = ({ text, wrapperClass, loaderClass }) => {
  let wrapperClassNames = [styles["loader-wrapper"]];
  let loaderClassNames = [styles["ellipsis-loader"]];
  if (wrapperClass) {
    wrapperClassNames.push(wrapperClass);
  }
  if (loaderClass) {
    loaderClassNames.push(loaderClass);
  }
  return (
    <>
      <div className={wrapperClassNames.join(" ")}>
        <p>{text}</p>
        <div className={loaderClassNames.join(" ")}>
          <div>.</div>
          <div>.</div>
          <div>.</div>
        </div>
      </div>
    </>
  );
};

export default Loader;
