export function calculateScore(bid, taken) {
  if (bid === taken) {
    return 10 + (bid * 5);
  } else {
    return -5 * Math.abs(bid - taken);
  }
}

export function calculateRoundScores(players, bids, tricks) {
  return players.map((player, index) => {
    const bid = bids[index] || 0;
    const taken = tricks[index] || 0;
    const roundScore = calculateScore(bid, taken);
    return {
      playerId: player.id,
      bid,
      taken,
      roundScore,
      totalScore: player.score + roundScore
    };
  });
}

export function isPocha(playerTricks, totalTricksInRound, cardsDealt) {
  return cardsDealt >= 6 && playerTricks === totalTricksInRound;
}
