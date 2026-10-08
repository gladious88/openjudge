import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CompetitionProvider } from './hooks/useCompetition';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoTourBar } from './components/common/DemoTourBar';

import { LandingPage } from './pages/LandingPage';
import { DemoAuthPage } from './pages/DemoAuthPage';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { CreateCompetitionPage } from './pages/CreateCompetitionPage';
import { SubmissionManagementPage } from './pages/SubmissionManagementPage';
import { ProjectAnalysisPage } from './pages/ProjectAnalysisPage';
import { JudgeCalibrationPage } from './pages/JudgeCalibrationPage';
import { LivePitchAssistantPage } from './pages/LivePitchAssistantPage';
import { HumanScorecardPage } from './pages/HumanScorecardPage';
import { PostAnalyticsPage } from './pages/PostAnalyticsPage';
import { FinalResultsPage } from './pages/FinalResultsPage';

// Participant Pages
import { ParticipantDashboard } from './pages/participant/ParticipantDashboard';
import { ParticipantTeamPage } from './pages/participant/ParticipantTeamPage';
import { ParticipantSubmissionsPage } from './pages/participant/ParticipantSubmissionsPage';
import { ParticipantProjectDetailsPage } from './pages/participant/ParticipantProjectDetailsPage';
import { ParticipantTechnicalPage } from './pages/participant/ParticipantTechnicalPage';
import { ParticipantEvidencePage } from './pages/participant/ParticipantEvidencePage';
import { ParticipantReviewPage } from './pages/participant/ParticipantReviewPage';
import { ParticipantSuccessPage } from './pages/participant/ParticipantSuccessPage';

import { ShaderBackground } from './components/common/ShaderBackground';

export function App() {
  return (
    <CompetitionProvider>
      <Router>
        {/* Animated Shader Gradient Background */}
        <ShaderBackground />

        <div className="min-h-screen relative z-10 flex flex-col font-sans antialiased text-slate-800 selection:bg-purple-500 selection:text-white">
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              {/* Home & Auth */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/demo" element={<DemoAuthPage />} />

              {/* Organizer Routes */}
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/organizer/competitions/new" element={<CreateCompetitionPage />} />
              <Route path="/organizer/competitions/:id/submissions" element={<SubmissionManagementPage />} />
              <Route path="/organizer/competitions/:id/submissions/:submissionId" element={<ProjectAnalysisPage />} />
              <Route path="/organizer/competitions/:id/calibration" element={<JudgeCalibrationPage />} />
              <Route path="/organizer/live/:submissionId" element={<LivePitchAssistantPage />} />
              <Route path="/organizer/competitions/:id/analytics" element={<PostAnalyticsPage />} />
              <Route path="/organizer/competitions/:id/results" element={<FinalResultsPage />} />

              {/* Judge Routes */}
              <Route path="/judge/live/:submissionId" element={<LivePitchAssistantPage />} />
              <Route path="/judge/projects/:submissionId/score" element={<HumanScorecardPage />} />

              {/* Participant Routes */}
              <Route path="/participant" element={<ParticipantDashboard />} />
              <Route path="/participant/team" element={<ParticipantTeamPage />} />
              <Route path="/participant/submission" element={<ParticipantSubmissionsPage />} />
              <Route path="/participant/submission/project" element={<ParticipantProjectDetailsPage />} />
              <Route path="/participant/submission/technical" element={<ParticipantTechnicalPage />} />
              <Route path="/participant/submission/evidence" element={<ParticipantEvidencePage />} />
              <Route path="/participant/submission/review" element={<ParticipantReviewPage />} />
              <Route path="/participant/submission/success" element={<ParticipantSuccessPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <DemoTourBar />
          <Footer />
        </div>
      </Router>
    </CompetitionProvider>
  );
}

export default App;
