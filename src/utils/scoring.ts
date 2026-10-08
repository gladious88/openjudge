import { Criterion } from '../types';

/**
 * Formula (Section 9):
 * weighted_score = Σ (criterion_score × criterion_weight) / Σ(weights)
 * Rounded to 1 decimal place.
 */
export function calculateWeightedScore(
  scores: Record<string, number>, // criterionId -> score (1-10)
  criteria: Criterion[]
): number {
  if (!criteria || criteria.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const crit of criteria) {
    const score = scores[crit.id] ?? 0;
    const weight = crit.weight ?? 0;
    totalWeightedScore += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  
  const rawWeightedScore = totalWeightedScore / totalWeight;
  return Math.round(rawWeightedScore * 10) / 10;
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '—';
  return score.toFixed(1);
}

export function getScoreColorClass(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'text-slate-400 bg-slate-800/50 border-slate-700';
  if (score >= 8.5) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
  if (score >= 7.0) return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
  if (score >= 5.5) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
  return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
}

export function getRiskColorClass(risk: 'Low' | 'Medium' | 'High'): string {
  switch (risk) {
    case 'Low':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Medium':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'High':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  }
}

export function getSeverityBadgeClass(severity: 'Low' | 'Medium' | 'High'): string {
  switch (severity) {
    case 'Low':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'High':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
}
