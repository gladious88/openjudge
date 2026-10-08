import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowUpDown, 
  BrainCircuit, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Sidebar } from '../components/common/Sidebar';

export const SubmissionManagementPage: React.FC = () => {
  const { competition, submissions, runAiAnalysisOnSelected } = useCompetition();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAiStatus, setSelectedAiStatus] = useState<string>('All');
  const [flagFilter, setFlagFilter] = useState<'All' | 'FlaggedOnly'>('All');
  const [sortField, setSortField] = useState<'aiScore' | 'humanScore' | 'flagsCount' | 'submittedDate'>('aiScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categories = useMemo(() => {
    const set = new Set(submissions.map(s => s.category));
    return ['All', ...Array.from(set)];
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter(sub => {
        const matchesSearch =
          sub.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.teamName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
        const matchesAiStatus = selectedAiStatus === 'All' || sub.aiStatus === selectedAiStatus;
        const matchesFlag = flagFilter === 'All' || (flagFilter === 'FlaggedOnly' && sub.flagsCount > 0);

        return matchesSearch && matchesCategory && matchesAiStatus && matchesFlag;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [submissions, searchTerm, selectedCategory, selectedAiStatus, flagFilter, sortField, sortOrder]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map(s => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchAiAnalysis = () => {
    if (selectedIds.length === 0) return;
    runAiAnalysisOnSelected(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/20 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-white/80 px-2.5 py-1 rounded-full border border-[#E87D87]">
              Submissions Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">
              Submission Queue ({submissions.length})
            </h1>
            <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
              Filter, inspect, and execute multi-agent AI analysis across projects submitted to <span className="font-semibold text-[#9D0D2F]">{competition.name}</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/participant/submission/project"
              className="px-4 py-2.5 btn-primary flex items-center space-x-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Project</span>
            </Link>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchAiAnalysis}
                className="px-4 py-2.5 btn-primary text-xs flex items-center space-x-2 animate-bounce-short"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Run AI Analysis ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-white/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#9D0D2F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search project or team..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/90 border border-[#E87D87]/60 text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#E87D87]/60 text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
            >
              {categories.map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>

            {/* AI Status */}
            <select
              value={selectedAiStatus}
              onChange={e => setSelectedAiStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#E87D87]/60 text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
            >
              <option value="All">AI Status: All</option>
              <option value="Complete">Complete</option>
              <option value="Pending">Pending</option>
              <option value="Analyzing">Analyzing</option>
            </select>

            {/* Flags Filter */}
            <select
              value={flagFilter}
              onChange={e => setFlagFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#E87D87]/60 text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
            >
              <option value="All">Integrity Flags: All</option>
              <option value="FlaggedOnly">Flagged Projects Only</option>
            </select>

          </div>
        </div>

        {/* Table / Cards List */}
        <div className="glass-panel rounded-3xl border border-white/20 overflow-hidden shadow-2xs">
          <div className="p-4 bg-white/80 border-b border-[#E87D87]/40 flex items-center justify-between text-xs font-bold text-[#3E0D1E]">
            <div className="flex items-center space-x-3">
              <button onClick={handleSelectAll} className="p-1 text-[#9D0D2F] hover:text-[#B4204A]">
                {selectedIds.length === filteredSubmissions.length && filteredSubmissions.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[#9D0D2F]" />
                ) : (
                  <Square className="w-4 h-4 text-[#9D0D2F]" />
                )}
              </button>
              <span>Showing {filteredSubmissions.length} of {submissions.length} Submissions</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[#3E0D1E]/70 font-semibold">Sort:</span>
              <button
                onClick={() => {
                  if (sortField === 'aiScore') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortField('aiScore'); setSortOrder('desc'); }
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1 ${
                  sortField === 'aiScore' ? 'bg-[#9D0D2F]/10 border-[#E87D87] text-[#9D0D2F]' : 'bg-white border-slate-200 text-[#3E0D1E]'
                }`}
              >
                <span>AI Score</span>
                <ArrowUpDown className="w-3 h-3 text-[#9D0D2F]" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#E87D87]/30">
            {filteredSubmissions.map(sub => {
              const isSelected = selectedIds.includes(sub.id);
              return (
                <div
                  key={sub.id}
                  className={`p-4 hover:bg-white/90 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected ? 'bg-[#9D0D2F]/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleToggleSelect(sub.id)}
                      className="mt-1 p-0.5 text-[#9D0D2F]"
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4 text-[#9D0D2F]" /> : <Square className="w-4 h-4 text-[#9D0D2F]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/organizer/competitions/${competition.id}/submissions/${sub.id}`}
                          className="font-extrabold text-[#3E0D1E] text-sm hover:text-[#9D0D2F] transition-colors"
                        >
                          {sub.projectName}
                        </Link>
                        {sub.isFlagship && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                            Flagship
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-[#3E0D1E]/70 font-medium">
                        <span>Team: <strong className="text-[#3E0D1E]">{sub.teamName}</strong></span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-[#9D0D2F]/10 text-[#9D0D2F] border border-[#E87D87]/60 text-[11px] font-semibold">{sub.category}</span>
                        <span>•</span>
                        <span>v{sub.version || 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Flags */}
                    {sub.flagsCount > 0 && (
                      <span className="flex items-center space-x-1 text-xs font-semibold text-[#D94A63] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{sub.flagsCount} Flag</span>
                      </span>
                    )}

                    {/* Scores */}
                    <div className="text-right space-y-0.5">
                      <div className="text-xs font-extrabold text-[#9D0D2F]">
                        AI Score: {sub.aiStatus === 'Complete' ? `${sub.aiScore}/10` : 'Pending'}
                      </div>
                      <div className="text-[11px] font-semibold text-[#3E0D1E]/70">
                        Human: {sub.humanScore ? `${sub.humanScore}/10` : 'Unrated'}
                      </div>
                    </div>

                    <Link
                      to={`/organizer/competitions/${competition.id}/submissions/${sub.id}`}
                      className="p-2 rounded-xl bg-white hover:bg-[#9D0D2F]/10 text-[#9D0D2F] border border-[#E87D87]/60 transition-colors"
                      title="Inspect Submission Analysis"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};
