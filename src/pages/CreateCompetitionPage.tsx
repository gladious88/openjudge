import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Sparkles, ArrowRight, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCompetition } from '../hooks/useCompetition';
import { Criterion, Competition } from '../types';
import { Sidebar } from '../components/common/Sidebar';

export const CreateCompetitionPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateCompetition, competition } = useCompetition();

  const [name, setName] = useState<string>('National Tech & Civic Innovation Sprint 2026');
  const [description, setDescription] = useState<string>(
    'A national competition bringing together software engineers, designers, and domain experts to build evidence-backed solutions for urban resilience.'
  );
  const [deadline, setDeadline] = useState<string>('2026-12-01');
  const [numberOfTeams, setNumberOfTeams] = useState<number>(100);
  const [competitionType, setCompetitionType] = useState<Competition['competitionType']>('Hackathon');

  const [criteria, setCriteria] = useState<Criterion[]>(competition.criteria || [
    { id: 'crit-orig', name: 'Originality', description: 'Uniqueness of technical approach and novelty vs prior art.', weight: 30, scoreRange: '1-10' },
    { id: 'crit-feas', name: 'Feasibility', description: 'Architecture practicality, tech stack fit, and risk mitigations.', weight: 25, scoreRange: '1-10' },
    { id: 'crit-imp', name: 'Impact', description: 'Problem significance, user scale, and practical societal benefits.', weight: 25, scoreRange: '1-10' },
    { id: 'crit-scale', name: 'Scalability', description: 'Growth roadmap, cloud capacity, and operational expansion.', weight: 20, scoreRange: '1-10' }
  ]);

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isWeightValid = totalWeight === 100;
  const areNamesValid = criteria.every(c => c.name.trim().length > 0);
  const isFormValid = isWeightValid && areNamesValid && name.trim().length > 0 && deadline !== '';

  const handleApplyTemplate = () => {
    setCriteria([
      { id: 'crit-orig', name: 'Originality', description: 'Uniqueness of approach and novelty compared to existing public solutions.', weight: 30, scoreRange: '1-10' },
      { id: 'crit-feas', name: 'Feasibility', description: 'Technical architecture soundness, execution practicality, and risk mitigations.', weight: 25, scoreRange: '1-10' },
      { id: 'crit-imp', name: 'Impact', description: 'Significance of the target problem, user scale, and practical societal benefits.', weight: 25, scoreRange: '1-10' },
      { id: 'crit-scale', name: 'Scalability', description: 'Growth roadmap, cloud architecture capacity, and operational expansion potential.', weight: 20, scoreRange: '1-10' }
    ]);
  };

  const handleAddCriterion = () => {
    if (criteria.length >= 8) return;
    const newId = `crit-custom-${Date.now()}`;
    setCriteria([
      ...criteria,
      { id: newId, name: '', description: '', weight: 0, scoreRange: '1-10' }
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleUpdateCriterion = (id: string, field: keyof Criterion, value: any) => {
    setCriteria(
      criteria.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newComp: Competition = {
      id: `comp-${Date.now()}`,
      name,
      description,
      deadline,
      numberOfTeams: Number(numberOfTeams),
      competitionType,
      criteria,
      createdAt: new Date().toISOString().split('T')[0]
    };

    updateCompetition(newComp);
    navigate(`/organizer/competitions/${newComp.id}/submissions`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-white/20 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9D0D2F] bg-white/80 px-2.5 py-1 rounded-full border border-[#E87D87]">
            Competition Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E0D1E] mt-2">Create / Configure Competition</h1>
          <p className="text-xs text-[#3E0D1E]/75 mt-1 font-semibold">
            Establish competition details and define official rubric criteria & weights that dynamically control AI scoring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Info */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-5">
            <h3 className="text-base font-extrabold text-[#3E0D1E] flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#9D0D2F]" />
              <span>General Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                  Competition Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] font-bold text-sm focus:outline-none focus:border-[#9D0D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-medium focus:outline-none focus:border-[#9D0D2F] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                    Expected Teams
                  </label>
                  <input
                    type="number"
                    value={numberOfTeams}
                    onChange={e => setNumberOfTeams(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
                    Type
                  </label>
                  <select
                    value={competitionType}
                    onChange={e => setCompetitionType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#E87D87] text-[#3E0D1E] text-xs font-semibold focus:outline-none focus:border-[#9D0D2F]"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Grant Challenge">Grant Challenge</option>
                    <option value="Research Competition">Research Competition</option>
                    <option value="Civic Challenge">Civic Challenge</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Rubric Weights Section */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E87D87]/40 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#3E0D1E] flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#9D0D2F]" />
                  <span>Evaluation Rubric & Weights</span>
                </h3>
                <p className="text-xs text-[#3E0D1E]/75 mt-0.5 font-semibold">
                  Define the criteria and percentage weights. Total must equal exactly 100%. Mapped dynamically to AI scoring.
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyTemplate}
                className="px-3.5 py-1.5 rounded-xl bg-[#9D0D2F]/10 text-[#9D0D2F] font-bold text-xs border border-[#E87D87] hover:bg-[#9D0D2F]/20 transition-colors"
              >
                Apply Standard 30/25/25/20 Template
              </button>
            </div>

            {/* Total Weight Indicator */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between font-bold ${
              isWeightValid 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center space-x-2">
                {isWeightValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>Current Total Rubric Weight: <strong>{totalWeight}%</strong></span>
              </div>
              <span>{isWeightValid ? 'Valid (100%)' : `Adjust by ${100 - totalWeight}%`}</span>
            </div>

            {/* Criteria List */}
            <div className="space-y-4">
              {criteria.map((crit, idx) => (
                <div key={crit.id} className="p-4 rounded-2xl bg-white/80 border border-[#E87D87]/60 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#9D0D2F]/10 text-[#9D0D2F] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#E87D87]">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={crit.name}
                      onChange={e => handleUpdateCriterion(crit.id, 'name', e.target.value)}
                      placeholder="Criterion Name (e.g. Feasibility)"
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E87D87]/60 text-xs font-bold text-[#3E0D1E] focus:outline-none focus:border-[#9D0D2F]"
                    />
                    <div className="flex items-center space-x-1 w-32">
                      <input
                        type="number"
                        value={crit.weight}
                        onChange={e => handleUpdateCriterion(crit.id, 'weight', Number(e.target.value))}
                        className="w-16 px-2 py-2 rounded-xl bg-white border border-[#E87D87]/60 text-xs font-extrabold text-[#9D0D2F] text-center focus:outline-none focus:border-[#9D0D2F]"
                      />
                      <span className="text-xs font-bold text-[#3E0D1E]">%</span>
                    </div>

                    {criteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(crit.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={crit.description}
                    onChange={e => handleUpdateCriterion(crit.id, 'description', e.target.value)}
                    placeholder="Criterion guidance description..."
                    className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#E87D87]/60 text-xs text-[#3E0D1E] focus:outline-none focus:border-[#9D0D2F]"
                  />
                </div>
              ))}
            </div>

            {criteria.length < 8 && (
              <button
                type="button"
                onClick={handleAddCriterion}
                className="px-4 py-2 rounded-xl bg-white border border-[#E87D87] hover:bg-rose-50 text-[#3E0D1E] font-bold text-xs transition-colors flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4 text-[#9D0D2F]" />
                <span>Add Custom Criterion</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/organizer')}
              className="px-5 py-2.5 btn-secondary text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className="px-7 py-3 btn-primary text-xs flex items-center space-x-2 disabled:opacity-40"
            >
              <span>Save Competition Rubric</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </main>
    </div>
  );
};
