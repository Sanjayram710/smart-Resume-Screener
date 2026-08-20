export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatScore(score: number): string {
  return typeof score === 'number' ? score.toFixed(1) : '0.0';
}

export function formatPercentage(pct: number): string {
  return `${Math.round(pct)}%`;
}
