// Sequence's own definition of what counts as winning: which attempt
// (1-3) you got the order right on, lower is better (matches the 'asc'
// sort_direction seeded for 'sequence' in leaderboard_games). Every
// game writes its own version of this — the shared leaderboard.js
// never needs to know what an "attempt" is. Only 3 possible values
// though, so ties are common — solve time breaks them (also 'asc' in
// leaderboard_games).
export function toLeaderboardScore(attemptNumber, elapsedSeconds) {
  const attemptLabel = `Attempt ${attemptNumber}/3`
  if (elapsedSeconds == null) return { score: attemptNumber, tiebreak: null, scoreDisplay: attemptLabel }
  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')
  const ss = String(elapsedSeconds % 60).padStart(2, '0')
  return { score: attemptNumber, tiebreak: elapsedSeconds, scoreDisplay: `${attemptLabel} · ${mm}:${ss}` }
}
