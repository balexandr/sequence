// Sequence's own definition of what counts as winning: which attempt
// (1-3) you got the order right on, lower is better (matches the 'asc'
// sort_direction seeded for 'sequence' in leaderboard_games). Every
// game writes its own version of this — the shared leaderboard.js
// never needs to know what an "attempt" is.
export function toLeaderboardScore(attemptNumber) {
  return { score: attemptNumber, tiebreak: null, scoreDisplay: `Attempt ${attemptNumber}/3` }
}
