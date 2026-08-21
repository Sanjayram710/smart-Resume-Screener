export function getRecommendationBadge(recommendation: string) {
  switch (recommendation) {
    case 'SHORTLIST':
      return {
        label: 'SHORTLIST',
        bgColor: 'bg-[#DCFCE7]',
        textColor: 'text-[#15803D]',
        borderColor: 'border-[#86EFAC]',
        dotColor: 'bg-[#16A34A]',
      };
    case 'REVIEW':
      return {
        label: 'REVIEW',
        bgColor: 'bg-[#FEF3C7]',
        textColor: 'text-[#92400E]',
        borderColor: 'border-[#FDE68A]',
        dotColor: 'bg-[#D97706]',
      };
    case 'NOT_RECOMMENDED':
    default:
      return {
        label: 'NOT RECOMMENDED',
        bgColor: 'bg-[#FEE2E2]',
        textColor: 'text-[#991B1B]',
        borderColor: 'border-[#FECACA]',
        dotColor: 'bg-[#DC2626]',
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
      text: 'text-[#15803D]',
      bg: 'bg-[#DCFCE7]',
      border: 'border-[#86EFAC]',
      ring: '#16A34A',
    };
  } else if (score >= 5.0) {
    return {
      text: 'text-[#B45309]',
      bg: 'bg-[#FEF3C7]',
      border: 'border-[#FDE68A]',
      ring: '#D97706',
    };
  } else {
    return {
      text: 'text-[#B91C1C]',
      bg: 'bg-[#FEE2E2]',
      border: 'border-[#FECACA]',
      ring: '#DC2626',
    };
  }
}
