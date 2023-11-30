const isValidTennisScore = (score1: number, score2: number) => {
    score1 = Number(score1);
    score2 = Number(score2);
  
    // Legit Scores sind 6-0, 6-1, 6-2, 6-3, 6-4 oder 7-5 und 7-6
    if ((score1 === 6 && score2 < 5) || (score2 === 6 && score1 < 5)) {
      return true;
    }
    if ((score1 === 7 && (score2 === 5 || score2 === 6)) || (score2 === 7 && (score1 === 5 || score1 === 6))) {
      return true;
    }
  
    return false;
  };
  export default isValidTennisScore;