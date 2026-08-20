import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { UploadResumesPage } from './pages/UploadResumesPage';
import { CandidateRankingsPage } from './pages/CandidateRankingsPage';
import { CandidateDetailsPage } from './pages/CandidateDetailsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/jobs/create" element={<CreateJobPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/jobs/:jobId/upload" element={<UploadResumesPage />} />
            <Route path="/jobs/:jobId/rankings" element={<CandidateRankingsPage />} />
            <Route path="/candidates/:candidateId" element={<CandidateDetailsPage />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
            Smart Resume Screener & Candidate Ranking System • Deterministic Multi-Stage Matching Engine
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
