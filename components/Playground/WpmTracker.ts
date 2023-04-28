interface WpmResult {
  wpm: number;
  accuracyInPerc: number;
  netWpm: number;
}
class WpmTracker {
  static totalLetterTyped: number = 0;
  static totalIncorrectLetterTyped: number = 0;

  static resetData() {
    this.totalIncorrectLetterTyped = 0;
    this.totalLetterTyped = 0;
  }

  static getResult(timeInSec: number = 60): WpmResult {
    const result: Partial<WpmResult> = {};
    let totalLetterTyped: number;
    let totalCorrectLetterTyped: number;
    let totalIncorrectLetterTyped: number;

    if (timeInSec === 60) {
      totalLetterTyped = this.totalLetterTyped;
      totalIncorrectLetterTyped = this.totalIncorrectLetterTyped;
      totalCorrectLetterTyped =
        this.totalLetterTyped - this.totalIncorrectLetterTyped;
    } else {
      totalLetterTyped = (this.totalLetterTyped / timeInSec) * 60;
      totalIncorrectLetterTyped =
        (this.totalIncorrectLetterTyped / timeInSec) * 60;
      totalCorrectLetterTyped = totalLetterTyped - totalIncorrectLetterTyped;
    }
    result.wpm = Math.round(totalLetterTyped / 5);
    result.netWpm = Math.round(totalCorrectLetterTyped / 5);
    result.accuracyInPerc = +Number(
      (totalCorrectLetterTyped / totalLetterTyped) * 100
    ).toFixed(2);
    return result as WpmResult;
  }
}

export default WpmTracker;
