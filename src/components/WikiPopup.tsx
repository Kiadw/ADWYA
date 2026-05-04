'use client';

import React, { useState, useEffect } from 'react';
import { X, Book, Search, ChevronRight, FlaskConical, Shield, Map as MapIcon, BrainCircuit, Pill, Settings, FileText } from 'lucide-react';

interface WikiPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WIKI_SECTIONS = [
  {
    id: 'getting-started', title: 'Premiers pas', icon: Book,
    articles: [
      { slug: 'introduction', title: 'Introduction a ADWYA PharmaTech Hub' },
      { slug: 'navigation', title: 'Navigation et interface' },
      { slug: 'compte', title: 'Gestion du compte' },
    ]
  },
  {
    id: 'molecules', title: 'Editeur de Molecules', icon: FlaskConical,
    articles: [
      { slug: 'ketcher-guide', title: 'Utiliser Ketcher V3' },
      { slug: 'analyse-ia', title: 'Analyse IA en temps reel' },
      { slug: 'annotations', title: 'Annotations visuelles' },
      { slug: 'smiles', title: 'Format SMILES' },
    ]
  },
  {
    id: 'suppliers', title: 'Fournisseurs & Supply Chain', icon: MapIcon,
    articles: [
      { slug: 'carte-fournisseurs', title: 'Carte des fournisseurs' },
      { slug: 'risque-supply', title: 'Evaluation du risque' },
      { slug: 'pubchem-api', title: 'Integration PubChem' },
    ]
  },
  {
    id: 'medicaments', title: 'Base de Medicaments', icon: Pill,
    articles: [
      { slug: 'catalogue-adwya', title: 'Catalogue ADWYA' },
      { slug: 'import-export', title: 'Import / Export CSV' },
      { slug: 'classes-therapeutiques', title: 'Classes therapeutiques' },
      { slug: 'fournisseurs-reels', title: 'Fournisseurs reels ADWYA' },
    ]
  },
  {
    id: 'compliance', title: 'Conformite & Securite', icon: Shield,
    articles: [
      { slug: 'cfr-part11', title: '21 CFR Part 11' },
      { slug: 'rls-policies', title: 'Politiques RLS' },
      { slug: 'audit-trail', title: 'Journal d\'audit' },
    ]
  },
  {
    id: 'api', title: 'API & Integration', icon: Settings,
    articles: [
      { slug: 'edge-functions', title: 'Edge Functions Supabase' },
      { slug: 'ketcher-bridge', title: 'Ketcher Bridge API' },
    ]
  },
];

const ARTICLES: Record<string, string> = {
  'introduction': `# Introduction a ADWYA PharmaTech Hub

ADWYA PharmaTech Hub est une plateforme de laboratoire in silico concue pour les equipes R&D pharmaceutiques du Groupe KILANI. Elle combine l'edition moleculaire, l'analyse IA en temps reel et l'intelligence sur la chaine d'approvisionnement.

## Fonctionnalites principales

- **Analyse moleculaire en temps reel** : Dessinez une molecule et obtenez un score de viabilite, Lipinski et ADMET
- **Intelligence fournisseurs** : 14 fournisseurs reels (PharmaCompass, Volza, CPhI)
- **Base medicaments** : 45 produits ADWYA, 11 categories therapeutiques
- **Conformite 21 CFR Part 11** : Journal d'audit, RLS, signatures electroniques

## Architecture

- **Frontend** : Next.js 16 (App Router), React 19, Vanilla CSS
- **Backend** : Supabase (PostgreSQL + Edge Functions + RLS)
- **Chimie** : Ketcher V3 Standalone, PubChem API
- **Cartographie** : Leaflet avec tuiles OpenStreetMap`,

  'ketcher-guide': `# Utiliser Ketcher V3

Ketcher est un editeur de molecules open-source integre dans la plateforme.

## Dessiner une molecule

1. Selectionnez l'outil atome dans la barre laterale
2. Choisissez l'element (C, N, O, S)
3. Cliquez sur le canvas pour placer un atome
4. Glissez entre atomes pour creer une liaison

## Raccourcis

| Raccourci | Action |
|-----------|--------|
| Ctrl+Z | Annuler |
| Ctrl+Y | Retablir |
| Ctrl+A | Tout selectionner |
| Delete | Supprimer |
| R | Outil cycle |

## Analyse automatique

L'analyse IA se declenche 1.5s apres chaque modification. Le panneau droit affiche le score de viabilite (0-100), conformite Lipinski, predictions ADMET et alertes structurelles.`,

  'analyse-ia': `# Analyse IA en temps reel

## Score de viabilite (0-100)

- Score de base: 95 points
- -20 par groupe fonctionnel critique (aldehydes reactifs, peroxides)
- -10 par groupe a haut risque (epoxides, halogenures d'acyle)
- -8 par violation Lipinski

## Regle de Lipinski

Une molecule est "drug-like" si: MW < 500 Da, LogP < 5, HBD < 5, HBA < 10.

## Predictions ADMET

- Biodisponibilite orale (si Lipinski conforme)
- Penetration BHE (si TPSA < 90 et MW < 450)
- LogP et TPSA`,

  'catalogue-adwya': `# Catalogue ADWYA

ADWYA produit 45 medicaments generiques couvrant 11 categories therapeutiques.

## Categories

| Categorie | Nb | Exemples |
|-----------|-----|----------|
| Cardiologie | 11 | ZARTAN, ADWLOR, BISADWYL |
| Anti-infectieux | 5 | ADWAMOX, ADWAZITHRO |
| Neuropsychiatrie | 5 | ADWATINE, ADWALEX |
| Gastroenterologie | 4 | ADWAZOL, ADWAPAN |
| Antalgiques | 4 | ADWALGIC, IBADWYA |
| Diabetologie | 4 | METADWYA, GLIBADWYA |

## Acces

Menu > Medicaments pour filtrer, rechercher et exporter en CSV.`,

  'fournisseurs-reels': `# Fournisseurs reels ADWYA

ADWYA source ses matieres premieres aupres de 14 fournisseurs identifies dans 6 pays.

## Par pays

- **Inde** : Dr. Reddy's, Cipla, Aurobindo, Hetero, Granules (APIs generiques)
- **Chine** : Zhejiang Huahai, Zhejiang Jiuzhou, Anhui BBCA (APIs + excipients)
- **France** : Sanofi (licence), Roquette (excipients)
- **Allemagne** : BASF Pharma Solutions (excipients)
- **Jordanie** : Hikma Pharmaceuticals (APIs)
- **Tunisie** : TERIAK (CMO frere), PCT (distribution)

## Sources

Donnees issues de PharmaCompass, Volza.com (trade data), CPhI Online, et communications officielles du Groupe KILANI.`,

  'import-export': `# Import / Export CSV

## Exporter

1. Medicaments > Appliquez vos filtres
2. Cliquez "CSV" pour telecharger
3. Le fichier contient les medicaments filtres

## Importer

Preparez un CSV avec: ID, Nom Commercial, DCI, Dosage, Forme, Classe, Categorie, Conditionnement, AMM, Statut

Cliquez "Importer" et selectionnez le fichier.`,

  'cfr-part11': `# 21 CFR Part 11

## Piste d'audit

Chaque action est enregistree avec horodatage, utilisateur, type d'action, cible et details JSON.

## Controle d'acces

- Row Level Security (RLS) sur toutes les tables Supabase
- Roles : admin, scientist, viewer
- Authentification JWT

## Integrite

- Journal d'audit immuable
- Edge Functions logguent chaque appel API externe
- Donnees PubChem et FDA horodatees`,

  'carte-fournisseurs': `# Carte des fournisseurs

La carte interactive (Leaflet + OpenStreetMap) affiche les fournisseurs mondiaux pour chaque molecule analysee.

## Codes couleur

- Vert : disponible, stock confirme
- Orange : stock limite ou delai
- Rouge : rupture ou alerte FDA

## Interaction

Cliquez sur un marqueur pour voir les details du fournisseur. La carte se met a jour en temps reel quand vous modifiez la molecule dans Ketcher.`,
};

export default function WikiPopup({ isOpen, onClose }: WikiPopupProps) {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(WIKI_SECTIONS.map(s => s.id)));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const matchingArticles = searchQuery
    ? WIKI_SECTIONS.flatMap(s => s.articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ ...a, section: s.title })))
    : [];

  const content = selectedArticle ? ARTICLES[selectedArticle] : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div style={{ position: 'relative', inset: 0, width: '100vw', height: '100vh', background: 'var(--bg-primary)', display: 'flex', overflow: 'hidden' }}>
        {/* Close button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <X size={16} />
        </button>

        {/* Sidebar */}
        <div style={{ width: 260, borderRight: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Book size={16} color="#6366f1" />
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Wiki ADWYA</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '6px 8px 6px 26px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: 11, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
          </div>

          {searchQuery && matchingArticles.length > 0 && (
            <div style={{ padding: 6, borderBottom: '1px solid var(--border-primary)' }}>
              {matchingArticles.map(a => (
                <button key={a.slug} onClick={() => { setSelectedArticle(a.slug); setSearchQuery(''); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '5px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-primary)', borderRadius: 4 }}>
                  {a.title}
                </button>
              ))}
            </div>
          )}

          <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: 6 }}>
            {WIKI_SECTIONS.map(section => {
              const Icon = section.icon;
              const isExpanded = expandedSections.has(section.id);
              return (
                <div key={section.id} style={{ marginBottom: 2 }}>
                  <button onClick={() => toggleSection(section.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>
                    <ChevronRight size={10} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }} />
                    <Icon size={12} /> {section.title}
                  </button>
                  {isExpanded && section.articles.map(a => (
                    <button key={a.slug} onClick={() => setSelectedArticle(a.slug)}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '4px 8px 4px 34px', border: 'none', background: selectedArticle === a.slug ? 'rgba(99,102,241,.06)' : 'none', color: selectedArticle === a.slug ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer', borderRadius: 4, fontSize: 11, fontWeight: selectedArticle === a.slug ? 600 : 400 }}>
                      {a.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: 'var(--space-xl)' }}>
          {content ? (
            <article className="wiki-article" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
          ) : (
            <div style={{ maxWidth: 700 }}>
              <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>Wiki ADWYA</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-lg)' }}>
                Selectionnez un article dans la barre laterale.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {WIKI_SECTIONS.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.id} onClick={() => setSelectedArticle(s.articles[0].slug)}
                      style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border-primary)', cursor: 'pointer', transition: 'border-color .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Icon size={14} color="#6366f1" />
                        <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.title}</strong>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{s.articles.length} articles</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim());
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^(?!<[huplo\-])([\w].+)$/gm, '<p>$1</p>')
    .replace(/\n{2,}/g, '\n');
}
