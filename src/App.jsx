import { useRef, useState } from 'react';

const skillsPresent = ['Figma', 'Prototyping', 'Design systems', 'User research', 'Wireframing', 'Usability testing', 'Interaction design', 'Accessibility'];
const skillsMissing = ['Analytics', 'HTML / CSS'];

function UploadIcon() {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function LockIcon() {
  return <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 117 0v2m-8 .5h9v6h-9v-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SkillBox({ title, skills, missing = false }) {
  return (
    <div className={`skill-box${missing ? ' missing' : ' present'}`}>
      <div className="skill-box-head"><span className="status-icon">{missing ? '＋' : '✓'}</span>{title}<span className="num">{String(skills.length).padStart(2, '0')}</span></div>
      <div className="chips">{skills.map((skill) => <span className="chip" key={skill}>{skill}</span>)}</div>
    </div>
  );
}

function UploadCard({ file, onFile, onRemove, onAnalyze, analyzing, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const handleFile = (candidate) => {
    if (!candidate) return;
    if (!/\.pdf$/i.test(candidate.name) && candidate.type !== 'application/pdf') return onError('Please choose a PDF file.');
    if (candidate.size > 10 * 1024 * 1024) return onError('That file is over the 10 MB limit.');
    onFile(candidate);
  };
  const openPicker = () => inputRef.current?.click();

  return (
    <section className="card upload-card" aria-labelledby="upload-title">
      <div className="card-head"><div className="card-title" id="upload-title">Your resume</div><span className="step">01 / UPLOAD</span></div>
      <div className={`dropzone${dragging ? ' dragging' : ''}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { event.preventDefault(); setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files[0]); }}>
        {!file ? <>
          <div className="upload-icon"><UploadIcon /></div><h2>Drop your resume here</h2><p>or choose a file from your device</p>
          <button className="browse" onClick={openPicker} type="button">Browse files</button><div className="file-hint">PDF format · up to 10 MB</div>
        </> : <div className="file-row show"><div className="pdf-icon">PDF</div><div className="file-info"><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · ready to preview</span></div><button className="remove-file" onClick={onRemove} type="button" aria-label="Remove file">×</button></div>}
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => { handleFile(event.target.files[0]); event.target.value = ''; }} />
      <button className="analyze" onClick={onAnalyze} type="button" disabled={!file || analyzing}>{analyzing ? 'Preparing preview…' : <>Preview sample results <span aria-hidden="true">↗</span></>}</button>
      <p className="privacy"><LockIcon />This mock runs in your browser. No file is uploaded.</p>
    </section>
  );
}

function ResultsCard({ analyzed }) {
  return (
    <section className="card results" aria-labelledby="results-title">
      <div className="result-top"><div className="card-title" id="results-title">Your match snapshot</div><div className="match-label">{analyzed ? 'SAMPLE PREVIEW' : 'SAMPLE RESULT'}</div></div>
      <div className="score-row">
        <div className="score-ring"><div className="score-content"><div className="score-value">82</div><div className="score-denom">/ 100</div><div className="score-caption">match score</div></div></div>
        <div className="score-copy"><div className="score-status"><i></i><span>Strong foundation</span></div><h3>You’re closer than you think.</h3><p>{analyzed ? <>This is a <strong>sample preview</strong> for your selected file. Real PDF parsing and scoring are not connected yet.</> : <>Your resume lines up with <strong>8 of 10 key skills</strong> for this role. A couple of additions could make your experience stand out.</>}</p></div>
      </div>
      <div className="skill-section"><div className="skill-heading"><h3>Skills at a glance</h3><span>ROLE REQUIREMENTS</span></div><div className="skill-grid"><SkillBox title="Skills you have" skills={skillsPresent} /><SkillBox title="Room to grow" skills={skillsMissing} missing /></div><p className="result-footer">A useful signal, not a verdict. <em>Made to help you take the next step.</em></p></div>
    </section>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState('');
  const showMessage = (message) => { setToast(message); window.clearTimeout(showMessage.timer); showMessage.timer = window.setTimeout(() => setToast(''), 2600); };
  const preview = () => {
    setAnalyzing(true);
    window.setTimeout(() => { setAnalyzing(false); setAnalyzed(true); showMessage('Sample preview ready. PDF parsing is not connected yet.'); }, 450);
  };
  const removeFile = () => { setFile(null); setAnalyzed(false); };

  return <div className="shell">
    <header className="topbar"><a className="brand" href="#" aria-label="0 to Shipped home"><span className="brandmark">0→</span><span className="brandname">0 to shipped <span>/ resume parser</span></span></a><div className="top-right"><span className="live-dot"></span><span>YOUR NEXT ROLE, IN SIGHT</span></div></header>
    <main className="page"><div className="eyebrow">A clearer next step</div><section className="intro"><div><h1>Know where you stand.</h1><p>Drop in your resume. Get a quick read on your skills match.</p></div><div className="role-tag">Role target&nbsp; <b>Product Designer ↗</b></div></section>
      <div className="workspace"><UploadCard file={file} onFile={(nextFile) => { setFile(nextFile); setAnalyzed(false); }} onRemove={removeFile} onAnalyze={preview} analyzing={analyzing} onError={showMessage} /><ResultsCard analyzed={analyzed} /></div>
    </main>
    <footer className="footer"><span><strong>0 to shipped</strong> &nbsp;·&nbsp; One step closer to what’s next.</span><span>YOUR CAREER, YOUR CALL.</span></footer>
    <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}
