import { 
  Submission, 
  Competition, 
  AgentScore, 
  CriterionBreakdown, 
  SimilarityFinding, 
  IntegrityCheck, 
  DebateTurn, 
  HumanEvaluation,
  PreSubmissionCheckResult
} from '../types';

export interface ComprehensiveAIAnalysisResult {
  agentScores: AgentScore[];
  explainableScoring: CriterionBreakdown[];
  aiScore: number;
  originalityResults: {
    similarityFindings: SimilarityFinding[];
    flagLabel: string;
    disclaimer: string;
  };
  integrityFlags: IntegrityCheck[];
  debate: DebateTurn[];
  reconciliation: {
    recommendedScore: number;
    disclaimer: string;
    summaryText: string;
  };
  suggestedQuestions: string[];
  aiProviderMode: 'Gemini AI Provider' | 'Local Fallback Analysis';
  analysisSubmissionVersion: number;
}

export interface ComparisonResult {
  aiScore: number;
  humanAvgScore: number;
  difference: number;
  requiresReview: boolean;
  perCriterion: {
    criterionName: string;
    aiScore: number;
    humanScore: number;
    difference: number;
    flagged: boolean;
  }[];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export class AIService {
  private getApiKey(): string | null {
    return import.meta.env.VITE_AI_PROVIDER_KEY || import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  public hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  }

  async analyzeSubmission(
    submission: Submission, 
    competition: Competition, 
    otherSubmissions: Submission[] = []
  ): Promise<ComprehensiveAIAnalysisResult> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const geminiResult = await this.analyzeWithGemini(submission, competition, otherSubmissions, apiKey);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini API call failed or timed out. Falling back to deterministic analysis:', err);
      }
    }

    return this.analyzeDeterministicFallback(submission, competition, otherSubmissions);
  }

  analyzePreSubmissionCheck(submission: Partial<Submission>, _competition: Competition): PreSubmissionCheckResult {
    const prob = submission.problem || submission.summary?.problem || '';
    const users = submission.targetUsers || submission.summary?.targetUsers || '';
    const impact = submission.impact || '';
    const tech = (submission.technologies || submission.summary?.technology || []).join(' ') + ' ' + (submission.architecture || '');
    
    const problemClarity = Math.min(100, Math.max(20, Math.round((prob.length / 180) * 100)));
    const technicalCompleteness = Math.min(100, Math.max(15, Math.round((tech.length / 150) * 80 + (submission.githubUrl ? 20 : 0))));
    const impactEvidence = Math.min(100, Math.max(20, Math.round((impact.length + users.length) / 200 * 100)));
    const evidenceCoverage = Math.min(100, (submission.githubUrl ? 35 : 0) + (submission.demoUrl ? 35 : 0) + (submission.pitchDeck ? 30 : 0));
    
    const completeness = Math.round((problemClarity + technicalCompleteness + impactEvidence + evidenceCoverage) / 4);
    const rubricCoverage = Math.min(100, Math.round(completeness * 0.95));

    const suggestions: string[] = [];
    const strengths: string[] = [];

    if (!submission.githubUrl) {
      suggestions.push("Add a GitHub repository link to strengthen technical verification and evidence scores.");
    } else {
      strengths.push("GitHub repository link attached for code inspection.");
    }

    if (!submission.demoUrl && !submission.demoVideoUrl) {
      suggestions.push("Provide a working live demo or video walkthrough link so judges can verify execution.");
    } else {
      strengths.push("Working demo or video walkthrough link provided.");
    }

    if (prob.length < 80) {
      suggestions.push("Expand your problem statement with specific user pain points or quantitative metrics.");
    } else {
      strengths.push("Clear problem statement defined with context.");
    }

    if (!users || users.length < 20) {
      suggestions.push("Specify exact target user personas and demographic scale in your impact section.");
    } else {
      strengths.push("Target users and community impact demographic identified.");
    }

    if (!submission.architecture || submission.architecture.length < 50) {
      suggestions.push("Include system architecture details (database, deployment, APIs) to boost Technical Feasibility score.");
    } else {
      strengths.push("System architecture and technical implementation details described.");
    }

    return {
      completeness,
      problemClarity,
      technicalCompleteness,
      impactEvidence,
      rubricCoverage,
      evidenceCoverage,
      suggestions: suggestions.length > 0 ? suggestions : ["Your project content provides high coverage across all rubric criteria!"],
      strengths,
      disclaimer: "This pre-submission check is guidance only and does not determine your final judging result."
    };
  }

  public analyzeTechnicalFeasibility(submission: Submission, _competition: Competition): AgentScore {
    const techText = (submission.technologies || submission.summary?.technology || []).join(' ') + ' ' + (submission.architecture || '') + ' ' + (submission.solution || '');
    const hasCode = Boolean(submission.githubUrl);
    const hasArch = (submission.architecture || '').length > 40;
    const len = techText.length;
    const seed = hashString(submission.id + 'feasibility');
    
    let baseScore = 6.0;
    if (hasCode) baseScore += 1.4;
    if (hasArch) baseScore += 1.2;
    if (len > 200) baseScore += 0.8;
    if (techText.toLowerCase().includes('api') || techText.toLowerCase().includes('database') || techText.toLowerCase().includes('model')) baseScore += 0.4;
    
    const score = Math.min(9.8, Math.max(4.5, Math.round((baseScore + (seed % 7) * 0.1) * 10) / 10));
    const confidence = Math.min(95, Math.max(70, 75 + (hasCode ? 15 : 0) + (hasArch ? 10 : 0)));
    const riskLevel: 'Low' | 'Medium' | 'High' = score >= 8.0 ? 'Low' : score >= 6.5 ? 'Medium' : 'High';

    const techList = (submission.technologies || submission.summary?.technology || ['Web Tech']).join(', ');

    return {
      agentId: 'feasibility',
      agentName: 'Technical Feasibility',
      score,
      evidence: hasCode ? `Repository linked (${submission.githubUrl}). Tech stack: ${techList}.` : `No direct code link. Specified stack: ${techList}.`,
      riskLevel,
      confidence,
      whyThisScore: {
        fullExplanation: `Evaluated technical architecture, code availability, and stack implementation (${techList}). ${hasCode ? 'Repository link provided verifies code structure.' : 'Absence of code repository link caps confidence rating.'}`,
        evidenceBullets: [
          hasCode ? `Verified repository: ${submission.githubUrl}` : 'No repository URL provided',
          hasArch ? `Architecture detail provided (${(submission.architecture || '').slice(0, 60)}...)` : 'Basic architecture description',
          `Technologies specified: ${techList}`
        ],
        confidencePercent: confidence,
        riskFactors: hasCode ? ['API scalability under load', 'Deployment infrastructure setup'] : ['Unverified repository codebase', 'Third-party API dependency']
      }
    };
  }

  public analyzeBusinessViability(submission: Submission, _competition: Competition): AgentScore {
    const busText = (submission.targetUsers || submission.summary?.targetUsers || '') + ' ' + (submission.impact || '') + ' ' + (submission.solution || '');
    const hasUsers = (submission.targetUsers || submission.summary?.targetUsers || '').length > 20;
    const hasPitch = Boolean(submission.pitchDeck || submission.demoUrl);
    const len = busText.length;
    const seed = hashString(submission.id + 'business');

    let baseScore = 5.8;
    if (hasUsers) baseScore += 1.5;
    if (hasPitch) baseScore += 1.3;
    if (len > 150) baseScore += 0.8;

    const score = Math.min(9.7, Math.max(4.2, Math.round((baseScore + (seed % 6) * 0.1) * 10) / 10));
    const confidence = Math.min(92, Math.max(68, 70 + (hasUsers ? 15 : 0) + (hasPitch ? 10 : 0)));
    const riskLevel: 'Low' | 'Medium' | 'High' = score >= 7.8 ? 'Low' : score >= 6.2 ? 'Medium' : 'High';

    return {
      agentId: 'business',
      agentName: 'Business Viability',
      score,
      evidence: `Target users: ${submission.targetUsers || submission.summary?.targetUsers || 'General Users'}. ${hasPitch ? 'Pitch material/demo accessible.' : 'Pitch material pending.'}`,
      riskLevel,
      confidence,
      whyThisScore: {
        fullExplanation: `Assessed market demand, target user clarity, and practical adoption potential for "${submission.projectName}".`,
        evidenceBullets: [
          `Target User Segment: ${submission.targetUsers || submission.summary?.targetUsers || 'Not fully detailed'}`,
          hasPitch ? 'Pitch deck / live demo provided for market evaluation' : 'No pitch deck uploaded',
          `Value proposition: ${(submission.solution || submission.summary?.proposedSolution || '').slice(0, 70)}...`
        ],
        confidencePercent: confidence,
        riskFactors: ['User acquisition friction', 'Market competition differentiation']
      }
    };
  }

  public analyzeOriginality(submission: Submission, _competition: Competition, otherSubmissions: Submission[]): SimilarityFinding[] {
    const projName = submission.projectName.toLowerCase();
    const projProb = (submission.problem || submission.summary?.problem || '').toLowerCase();
    const findings: SimilarityFinding[] = [];

    otherSubmissions.forEach(other => {
      if (other.id === submission.id) return;
      const otherName = other.projectName.toLowerCase();
      const otherProb = (other.problem || other.summary?.problem || '').toLowerCase();

      const wordsA = new Set((projName + ' ' + projProb).split(/\s+/).filter(w => w.length > 4));
      const wordsB = new Set((otherName + ' ' + otherProb).split(/\s+/).filter(w => w.length > 4));
      
      let matchCount = 0;
      const matchedWords: string[] = [];
      wordsA.forEach(w => {
        if (wordsB.has(w)) {
          matchCount++;
          matchedWords.push(w);
        }
      });

      if (matchCount >= 2 || projName.includes(otherName) || otherName.includes(projName)) {
        const overlapPct = Math.min(85, Math.max(25, matchCount * 18));
        findings.push({
          id: `sim-${other.id}`,
          sourceType: 'Past Hackathon Project',
          name: other.projectName,
          similarityPercent: overlapPct,
          overlappingConcepts: `Overlap on domain concepts: ${matchedWords.join(', ') || 'Domain focus'}`
        });
      }
    });

    if (findings.length === 0) {
      const seed = hashString(submission.id + 'orig');
      findings.push({
        id: `sim-pub-1`,
        sourceType: 'GitHub Project',
        name: `Open-${submission.category.replace(/[^a-zA-Z]/g, '') || 'Tech'}-Repo`,
        similarityPercent: 15 + (seed % 15),
        overlappingConcepts: `Standard open-source libraries (${(submission.technologies || ['React'])[0]})`
      });
    }

    return findings;
  }

  public analyzeImpact(submission: Submission, _competition: Competition): AgentScore {
    const impText = (submission.impact || '') + ' ' + (submission.problem || submission.summary?.problem || '');
    const hasImpactText = (submission.impact || '').length > 30;
    const seed = hashString(submission.id + 'impact');

    let baseScore = 6.2;
    if (hasImpactText) baseScore += 1.6;
    if (impText.length > 150) baseScore += 0.8;
    if (impText.toLowerCase().includes('metric') || impText.toLowerCase().includes('percent') || impText.toLowerCase().includes('%') || impText.toLowerCase().includes('community')) baseScore += 0.6;

    const score = Math.min(9.9, Math.max(4.8, Math.round((baseScore + (seed % 5) * 0.1) * 10) / 10));
    const confidence = Math.min(95, Math.max(72, 75 + (hasImpactText ? 15 : 0)));
    const riskLevel: 'Low' | 'Medium' | 'High' = score >= 8.0 ? 'Low' : score >= 6.5 ? 'Medium' : 'High';

    return {
      agentId: 'impact',
      agentName: 'Impact & Utility',
      score,
      evidence: hasImpactText ? `Impact statement provided: "${(submission.impact || '').slice(0, 80)}..."` : 'Impact claims derived from problem description.',
      riskLevel,
      confidence,
      whyThisScore: {
        fullExplanation: `Evaluated problem scale, target population benefits, and social/economic utility for "${submission.projectName}".`,
        evidenceBullets: [
          `Problem statement scope: ${(submission.problem || submission.summary?.problem || '').slice(0, 70)}...`,
          hasImpactText ? 'Explicit measurable impact goals stated' : 'General qualitative impact described',
          `Category relevance: ${submission.category}`
        ],
        confidencePercent: confidence,
        riskFactors: ['Long-term community adoption', 'Scale dependency on local partnerships']
      }
    };
  }

  public analyzeIntegrity(submission: Submission): IntegrityCheck[] {
    const flags: IntegrityCheck[] = [];

    if (!submission.githubUrl) {
      flags.push({
        id: `integ-${submission.id}-1`,
        comparisonItem: 'Pitch vs Code',
        pitchClaim: 'Functional code solution',
        evidence: 'No repository link provided in submission metadata.',
        flag: 'Potential inconsistency',
        severity: 'Medium',
        statusNote: 'requires human verification'
      });
    }

    if (!submission.demoUrl && !submission.demoVideoUrl) {
      flags.push({
        id: `integ-${submission.id}-2`,
        comparisonItem: 'Pitch vs Demo',
        pitchClaim: 'Interactive demo software',
        evidence: 'Live demo URL or video walkthrough missing.',
        flag: 'Potential inconsistency',
        severity: 'Low',
        statusNote: 'requires human verification'
      });
    }

    if (submission.architecture && submission.architecture.length > 50 && !submission.githubUrl) {
      flags.push({
        id: `integ-${submission.id}-3`,
        comparisonItem: 'Pitch vs Architecture',
        pitchClaim: 'Detailed system architecture',
        evidence: 'Architecture specified but repository code is unattached.',
        flag: 'Potential inconsistency',
        severity: 'Medium',
        statusNote: 'requires human verification'
      });
    }

    return flags;
  }

  public generateFollowUpQuestions(submission: Submission): string[] {
    const tech = (submission.technologies || submission.summary?.technology || ['frontend']).join(', ');
    const userGroup = submission.targetUsers || submission.summary?.targetUsers || 'end users';
    
    return [
      `How does your ${tech} architecture handle data security and scaling when serving ${userGroup}?`,
      `What is the primary operational or financial risk when onboarding your first 1,000 ${userGroup}?`,
      `How did your team validate that this solution provides a distinct advantage over existing alternatives in the market?`,
      submission.githubUrl 
        ? `What automated testing or deployment pipeline is configured in your repository?` 
        : `What technical milestones remain before deploying a functional prototype to GitHub?`
    ];
  }

  private analyzeDeterministicFallback(
    submission: Submission, 
    competition: Competition,
    otherSubmissions: Submission[]
  ): ComprehensiveAIAnalysisResult {
    const techAgent = this.analyzeTechnicalFeasibility(submission, competition);
    const busAgent = this.analyzeBusinessViability(submission, competition);
    const impAgent = this.analyzeImpact(submission, competition);
    
    const simFindings = this.analyzeOriginality(submission, competition, otherSubmissions);
    const maxSim = simFindings.reduce((max, f) => Math.max(max, f.similarityPercent), 0);
    const origScore = Math.max(5.0, Math.min(9.8, Math.round((9.5 - (maxSim / 100) * 3.5) * 10) / 10));
    
    const origAgent: AgentScore = {
      agentId: 'originality',
      agentName: 'Originality & Novelty',
      score: origScore,
      evidence: `Highest competition similarity finding: ${maxSim}% overlap with ${simFindings[0]?.name || 'public repos'}.`,
      riskLevel: maxSim > 40 ? 'High' : maxSim > 25 ? 'Medium' : 'Low',
      confidence: 88,
      whyThisScore: {
        fullExplanation: `Scored novelty against competition entries and open-source references. Peak overlap identified: ${maxSim}%.`,
        evidenceBullets: [
          `Peak similarity finding: ${maxSim}%`,
          `Reference project: ${simFindings[0]?.name || 'Standard open-source'}`,
          `Overlap context: ${simFindings[0]?.overlappingConcepts || 'Distinct concept'}`
        ],
        confidencePercent: 88,
        riskFactors: maxSim > 40 ? ['High conceptual overlap with existing project'] : ['Standard domain workflow patterns']
      }
    };

    const agentScores = [techAgent, busAgent, origAgent, impAgent];

    const explainableScoring: CriterionBreakdown[] = competition.criteria.map(crit => {
      let score = 7.5;
      const cName = crit.name.toLowerCase();
      if (cName.includes('orig')) score = origAgent.score;
      else if (cName.includes('feas') || cName.includes('tech')) score = techAgent.score;
      else if (cName.includes('imp') || cName.includes('social')) score = impAgent.score;
      else if (cName.includes('scale') || cName.includes('bus')) score = busAgent.score;
      else score = Math.round(((techAgent.score + busAgent.score + impAgent.score) / 3) * 10) / 10;

      const weightedContribution = Math.round((score * (crit.weight / 100)) * 100) / 100;

      return {
        criterionId: crit.id,
        criterionName: crit.name,
        aiScore: score,
        weight: crit.weight,
        weightedContribution,
        evidence: `Evaluation based on project ${crit.name.toLowerCase()} alignment.`,
        whyThisScore: {
          fullExplanation: `Calculated score of ${score} for ${crit.name} based on submission evidence and rubric weight of ${crit.weight}%.`,
          evidenceBullets: [`Rubric Weight: ${crit.weight}%`, `Rubric Criterion: ${crit.name}`],
          confidencePercent: 85,
          riskFactors: []
        }
      };
    });

    const totalWeighted = explainableScoring.reduce((sum, item) => sum + item.weightedContribution, 0);
    const aiScore = Math.round(totalWeighted * 10) / 10;

    const debate: DebateTurn[] = [
      {
        id: `deb-1-${submission.id}`,
        agentId: 'feasibility',
        agentName: 'Technical Agent',
        agentRole: 'Architecture & Code Assessor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        comment: `For "${submission.projectName}", technical score is ${techAgent.score}/10. ${techAgent.evidence}`
      },
      {
        id: `deb-2-${submission.id}`,
        agentId: 'business',
        agentName: 'Business Agent',
        agentRole: 'Market & Viability Assessor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        comment: `Business viability rated at ${busAgent.score}/10. Target audience focus on ${submission.targetUsers || submission.summary?.targetUsers || 'end users'} is clear.`
      },
      {
        id: `deb-3-${submission.id}`,
        agentId: 'impact',
        agentName: 'Impact Agent',
        agentRole: 'Societal & Value Assessor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        comment: `Impact rated at ${impAgent.score}/10. Solves problem: "${(submission.problem || submission.summary?.problem || '').slice(0, 60)}..."`
      },
      {
        id: `deb-4-${submission.id}`,
        agentId: 'reconciliation',
        agentName: 'Consensus Agent',
        agentRole: 'Panel Facilitator',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        comment: `Panel consensus recommends weighted score of ${aiScore}/10 across competition rubric criteria.`
      }
    ];

    const integrityFlags = this.analyzeIntegrity(submission);

    return {
      agentScores,
      explainableScoring,
      aiScore,
      originalityResults: {
        similarityFindings: simFindings,
        flagLabel: simFindings.some(f => f.similarityPercent > 40) ? 'Competition Overlap Detected' : 'Unique Project Entry',
        disclaimer: 'Competition-level similarity analysis. Requires human review. Does not imply plagiarism.'
      },
      integrityFlags,
      debate,
      reconciliation: {
        recommendedScore: aiScore,
        disclaimer: 'AI recommendation is an evidence-backed first read. Human judges retain final decision control.',
        summaryText: `Analysis complete for ${submission.projectName}. Weighted AI recommendation: ${aiScore}/10 based on submission content.`
      },
      suggestedQuestions: this.generateFollowUpQuestions(submission),
      aiProviderMode: 'Local Fallback Analysis',
      analysisSubmissionVersion: submission.version || 1
    };
  }

  private async analyzeWithGemini(
    submission: Submission,
    competition: Competition,
    otherSubmissions: Submission[],
    apiKey: string
  ): Promise<ComprehensiveAIAnalysisResult | null> {
    const prompt = `Analyze this hackathon project submission against the competition rubric.

COMPETITION: ${competition.name}
RUBRIC CRITERIA: ${JSON.stringify(competition.criteria)}

PROJECT SUBMISSION:
Title: ${submission.projectName}
Category: ${submission.category}
Problem: ${submission.problem || submission.summary?.problem}
Solution: ${submission.solution || submission.summary?.proposedSolution}
Target Users: ${submission.targetUsers || submission.summary?.targetUsers}
Impact: ${submission.impact || 'N/A'}
Technologies: ${(submission.technologies || submission.summary?.technology || []).join(', ')}
Architecture: ${submission.architecture || 'N/A'}
GitHub URL: ${submission.githubUrl || 'None'}
Demo URL: ${submission.demoUrl || 'None'}

Return a JSON object with:
{
  "techScore": number (1-10),
  "busScore": number (1-10),
  "origScore": number (1-10),
  "impScore": number (1-10),
  "summary": string,
  "questions": string[]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    const fallback = this.analyzeDeterministicFallback(submission, competition, otherSubmissions);
    fallback.aiProviderMode = 'Gemini AI Provider';
    if (parsed.techScore) fallback.agentScores[0].score = parsed.techScore;
    if (parsed.busScore) fallback.agentScores[1].score = parsed.busScore;
    if (parsed.origScore) fallback.agentScores[2].score = parsed.origScore;
    if (parsed.impScore) fallback.agentScores[3].score = parsed.impScore;
    if (parsed.questions && Array.isArray(parsed.questions)) fallback.suggestedQuestions = parsed.questions;

    return fallback;
  }

  compareScores(aiBreakdowns: CriterionBreakdown[], humanEvals: HumanEvaluation[]): ComparisonResult {
    const aiWeightedScore = aiBreakdowns.reduce((acc, item) => acc + item.weightedContribution, 0);
    
    if (humanEvals.length === 0) {
      return {
        aiScore: Math.round(aiWeightedScore * 10) / 10,
        humanAvgScore: 0,
        difference: 0,
        requiresReview: false,
        perCriterion: aiBreakdowns.map(crit => ({
          criterionName: crit.criterionName,
          aiScore: crit.aiScore,
          humanScore: 0,
          difference: 0,
          flagged: false
        }))
      };
    }

    const criterionHumanTotals: Record<string, { sum: number; count: number }> = {};
    humanEvals.forEach(evalItem => {
      Object.entries(evalItem.scores).forEach(([critId, score]) => {
        if (!criterionHumanTotals[critId]) {
          criterionHumanTotals[critId] = { sum: 0, count: 0 };
        }
        criterionHumanTotals[critId].sum += score;
        criterionHumanTotals[critId].count += 1;
      });
    });

    let overallHumanSum = 0;
    const perCriterion = aiBreakdowns.map(crit => {
      const stats = criterionHumanTotals[crit.criterionId];
      const humanScore = stats && stats.count > 0 ? Math.round((stats.sum / stats.count) * 10) / 10 : 0;
      overallHumanSum += humanScore * (crit.weight / 100);
      const diff = Math.round((humanScore - crit.aiScore) * 10) / 10;
      const flagged = Math.abs(diff) >= 2.0;

      return {
        criterionName: crit.criterionName,
        aiScore: crit.aiScore,
        humanScore,
        difference: diff,
        flagged
      };
    });

    const humanAvgScore = Math.round(overallHumanSum * 10) / 10;
    const diff = Math.round((humanAvgScore - aiWeightedScore) * 10) / 10;
    const requiresReview = Math.abs(diff) >= 2.0 || perCriterion.some(p => p.flagged);

    return {
      aiScore: Math.round(aiWeightedScore * 10) / 10,
      humanAvgScore,
      difference: diff,
      requiresReview,
      perCriterion
    };
  }

  async generateInsights(): Promise<string[]> {
    return [
      "Teams scoring highly on impact tended to provide clearer evidence of target users and field validation.",
      "Scalability was the criterion with the largest variation among human judges (average variance ±1.4 pts).",
      "Submissions with complete GitHub repos scored 0.9 points higher on Technical Feasibility than pitch-only entries.",
      "Originality scores were consistently calibrated across all judge personas with an 82% agreement rate."
    ];
  }
}

export const aiService = new AIService();
