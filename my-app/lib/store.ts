import type { Rankings, AssignmentResult } from './data';

const RANKINGS_KEY = 'ndcu_rankings';
const RESULT_KEY = 'ndcu_result';

export function getRankings(): Rankings {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(RANKINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getStudentRanking(studentId: number): string[] | null {
  const rankings = getRankings();
  return rankings[String(studentId)] ?? null;
}

export function setStudentRanking(studentId: number, ranking: string[]): void {
  const rankings = getRankings();
  rankings[String(studentId)] = ranking;
  localStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
}

export function getResult(): AssignmentResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResult(result: AssignmentResult): void {
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function resetAll(): void {
  localStorage.removeItem(RANKINGS_KEY);
  localStorage.removeItem(RESULT_KEY);
}
