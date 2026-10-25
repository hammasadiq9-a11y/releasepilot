import { useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bot,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Code2, FileCode2,
  GitBranch, GitCommitHorizontal, GitPullRequest, Gauge, Layers3, LockKeyhole,
  Play, Plus, Search, ShieldCheck, Sparkles, Terminal, UploadCloud, X
} from 'lucide-react';
import { analyzeDiff, sampleDiff, type Finding } from './analysis';

type Tab = 'overview' | 'review' | 'checks';

const initial = analyzeDiff(sampleDiff);

function severityClass(severity: Finding['severity']) {
  return `severity severity-${severity}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [diff, setDiff] = useState(sampleDiff);
  const [analysis, setAnalysis] = useState(initial);
  const [showEditor, setShowEditor] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState('');
  const [project, setProject] = useState('acme / storefront');

  const counts = useMemo(() => ({
    critical: analysis.findings.filter(f => f.severity === 'critical').length,
    high: analysis.findings.filter(f => f.severity === 'high').length,
    medium: analysis.findings.filter(f => f.severity === 'medium').length,
    low: analysis.findings.filter(f => f.severity === 'low').length
  }), [analysis]);

  function runReview() {
    setAnalysis(analyzeDiff(diff));
    setActiveTab('review');
    setShowEditor(false);
    setToast('Review completed using local heuristic checks.');
    window.setTimeout(() => setToast(''), 3500);
  }

  function loadSample() {
    setDiff(sampleDiff);
    setAnalysis(analyzeDiff(sampleDiff));
    setToast('Sample change loaded.');
    window.setTimeout(() => setToast(''), 2500);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      setToast('Please choose a text file smaller than 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? '');
      setDiff(value);
      setAnalysis(analyzeDiff(value));
      setShowEditor(true);
      setToast(`Loaded ${file.name}`);
      window.setTimeout(() => setToast(''), 2500);
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  const displayedFindings = showAll ? analysis.findings : analysis.findings.slice(0, 3);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={19} strokeWidth={2.5} /></div>
          <span>release<span className="brand-light">pilot</span></span>
          <span className="beta">BETA</span>
        </div>
        <button className="workspace-switch">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy"><strong>Acme workspace</strong><small>Free workspace</small></div>
          <ChevronDown size={15} />
        </button>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className="nav-item active"><Layers3 size={17} /> Overview</button>
          <button className="nav-item" onClick={() => setActiveTab('review')}><GitPullRequest size={17} /> Change reviews <span className="nav-count">{analysis.findings.length}</span></button>
          <button className="nav-item" onClick={() => setActiveTab('checks')}><ShieldCheck size={17} /> Checks & policies</button>
        </nav>
        <div className="side-label projects-label">PROJECTS <button aria-label="Add project" onClick={() => { setToast('Connect a GitLab project in the integration setup guide.'); window.setTimeout(() => setToast(''), 3500); }}><Plus size={14} /></button></div>
        <button className="project-link selected" onClick={() => setProject('acme / storefront')}><span className="project-dot purple" /><span>storefront</span><span className="project-branch">main</span></button>
        <button className="project-link" onClick={() => setProject('acme / payments')}><span className="project-dot blue" /><span>payments-api</span></button>
        <button className="project-link" onClick={() => setProject('acme / mobile')}><span className="project-dot green" /><span>mobile-app</span></button>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>New to ReleasePilot?</strong><p>Understand your release risk before you merge.</p><button onClick={() => setToast('Tip: paste a unified diff and run a review to get started.')}>Quick start <ArrowRight size={13} /></button></div>
          <div className="user-profile"><div className="user-avatar">ES</div><div><strong>Engineering team</strong><small>Developer</small></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{project}</strong><span className="branch-pill"><GitBranch size={12} /> main</span></div>
          <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={17} /></button><div className="top-divider" /><button className="help-button"><CircleHelp size={15} /> Help</button><div className="top-avatar">ES</div></div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="live-dot" /> RELEASE INTELLIGENCE</div><h1>Good morning, team <span className="wave">✳</span></h1><p className="subtitle">Know what could break before it reaches production.</p></div>
            <button className="primary-button" onClick={() => { setShowEditor(true); setActiveTab('review'); }}><Plus size={16} /> New review</button>
          </div>

          <section className="release-banner">
            <div className="banner-orb orb-one" /><div className="banner-orb orb-two" />
            <div className="banner-copy"><div className="banner-kicker"><Sparkles size={14} /> YOUR RELEASE COPILOT</div><h2>Ship with more confidence.</h2><p>Review code changes, surface risk, and get a clear next step — before the merge.</p><div className="banner-actions"><button onClick={() => { setShowEditor(true); setActiveTab('review'); }} className="banner-button">Review a change <ArrowRight size={15} /></button><span><LockKeyhole size={12} /> Your code stays in this browser demo</span></div></div>
            <div className="banner-illustration"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit-core"><ShieldCheck size={38} /></div><div className="float-chip chip-top"><CheckCircle2 size={13} /> Tests checked</div><div className="float-chip chip-bottom"><Activity size={13} /> Risk mapped</div></div>
          </section>

          <div className="section-heading"><div><h2>Release overview</h2><p>Snapshot of the selected project</p></div><button className="date-filter"><Clock3 size={14} /> Last 7 days <ChevronDown size={14} /></button></div>
          <div className="metrics-grid">
            <Metric icon={<GitPullRequest size={17} />} label="Changes reviewed" value="24" delta="+18.2%" trend="up" note="vs. previous week" />
            <Metric icon={<ShieldCheck size={17} />} label="Release readiness" value={`${analysis.score}%`} delta={analysis.score >= 82 ? 'Healthy' : 'Needs review'} trend={analysis.score >= 82 ? 'up' : 'down'} note="Current sample analysis" />
            <Metric icon={<AlertTriangle size={17} />} label="Open findings" value={String(analysis.findings.length).padStart(2, '0')} delta={`${counts.critical + counts.high} high impact`} trend="down" note="From current analysis" />
            <Metric icon={<Gauge size={17} />} label="Avg. review time" value="8m" delta="-12.4%" trend="up" note="vs. previous week" />
          </div>

          <div className="tab-row">
            <button className={activeTab === 'overview' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={activeTab === 'review' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('review')}>Latest review <span className="tab-badge">{analysis.findings.length}</span></button>
            <button className={activeTab === 'checks' ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab('checks')}>CI checks</button>
          </div>

          {activeTab === 'overview' && <div className="dashboard-grid">
            <section className="panel recent-panel">
              <div className="panel-heading"><div><h3>Recent change review</h3><p>Latest analysis for {project.split(' / ')[1]}</p></div><button className="text-button" onClick={() => setActiveTab('review')}>View details <ArrowRight size={14} /></button></div>
              <div className="change-card"><div className="change-icon"><GitCommitHorizontal size={19} /></div><div className="change-info"><strong>Improve sign-in flow</strong><div className="change-meta"><span>MR !128</span><span>·</span><span>alex-morgan</span><span>·</span><span>18 min ago</span></div><div className="file-chips"><span><FileCode2 size={12} /> src/auth.ts</span><span>+18</span><span className="removed">−4</span></div></div><div className={`readiness-pill ${analysis.score < 82 ? 'attention' : ''}`}><span />{analysis.label}</div></div>
              <div className="change-footer"><div className="mini-avatars"><span>AM</span><span>JD</span><span>+2</span></div><span className="footer-note">Reviewed by ReleasePilot</span><button className="round-arrow" aria-label="Open review" onClick={() => setActiveTab('review')}><ArrowRight size={15} /></button></div>
              <div className="panel-separator" />
              <div className="panel-heading second"><div><h3>Review activity</h3><p>Weekly review volume</p></div><span className="chart-legend"><i /> Reviews</span></div>
              <div className="chart-area"><div className="chart-y-labels"><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart"><div className="chart-gridline one" /><div className="chart-gridline two" /><div className="chart-gridline three" /><svg viewBox="0 0 600 150" preserveAspectRatio="none" aria-label="Weekly review activity chart"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b7cff" stopOpacity=".24" /><stop offset="100%" stopColor="#8b7cff" stopOpacity="0" /></linearGradient></defs><path d="M0 118 C30 115 48 92 80 99 S130 120 165 85 S210 73 245 89 S290 48 330 61 S380 82 410 45 S455 57 490 35 S540 55 600 12 L600 150 L0 150Z" fill="url(#chartFill)" /><path d="M0 118 C30 115 48 92 80 99 S130 120 165 85 S210 73 245 89 S290 48 330 61 S380 82 410 45 S455 57 490 35 S540 55 600 12" fill="none" stroke="#8b7cff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div>
            </section>
            <section className="panel findings-panel"><div className="panel-heading"><div><h3>Risk signals</h3><p>Findings from the current sample</p></div><button className="icon-button subtle" onClick={() => setActiveTab('review')} aria-label="Open findings"><ArrowUpRight size={16} /></button></div>
              <div className="risk-score-row"><div className={`score-ring ${analysis.score < 55 ? 'score-low' : analysis.score < 82 ? 'score-mid' : ''}`}><div><strong>{analysis.score}</strong><small>/100</small></div></div><div><strong className="score-label">{analysis.label}</strong><p>Readiness estimate</p><span className="score-caption">Heuristic checks only</span></div></div>
              <div className="risk-breakdown">{(['critical', 'high', 'medium', 'low'] as const).map(level => <div className="risk-line" key={level}><span className={`risk-dot ${level}`} /> <span className="risk-name">{level.charAt(0).toUpperCase() + level.slice(1)}</span><div className="risk-track"><i className={`risk-fill ${level}`} style={{ width: `${Math.min(100, counts[level] * 30)}%` }} /></div><strong>{counts[level]}</strong></div>)}</div>
              <div className="panel-bottom-note"><ShieldCheck size={15} /><span>ReleasePilot never approves or deploys automatically.</span></div>
            </section>
          </div>}

          {activeTab === 'review' && <section className="panel review-view">
            <div className="panel-heading"><div><h3>Change review</h3><p>Inspect potential risks before merging</p></div><button className="outline-button" onClick={() => setShowEditor(!showEditor)}><Code2 size={14} /> {showEditor ? 'Hide input' : 'Edit diff'}</button></div>
            {showEditor && <div className="diff-editor"><div className="editor-toolbar"><span><Terminal size={13} /> Paste a unified diff or source snippet</span><label className="upload-label"><UploadCloud size={13} /> Upload text file<input type="file" accept=".diff,.patch,.txt,.js,.ts,.tsx,.jsx,.py,.go,.java,.json" onChange={handleFile} /></label></div><textarea value={diff} onChange={e => setDiff(e.target.value)} spellCheck={false} aria-label="Code diff input" placeholder="Paste your code diff here..." /><div className="editor-footer"><span>{diff.split(/\\r?\\n/).length} lines · local analysis</span><div><button className="ghost-button" onClick={loadSample}>Load sample</button><button className="primary-button compact" onClick={runReview}><Play size={13} /> Run review</button></div></div></div>}
            <div className="review-summary"><div className={`review-score ${analysis.score < 82 ? 'warn' : ''}`}><Gauge size={18} /><strong>{analysis.score}/100</strong><span>{analysis.label}</span></div><p>{analysis.summary}</p></div>
            <div className="findings-header"><div><h4>Findings <span>{analysis.findings.length}</span></h4><p>Rule-based signals · human review required</p></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer' : 'Show all'} <ChevronDown size={13} /></button></div>
            {analysis.findings.length === 0 ? <div className="empty-state"><CheckCircle2 size={24} /><strong>No rule matches found</strong><p>This does not guarantee the change is safe. Run your test and security pipeline, then request human review.</p></div> : <div className="finding-list">{displayedFindings.map(finding => <div className="finding-item" key={finding.id}><div className={`finding-icon ${finding.severity}`}><AlertTriangle size={16} /></div><div className="finding-content"><div className="finding-title-row"><strong>{finding.title}</strong><span className={severityClass(finding.severity)}>{finding.severity}</span></div><p>{finding.detail}</p><div className="finding-meta"><span>{finding.category}</span><span>·</span><span>Line {finding.line}</span><span>·</span><span>Heuristic signal</span></div></div></div>)}</div>}
            <div className="human-note"><LockKeyhole size={15} /><p><strong>Human decision required.</strong> This prototype uses local pattern checks, not an LLM or full security scanner. Validate findings and test results before merging.</p></div>
          </section>}

          {activeTab === 'checks' && <section className="panel checks-view"><div className="panel-heading"><div><h3>Continuous integration</h3><p>What ReleasePilot expects before release</p></div><span className="status-pill pending"><span /> Demo mode</span></div><div className="check-list"><CheckRow icon={<CheckCircle2 size={17} />} title="Unit tests" description="Run the project test suite and publish test results." status="Template ready" /><CheckRow icon={<ShieldCheck size={17} />} title="Static application security testing" description="Use GitLab SAST templates where supported by your project." status="Template ready" /><CheckRow icon={<LockKeyhole size={17} />} title="Secret detection" description="Scan changes for accidentally committed credentials." status="Template ready" /><CheckRow icon={<Bot size={17} />} title="Duo-assisted review" description="Use GitLab Duo Agent Platform's Code Review Flow to review merge requests." status="Setup required" /></div><div className="ci-callout"><div className="ci-callout-icon"><Terminal size={17} /></div><div><strong>Next integration step</strong><p>Add the included <code>.gitlab-ci.yml</code> to your GitLab project, enable the relevant security scanners, and configure Duo flows in your GitLab namespace.</p><a href="https://docs.gitlab.com/user/duo_agent_platform/" target="_blank" rel="noreferrer">Read GitLab Duo docs <ArrowUpRight size={13} /></a></div></div></section>}

          <footer className="page-footer"><span>© 2026 ReleasePilot</span><span><span className="footer-status-dot" /> Systems operational</span><span>Built for safer releases</span></footer>
        </div>
      </main>
      {toast && <div className="toast"><Check size={15} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={14} /></button></div>}
    </div>
  );
}

function Metric({ icon, label, value, delta, trend, note }: { icon: ReactNode; label: string; value: string; delta: string; trend: 'up' | 'down'; note: string }) {
  return <div className="metric-card"><div className="metric-top"><div className="metric-icon">{icon}</div><span className={`metric-delta ${trend === 'down' ? 'delta-down' : ''}`}>{trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{delta}</span></div><div className="metric-value">{value}</div><div className="metric-label">{label}</div><div className="metric-note">{note}</div></div>;
}

function CheckRow({ icon, title, description, status }: { icon: ReactNode; title: string; description: string; status: string }) {
  return <div className="check-row"><div className="check-row-icon">{icon}</div><div className="check-row-copy"><strong>{title}</strong><p>{description}</p></div><span className="check-row-status"><span />{status}</span></div>;
}