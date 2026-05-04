'use client';
import React from 'react';

interface Issue {
  group: string;
  risk: string;
  description: string;
}

interface ScoringResult {
  score: number;
  viability: string;
  molecular_formula?: string;
  molecular_weight?: number;
  iupac_name?: string;
  structural_issues?: Issue[];
  lipinski_violations?: string[];
  lipinski_compliant?: boolean;
  admet?: Record<string, any>;
  confidence_interval?: string;
  ml_model_version?: string;
  data_sources?: string[];
}

const riskColor: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  moderate: '#6366f1',
  low: '#10b981'
};

export default function AISidebar({ result, loading }: { result: ScoringResult | null; loading: boolean }) {
  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Analyse en cours…</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={panelStyle}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', textAlign: 'center', padding: 'var(--space-xl) 0' }}>
          Dessinez une molécule pour lancer l'analyse IA automatique.
        </div>
      </div>
    );
  }

  const scoreColor = result.score > 80 ? '#10b981' : result.score > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={panelStyle}>
      <h3 style={{ fontSize: 'var(--font-md)', color: 'var(--text-primary)', margin: '0 0 var(--space-md) 0', fontWeight: 600 }}>
        Analyse IA — Live
      </h3>

      {/* Score gauge */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
          {result.score}
        </div>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
          Score de viabilité — {result.viability}
        </div>
        <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary, #e5e7eb)', borderRadius: 3, marginTop: 8 }}>
          <div style={{ width: `${result.score}%`, height: '100%', borderRadius: 3, background: scoreColor, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Molecular identity */}
      {result.iupac_name && (
        <Section title="Identité moléculaire">
          <InfoRow label="IUPAC" value={result.iupac_name} />
          <InfoRow label="Formule" value={result.molecular_formula || '—'} />
          <InfoRow label="Masse" value={result.molecular_weight ? `${result.molecular_weight} g/mol` : '—'} />
        </Section>
      )}

      {/* Lipinski */}
      {result.lipinski_compliant !== undefined && (
        <Section title="Lipinski (Rule of 5)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{result.lipinski_compliant ? '✅' : '⚠️'}</span>
            <span style={{ fontSize: 'var(--font-sm)', color: result.lipinski_compliant ? '#10b981' : '#f59e0b' }}>
              {result.lipinski_compliant ? 'Conforme' : `${result.lipinski_violations?.length} violation(s)`}
            </span>
          </div>
          {result.lipinski_violations && result.lipinski_violations.length > 0 && (
            <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: 'var(--font-xs)', color: '#f59e0b' }}>
              {result.lipinski_violations.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          )}
        </Section>
      )}

      {/* ADMET */}
      {result.admet && Object.keys(result.admet).length > 0 && (
        <Section title="ADMET">
          {result.admet.oral_bioavailability && <InfoRow label="Biodisponibilité orale" value={result.admet.oral_bioavailability} />}
          {result.admet.bbb_penetration && <InfoRow label="Pénétration BHE" value={result.admet.bbb_penetration} />}
          {result.admet.logP != null && <InfoRow label="LogP" value={String(result.admet.logP)} />}
          {result.admet.tpsa != null && <InfoRow label="TPSA" value={`${result.admet.tpsa} Å²`} />}
        </Section>
      )}

      {/* Structural issues */}
      {result.structural_issues && result.structural_issues.length > 0 && (
        <Section title="Alertes structurelles">
          {result.structural_issues.map((issue, i) => (
            <div key={i} style={{
              padding: '6px 8px', borderRadius: 6, marginBottom: 4,
              background: `${riskColor[issue.risk] || '#6b7280'}11`,
              borderLeft: `3px solid ${riskColor[issue.risk] || '#6b7280'}`
            }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-xs)', color: riskColor[issue.risk] || '#6b7280' }}>
                {issue.group} — {issue.risk.toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                {issue.description}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-primary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        {result.ml_model_version} · {result.confidence_interval}<br />
        Sources: {result.data_sources?.join(', ')}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  width: 320,
  background: 'var(--bg-secondary)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-primary)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  maxHeight: 'calc(100vh - 120px)'
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', marginBottom: 3 }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}
