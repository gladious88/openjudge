import { Competition, Submission, JudgePersona, CompetitionKPIs } from '../types';
import { SeededRNG } from '../utils/seededRng';
import { calculateWeightedScore } from '../utils/scoring';

export const DEFAULT_COMPETITION: Competition = {
  id: 'comp-2026-nsic',
  name: 'National Student Innovation Challenge 2026',
  description: 'Annual nationwide competition for technology, sustainability, and civic innovation projects building solutions for community resilience.',
  deadline: '2026-11-15',
  numberOfTeams: 100,
  competitionType: 'Hackathon',
  createdAt: '2026-09-01',
  criteria: [
    { id: 'crit-orig', name: 'Originality', description: 'Uniqueness of approach and novelty compared to existing public solutions.', weight: 30, scoreRange: '1-10' },
    { id: 'crit-feas', name: 'Feasibility', description: 'Technical architecture soundness, execution practicality, and risk mitigations.', weight: 25, scoreRange: '1-10' },
    { id: 'crit-imp', name: 'Impact', description: 'Significance of the target problem, user scale, and practical societal benefits.', weight: 25, scoreRange: '1-10' },
    { id: 'crit-scale', name: 'Scalability', description: 'Growth roadmap, cloud architecture capacity, and operational expansion potential.', weight: 20, scoreRange: '1-10' }
  ]
};

export const INITIAL_JUDGES: JudgePersona[] = [
  {
    id: 'judge-a',
    name: 'Judge A (Dr. Sarah Chen)',
    title: 'Principal AI Researcher, Tech Institute',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedProjectIds: ['sub-1', 'sub-2', 'sub-3', 'sub-5', 'sub-8', 'sub-10'],
    avgScore: 8.7,
    projectsScored: 22,
    deltaVsPanel: 0.9
  },
  {
    id: 'judge-b',
    name: 'Judge B (Alex Rivera)',
    title: 'Managing Partner, Frontier Ventures',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    assignedProjectIds: ['sub-1', 'sub-4', 'sub-6', 'sub-7', 'sub-9', 'sub-11'],
    avgScore: 6.9,
    projectsScored: 25,
    deltaVsPanel: -0.9
  },
  {
    id: 'judge-c',
    name: 'Judge C (Prof. Marcus Vance)',
    title: 'Chair of Computer Science, State Univ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedProjectIds: ['sub-1', 'sub-2', 'sub-4', 'sub-8', 'sub-12'],
    avgScore: 8.1,
    projectsScored: 18,
    deltaVsPanel: 0.3
  },
  {
    id: 'judge-d',
    name: 'Judge D (Elena Rostova)',
    title: 'Head of Product, Cloud Scale Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedProjectIds: ['sub-1', 'sub-3', 'sub-5', 'sub-7', 'sub-10'],
    avgScore: 7.4,
    projectsScored: 19,
    deltaVsPanel: -0.4
  },
  {
    id: 'judge-e',
    name: 'Judge E (David Park)',
    title: 'Director of Civic Innovation, City Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedProjectIds: ['sub-1', 'sub-6', 'sub-9', 'sub-11', 'sub-12'],
    avgScore: 7.6,
    projectsScored: 20,
    deltaVsPanel: -0.2
  }
];

export const INITIAL_KPIS: CompetitionKPIs = {
  totalSubmissions: 100,
  aiReviewed: 87,
  humanReviewsCompleted: 64,
  judgingProgress: 64,
  flaggedProjects: 8,
  judgeAgreement: 82
};

export function generateSeedSubmissions(): Submission[] {
  const rng = new SeededRNG(20260926);
  const submissions: Submission[] = [];

  // Flagship Demo Project: SmartWaste AI
  const flagship: Submission = {
    id: 'sub-1',
    teamName: 'Team Nova',
    projectName: 'SmartWaste AI',
    category: 'AI & Sustainability',
    submittedDate: '2026-09-20',
    aiStatus: 'Complete',
    aiScore: 7.8,
    humanScore: 8.2,
    finalScore: 8.2,
    flagsCount: 1,
    status: 'Finalist',
    assignedJudgeIds: ['judge-a', 'judge-b', 'judge-c', 'judge-d', 'judge-e'],
    isFlagship: true,
    summary: {
      problem: 'Municipal waste management lacks real-time collection optimization leading to overflowing bins and high fuel consumption across urban transit networks.',
      proposedSolution: 'IoT sensor-enabled waste monitoring platform with dynamic route optimization and machine-learning fill-level prediction.',
      technology: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI API', 'Docker', 'TensorFlow'],
      targetUsers: 'Municipal waste-management teams, smart city operations managers, sanitation workers'
    },
    agentScores: [
      {
        agentId: 'feasibility',
        agentName: 'Technical Feasibility',
        score: 7.4,
        evidence: 'FastAPI + PostgreSQL is appropriate for the proposed architecture. However, the submission does not explain how the system handles 100k+ concurrent users.',
        riskLevel: 'Medium',
        confidence: 86,
        whyThisScore: {
          fullExplanation: 'The technical design utilizes proven backend tooling (FastAPI, Postgres, Docker). However, load testing evidence and queue processing details for high-volume IoT telemetry streams are absent.',
          evidenceBullets: [
            'FastAPI async architecture handles HTTP REST endpoints efficiently.',
            'Database schema is normalized with proper indexing on bin IDs.',
            'Lacks redis queue setup for high-frequency telemetry ingestion spikes.'
          ],
          confidencePercent: 86,
          riskFactors: ['High telemetry burst load', 'Connection pooling constraints']
        }
      },
      {
        agentId: 'business',
        agentName: 'Business Viability',
        score: 7.6,
        evidence: 'Market size for municipal smart waste is estimated at $4.2B. Cost per unit is target low, but long-term municipal procurement cycles pose an adoption barrier.',
        riskLevel: 'Medium',
        confidence: 82,
        whyThisScore: {
          fullExplanation: 'Strong TAM and clear unit economics. City government pilot cycles often extend 12-18 months, requiring sustained capital.',
          evidenceBullets: [
            'Clear pilot pricing ($45 per hardware sensor node).',
            'Projected 28% route fuel savings for partner municipalities.',
            'B2G sales pipeline timeline not addressed.'
          ],
          confidencePercent: 82,
          riskFactors: ['Long sales cycles', 'Government RFP compliance']
        }
      },
      {
        agentId: 'originality',
        agentName: 'Originality',
        score: 8.1,
        evidence: 'Similarity search found limited overlap with existing public repos. Core route optimization algorithm shows novel constraint-handling for weather inputs.',
        riskLevel: 'Low',
        confidence: 91,
        whyThisScore: {
          fullExplanation: 'While IoT waste tracking exists, the integration of real-time weather pattern constraints into dynamic vehicle routing shows innovative problem formulation.',
          evidenceBullets: [
            'Algorithm factors rainfall precipitation into bin weight estimations.',
            'Unique dynamic rerouting trigger threshold.'
          ],
          confidencePercent: 91,
          riskFactors: ['Prior art in generic VRP (Vehicle Routing Problem)']
        }
      },
      {
        agentId: 'impact',
        agentName: 'Impact',
        score: 8.8,
        evidence: 'Direct measurable reduction in route travel time by up to 28% in pilot simulation. High environmental and public sanitation benefits for medium-to-large cities.',
        riskLevel: 'Low',
        confidence: 94,
        whyThisScore: {
          fullExplanation: 'Clear alignment with municipal sustainability targets and greenhouse gas reduction mandates.',
          evidenceBullets: [
            'Direct carbon footprint mitigation (CO2e reduction).',
            'Prevents sanitary overflow in high-density urban zones.'
          ],
          confidencePercent: 94,
          riskFactors: ['Driver adoption resistance']
        }
      }
    ],
    debate: [
      {
        id: 'deb-1',
        agentId: 'feasibility',
        agentName: 'Technical Agent',
        agentRole: 'Architecture & System Design',
        avatar: '⚡',
        comment: 'Scalability appears underdeveloped for enterprise-scale sensor deployment.'
      },
      {
        id: 'deb-2',
        agentId: 'business',
        agentName: 'Business Agent',
        agentRole: 'Market & Monetization',
        avatar: '💼',
        comment: 'The proposed market is large, but the team has not explained monetization and B2G sales pipeline.'
      },
      {
        id: 'deb-3',
        agentId: 'impact',
        agentName: 'Impact Agent',
        agentRole: 'Societal & Economic Value',
        avatar: '🌱',
        comment: 'The problem affects a significant user group and municipality budget.'
      },
      {
        id: 'deb-4',
        agentId: 'reconciliation',
        agentName: 'Final AI Reconciliation',
        agentRole: 'Synthesis Engine',
        avatar: '🤖',
        comment: 'Strong impact and reasonable technical foundation, but scalability and business validation require additional evidence.'
      }
    ],
    reconciliation: {
      recommendedScore: 7.8,
      disclaimer: 'this is a recommendation, not the final result.',
      summaryText: 'Strong impact and reasonable technical foundation, but scalability and business validation require additional evidence.'
    },
    explainableScoring: [
      {
        criterionId: 'crit-orig',
        criterionName: 'Originality',
        aiScore: 8.1,
        weight: 30,
        weightedContribution: 2.43,
        evidence: 'Similarity search found limited overlap with existing public solutions.',
        whyThisScore: {
          fullExplanation: 'High novelty in integrating precipitation metrics into vehicle routing heuristics.',
          evidenceBullets: ['Custom weather API hook', 'Low overlap with open-source repositories'],
          confidencePercent: 91,
          riskFactors: ['Standard VRP algorithms used as base']
        }
      },
      {
        criterionId: 'crit-feas',
        criterionName: 'Feasibility',
        aiScore: 7.4,
        weight: 25,
        weightedContribution: 1.85,
        evidence: 'Architecture is plausible using FastAPI + PostgreSQL.',
        whyThisScore: {
          fullExplanation: 'Solid framework selection, lacks concurrency stress-testing proofs.',
          evidenceBullets: ['Clean REST API specs', 'Dockerized deployment setup'],
          confidencePercent: 86,
          riskFactors: ['Missing load testing metrics']
        }
      },
      {
        criterionId: 'crit-imp',
        criterionName: 'Impact',
        aiScore: 8.8,
        weight: 25,
        weightedContribution: 2.20,
        evidence: 'Strong target-user relevance and high environmental ROI.',
        whyThisScore: {
          fullExplanation: 'Addresses urgent city infrastructure pain points with quantifiable metrics.',
          evidenceBullets: ['28% reduction in collection mileage', 'Positive environmental feedback loop'],
          confidencePercent: 94,
          riskFactors: ['Requires municipal operator training']
        }
      },
      {
        criterionId: 'crit-scale',
        criterionName: 'Scalability',
        aiScore: 6.7,
        weight: 20,
        weightedContribution: 1.34,
        evidence: 'Scaling strategy insufficient for 100k+ concurrent IoT nodes.',
        whyThisScore: {
          fullExplanation: 'System needs message queue orchestration (Kafka/RabbitMQ) for multi-city scale.',
          evidenceBullets: ['Single database node bottleneck', 'No distributed cache layer specified'],
          confidencePercent: 84,
          riskFactors: ['Database write locks under heavy load']
        }
      }
    ],
    originalityResults: {
      similarityFindings: [
        { id: 'sim-1', sourceType: 'GitHub Project', name: 'WasteSense', similarityPercent: 72, overlappingConcepts: 'Smart waste classification, IoT bins' },
        { id: 'sim-2', sourceType: 'Startup', name: 'EcoTrack', similarityPercent: 48, overlappingConcepts: 'Route optimization' },
        { id: 'sim-3', sourceType: 'Past Hackathon Project', name: 'SmartBin', similarityPercent: 39, overlappingConcepts: 'IoT bins' }
      ],
      flagLabel: 'Potential Overlap Detected',
      disclaimer: 'Demo similarity results shown for illustration only — not verified legal or IP conclusions.'
    },
    integrityFlags: [
      {
        id: 'integ-1',
        comparisonItem: 'Pitch vs Code',
        pitchClaim: 'Real-time AI processing',
        evidence: 'Processing currently runs through batch requests.',
        flag: 'Potential inconsistency',
        severity: 'Medium',
        statusNote: 'requires human verification'
      },
      {
        id: 'integ-2',
        comparisonItem: 'Pitch vs Demo',
        pitchClaim: 'Hardware sensor live streaming',
        evidence: 'Uses simulated telemetry JSON feed in frontend sandbox.',
        flag: 'Potential inconsistency',
        severity: 'Low',
        statusNote: 'requires human verification'
      }
    ],
    humanEvaluations: [
      {
        judgeId: 'judge-a',
        judgeName: 'Judge A (Dr. Sarah Chen)',
        submittedAt: '2026-09-21 14:30',
        scores: { 'crit-orig': 8.5, 'crit-feas': 8.0, 'crit-imp': 9.0, 'crit-scale': 8.5 },
        weightedTotal: 8.5,
        strengths: 'Excellent real-world problem framing and impressive pilot data.',
        concerns: 'Needs deeper scalability analysis for multi-city deployment.',
        questions: 'How will hardware maintenance be budgeted across municipal partners?',
        justificationNote: 'Higher score than AI due to strong live pitch demonstration.',
        isLocked: true
      },
      {
        judgeId: 'judge-b',
        judgeName: 'Judge B (Alex Rivera)',
        submittedAt: '2026-09-22 09:15',
        scores: { 'crit-orig': 8.0, 'crit-feas': 7.0, 'crit-imp': 8.5, 'crit-scale': 7.5 },
        weightedTotal: 7.8,
        strengths: 'Clear economic payback story for sanitation departments.',
        concerns: 'Procurement hurdles in government contracts.',
        questions: 'What is your sales cycle length assumption?',
        isLocked: true
      },
      {
        judgeId: 'judge-c',
        judgeName: 'Judge C (Prof. Marcus Vance)',
        submittedAt: '2026-09-22 16:45',
        scores: { 'crit-orig': 8.5, 'crit-feas': 8.0, 'crit-imp': 9.0, 'crit-scale': 8.0 },
        weightedTotal: 8.4,
        strengths: 'Innovative weather-aware constraint model.',
        concerns: 'Database sharding strategy not detailed.',
        questions: 'Can the weather model adapt to sudden storm anomalies?',
        isLocked: true
      }
    ],
    livePitchTranscript: [
      { id: 'tr-1', speaker: 'Team', text: 'Our platform allows municipal waste collection teams to dynamically optimize routes using IoT sensor telemetry.', timestamp: '00:15' },
      { id: 'tr-2', speaker: 'AI', text: 'Potential gap: Hardware maintenance and sensor calibration protocol not specified.', timestamp: '00:22' },
      { id: 'tr-3', speaker: 'Judge', text: 'How do you handle sensor degradation in sub-zero winter environments?', timestamp: '01:05' },
      { id: 'tr-4', speaker: 'Team', text: 'We use industrial-grade IP67 enclosures with low-power thermal regulation batteries.', timestamp: '01:30' }
    ]
  };

  submissions.push(flagship);

  // Submissions 2 & 3: Other highlighted demo projects
  const teamAxiom: Submission = {
    id: 'sub-2',
    teamName: 'Team Axiom',
    projectName: 'Rural Health Connect',
    category: 'Healthcare',
    submittedDate: '2026-09-19',
    aiStatus: 'Complete',
    aiScore: 8.4,
    humanScore: 8.6,
    finalScore: 8.6,
    flagsCount: 0,
    status: 'Finalist',
    assignedJudgeIds: ['judge-a', 'judge-c'],
    summary: {
      problem: 'Rural clinics lack reliable broadband internet and access to specialist diagnostic assistance.',
      proposedSolution: 'Offline-first AI triage assistant running quantized mobile LLM models on solar-powered tablets.',
      technology: ['Flutter', 'ONNX Runtime', 'Python', 'SQLite', 'WebRTC'],
      targetUsers: 'Rural healthcare workers, community nurses, remote patient populations'
    },
    agentScores: [
      { agentId: 'feasibility', agentName: 'Technical Feasibility', score: 8.6, evidence: 'ONNX edge deployment verified on ARM mobile processors.', riskLevel: 'Low', confidence: 92, whyThisScore: { fullExplanation: 'Edge model optimization is proven.', evidenceBullets: ['Quantized INT8 weights', 'Low RAM footprint'], confidencePercent: 92, riskFactors: [] } },
      { agentId: 'business', agentName: 'Business Viability', score: 7.8, evidence: 'Grant-funded deployment model with health ministry subsidies.', riskLevel: 'Medium', confidence: 85, whyThisScore: { fullExplanation: 'Non-profit pricing model.', evidenceBullets: ['NGO partnership letters'], confidencePercent: 85, riskFactors: ['Dependency on grants'] } },
      { agentId: 'originality', agentName: 'Originality', score: 8.7, evidence: 'Novel offline sync protocol over low-bandwidth SMS bursts.', riskLevel: 'Low', confidence: 90, whyThisScore: { fullExplanation: 'Strong innovation in low-bandwidth telemetry.', evidenceBullets: ['Custom compression algorithm'], confidencePercent: 90, riskFactors: [] } },
      { agentId: 'impact', agentName: 'Impact', score: 8.9, evidence: 'Serves an estimated 1.2 million underserved rural residents.', riskLevel: 'Low', confidence: 95, whyThisScore: { fullExplanation: 'Extremely high social utility.', evidenceBullets: ['Direct clinical impact'], confidencePercent: 95, riskFactors: [] } }
    ],
    debate: [
      { id: 'deb-21', agentId: 'feasibility', agentName: 'Technical Agent', agentRole: 'Architecture', avatar: '⚡', comment: 'Impressive INT8 quantization work for offline mobile hardware.' },
      { id: 'deb-22', agentId: 'impact', agentName: 'Impact Agent', agentRole: 'Societal Value', avatar: '🌱', comment: 'Addresses acute healthcare access disparities.' },
      { id: 'deb-23', agentId: 'reconciliation', agentName: 'Final AI Reconciliation', agentRole: 'Synthesis Engine', avatar: '🤖', comment: 'Outstanding impact and technical execution for low-resource environments.' }
    ],
    reconciliation: { recommendedScore: 8.4, disclaimer: 'this is a recommendation, not the final result.', summaryText: 'Outstanding impact and technical execution for low-resource environments.' },
    explainableScoring: [
      { criterionId: 'crit-orig', criterionName: 'Originality', aiScore: 8.7, weight: 30, weightedContribution: 2.61, evidence: 'Novel SMS-burst sync protocol.', whyThisScore: { fullExplanation: 'Strong technical novelty.', evidenceBullets: ['Low-bandwidth optimization'], confidencePercent: 90, riskFactors: [] } },
      { criterionId: 'crit-feas', criterionName: 'Feasibility', aiScore: 8.6, weight: 25, weightedContribution: 2.15, evidence: 'Edge ONNX runtime verified.', whyThisScore: { fullExplanation: 'Robust offline performance.', evidenceBullets: ['ARM assembly optimizations'], confidencePercent: 92, riskFactors: [] } },
      { criterionId: 'crit-imp', criterionName: 'Impact', aiScore: 8.9, weight: 25, weightedContribution: 2.22, evidence: '1.2M potential patient reach.', whyThisScore: { fullExplanation: 'High humanitarian value.', evidenceBullets: ['Direct rural clinic adoption'], confidencePercent: 95, riskFactors: [] } },
      { criterionId: 'crit-scale', criterionName: 'Scalability', aiScore: 7.2, weight: 20, weightedContribution: 1.44, evidence: 'Requires local health worker onboarding.', whyThisScore: { fullExplanation: 'Scales with field team training.', evidenceBullets: ['Train-the-trainer model'], confidencePercent: 83, riskFactors: ['Field training overhead'] } }
    ],
    originalityResults: { similarityFindings: [], flagLabel: 'Original Work Verified', disclaimer: 'Demo similarity results shown for illustration only — not verified legal or IP conclusions.' },
    integrityFlags: [],
    humanEvaluations: [
      { judgeId: 'judge-a', judgeName: 'Judge A (Dr. Sarah Chen)', submittedAt: '2026-09-22 11:00', scores: { 'crit-orig': 9.0, 'crit-feas': 8.5, 'crit-imp': 9.0, 'crit-scale': 7.5 }, weightedTotal: 8.6, strengths: 'Flawless edge execution on solar tablets.', concerns: 'Long-term battery replacement strategy.', questions: 'How do you update diagnostic models without internet?', isLocked: true }
    ]
  };

  const teamVision: Submission = {
    id: 'sub-3',
    teamName: 'Team Vision',
    projectName: 'EduLens',
    category: 'EdTech',
    submittedDate: '2026-09-18',
    aiStatus: 'Complete',
    aiScore: 6.2,
    humanScore: 5.8,
    finalScore: 5.8,
    flagsCount: 2,
    status: 'Not Selected',
    assignedJudgeIds: ['judge-a', 'judge-d'],
    summary: {
      problem: 'Students with visual impairments struggle to comprehend graphical textbook diagrams.',
      proposedSolution: 'AR tactile-feedback glasses converting 2D figures into multi-modal spatial audio cues.',
      technology: ['Unity', 'C#', 'OpenCV', 'WebSockets'],
      targetUsers: 'Visually impaired students and special education instructors'
    },
    agentScores: [
      { agentId: 'feasibility', agentName: 'Technical Feasibility', score: 5.4, evidence: 'Latency in 2D image processing causes noticeable lag during live spatial tracking.', riskLevel: 'High', confidence: 88, whyThisScore: { fullExplanation: 'High processing latency.', evidenceBullets: ['Frame rate drops below 15 FPS'], confidencePercent: 88, riskFactors: ['Hardware overheating'] } },
      { agentId: 'business', agentName: 'Business Viability', score: 5.8, evidence: 'High bill-of-materials cost ($850/unit) limits school district affordability.', riskLevel: 'High', confidence: 82, whyThisScore: { fullExplanation: 'High hardware cost barrier.', evidenceBullets: ['BOM cost exceeds market expectations'], confidencePercent: 82, riskFactors: ['High price point'] } },
      { agentId: 'originality', agentName: 'Originality', score: 7.9, evidence: 'Unique spatial audio mapping algorithm.', riskLevel: 'Low', confidence: 89, whyThisScore: { fullExplanation: 'Good assistive tech concept.', evidenceBullets: ['Novel audio synthesis'], confidencePercent: 89, riskFactors: [] } },
      { agentId: 'impact', agentName: 'Impact', score: 6.1, evidence: 'Addresses genuine accessibility need but hardware cost restricts reach.', riskLevel: 'Medium', confidence: 90, whyThisScore: { fullExplanation: 'Limited initial user base size.', evidenceBullets: ['Niche adoption curve'], confidencePercent: 90, riskFactors: [] } }
    ],
    debate: [
      { id: 'deb-31', agentId: 'feasibility', agentName: 'Technical Agent', agentRole: 'Architecture', avatar: '⚡', comment: 'Camera processing lag creates disorienting audio delay.' },
      { id: 'deb-32', agentId: 'reconciliation', agentName: 'Final AI Reconciliation', agentRole: 'Synthesis Engine', avatar: '🤖', comment: 'Promising accessibility vision hampered by latency and unit economics.' }
    ],
    reconciliation: { recommendedScore: 6.2, disclaimer: 'this is a recommendation, not the final result.', summaryText: 'Promising accessibility vision hampered by latency and unit economics.' },
    explainableScoring: [
      { criterionId: 'crit-orig', criterionName: 'Originality', aiScore: 7.9, weight: 30, weightedContribution: 2.37, evidence: 'Unique spatial audio synthesis.', whyThisScore: { fullExplanation: 'Creative hardware concept.', evidenceBullets: [], confidencePercent: 89, riskFactors: [] } },
      { criterionId: 'crit-feas', criterionName: 'Feasibility', aiScore: 5.4, weight: 25, weightedContribution: 1.35, evidence: 'Frame rate drops under 15 FPS.', whyThisScore: { fullExplanation: 'Latency bottleneck in CV pipeline.', evidenceBullets: [], confidencePercent: 88, riskFactors: ['Unresolved lag'] } },
      { criterionId: 'crit-imp', criterionName: 'Impact', aiScore: 6.1, weight: 25, weightedContribution: 1.53, evidence: 'Niche user group due to unit cost.', whyThisScore: { fullExplanation: 'High cost restricts impact.', evidenceBullets: [], confidencePercent: 90, riskFactors: [] } },
      { criterionId: 'crit-scale', criterionName: 'Scalability', aiScore: 4.8, weight: 20, weightedContribution: 0.96, evidence: 'Manufacturing scaling unproven.', whyThisScore: { fullExplanation: 'Custom hardware assembly bottlenecks.', evidenceBullets: [], confidencePercent: 80, riskFactors: ['Manufacturing hurdles'] } }
    ],
    originalityResults: {
      similarityFindings: [
        { id: 'sim-31', sourceType: 'Past Hackathon Project', name: 'AudioGlass', similarityPercent: 65, overlappingConcepts: 'Spatial audio convertor' }
      ],
      flagLabel: 'Potential Overlap Detected',
      disclaimer: 'Demo similarity results shown for illustration only — not verified legal or IP conclusions.'
    },
    integrityFlags: [
      { id: 'integ-31', comparisonItem: 'Pitch vs Code', pitchClaim: 'Custom ASIC chip design', evidence: 'Uses standard Raspberry Pi 4 compute module in repo.', flag: 'Potential inconsistency', severity: 'High', statusNote: 'requires human verification' }
    ],
    humanEvaluations: [
      { judgeId: 'judge-d', judgeName: 'Judge D (Elena Rostova)', submittedAt: '2026-09-21 16:00', scores: { 'crit-orig': 7.5, 'crit-feas': 5.0, 'crit-imp': 6.0, 'crit-scale': 4.5 }, weightedTotal: 5.8, strengths: 'Heartfelt accessibility target.', concerns: 'Raspberry Pi hardware overheating in demo.', questions: 'Why claim custom ASIC chip when code repo uses Pi 4?', isLocked: true }
    ]
  };

  submissions.push(teamAxiom, teamVision);

  // Generate remaining 97 procedurally generated submissions
  const projectNames = [
    'BioGrapher', 'AquaPure AI', 'SolarGrid OS', 'CivicPulse', 'CropShield', 'NeuroFlow',
    'QuantumLogistics', 'EcoFreight', 'PatientTrack', 'MediScan AI', 'UrbanFlora', 'GridMind',
    'PolymerRecycle', 'SonicLeak', 'ZeroCarbon Logistics', 'SafeRoute', 'EduBridge', 'AgriSense',
    'ClearSky AI', 'OmniPay', 'TrustLedger', 'CarbonTrace', 'MicroGrid Hub', 'BioPlastic X',
    'PharmaChain', 'SafeHarbor AI', 'WaterNet', 'TheranoScan', 'SkyWatch Drone', 'CleanWave'
  ];

  const categories = ['AI & Sustainability', 'Healthcare', 'EdTech', 'FinTech', 'Civic Tech', 'Climate Tech'];
  const teamPrefixes = ['Team Apex', 'Team Horizon', 'Team Quantum', 'Team Cipher', 'Team Synergy', 'Team Nexus', 'Team Catalyst', 'Team Orbit'];

  for (let i = 4; i <= 100; i++) {
    const id = `sub-${i}`;
    const pName = rng.choice(projectNames) + ` ${i}`;
    const tName = `${rng.choice(teamPrefixes)} #${i}`;
    const category = rng.choice(categories);
    const dateDay = rng.nextInt(10, 25);
    const submittedDate = `2026-09-${dateDay < 10 ? '0' + dateDay : dateDay}`;

    const isAiReviewed = i <= 87;
    const isHumanReviewed = i <= 64;
    const isFlagged = [5, 9, 14, 22, 33, 45, 61, 78].includes(i);

    const aiStatus = isAiReviewed ? 'Complete' : (i <= 92 ? 'Analyzing' : 'Pending');
    
    const origScore = rng.nextFloatDec1(5.5, 9.5);
    const feasScore = rng.nextFloatDec1(5.0, 9.2);
    const impScore = rng.nextFloatDec1(6.0, 9.8);
    const scaleScore = rng.nextFloatDec1(4.5, 9.0);

    const scoresObj = {
      'crit-orig': origScore,
      'crit-feas': feasScore,
      'crit-imp': impScore,
      'crit-scale': scaleScore
    };

    const weightedAiScore = calculateWeightedScore(scoresObj, DEFAULT_COMPETITION.criteria);

    let humanScore: number | null = null;
    if (isHumanReviewed) {
      const delta = isFlagged ? (rng.next() > 0.5 ? 2.2 : -2.3) : rng.nextFloatDec1(-0.8, 0.8);
      humanScore = Math.max(1.0, Math.min(10.0, Math.round((weightedAiScore + delta) * 10) / 10));
    }

    let status: 'Draft' | 'Under Review' | 'Finalist' | 'Shortlisted' | 'Not Selected' = 'Under Review';
    if (humanScore !== null) {
      if (humanScore >= 8.5) status = 'Finalist';
      else if (humanScore >= 7.3) status = 'Shortlisted';
      else status = 'Under Review';
    }

    const judgePool = ['judge-a', 'judge-b', 'judge-c', 'judge-d', 'judge-e'];
    const assignedJudges = [judgePool[i % 5], judgePool[(i + 2) % 5]];

    const humanEvals = [];
    if (isHumanReviewed && humanScore !== null) {
      humanEvals.push({
        judgeId: assignedJudges[0],
        judgeName: INITIAL_JUDGES.find(j => j.id === assignedJudges[0])?.name || 'Judge A',
        submittedAt: `2026-09-23 10:${(i % 50).toString().padStart(2, '0')}`,
        scores: {
          'crit-orig': Math.round((origScore + rng.nextFloatDec1(-0.5, 0.5)) * 10) / 10,
          'crit-feas': Math.round((feasScore + rng.nextFloatDec1(-0.5, 0.5)) * 10) / 10,
          'crit-imp': Math.round((impScore + rng.nextFloatDec1(-0.5, 0.5)) * 10) / 10,
          'crit-scale': Math.round((scaleScore + rng.nextFloatDec1(-0.5, 0.5)) * 10) / 10
        },
        weightedTotal: humanScore,
        strengths: 'Promising technology prototype and active team response.',
        concerns: 'Market validation requires larger pilot size.',
        questions: 'What is your operational deployment roadmap?',
        isLocked: true
      });
    }

    const integrityFlags = [];
    if (isFlagged) {
      integrityFlags.push({
        id: `integ-flag-${i}`,
        comparisonItem: 'Pitch vs Code' as const,
        pitchClaim: 'Fully autonomous ML inference pipeline',
        evidence: 'Repository uses standard heuristics with dummy threshold rules.',
        flag: 'Potential inconsistency' as const,
        severity: (i % 2 === 0 ? 'Medium' : 'High') as 'Medium' | 'High',
        statusNote: 'requires human verification' as const
      });
    }

    submissions.push({
      id,
      teamName: tName,
      projectName: pName,
      category,
      submittedDate,
      aiStatus,
      aiScore: weightedAiScore,
      humanScore,
      finalScore: humanScore,
      flagsCount: integrityFlags.length,
      status,
      assignedJudgeIds: assignedJudges,
      summary: {
        problem: `${category} challenges in regional deployment environments.`,
        proposedSolution: `Automated solution utilizing cloud microservices and analytics.`,
        technology: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        targetUsers: 'Enterprise operations managers and field technicians'
      },
      agentScores: [
        { agentId: 'feasibility', agentName: 'Technical Feasibility', score: feasScore, evidence: 'Architecture design uses modular microservices.', riskLevel: 'Low', confidence: 88, whyThisScore: { fullExplanation: 'Standard web stack.', evidenceBullets: ['Clean REST API specs'], confidencePercent: 88, riskFactors: [] } },
        { agentId: 'business', agentName: 'Business Viability', score: 7.5, evidence: 'SaaS subscription model with tiered licensing.', riskLevel: 'Medium', confidence: 82, whyThisScore: { fullExplanation: 'Clear revenue model.', evidenceBullets: ['Tiered pricing table'], confidencePercent: 82, riskFactors: ['Competitive market'] } },
        { agentId: 'originality', agentName: 'Originality', score: origScore, evidence: 'Novel user workflow optimization.', riskLevel: 'Low', confidence: 90, whyThisScore: { fullExplanation: 'Novel UI pattern.', evidenceBullets: ['Unique data pipeline'], confidencePercent: 90, riskFactors: [] } },
        { agentId: 'impact', agentName: 'Impact', score: impScore, evidence: 'Addresses widespread industry inefficiency.', riskLevel: 'Low', confidence: 93, whyThisScore: { fullExplanation: 'Quantifiable operational efficiency.', evidenceBullets: ['Direct time savings'], confidencePercent: 93, riskFactors: [] } }
      ],
      debate: [
        { id: `deb-${i}-1`, agentId: 'feasibility', agentName: 'Technical Agent', agentRole: 'Architecture', avatar: '⚡', comment: 'Technical foundation is sound.' },
        { id: `deb-${i}-2`, agentId: 'reconciliation', agentName: 'Final AI Reconciliation', agentRole: 'Synthesis Engine', avatar: '🤖', comment: 'Consistent rubric execution.' }
      ],
      reconciliation: {
        recommendedScore: weightedAiScore,
        disclaimer: 'this is a recommendation, not the final result.',
        summaryText: 'Consistent rubric execution with solid evidence backing.'
      },
      explainableScoring: [
        { criterionId: 'crit-orig', criterionName: 'Originality', aiScore: origScore, weight: 30, weightedContribution: Math.round(origScore * 0.3 * 100) / 100, evidence: 'Evaluated against GitHub index.', whyThisScore: { fullExplanation: 'Standard originality scan.', evidenceBullets: [], confidencePercent: 90, riskFactors: [] } },
        { criterionId: 'crit-feas', criterionName: 'Feasibility', aiScore: feasScore, weight: 25, weightedContribution: Math.round(feasScore * 0.25 * 100) / 100, evidence: 'Evaluated against codebase.', whyThisScore: { fullExplanation: 'Standard feasibility scan.', evidenceBullets: [], confidencePercent: 88, riskFactors: [] } },
        { criterionId: 'crit-imp', criterionName: 'Impact', aiScore: impScore, weight: 25, weightedContribution: Math.round(impScore * 0.25 * 100) / 100, evidence: 'Evaluated against problem scope.', whyThisScore: { fullExplanation: 'Standard impact scan.', evidenceBullets: [], confidencePercent: 93, riskFactors: [] } },
        { criterionId: 'crit-scale', criterionName: 'Scalability', aiScore: scaleScore, weight: 20, weightedContribution: Math.round(scaleScore * 0.2 * 100) / 100, evidence: 'Evaluated against cloud specs.', whyThisScore: { fullExplanation: 'Standard scalability scan.', evidenceBullets: [], confidencePercent: 82, riskFactors: [] } }
      ],
      originalityResults: {
        similarityFindings: isFlagged ? [
          { id: `sim-${i}`, sourceType: 'GitHub Project', name: 'OpenCore-Base', similarityPercent: 54, overlappingConcepts: 'Shared module structure' }
        ] : [],
        flagLabel: isFlagged ? 'Potential Overlap Detected' : 'Original Work Verified',
        disclaimer: 'Demo similarity results shown for illustration only — not verified legal or IP conclusions.'
      },
      integrityFlags,
      humanEvaluations: humanEvals
    });
  }

  return submissions;
}
