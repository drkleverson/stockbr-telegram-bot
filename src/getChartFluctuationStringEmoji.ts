export function getChartFluctuationStringEmoji(fluctuation: "+" | '-' | string) {
  if (fluctuation.includes('-')) return '📉';
  if (fluctuation.includes('+')) return '📈';
  return '📊';
}


function getChartFluctuationEmoji(fluctuation: number) {
  if (fluctuation < 0) return '📉';
  if (fluctuation > 0) return '📈';
  return '📊';
}