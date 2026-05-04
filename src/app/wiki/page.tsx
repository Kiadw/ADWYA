'use client';

import React, { useState } from 'react';
import { Book, Search, ChevronRight, Beaker, FlaskConical, Shield, Map, BrainCircuit, Pill, Settings, FileText } from 'lucide-react';

const WIKI_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Premiers pas',
    icon: Book,
    articles: [
      { slug: 'introduction', title: 'Introduction a ADWYA PharmaTech Hub', summary: 'Presentation de la plateforme, ses objectifs et son architecture.' },
      { slug: 'navigation', title: 'Navigation et interface', summary: 'Comprendre le tableau de bord, la barre laterale et les raccourcis.' },
      { slug: 'compte', title: 'Gestion du compte', summary: 'Connexion, parametres de profil et roles utilisateur.' },
    ]
  },
  {
    id: 'molecules',
    title: 'Editeur de Molecules',
    icon: FlaskConical,
    articles: [
      { slug: 'ketcher-guide', title: 'Utiliser Ketcher V3', summary: 'Dessiner, modifier et sauvegarder des structures moleculaires.' },
      { slug: 'analyse-ia', title: 'Analyse IA en temps reel', summary: 'Score de viabilite, Lipinski, ADMET et alertes structurelles.' },
      { slug: 'annotations', title: 'Annotations visuelles', summary: 'Comment l\'IA identifie et surligne les groupes problematiques.' },
      { slug: 'smiles', title: 'Format SMILES', summary: 'Comprendre la notation SMILES pour les structures chimiques.' },
    ]
  },
  {
    id: 'suppliers',
    title: 'Fournisseurs & Supply Chain',
    icon: Map,
    articles: [
      { slug: 'carte-fournisseurs', title: 'Carte des fournisseurs', summary: 'Visualiser les fournisseurs mondiaux sur la carte interactive.' },
      { slug: 'risque-supply', title: 'Evaluation du risque', summary: 'Niveaux de risque, alertes FDA et ruptures de stock.' },
      { slug: 'pubchem-api', title: 'Integration PubChem', summary: 'Comment les donnees fournisseurs sont recuperees en temps reel.' },
    ]
  },
  {
    id: 'medicaments',
    title: 'Base de Medicaments',
    icon: Pill,
    articles: [
      { slug: 'catalogue-adwya', title: 'Catalogue ADWYA', summary: '45 produits pharmaceutiques, 11 categories therapeutiques.' },
      { slug: 'import-export', title: 'Import / Export CSV', summary: 'Importer et exporter des listes de medicaments au format CSV.' },
      { slug: 'classes-therapeutiques', title: 'Classes therapeutiques', summary: 'Cardiologie, neurologie, dermatologie, anti-infectieux et plus.' },
    ]
  },
  {
    id: 'compliance',
    title: 'Conformite & Securite',
    icon: Shield,
    articles: [
      { slug: 'cfr-part11', title: '21 CFR Part 11', summary: 'Piste d\'audit, signatures electroniques et integrite des donnees.' },
      { slug: 'rls-policies', title: 'Politiques RLS', summary: 'Row Level Security et controle d\'acces base sur les roles.' },
      { slug: 'audit-trail', title: 'Journal d\'audit', summary: 'Toutes les actions sont tracees pour conformite reglementaire.' },
    ]
  },
  {
    id: 'api',
    title: 'API & Integration',
    icon: Settings,
    articles: [
      { slug: 'edge-functions', title: 'Edge Functions Supabase', summary: 'ai-scoring, supply-chain-proxy et architecture serverless.' },
      { slug: 'ketcher-bridge', title: 'Ketcher Bridge API', summary: 'Communication bidirectionnelle avec l\'editeur de molecules.' },
      { slug: 'webhooks', title: 'Webhooks & Automatisation', summary: 'Declencheurs automatiques et integration avec des outils tiers.' },
    ]
  },
];

// Article content database
const ARTICLE_CONTENT: Record<string, string> = {
  'introduction': `# Introduction a ADWYA PharmaTech Hub

ADWYA PharmaTech Hub est une plateforme de laboratoire in silico concue pour les equipes R&D pharmaceutiques. Elle combine l'edition moleculaire, l'analyse IA en temps reel et l'intelligence sur la chaine d'approvisionnement en une interface unique et conforme aux normes 21 CFR Part 11.

## Objectifs de la plateforme

- **Analyse moleculaire en temps reel** : Dessinez une molecule et obtenez instantanement un score de viabilite, une verification Lipinski et des predictions ADMET
- **Intelligence fournisseurs** : Visualisez les fournisseurs mondiaux, leur disponibilite et les alertes de rupture FDA
- **Conformite reglementaire** : Chaque action est tracee dans un journal d'audit pour garantir l'integrite des donnees
- **Base de medicaments** : Catalogue complet des 45 produits ADWYA avec import/export CSV

## Architecture technique

La plateforme repose sur :
- **Next.js 16** (App Router) pour le frontend
- **Supabase** (PostgreSQL + Edge Functions) pour le backend
- **Ketcher V3** pour l'edition moleculaire
- **PubChem API** pour les donnees chimiques en temps reel
- **FDA API** pour les alertes de rupture de stock`,

  'ketcher-guide': `# Utiliser Ketcher V3

Ketcher est un editeur de molecules open-source integre directement dans la plateforme. Il permet de dessiner des structures chimiques en 2D avec une interface intuitive.

## Dessiner une molecule

1. Cliquez sur l'outil "Atome" dans la barre laterale gauche
2. Selectionnez l'element (C, N, O, S, etc.) dans le tableau periodique a droite
3. Cliquez sur le canvas pour placer un atome
4. Glissez entre deux atomes pour creer une liaison

## Raccourcis utiles

| Raccourci | Action |
|-----------|--------|
| Ctrl+Z | Annuler |
| Ctrl+Y | Retablir |
| Ctrl+A | Tout selectionner |
| Delete | Supprimer la selection |
| R | Outil de dessin de cycle |
| B | Outil de liaison |

## Analyse automatique

Des que vous dessinez ou modifiez une molecule, l'analyse IA se declenche automatiquement apres 1.5 secondes d'inactivite. Le panneau lateral droit affiche :
- Le score de viabilite (0-100)
- L'identite moleculaire (IUPAC, formule, masse)
- La conformite Lipinski
- Les predictions ADMET
- Les alertes structurelles`,

  'analyse-ia': `# Analyse IA en temps reel

Le moteur d'analyse IA evalue chaque molecule sur plusieurs criteres pharmaceutiques.

## Score de viabilite

Le score (0-100) est calcule en fonction de :
- **Groupes fonctionnels a risque** : -20 points par groupe critique, -10 par groupe a haut risque
- **Violations Lipinski** : -8 points par violation
- **Score de base** : 95 points

## Regle de Lipinski (Rule of Five)

Une molecule est consideree "drug-like" si elle respecte :
- Masse moleculaire < 500 Da
- LogP < 5
- Donneurs de liaisons H < 5
- Accepteurs de liaisons H < 10

## Predictions ADMET

- **Biodisponibilite orale** : Probable si Lipinski conforme
- **Penetration BHE** : Possible si TPSA < 90 et MW < 450
- **LogP** : Coefficient de partage octanol/eau
- **TPSA** : Surface polaire topologique`,

  'catalogue-adwya': `# Catalogue ADWYA

ADWYA est un laboratoire pharmaceutique tunisien fonde en 1983, acquis par le Groupe KILANI en 2022. La gamme couvre 11 categories therapeutiques avec 45 produits commercialises.

## Categories therapeutiques

| Categorie | Nombre | Exemples |
|-----------|--------|----------|
| Cardiologie | 11 | ZARTAN, ADWLOR, BISADWYL |
| Anti-infectieux | 5 | ADWAMOX, ADWAZITHRO, CIPROADWYA |
| Neuropsychiatrie | 5 | ADWATINE, ADWALEX, GABADWYA |
| Gastroenterologie | 4 | ADWAZOL, ADWAPAN, DOMADWYA |
| Antalgiques | 4 | ADWALGIC, IBADWYA, DICADWYA |
| Diabetologie | 4 | METADWYA, GLIBADWYA |
| Dermatologie | 3 | ADWADERM, ADWAFUNG |
| Allergologie | 2 | ADWATADINE, CETADWYA |
| Urologie | 2 | TAMADWYA, FINADWYA |
| Rhumatologie | 2 | ALLOADWYA |
| Endocrinologie | 2 | LEVADWYA |
| Pneumologie | 1 | MONTADWYA |

## Acces aux donnees

Naviguez vers la section **Medicaments** dans le menu principal pour acceder au catalogue complet, filtrer par categorie et exporter en CSV.`,

  'import-export': `# Import / Export CSV

## Exporter

1. Allez dans **Medicaments** depuis le menu lateral
2. Appliquez vos filtres si necessaire (categorie, recherche)
3. Cliquez sur **Exporter CSV**
4. Le fichier contient uniquement les medicaments filtres

## Importer

1. Preparez un fichier CSV avec les colonnes suivantes :
   - ID, Nom Commercial, DCI, Dosage, Forme, Classe Therapeutique, Categorie, Conditionnement, AMM, Statut
2. Cliquez sur **Importer CSV**
3. Selectionnez votre fichier
4. Les medicaments sont ajoutes a la liste existante

## Format du fichier

\`\`\`csv
ID,Nom Commercial,DCI,Dosage,Forme,Classe Therapeutique,Categorie,Conditionnement,AMM,Statut
"ADW-046","NEWMED","Substance X","10 mg","Comprime","Classe Y","Cardiologie","B/30","TN-2025","Commercialise"
\`\`\``,

  'cfr-part11': `# 21 CFR Part 11 - Conformite

La plateforme ADWYA PharmaTech Hub est concue pour faciliter la conformite avec le titre 21 CFR Part 11 de la FDA, qui definit les criteres pour les enregistrements electroniques et les signatures electroniques.

## Piste d'audit

Chaque action est enregistree dans la table \`audit_logs\` avec :
- **Horodatage** : Date et heure exactes de l'action
- **Utilisateur** : Identifiant de l'utilisateur
- **Action** : Type d'operation effectuee
- **Cible** : Element concerne (molecule, formulation, etc.)
- **Details** : Parametres supplementaires en JSON

## Controle d'acces

- **Row Level Security (RLS)** : Chaque table est protegee par des politiques RLS dans Supabase
- **Roles** : admin, scientist, viewer
- **JWT** : Authentification basee sur des tokens JWT signes

## Integrite des donnees

- Les modifications sont immuables dans le journal d'audit
- Les Edge Functions logguent chaque appel API externe
- Les donnees PubChem et FDA sont horodatees pour tracabilite`,
};

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(WIKI_SECTIONS.map(s => s.id)));

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter articles by search
  const matchingArticles = searchQuery
    ? WIKI_SECTIONS.flatMap(s => s.articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(a => ({ ...a, section: s.title })))
    : [];

  const articleContent = selectedArticle ? ARTICLE_CONTENT[selectedArticle] : null;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* Wiki sidebar */}
      <div style={{
        width: 300, borderRight: '1px solid var(--border-primary)', background: 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
      }}>
        <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-sm)' }}>
            <Book size={18} color="var(--accent-primary, #6366f1)" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Wiki ADWYA</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text" placeholder="Rechercher..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
        </div>

        {/* Search results */}
        {searchQuery && matchingArticles.length > 0 && (
          <div style={{ padding: 'var(--space-sm)', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', padding: '4px 8px', textTransform: 'uppercase' }}>{matchingArticles.length} resultats</div>
            {matchingArticles.map(a => (
              <button key={a.slug} onClick={() => { setSelectedArticle(a.slug); setSearchQuery(''); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 12, color: 'var(--text-primary)' }}>
                <div style={{ fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{a.section}</div>
              </button>
            ))}
          </div>
        )}

        {/* Navigation tree */}
        <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: 'var(--space-sm)' }}>
          {WIKI_SECTIONS.map(section => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.id);
            return (
              <div key={section.id} style={{ marginBottom: 4 }}>
                <button onClick={() => toggleSection(section.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>
                  <ChevronRight size={12} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
                  <Icon size={14} />
                  {section.title}
                </button>
                {isExpanded && (
                  <div style={{ marginLeft: 28 }}>
                    {section.articles.map(article => (
                      <button key={article.slug} onClick={() => setSelectedArticle(article.slug)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none',
                          background: selectedArticle === article.slug ? 'rgba(99,102,241,.08)' : 'none',
                          color: selectedArticle === article.slug ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
                          cursor: 'pointer', borderRadius: 4, fontSize: 12, fontWeight: selectedArticle === article.slug ? 600 : 400
                        }}>
                        {article.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Article content */}
      <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: 'var(--space-xl)' }}>
        {articleContent ? (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <article className="wiki-article" dangerouslySetInnerHTML={{ __html: renderMarkdown(articleContent) }} />
          </div>
        ) : (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              Wiki ADWYA PharmaTech Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--font-sm)' }}>
              Documentation complete de la plateforme. Selectionnez un article dans la barre laterale ou explorez les categories ci-dessous.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
              {WIKI_SECTIONS.map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', padding: 'var(--space-lg)', cursor: 'pointer', transition: 'all .2s' }}
                    onClick={() => { setSelectedArticle(section.articles[0].slug); }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary, #6366f1)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-sm)' }}>
                      <Icon size={18} color="var(--accent-primary, #6366f1)" />
                      <h3 style={{ margin: 0, fontSize: 'var(--font-md)', color: 'var(--text-primary)' }}>{section.title}</h3>
                    </div>
                    <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'none' }}>
                      {section.articles.map(a => (
                        <li key={a.slug} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={10} /> {a.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple markdown to HTML converter */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim());
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/^(?!<[huplo])([\w].+)$/gm, '<p>$1</p>')
    .replace(/\n{2,}/g, '\n');
}
