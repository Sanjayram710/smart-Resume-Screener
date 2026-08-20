export function getRecommendationBadge(recommendation: string) {
  switch (recommendation) {
    case 'SHORTLIST':
      return {
        label: 'SHORTLIST',
        bgColor: 'bg-emerald-500/15',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        dotColor: 'bg-emerald-400',
      };
    case 'REVIEW':
      return {
        label: 'REVIEW',
        bgColor: 'bg-amber-500/15',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        dotColor: 'bg-amber-400',
      };
    case 'NOT_RECOMMENDED':
    default:
      return {
        label: 'NOT RECOMMENDED',
        bgColor: 'bg-rose-500/15',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        dotColor: 'bg-rose-400',
      };
  }
}

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
} {
  if (score >= 7.0) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      ring: '#10b981',
    };
  } else if (score >= 5.0) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      ring: '#f59e0b',
    };
  } else {
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      ring: '#f43f5e',
    };
  }
}
