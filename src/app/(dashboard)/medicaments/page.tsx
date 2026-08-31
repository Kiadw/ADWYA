'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Download, Upload, Search, Filter, ChevronDown, ChevronUp, X, Globe } from 'lucide-react';
import { ADWYA_MEDICATIONS, getCategories, exportCSV, importCSV, type Medication } from '@/lib/medications';
import { ADWYA_SUPPLIERS, SUPPLIER_SOURCES } from '@/lib/suppliers';

interface GroupedMed {
  nom_commercial: string;
  dci: string;
  forme: string;
  classe_therapeutique: string;
  categorie: string;
  dosages: string[];
  conditionnements: string[];
  statut: string;
  smiles?: string;
  amm: string;
  ids: string[];
}

function groupMedications(meds: Medication[]): GroupedMed[] {
  const map = new Map<string, GroupedMed>();
  for (const m of meds) {
    const existing = map.get(m.nom_commercial);
    if (existing) {
      if (!existing.dosages.includes(m.dosage)) existing.dosages.push(m.dosage);
      if (!existing.conditionnements.includes(m.conditionnement)) existing.conditionnements.push(m.conditionnement);
      existing.ids.push(m.id);
      if (m.smiles && !existing.smiles) existing.smiles = m.smiles;
    } else {
      map.set(m.nom_commercial, {
        nom_commercial: m.nom_commercial,
        dci: m.dci,
        forme: m.forme,
        classe_therapeutique: m.classe_therapeutique,
        categorie: m.categorie,
        dosages: [m.dosage],
        conditionnements: [m.conditionnement],
        statut: m.statut,
        smiles: m.smiles,
        amm: m.amm,
        ids: [m.id],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.nom_commercial.localeCompare(b.nom_commercial));
}

export default function MedicamentsPage() {
  const [medications, setMedications] = useState<Medication[]>(ADWYA_MEDICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('nom_commercial');
  const [sortAsc, setSortAsc] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = getCategories();

  const filtered = medications.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || m.nom_commercial.toLowerCase().includes(q) || m.dci.toLowerCase().includes(q) || m.classe_therapeutique.toLowerCase().includes(q);
    const matchesCat = !selectedCategory || m.categorie === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const grouped = useMemo(() => {
    const g = groupMedications(filtered);
    return g.sort((a, b) => {
      const va = ((a as any)[sortField] || '').toString().toLowerCase();
      const vb = ((b as any)[sortField] || '').toString().toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const handleExport = () => {
    const csv = exportCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adwya_medicaments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const imported = importCSV(csv);
      if (imported.length > 0) setMedications(prev => [...prev, ...imported]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  // Find real suppliers for a given DCI
  const findSuppliers = (dci: string) => {
    return ADWYA_SUPPLIERS.filter(s => s.molecules_supplied.some(m => m.toLowerCase() === dci.toLowerCase()));
  };

  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: 1200, margin: '0 auto', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Medicaments ADWYA</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 'var(--font-sm)' }}>
              {grouped.length} produits uniques ({filtered.length} references) . {categories.length} categories
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> CSV</button>
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Upload size={14} /> Importer</button>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Rechercher par nom, DCI, ou classe..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}>
            <option value="">Toutes categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--space-md)' }}>
          {categories.map(cat => {
            const count = medications.filter(m => m.categorie === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button key={cat} onClick={() => setSelectedCategory(isActive ? '' : cat)}
                style={{ padding: '3px 10px', borderRadius: 16, border: `1px solid ${isActive ? '#6366f1' : 'var(--border-primary)'}`, background: isActive ? 'rgba(99,102,241,.08)' : 'transparent', color: isActive ? '#6366f1' : 'var(--text-tertiary)', fontSize: 11, cursor: 'pointer', fontWeight: isActive ? 600 : 400 }}>
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* SCROLLABLE Table */}
      <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 2 }}>
            <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
              {[
                { key: 'nom_commercial', label: 'Nom Commercial' },
                { key: 'dci', label: 'DCI' },
                { key: 'dosages', label: 'Dosages' },
                { key: 'forme', label: 'Forme' },
                { key: 'categorie', label: 'Categorie' },
                { key: 'statut', label: 'Statut' },
              ].map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.04em', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{col.label} <SortIcon field={col.key} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grouped.map(med => (
              <React.Fragment key={med.nom_commercial}>
                <tr onClick={() => setExpandedRow(expandedRow === med.nom_commercial ? null : med.nom_commercial)}
                  style={{ borderBottom: '1px solid rgba(0,0,0,.03)', cursor: 'pointer', transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.015)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={tdStyle}><strong style={{ color: 'var(--text-primary)' }}>{med.nom_commercial}</strong></td>
                  <td style={tdStyle}>{med.dci}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {med.dosages.map(d => (
                        <span key={d} style={{ padding: '1px 6px', borderRadius: 6, fontSize: 10, background: 'rgba(99,102,241,.06)', color: '#6366f1' }}>{d}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 11 }}>{med.forme}</td>
                  <td style={tdStyle}><span style={{ padding: '2px 7px', borderRadius: 8, fontSize: 10, background: 'rgba(99,102,241,.06)', color: '#6366f1' }}>{med.categorie}</span></td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 7px', borderRadius: 8, fontSize: 10, fontWeight: 600, background: med.statut === 'Commercialise' ? 'rgba(16,185,129,.08)' : 'rgba(245,158,11,.08)', color: med.statut === 'Commercialise' ? '#10b981' : '#f59e0b' }}>{med.statut}</span>
                  </td>
                </tr>
                {expandedRow === med.nom_commercial && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0, borderBottom: '1px solid var(--border-primary)' }}>
                      <ExpandedDetail med={med} suppliers={findSuppliers(med.dci)} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sources footer */}
      <div style={{ flexShrink: 0, marginTop: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: 'var(--text-tertiary)' }}>
        <span style={{ fontWeight: 600 }}>Sources:</span>
        {SUPPLIER_SOURCES.slice(0, 4).map(src => (
          <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Globe size={8} /> {src.name}
          </a>
        ))}
        <span>| DPM Tunisie | med.tn — <em>numéros d'AMM fournis à titre indicatif, non vérifiés individuellement</em></span>
      </div>
    </div>
  );
}

function ExpandedDetail({ med, suppliers }: { med: GroupedMed; suppliers: any[] }) {
  return (
    <div style={{ background: 'rgba(0,0,0,.01)', padding: '16px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Left: Details + Molecule */}
        <div>
          <div style={{ fontSize: 12, marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div><span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Classe: </span><strong>{med.classe_therapeutique}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>AMM: </span><strong>{med.amm}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Conditionnement: </span><strong>{med.conditionnements.join(', ')}</strong></div>
              <div><span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Dosages: </span><strong>{med.dosages.join(', ')}</strong></div>
            </div>
          </div>

          {/* Molecule viewer via Ketcher */}
          {med.smiles ? (
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Structure moleculaire</span>
                <button 
                  onClick={() => {
                    const iframe = document.getElementById(`ketcher-${med.ids[0]}`) as HTMLIFrameElement;
                    if (iframe && iframe.contentWindow) {
                      const kw = iframe.contentWindow as any;
                      // Toggle 3D mode if Miew is available, otherwise re-layout
                      if (kw.ketcher && kw.ketcher.editor) {
                        // Some ketcher versions support miew() directly
                        try { kw.ketcher.editor.miew(); } catch { alert('Vue 3D non disponible dans cette version.'); }
                      }
                    }
                  }}
                  style={{ fontSize: 9, padding: '2px 6px', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  Vue 3D
                </button>
              </div>
              <div style={{ height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-primary)', background: '#fff', position: 'relative' }}>
                <iframe
                  id={`ketcher-${med.ids[0]}`}
                  src={`/ketcher/standalone/index.html?hiddenControls=clear,open,save,undo,redo,cut,copy,paste,zoomIn,zoomOut,layout,clean,aromatize,dearomatize,calculate,check,recognize,miew,settings,help,about,select,erase,bondSingle,bondDouble,bondTriple,chain,chargePlus,chargeMinus,transformFlipH,transformFlipV,template,sgroup,sgroupData,reactionArrow,reactionPlus,reactionMap,reactionUnmap`}
                  width="100%" height="100%"
                  style={{ border: 'none' }}
                  title={`Structure ${med.nom_commercial}`}
                  onLoad={(e) => {
                    const iframe = e.currentTarget;
                    const trySet = () => {
                      try {
                        const ketcherFrame = iframe.contentWindow as any;
                        if (ketcherFrame?.ketcher) {
                          ketcherFrame.ketcher.setMolecule(med.smiles!).then(() => {
                            // Center and scale to fit
                            ketcherFrame.ketcher.editor.zoom(1.5);
                          });
                          // Inject CSS to hide all extraneous UI and restrict canvas
                          const doc = iframe.contentDocument;
                          if (doc) {
                            const style = doc.createElement('style');
                            style.textContent = `
                              header, [class*="Toolbar"], [class*="Header"], [class*="Menu"] { display: none !important; }
                              body { background: transparent !important; }
                            `;
                            doc.head.appendChild(style);
                          }
                        } else {
                          setTimeout(trySet, 500);
                        }
                      } catch { setTimeout(trySet, 500); }
                    };
                    setTimeout(trySet, 1000);
                  }}
                />
              </div>
              <code style={{ fontSize: 9, fontFamily: 'monospace', color: '#6366f1', display: 'block', marginTop: 4 }}>{med.smiles}</code>
            </div>
          ) : (
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 11, border: '1px dashed var(--border-primary)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-sm)' }}>
              Structure SMILES non disponible pour ce produit
            </div>
          )}
        </div>

        {/* Right: Suppliers */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
            Fournisseurs ({suppliers.length})
          </div>
          {suppliers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suppliers.map(sup => (
                <div key={sup.id} style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', fontSize: 11 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sup.name}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 10, marginTop: 2 }}>
                    {sup.city}, {sup.country} . {sup.relationship}
                  </div>
                  <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                    {sup.certifications.slice(0, 3).map((c: string) => (
                      <span key={c} style={{ padding: '1px 5px', borderRadius: 4, fontSize: 8, background: 'rgba(16,185,129,.08)', color: '#10b981', fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 3 }}>Source: {sup.source}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 12, color: 'var(--text-tertiary)', fontSize: 11, textAlign: 'center', border: '1px dashed var(--border-primary)', borderRadius: 'var(--radius-md)' }}>
              Aucun fournisseur identifie pour cette DCI dans nos donnees
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '9px 12px', color: 'var(--text-primary)' };
