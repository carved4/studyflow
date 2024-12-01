export interface GradeItem {
  id: number;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

export interface GradePredictorProps {
  className?: string;
}

export type GradeField = keyof GradeItem;

export type GradeCalculationResult = {
  grade: string;
  color: 'success.main' | 'warning.main' | 'error.main';
};

export type NeededScoreResult = string;
