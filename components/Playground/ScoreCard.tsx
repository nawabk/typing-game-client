import styles from "@/styles/ScoreCard.module.css";

interface Props {
  userName: string;
  wpm: number;
  netWpm: number;
  accuracyInPerc: number;
}

const ScoreCard: React.FC<Props> = ({
  userName,
  wpm,
  netWpm,
  accuracyInPerc,
}) => {
  return (
    <div className={styles["score-card"]}>
      <h2 className={styles["score-card-user"]}>{userName}</h2>
      <div className={styles["score-card-container"]}>
        <Score label="Wpm" value={wpm} />
        <Score label="Accurarcy" value={accuracyInPerc} isPercentage={true} />
        <Score label="Net Wpm" value={netWpm} isFocused={true} />
      </div>
    </div>
  );
};

const Score: React.FC<{
  label: string;
  value: number;
  isPercentage?: boolean;
  isFocused?: boolean;
}> = ({ label, value, isFocused, isPercentage = false }) => {
  return (
    <div className={`${styles.score} ${isFocused ? styles.focused : ""}`}>
      <h3 className={styles["score-label"]}>{label}</h3>
      <h2 className={styles["score-value"]}>
        {value}
        {isPercentage && <span>%</span>}
      </h2>
    </div>
  );
};

export default ScoreCard;
