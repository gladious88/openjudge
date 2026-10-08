import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { useCompetition } from '../../hooks/useCompetition';
import { TeamMember } from '../../types';

export const ParticipantTeamPage: React.FC = () => {
  const { currentTeam, updateTeam } = useCompetition();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState<string>(currentTeam?.teamName || 'My Team');
  const [members, setMembers] = useState<TeamMember[]>(currentTeam?.members || [
    { id: 'm-1', name: 'Alex Johnson', email: 'alex@horizon.dev', role: 'Team Lead' }
  ]);

  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('Developer');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleAddMember = () => {
    if (!newName.trim()) return;
    const m: TeamMember = {
      id: `m-${Date.now()}`,
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      role: newRole || 'Developer'
    };
    setMembers(prev => [...prev, m]);
    setNewName('');
    setNewEmail('');
    setNewRole('Developer');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (currentTeam) {
      updateTeam({
        ...currentTeam,
        teamName,
        members
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/participant')}
          className="p-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] border border-[#9D0D2F]/30 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#9D0D2F]" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#3E0D1E]">Team Setup & Members</h1>
          <p className="text-xs text-[#3E0D1E]/80 font-medium">Configure your team profile and collaborators.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#35B779]/20 border border-[#35B779]/40 text-[#3E0D1E] text-xs flex items-center space-x-2 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-[#35B779]" />
          <span>Team settings saved successfully!</span>
        </div>
      )}

      <div className="glass-card p-6 rounded-3xl border border-white/20 space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#3E0D1E] uppercase tracking-wider mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#9D0D2F]/30 text-[#3E0D1E] text-sm font-semibold focus:outline-none focus:border-[#9D0D2F]"
            placeholder="e.g. Team Horizon"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3E0D1E] flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#9D0D2F]" />
              <span>Team Members ({members.length})</span>
            </h3>
          </div>

          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="p-3.5 rounded-xl bg-white/60 border border-[#9D0D2F]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#3E0D1E] block">{m.name}</span>
                  <span className="text-[11px] text-[#9D0D2F] font-medium">{m.role} • {m.email}</span>
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="p-1.5 rounded-lg text-[#D94A63] hover:text-[#D94A63] hover:bg-[#D94A63]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Member Inputs */}
          <div className="p-4 rounded-2xl bg-white/80 border border-[#9D0D2F]/30 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-[#9D0D2F] block">Add New Team Member</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Full Name"
                className="px-3 py-2 rounded-lg bg-white border border-[#9D0D2F]/30 text-xs text-[#3E0D1E] focus:outline-none focus:border-[#9D0D2F]"
              />
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="Email Address"
                className="px-3 py-2 rounded-lg bg-white border border-[#9D0D2F]/30 text-xs text-[#3E0D1E] focus:outline-none focus:border-[#9D0D2F]"
              />
              <input
                type="text"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="Role (e.g. AI Dev)"
                className="px-3 py-2 rounded-lg bg-white border border-[#9D0D2F]/30 text-xs text-[#3E0D1E] focus:outline-none focus:border-[#9D0D2F]"
              />
            </div>
            <button
              onClick={handleAddMember}
              className="px-4 py-2 rounded-lg bg-[#9D0D2F] text-white font-bold text-xs hover:bg-[#B4204A] transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#9D0D2F]/20">
          <button
            onClick={() => navigate('/participant')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#ECA59D]/30 text-[#3E0D1E] font-semibold text-xs border border-[#9D0D2F]/30 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#9D0D2F] hover:bg-[#B4204A] text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Team Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
};
