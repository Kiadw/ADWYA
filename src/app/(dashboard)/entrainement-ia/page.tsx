'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BrainCircuit, Upload, Play, FileText, CheckCircle2,
  AlertTriangle, Clock, Download, Trash2, RefreshCw, Sparkles, XCircle
} from 'lucide-react';

interface TrainingJob {
  id: string;
  status: string;
  model: string;
  fineTunedModel: string | null;
  createdAt: number;
  finishedAt: number | null;
}

interface TrainingFile {
  id: string;
  filename: string;
  bytes: number;
  createdAt: number;
  status: string;
}

type Tab = 'upload' | 'jobs' | 'guide';

export default function EntrainementIAPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Training state
  const [trainingModel, setTrainingModel] = useState('gpt-4o-mini');
  const [trainingEpochs, setTrainingEpochs] = useState(3);
  const [trainingSuffix, setTrainingSuffix] = useState('adwya-pharma');
  const [startingTraining, setStartingTraining] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/openai-training');
      const data = await res.json();
      setConfigured(data.configured !== false);
      if (data.error && data.configured) setApiError(data.error);
      else setApiError(null);
      if (data.jobs) setJobs(data.jobs);
      if (data.files) setFiles(data.files);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    const fd = new FormData();
    fd.append('action', 'upload');
    fd.append('file', selectedFile);
    try {
      const res = await fetch('/api/openai-training', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || data.error) {
        setUploadError(data.error + (data.details ? '\n' + data.details.join('\n') : ''));
      } else {
        setUploadResult(data);
        fetchStatus();
      }
    } catch (e: any) { setUploadError(e.message); }
    setUploading(false);
  };

  const handleStartTraining = async (fileId: string) => {
    setStartingTraining(true);
    const fd = new FormData();
    fd.append('action', 'start-training');
    fd.append('fileId', fileId);
    fd.append('model', trainingModel);
    fd.append('epochs', String(trainingEpochs));
    fd.append('suffix', trainingSuffix);
    try {
      await fetch('/api/openai-training', { method: 'POST', body: fd });
      fetchStatus();
      setActiveTab('jobs');
    } catch { /* silent */ }
    setStartingTraining(false);
  };

  const handleDownloadSample = async () => {
    const fd = new FormData();
    fd.append('action', 'generate-sample');
    fd.append('domain', 'classification');
    try {
      const res = await fetch('/api/openai-training', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.content) {
        const blob = new Blob([data.content], { type: 'application/jsonl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adwya_training_sample.jsonl';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* silent */ }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      succeeded: { bg: 'rgba(16,185,129,.1)', color: '#10b981' },
      running: { bg: 'rgba(96,178,70,.1)', color: '#60B246' },
      queued: { bg: 'rgba(245,158,11,.1)', color: '#f59e0b' },
      validating_files: { bg: 'rgba(27,117,188,.1)', color: '#1B75BC' },
      failed: { bg: 'rgba(239,68,68,.1)', color: '#ef4444' },
      cancelled: { bg: 'rgba(148,163,184,.1)', color: '#94a3b8' },
    };
    const style = map[s] || map.queued;
    return (
      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 'var(--font-xs)', fontWeight: 600, background: style.bg, color: style.color }}>
        {s}
      </span>
    );
  };

  const fmtDate = (ts: number) => new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtBytes = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} Mo` : `${(b / 1024).toFixed(1)} Ko`;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Entraînement IA</h1>
        <p className="page-subtitle">
          Fine-tuning OpenAI — Importez vos documents pour entraîner un modèle spécialisé pharmaceutique
        </p>
      </div>

      {!configured && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontWeight: 600 }}>Clé API OpenAI non configurée</div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                Ajoutez <code>OPENAI_API_KEY</code> dans votre fichier <code>.env.local</code> pour activer le fine-tuning.
              </div>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <AlertTriangle size={20} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontWeight: 600 }}>Erreur OpenAI API</div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                {apiError}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        {([
          { id: 'upload' as Tab, label: 'Importer & Entraîner', icon: Upload },
          { id: 'jobs' as Tab, label: 'Jobs d\'entraînement', icon: Clock },
          { id: 'guide' as Tab, label: 'Guide JSONL', icon: FileText },
        ]).map(t => (
          <button key={t.id} className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px' }}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
        <button className="btn btn-ghost" onClick={fetchStatus} style={{ marginLeft: 'auto' }}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {activeTab === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-xl)' }}>
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BrainCircuit size={20} style={{ color: 'var(--accent-primary)' }} /> Importer un fichier d&apos;entraînement
            </h2>

            {/* Drop zone */}
            <div
              style={{
                border: '2px dashed var(--border-primary)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3xl)', textAlign: 'center', cursor: 'pointer',
                transition: 'all .2s', background: selectedFile ? 'rgba(96,178,70,.03)' : 'var(--bg-tertiary)',
                borderColor: selectedFile ? 'var(--accent-primary)' : 'var(--border-primary)',
              }}
              onClick={() => document.getElementById('training-file-input')?.click()}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }}
            >
              <input id="training-file-input" type="file" accept=".jsonl" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--accent-primary)' }} />
                  <div style={{ fontWeight: 600 }}>{selectedFile.name}</div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{fmtBytes(selectedFile.size)}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Upload size={32} style={{ color: 'var(--text-tertiary)' }} />
                  <div style={{ fontWeight: 600 }}>Glissez votre fichier JSONL ici</div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>ou cliquez pour sélectionner</div>
                </div>
              )}
            </div>

            {uploadError && (
              <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,.06)', borderLeft: '3px solid #ef4444', whiteSpace: 'pre-wrap', fontSize: 'var(--font-sm)', color: '#ef4444' }}>
                <XCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{uploadError}
              </div>
            )}

            {uploadResult && (
              <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,.06)', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontWeight: 600, color: '#10b981', marginBottom: 4 }}><CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {uploadResult.message}</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  ID: <code>{uploadResult.fileId}</code> — {uploadResult.lineCount} exemples
                </div>
              </div>
            )}

            {/* Training config */}
            <div style={{ marginTop: 'var(--space-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Modèle de base</label>
                <select className="filter-select" value={trainingModel} onChange={e => setTrainingModel(e.target.value)} style={{ width: '100%' }}>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4o">gpt-4o</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Epochs</label>
                <select className="filter-select" value={trainingEpochs} onChange={e => setTrainingEpochs(Number(e.target.value))} style={{ width: '100%' }}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Suffixe modèle</label>
                <input className="filter-input" value={trainingSuffix} onChange={e => setTrainingSuffix(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)' }}>
              <button className="btn btn-primary" onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? <><RefreshCw size={16} className="spin" /> Upload en cours...</> : <><Upload size={16} /> Uploader le fichier</>}
              </button>
              {uploadResult?.fileId && (
                <button className="btn btn-primary" onClick={() => handleStartTraining(uploadResult.fileId)} disabled={startingTraining} style={{ background: 'linear-gradient(135deg, #1B75BC, #60B246)' }}>
                  {startingTraining ? <><RefreshCw size={16} className="spin" /> Lancement...</> : <><Play size={16} /> Lancer l&apos;entraînement</>}
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleDownloadSample}>
                <Download size={16} /> Télécharger un exemple JSONL
              </button>
            </div>
          </div>

          {/* Right panel: uploaded files */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} /> Fichiers uploadés
            </h3>
            {files.length === 0 ? (
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl) 0' }}>Aucun fichier</div>
            ) : files.map(f => (
              <div key={f.id} style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-primary)', fontSize: 'var(--font-sm)' }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{f.filename}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>{fmtBytes(f.bytes)} — {fmtDate(f.createdAt)}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                  {statusBadge(f.status)}
                  <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 'var(--font-xs)' }} onClick={() => handleStartTraining(f.id)}>
                    <Play size={12} /> Entraîner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>Jobs de fine-tuning</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>Chargement...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
              <BrainCircuit size={48} style={{ marginBottom: 12, opacity: .3 }} />
              <div>Aucun job d&apos;entraînement pour le moment</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>ID</th><th>Modèle</th><th>Statut</th><th>Modèle fine-tuné</th><th>Créé le</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td><code style={{ fontSize: 11 }}>{j.id.slice(0, 20)}…</code></td>
                    <td>{j.model}</td>
                    <td>{statusBadge(j.status)}</td>
                    <td>{j.fineTunedModel ? <code style={{ fontSize: 11, color: 'var(--accent-primary)' }}>{j.fineTunedModel}</code> : '—'}</td>
                    <td style={{ fontSize: 'var(--font-xs)' }}>{fmtDate(j.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} /> Guide de préparation des données
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 8 }}>Format JSONL requis</h3>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Chaque ligne du fichier doit être un objet JSON valide contenant un champ <code>messages</code> avec les rôles <code>system</code>, <code>user</code> et <code>assistant</code>.
              </p>
              <pre style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', fontSize: 12, overflow: 'auto', lineHeight: 1.6 }}>
{`{"messages": [
  {"role": "system", "content": "Tu es un expert pharmaceutique ADWYA."},
  {"role": "user", "content": "Classifie: Paracétamol"},
  {"role": "assistant", "content": "Catégorie: Principe actif\\nRisque: Modéré"}
]}`}
              </pre>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 8 }}>Recommandations OpenAI</h3>
              <ul style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong>Minimum 10 exemples</strong> — recommandé : 50 à 100+ pour des résultats optimaux</li>
                <li><strong>Qualité &gt; Quantité</strong> — chaque exemple doit être précis et représentatif</li>
                <li><strong>Diversité</strong> — couvrir les différentes catégories (principes actifs, excipients, solvants)</li>
                <li><strong>Cohérence du format</strong> — garder le même style de réponse pour tous les exemples</li>
                <li><strong>Message système</strong> — toujours inclure un message système définissant le contexte ADWYA</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 8 }}>Domaines d&apos;entraînement suggérés</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                {[
                  { title: 'Classification pharmaceutique', desc: 'Catégorisation automatique des ingrédients avec action pharmacologique' },
                  { title: 'Analyse de formulation', desc: 'Vérification des incompatibilités galéniques entre ingrédients' },
                  { title: 'Analyse moléculaire', desc: 'Évaluation ADMET, druglikeness, et potentiel thérapeutique' },
                  { title: 'Supply Chain', desc: 'Prédiction des risques de rupture et alternatives fournisseurs' },
                ].map(d => (
                  <div key={d.title} style={{ padding: 'var(--space-lg)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-md)', marginBottom: 4 }}>{d.title}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{d.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
