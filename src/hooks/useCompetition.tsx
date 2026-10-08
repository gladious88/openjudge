import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Competition, 
  Submission, 
  JudgePersona, 
  UserRole, 
  CompetitionKPIs, 
  OpenJudgePrinciple,
  Team
} from '../types';
import { DEFAULT_COMPETITION, INITIAL_JUDGES, generateSeedSubmissions } from '../data/demoData';
import { aiService } from '../services/aiService';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  submissionId: string;
  submissionName: string;
  action: string;
  judgeName?: string;
  oldValue?: string | number;
  newValue?: string | number;
  justificationNote: string;
}

export interface DemoTourStep {
  id: string;
  title: string;
  path: string;
  description: string;
}

export const DEMO_TOUR_STEPS: DemoTourStep[] = [
  { id: 'step-dash', title: '1. Dashboard', path: '/organizer', description: 'View overall competition KPIs, judge agreement rate, and score distribution.' },
  { id: 'step-sub', title: '2. Submissions', path: '/organizer/competitions/comp-2026-nsic/submissions', description: 'Browse all submissions. Click flagship project SmartWaste AI or newly submitted projects.' },
  { id: 'step-analysis', title: '3. AI Analysis', path: '/organizer/competitions/comp-2026-nsic/submissions/sub-1', description: 'Inspect SmartWaste AI analysis, summary, and agent evidence.' },
  { id: 'step-panel', title: '4. AI Panel', path: '/organizer/competitions/comp-2026-nsic/submissions/sub-1?tab=panel', description: 'Review scores from 4 multi-agent AI reviewers.' },
  { id: 'step-debate', title: '5. Multi-Agent Debate', path: '/organizer/competitions/comp-2026-nsic/submissions/sub-1?tab=debate', description: 'Watch Technical, Business, and Impact AI agents debate in real-time.' },
  { id: 'step-orig', title: '6. Originality Scan', path: '/organizer/competitions/comp-2026-nsic/submissions/sub-1?tab=originality', description: 'View similarity graph against public open-source repos.' },
  { id: 'step-card', title: '7. Human Scorecard', path: '/judge/projects/sub-1/score', description: 'Try scoring as a human judge with sliders and AI evidence side-by-side.' },
  { id: 'step-diff', title: '8. AI vs. Human Diff', path: '/organizer/competitions/comp-2026-nsic/submissions/sub-1?tab=diff', description: 'Compare AI recommendation vs human judge consensus.' },
  { id: 'step-calib', title: '9. Judge Calibration', path: '/organizer/competitions/comp-2026-nsic/calibration', description: 'Monitor statistical variance across Judge Personas A–E.' },
  { id: 'step-part', title: '10. Participant Portal', path: '/participant', description: 'Experience project creation, team management, and AI pre-submission check.' },
  { id: 'step-results', title: '11. Final Results', path: '/organizer/competitions/comp-2026-nsic/results', description: 'Finalize competition rankings and export CSV/PDF reports.' }
];

export const DEFAULT_OPENJUDGE_PRINCIPLE: OpenJudgePrinciple = {
  title: 'OpenJudge Principle',
  description: 'AI assists. Humans decide. Overrides are logged and transparent.',
  tagline: 'AI recommends evidence-backed scores. Human judges retain complete decision control.',
  updatedAt: '2026-09-01 09:00',
  updatedBy: 'System Default Governance',
  history: [
    {
      version: 1,
      title: 'OpenJudge Principle',
      description: 'AI assists. Humans decide. Overrides are logged and transparent.',
      tagline: 'AI recommends evidence-backed scores. Human judges retain complete decision control.',
      changedAt: '2026-09-01 09:00',
      changedBy: 'System Default Governance'
    }
  ]
};

interface CompetitionContextType {
  competition: Competition;
  submissions: Submission[];
  judges: JudgePersona[];
  kpis: CompetitionKPIs;
  userRole: UserRole;
  activeJudgeId: string;
  auditLogs: AuditLogItem[];
  openJudgePrinciple: OpenJudgePrinciple;
  currentTeam: Team | null;
  isDemoTourActive: boolean;
  demoTourStepIndex: number;
  
  setUserRole: (role: UserRole) => void;
  setActiveJudgeId: (id: string) => void;
  loadDemoCompetition: () => void;
  createCompetition: (comp: Competition) => void;
  updateCompetition: (comp: Competition) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  addParticipantSubmission: (newSub: Partial<Submission>) => Promise<Submission>;
  runAiAnalysisForSubmission: (id: string) => Promise<void>;
  submitHumanEvaluation: (
    submissionId: string,
    judgeId: string,
    scores: Record<string, number>,
    strengths: string,
    concerns: string,
    questions: string,
    justificationNote?: string
  ) => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  runAiAnalysisOnSelected: (ids: string[]) => void;
  updateOpenJudgePrinciple: (title: string, description: string, tagline?: string) => void;
  resetOpenJudgePrinciple: () => void;
  updateTeam: (team: Team) => void;
  startDemoTour: () => void;
  nextDemoTourStep: () => void;
  prevDemoTourStep: () => void;
  endDemoTour: () => void;
  setDemoTourStepIndex: (idx: number) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [competition, setCompetition] = useState<Competition>(() => {
    const saved = localStorage.getItem('openjudge_competition');
    return saved ? JSON.parse(saved) : DEFAULT_COMPETITION;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('openjudge_submissions');
    return saved ? JSON.parse(saved) : generateSeedSubmissions();
  });

  const [judges] = useState<JudgePersona[]>(INITIAL_JUDGES);

  const [openJudgePrinciple, setOpenJudgePrinciple] = useState<OpenJudgePrinciple>(() => {
    const saved = localStorage.getItem('openjudge_principle');
    return saved ? JSON.parse(saved) : DEFAULT_OPENJUDGE_PRINCIPLE;
  });

  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    const saved = localStorage.getItem('openjudge_team');
    return saved ? JSON.parse(saved) : {
      id: 'team-alpha',
      teamName: 'Team Horizon Labs',
      members: [
        { id: 'm-1', name: 'Alex Johnson', email: 'alex@horizon.dev', role: 'Team Lead / Frontend' },
        { id: 'm-2', name: 'Priya Sharma', email: 'priya@horizon.dev', role: 'AI / Backend Engineer' }
      ],
      createdAt: '2026-09-22'
    };
  });

  const [userRole, setUserRole] = useState<UserRole>('organizer');
  const [activeJudgeId, setActiveJudgeId] = useState<string>('judge-a');
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStepIndex, setDemoTourStepIndex] = useState<number>(0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('openjudge_competition', JSON.stringify(competition));
  }, [competition]);

  useEffect(() => {
    localStorage.setItem('openjudge_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('openjudge_principle', JSON.stringify(openJudgePrinciple));
  }, [openJudgePrinciple]);

  useEffect(() => {
    if (currentTeam) {
      localStorage.setItem('openjudge_team', JSON.stringify(currentTeam));
    }
  }, [currentTeam]);

  // Derived KPIs
  const totalSubmissions = submissions.length;
  const aiReviewed = submissions.filter(s => s.aiStatus === 'Complete').length;
  const humanReviewsCompleted = submissions.filter(s => s.humanEvaluations && s.humanEvaluations.length > 0).length;
  const judgingProgress = Math.round((humanReviewsCompleted / Math.max(1, totalSubmissions)) * 100);
  const flaggedProjects = submissions.filter(s => s.flagsCount > 0 || (s.integrityFlags && s.integrityFlags.length > 0)).length;

  const kpis: CompetitionKPIs = {
    totalSubmissions,
    aiReviewed,
    humanReviewsCompleted,
    judgingProgress,
    flaggedProjects,
    judgeAgreement: 84
  };

  const loadDemoCompetition = () => {
    setCompetition(DEFAULT_COMPETITION);
    const seeds = generateSeedSubmissions();
    setSubmissions(seeds);
    setOpenJudgePrinciple(DEFAULT_OPENJUDGE_PRINCIPLE);
    localStorage.removeItem('openjudge_submissions');
    localStorage.removeItem('openjudge_principle');
    localStorage.removeItem('openjudge_competition');
  };

  const createCompetition = (comp: Competition) => {
    setCompetition(comp);
  };

  const updateCompetition = (comp: Competition) => {
    setCompetition(comp);

    // Re-evaluate explainable scores for existing submissions when rubric weights change
    setSubmissions(prev => prev.map(sub => {
      if (sub.explainableScoring && sub.explainableScoring.length > 0) {
        const newExplainable = comp.criteria.map(crit => {
          const existing = sub.explainableScoring.find(e => e.criterionId === crit.id || e.criterionName.toLowerCase().includes(crit.name.toLowerCase()));
          const score = existing ? existing.aiScore : 7.5;
          const weightedContribution = Math.round((score * (crit.weight / 100)) * 100) / 100;
          return {
            criterionId: crit.id,
            criterionName: crit.name,
            aiScore: score,
            weight: crit.weight,
            weightedContribution,
            evidence: existing ? existing.evidence : `Evaluated under ${crit.name}`,
            whyThisScore: existing ? existing.whyThisScore : {
              fullExplanation: `Calculated under rubric criterion ${crit.name} (${crit.weight}% weight).`,
              evidenceBullets: [`Rubric Weight: ${crit.weight}%`],
              confidencePercent: 85,
              riskFactors: []
            }
          };
        });

        const newAiScore = Math.round(newExplainable.reduce((acc, item) => acc + item.weightedContribution, 0) * 10) / 10;
        return {
          ...sub,
          aiScore: newAiScore,
          explainableScoring: newExplainable
        };
      }
      return sub;
    }));
  };

  const updateSubmission = (id: string, updates: Partial<Submission>) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id !== id) return sub;
        
        // If content changed, bump version and invalidate AI analysis
        const isContentEdit = updates.projectName !== undefined || updates.problem !== undefined || updates.solution !== undefined || updates.githubUrl !== undefined;
        const newVersion = isContentEdit ? (sub.version || 1) + 1 : (sub.version || 1);
        const newAiStatus = isContentEdit ? 'Pending' : sub.aiStatus;

        return {
          ...sub,
          ...updates,
          version: newVersion,
          aiStatus: newAiStatus
        };
      })
    );
  };

  const addParticipantSubmission = async (newSub: Partial<Submission>): Promise<Submission> => {
    const id = `sub-part-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    const baseSubmission: Submission = {
      id,
      teamId: currentTeam?.id || 'team-alpha',
      teamName: currentTeam?.teamName || newSub.teamName || 'Participant Team',
      projectName: newSub.projectName || 'Untitled Project',
      category: newSub.category || 'AI & Innovation',
      submittedDate: today,
      version: 1,
      aiStatus: 'Pending',
      aiScore: 0,
      humanScore: null,
      finalScore: null,
      flagsCount: 0,
      status: 'Under Review',
      assignedJudgeIds: ['judge-a', 'judge-c', 'judge-e'],
      problem: newSub.problem || '',
      solution: newSub.solution || '',
      targetUsers: newSub.targetUsers || '',
      impact: newSub.impact || '',
      technologies: newSub.technologies || ['React', 'TypeScript', 'Node.js'],
      architecture: newSub.architecture || '',
      aiComponents: newSub.aiComponents || '',
      limitations: newSub.limitations || '',
      githubUrl: newSub.githubUrl || '',
      demoUrl: newSub.demoUrl || '',
      demoVideoUrl: newSub.demoVideoUrl || '',
      pitchDeck: newSub.pitchDeck || '',
      documentation: newSub.documentation || '',
      completionPercentage: 100,
      members: currentTeam?.members || [],
      summary: {
        problem: newSub.problem || 'Defined problem statement',
        proposedSolution: newSub.solution || 'Proposed innovative solution',
        technology: newSub.technologies || ['Web Tech'],
        targetUsers: newSub.targetUsers || 'Target users'
      },
      agentScores: [],
      debate: [],
      reconciliation: {
        recommendedScore: 0,
        disclaimer: 'Analysis pending.',
        summaryText: 'Submission received.'
      },
      explainableScoring: [],
      originalityResults: {
        similarityFindings: [],
        flagLabel: 'Pending Analysis',
        disclaimer: 'Originality scan pending.'
      },
      integrityFlags: [],
      humanEvaluations: []
    };

    // Run dynamic AI analysis immediately on submission content
    const analysis = await aiService.analyzeSubmission(baseSubmission, competition, submissions);

    const finalSubmission: Submission = {
      ...baseSubmission,
      aiStatus: 'Complete',
      aiScore: analysis.aiScore,
      finalScore: analysis.aiScore,
      agentScores: analysis.agentScores,
      explainableScoring: analysis.explainableScoring,
      originalityResults: analysis.originalityResults,
      integrityFlags: analysis.integrityFlags,
      debate: analysis.debate,
      reconciliation: analysis.reconciliation,
      suggestedQuestions: analysis.suggestedQuestions,
      aiProviderMode: analysis.aiProviderMode,
      analysisSubmissionVersion: 1,
      flagsCount: analysis.integrityFlags.length
    };

    setSubmissions(prev => [finalSubmission, ...prev]);

    addAuditLog({
      submissionId: finalSubmission.id,
      submissionName: finalSubmission.projectName,
      action: 'Participant Submission Created & AI Analyzed',
      newValue: finalSubmission.aiScore,
      justificationNote: `Submitted by ${finalSubmission.teamName}. Analyzed via ${analysis.aiProviderMode}.`
    });

    return finalSubmission;
  };

  const runAiAnalysisForSubmission = async (id: string) => {
    const target = submissions.find(s => s.id === id);
    if (!target) return;

    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, aiStatus: 'Analyzing' } : s));

    const analysis = await aiService.analyzeSubmission(target, competition, submissions);

    setSubmissions(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        aiStatus: 'Complete',
        aiScore: analysis.aiScore,
        agentScores: analysis.agentScores,
        explainableScoring: analysis.explainableScoring,
        originalityResults: analysis.originalityResults,
        integrityFlags: analysis.integrityFlags,
        debate: analysis.debate,
        reconciliation: analysis.reconciliation,
        suggestedQuestions: analysis.suggestedQuestions,
        aiProviderMode: analysis.aiProviderMode,
        analysisSubmissionVersion: s.version || 1,
        flagsCount: analysis.integrityFlags.length
      };
    }));

    addAuditLog({
      submissionId: id,
      submissionName: target.projectName,
      action: 'AI Re-Analysis Executed',
      newValue: analysis.aiScore,
      justificationNote: `Re-analyzed submission v${target.version || 1} via ${analysis.aiProviderMode}.`
    });
  };

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const newItem: AuditLogItem = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newItem, ...prev]);
  };

  const updateOpenJudgePrinciple = (title: string, description: string, tagline?: string) => {
    const newVersionNum = openJudgePrinciple.history.length + 1;
    const nowStr = new Date().toLocaleString('sv').slice(0, 16).replace('T', ' ');

    const newHistoryItem = {
      version: newVersionNum,
      title,
      description,
      tagline: tagline || openJudgePrinciple.tagline,
      changedAt: nowStr,
      changedBy: userRole === 'organizer' ? 'Organizer Admin' : 'Governance Officer'
    };

    setOpenJudgePrinciple({
      title,
      description,
      tagline: tagline || openJudgePrinciple.tagline,
      updatedAt: nowStr,
      updatedBy: 'Organizer Governance Board',
      history: [newHistoryItem, ...openJudgePrinciple.history]
    });

    addAuditLog({
      submissionId: 'comp-governance',
      submissionName: 'OpenJudge Principle Governance Policy',
      action: 'OpenJudge Principle Updated',
      newValue: `v${newVersionNum}`,
      justificationNote: `Updated principle to: "${title} - ${description}"`
    });
  };

  const resetOpenJudgePrinciple = () => {
    setOpenJudgePrinciple(DEFAULT_OPENJUDGE_PRINCIPLE);
    addAuditLog({
      submissionId: 'comp-governance',
      submissionName: 'OpenJudge Principle Governance Policy',
      action: 'OpenJudge Principle Reset to Default',
      justificationNote: 'Reset to default governance principle.'
    });
  };

  const updateTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  const submitHumanEvaluation = (
    submissionId: string,
    judgeId: string,
    scores: Record<string, number>,
    strengths: string,
    concerns: string,
    questions: string,
    justificationNote?: string
  ) => {
    const judge = judges.find(j => j.id === judgeId);
    const judgeName = judge ? judge.name : judgeId;

    let weightedSum = 0;
    let weightTotal = 0;
    competition.criteria.forEach(crit => {
      const s = scores[crit.id] || 0;
      weightedSum += s * crit.weight;
      weightTotal += crit.weight;
    });
    const weightedTotal = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 10) / 10 : 0;

    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id !== submissionId) return sub;

        const existingEvals = sub.humanEvaluations.filter(e => e.judgeId !== judgeId);
        const newEval = {
          judgeId,
          judgeName,
          submittedAt: new Date().toLocaleString('sv').slice(0, 16).replace('T', ' '),
          scores,
          weightedTotal,
          strengths,
          concerns,
          questions,
          justificationNote,
          isLocked: true
        };

        const allEvals = [...existingEvals, newEval];
        const newHumanScoreAvg = Math.round(
          (allEvals.reduce((acc, e) => acc + e.weightedTotal, 0) / allEvals.length) * 10
        ) / 10;

        return {
          ...sub,
          humanScore: newHumanScoreAvg,
          finalScore: newHumanScoreAvg,
          humanEvaluations: allEvals,
          status: sub.status === 'Draft' ? 'Under Review' : sub.status
        };
      })
    );

    addAuditLog({
      submissionId,
      submissionName: submissions.find(s => s.id === submissionId)?.projectName || submissionId,
      action: 'Human Evaluation Submitted',
      judgeName,
      newValue: weightedTotal,
      justificationNote: justificationNote || 'Standard rubric review completed.'
    });
  };

  const runAiAnalysisOnSelected = async (ids: string[]) => {
    for (const id of ids) {
      await runAiAnalysisForSubmission(id);
    }
  };

  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStepIndex(0);
  };

  const nextDemoTourStep = () => {
    if (demoTourStepIndex < DEMO_TOUR_STEPS.length - 1) {
      setDemoTourStepIndex(prev => prev + 1);
    } else {
      setIsDemoTourActive(false);
    }
  };

  const prevDemoTourStep = () => {
    if (demoTourStepIndex > 0) {
      setDemoTourStepIndex(prev => prev - 1);
    }
  };

  const endDemoTour = () => {
    setIsDemoTourActive(false);
  };

  return (
    <CompetitionContext.Provider
      value={{
        competition,
        submissions,
        judges,
        kpis,
        userRole,
        activeJudgeId,
        auditLogs,
        openJudgePrinciple,
        currentTeam,
        isDemoTourActive,
        demoTourStepIndex,
        setUserRole,
        setActiveJudgeId,
        loadDemoCompetition,
        createCompetition,
        updateCompetition,
        updateSubmission,
        addParticipantSubmission,
        runAiAnalysisForSubmission,
        submitHumanEvaluation,
        addAuditLog,
        runAiAnalysisOnSelected,
        updateOpenJudgePrinciple,
        resetOpenJudgePrinciple,
        updateTeam,
        startDemoTour,
        nextDemoTourStep,
        prevDemoTourStep,
        endDemoTour,
        setDemoTourStepIndex
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};
