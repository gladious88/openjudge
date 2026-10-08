import { Submission, Competition } from '../types';

export function exportToCSV(submissions: Submission[], competitionName: string) {
  const headers = [
    'Rank',
    'Team Name',
    'Project Name',
    'Category',
    'Submitted Date',
    'AI Score',
    'Human Score',
    'Final Score',
    'Status',
    'Flags Count'
  ];

  const rows = submissions.map((sub, idx) => [
    idx + 1,
    `"${sub.teamName.replace(/"/g, '""')}"`,
    `"${sub.projectName.replace(/"/g, '""')}"`,
    `"${sub.category.replace(/"/g, '""')}"`,
    sub.submittedDate,
    sub.aiScore.toFixed(1),
    sub.humanScore !== null ? sub.humanScore.toFixed(1) : 'N/A',
    sub.finalScore !== null ? sub.finalScore.toFixed(1) : 'N/A',
    sub.status,
    sub.flagsCount
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${competitionName.toLowerCase().replace(/\s+/g, '_')}_results.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDFSummary(submissions: Submission[], competition: Competition) {
  // Create a clean styled HTML document for printable PDF export
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const top10 = submissions.slice(0, 10);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${competition.name} - Final Leaderboard Summary</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 40px; color: #1e293b; }
          h1 { color: #0f172a; margin-bottom: 4px; }
          .tagline { color: #64748b; font-size: 14px; margin-bottom: 24px; font-weight: 500; }
          .motto { background: #f1f5f9; border-left: 4px solid #0284c7; padding: 12px 16px; font-style: italic; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; font-weight: 600; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge { padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
          .finalist { background: #dcfce7; color: #166534; }
          .shortlist { background: #e0f2fe; color: #0369a1; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${competition.name}</h1>
        <div class="tagline">Official Final Leaderboard & Analytics Summary • Generated on ${new Date().toLocaleDateString()}</div>
        
        <div class="motto">
          <strong>OpenJudge AI Core Principle:</strong> AI assists. Humans decide. Every score backed by evidence and calibrated human judge evaluations.
        </div>

        <h2>Top Ranked Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Project Name</th>
              <th>Category</th>
              <th>AI Score</th>
              <th>Human Score</th>
              <th>Final Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${top10.map((sub, i) => `
              <tr>
                <td><strong>#${i + 1}</strong></td>
                <td>${sub.teamName}</td>
                <td>${sub.projectName}</td>
                <td>${sub.category}</td>
                <td>${sub.aiScore.toFixed(1)}</td>
                <td>${sub.humanScore !== null ? sub.humanScore.toFixed(1) : '—'}</td>
                <td><strong>${sub.finalScore !== null ? sub.finalScore.toFixed(1) : '—'}</strong></td>
                <td><span class="badge ${sub.status === 'Finalist' ? 'finalist' : 'shortlist'}">${sub.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          OpenJudge AI — "One rubric. Every project. Smarter judging."
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
