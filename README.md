# ADWYA PharmaTech Hub

<p align="center">
  <img src="public/logo-adwya.png" alt="ADWYA Logo" width="180" />
</p>

<p align="center">
  <strong>Plateforme Intégrative d'Intelligence Moléculaire, de Formulation in silico et de Résilience Supply Chain</strong><br/>
</p>

## À propos du Pivot Stratégique (V2)

La plateforme ADWYA a évolué pour s'adapter aux défis critiques de l'industrie pharmaceutique mondiale (2024-2026). Initialement conçue comme un catalogue d'ingrédients, l'outil est aujourd'hui une plateforme "DeepTech" conçue pour résoudre les points de douleur réels d'un bio-ingénieur :

1. **La Formulation Assistée par Ordinateur** : Prédiction des incompatibilités galéniques avant la phase de paillasse.
2. **L'Intégration Bio-Informatique** : Rapatriement temps réel des données moléculaires structurées (SMILES, propriétés ADMET, spectres 3D).
3. **La Résilience Structurale (Supply Chain)** : Face aux pénuries pharmaceutiques mondiales, l'outil croise les données des Principes Actifs (API) avec le maillage géopolitique et industriel pour suggérer des fournisseurs alternatifs.
4. **Conformité Réglementaire (GMP / FDA)** : Infrastructure de logs inaltérables garantissant la traçabilité de bout-en-bout.

---

## Fonctionnalités (Roadmap Actuelle)

### 🔬 Laboratoire In Silico (R&D)
- Import et analyse des données chimiques profondes (connecté aux bases ChEMBL / PubChem).
- Visualisation interactive des molécules en 3D (Viewer WebGL embarqué).
- Moteur de scoring d'interface : évaluation de la viabilité d'un ensemble (Principe Actif + Excipients) limitant les itérations ratées en laboratoire.

### 🏭 Résilience & Supply Chain
- Analyse granulaire de l'origine des ingrédients.
- Prédiction algorithmique des risques de rupture (via métadonnées temporelles et fournisseurs).

### 🛡️ Conformité et Sécurité
- Intégration des standards d'audit stricts (Audit Trail type 21 CFR Part 11).
- Versioning crypté des modifications de formulation.

---

## Architecture de la Plateforme

L'architecture est pensée pour l'entreprise moderne :

- **Frontend** : Next.js 16 (React 19), ultra-rapide avec le compilateur Turbopack. Architecture Cloud-native.
- **Backend & Auth** : Supabase. Fournit le moteur PostgreSQL, une authentification sécurisée, et des politiques de Row Level Security (RLS) pour cloisonner la R&D de la Supply Chain.
- **Design System** : Calqué sur l'identité groupe *Kilani / ADWYA*, le design se veut sobre, blanc et professionnel, optimisé pour la lecture de données complexes.

---

## Installation pour Environnement R&D

```bash
git clone <url>
cd ADWYA
npm install
npm run dev
```

La plateforme se lance avec des données de démonstration peuplant des cas d'utilisation fréquents (Amoxicilline, Paracétamol, etc.) pour évaluer l'UX/UI.

---

## Vision à long terme

Cet outil est le premier pas de la numérisation complète de la chaîne de valeur du développement médicamenteux au sein du groupe ADWYA. Son but n'est plus seulement de *"stocker"* de l'information, mais de *"prédire"* et de *"sécuriser"* l'avenir du traitement patient dans un écosystème sous contraintes.
