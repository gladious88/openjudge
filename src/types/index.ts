export type UserRole = 'organizer' | 'judge' | 'participant';

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, e.g. 30
  scoreRange: '1-10';
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  deadline: string;
  numberOfTeams: number;
  competitionType: 'Hackathon' | 'Grant Challenge' | 'Research Competition' | 'Civic Challenge' | 'Custom';
  criteria: Criterion[];
  createdAt: string;
}

export type AIStatus = 'Pending' | 'Analyzing' | 'Complete';
export type SubmissionStatus = 'Draft' | 'Under Review' | 'Finalist' | 'Shortlisted' | 'Not Selected';

export interface AgentWhyThisScore {
  fullExplanation: string;
  evidenceBullets: string[];
  confidencePercent: number;
  riskFactors: string[];
}

export interface AgentScore {
  agentId: 'feasibility' | 'business' | 'originality' | 'impact';
  agentName: string; // e.g. 'Technical Feasibility'
  score: number; // e.g. 8.2
  evidence: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number; // 0-100
  whyThisScore: AgentWhyThisScore;
}

export interface DebateTurn {
  id: string;
  agentId: 'feasibility' | 'business' | 'originality' | 'impact' | 'reconciliation';
  agentName: string;
  agentRole: string;
  avatar: string;
  comment: string;
}

export interface CriterionBreakdown {
  criterionId: string;
  criterionName: string;
  aiScore: number;
  weight: number;
  weightedContribution: number;
  evidence: string;
  whyThisScore: AgentWhyThisScore;
}

export interface SimilarityFinding {
  id: string;
  sourceType: 'GitHub Project' | 'Startup' | 'Past Hackathon Project';
  name: string;
  similarityPercent: number;
  overlappingConcepts: string;
}

export interface IntegrityCheck {
  id: string;
  comparisonItem: 'Pitch vs Code' | 'Pitch vs Demo' | 'Pitch vs Architecture' | 'Documentation vs Repository';
  pitchClaim: string;
  evidence: string;
  flag: 'Potential inconsistency';
  severity: 'Low' | 'Medium' | 'High';
  statusNote: 'requires human verification';
}

export interface HumanEvaluation {
  judgeId: string;
  judgeName: string;
  submittedAt: string;
  scores: Record<string, number>; // criterionId -> score (1-10)
  weightedTotal: number;
  strengths: string;
  concerns: string;
  questions: string;
  justificationNote?: string;
  isLocked: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Team {
  id: string;
  teamName: string;
  members: TeamMember[];
  createdAt: string;
}

export interface PreSubmissionCheckResult {
  completeness: number;
  problemClarity: number;
  technicalCompleteness: number;
  impactEvidence: number;
  rubricCoverage: number;
  evidenceCoverage: number;
  suggestions: string[];
  strengths: string[];
  disclaimer: string;
}

export interface OpenJudgePrincipleHistory {
  version: number;
  title: string;
  description: string;
  tagline?: string;
  changedAt: string;
  changedBy: string;
}

export interface OpenJudgePrinciple {
  title: string;
  description: string;
  tagline: string;
  updatedAt: string;
  updatedBy: string;
  history: OpenJudgePrincipleHistory[];
}

export interface Submission {
  id: string;
  teamId?: string;
  teamName: string;
  projectName: string;
  category: string;
  submittedDate: string;
  version?: number;
  analysisSubmissionVersion?: number;
  aiStatus: AIStatus;
  aiScore: number; // weighted, 1 decimal place
  humanScore: number | null; // weighted avg of human evaluations
  finalScore: number | null;
  flagsCount: number;
  status: SubmissionStatus;
  assignedJudgeIds: string[];
  isFlagship?: boolean;
  
  // Rich submission payload
  members?: TeamMember[];
  problem?: string;
  solution?: string;
  targetUsers?: string;
  impact?: string;
  technologies?: string[];
  architecture?: string;
  aiComponents?: string;
  limitations?: string;
  githubUrl?: string;
  demoUrl?: string;
  demoVideoUrl?: string;
  pitchDeck?: string;
  documentation?: string;
  completionPercentage?: number;

  summary: {
    problem: string;
    proposedSolution: string;
    technology: string[];
    targetUsers: string;
  };
  agentScores: AgentScore[];
  debate: DebateTurn[];
  reconciliation: {
    recommendedScore: number;
    disclaimer: string;
    summaryText: string;
  };
  explainableScoring: CriterionBreakdown[];
  originalityResults: {
    similarityFindings: SimilarityFinding[];
    flagLabel: string;
    disclaimer: string;
  };
  integrityFlags: IntegrityCheck[];
  humanEvaluations: HumanEvaluation[];
  suggestedQuestions?: string[];
  aiProviderMode?: 'Gemini AI Provider' | 'Local Fallback Analysis';
  livePitchTranscript?: { id: string; speaker: 'Team' | 'Judge' | 'AI'; text: string; timestamp: string }[];
}

export interface JudgePersona {
  id: string;
  name: string;
  title: string;
  avatar: string;
  assignedProjectIds: string[];
  avgScore: number;
  projectsScored: number;
  deltaVsPanel: number;
  flaggedNotes?: string;
}

export interface CompetitionKPIs {
  totalSubmissions: number;
  aiReviewed: number;
  humanReviewsCompleted: number;
  judgingProgress: number;
  flaggedProjects: number;
  judgeAgreement: number;
}

