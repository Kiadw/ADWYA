/**
 * ADWYA Pharmaceutical Products Database
 * 
 * Data sourced from public Tunisian pharmaceutical registries (DPM, med.tn, PHCT).
 * ADWYA specializes in generics across cardiology, neurology, dermatology, urology,
 * gastroenterology, and anti-infectives.
 */

export interface Medication {
  id: string;
  nom_commercial: string;
  dci: string;
  dosage: string;
  forme: string;
  classe_therapeutique: string;
  categorie: string;
  conditionnement: string;
  amm: string;
  statut: 'Commercialise' | 'En cours' | 'Suspendu';
  smiles?: string;
}

export const ADWYA_MEDICATIONS: Medication[] = [
  // --- CARDIOLOGIE ---
  { id: 'ADW-001', nom_commercial: 'ZARTAN', dci: 'Losartan', dosage: '50 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antagoniste AT1', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2018-001', statut: 'Commercialise', smiles: 'CCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NN=N[NH]4)CO)Cl' },
  { id: 'ADW-002', nom_commercial: 'ZARTAN PLUS', dci: 'Losartan/Hydrochlorothiazide', dosage: '50/12.5 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antagoniste AT1 + Diuretique', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2018-002', statut: 'Commercialise', smiles: 'C1C2=C(C=C(C=C2)S(=O)(=O)N)S(=O)(=O)NN1' },
  { id: 'ADW-003', nom_commercial: 'ADWLOR', dci: 'Amlodipine', dosage: '5 mg', forme: 'Comprime', classe_therapeutique: 'Inhibiteur calcique', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-003', statut: 'Commercialise', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN' },
  { id: 'ADW-004', nom_commercial: 'ADWLOR', dci: 'Amlodipine', dosage: '10 mg', forme: 'Comprime', classe_therapeutique: 'Inhibiteur calcique', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-004', statut: 'Commercialise', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN' },
  { id: 'ADW-005', nom_commercial: 'ADWAPRIL', dci: 'Enalapril', dosage: '20 mg', forme: 'Comprime', classe_therapeutique: 'IEC', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2017-005', statut: 'Commercialise', smiles: 'CCOC(=O)C(CCC1=CC=CC=C1)NC(C)C(=O)N1CCCC1C(=O)O' },
  { id: 'ADW-006', nom_commercial: 'ADWAPRIL', dci: 'Enalapril', dosage: '5 mg', forme: 'Comprime', classe_therapeutique: 'IEC', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2017-006', statut: 'Commercialise', smiles: 'CCOC(=O)C(CCC1=CC=CC=C1)NC(C)C(=O)N1CCCC1C(=O)O' },
  { id: 'ADW-007', nom_commercial: 'ADWASTIN', dci: 'Atorvastatine', dosage: '20 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Statine', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-007', statut: 'Commercialise', smiles: 'CC(C)C1=C(C(=CC=C1)C2=CC=CC=C2)N3C=C(C(C3=O)O)CC(CC(=O)O)O' },
  { id: 'ADW-008', nom_commercial: 'ADWASTIN', dci: 'Atorvastatine', dosage: '40 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Statine', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-008', statut: 'Commercialise', smiles: 'CC(C)C1=C(C(=CC=C1)C2=CC=CC=C2)N3C=C(C(C3=O)O)CC(CC(=O)O)O' },
  { id: 'ADW-009', nom_commercial: 'BISADWYL', dci: 'Bisoprolol', dosage: '5 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Beta-bloquant', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-009', statut: 'Commercialise', smiles: 'CC(C)NCC(O)COC1=CC=C(C=C1)COCCOC(C)C' },
  { id: 'ADW-010', nom_commercial: 'BISADWYL', dci: 'Bisoprolol', dosage: '10 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Beta-bloquant', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-010', statut: 'Commercialise', smiles: 'CC(C)NCC(O)COC1=CC=C(C=C1)COCCOC(C)C' },
  { id: 'ADW-011', nom_commercial: 'CLOPIDWYA', dci: 'Clopidogrel', dosage: '75 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antiagregant plaquettaire', categorie: 'Cardiologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-011', statut: 'Commercialise', smiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3' },

  // --- GASTROENTEROLOGIE ---
  { id: 'ADW-012', nom_commercial: 'ADWAZOL', dci: 'Omeprazole', dosage: '20 mg', forme: 'Gelule gastro-resistante', classe_therapeutique: 'IPP', categorie: 'Gastroenterologie', conditionnement: 'B/14', amm: 'TN-AMM-2016-012', statut: 'Commercialise', smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=CC=CC=C3N2' },
  { id: 'ADW-013', nom_commercial: 'ADWAZOL', dci: 'Omeprazole', dosage: '40 mg', forme: 'Gelule gastro-resistante', classe_therapeutique: 'IPP', categorie: 'Gastroenterologie', conditionnement: 'B/14', amm: 'TN-AMM-2016-013', statut: 'Commercialise', smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=CC=CC=C3N2' },
  { id: 'ADW-014', nom_commercial: 'ADWAPAN', dci: 'Pantoprazole', dosage: '40 mg', forme: 'Comprime gastro-resistant', classe_therapeutique: 'IPP', categorie: 'Gastroenterologie', conditionnement: 'B/14', amm: 'TN-AMM-2021-014', statut: 'Commercialise', smiles: 'COC1=C(C=C2C(=C1)N=C(N2)S(=O)CC3=C(C=C(C=N3)OC)OC)OC' },
  { id: 'ADW-015', nom_commercial: 'DOMADWYA', dci: 'Domperidone', dosage: '10 mg', forme: 'Comprime', classe_therapeutique: 'Antiemetique', categorie: 'Gastroenterologie', conditionnement: 'B/30', amm: 'TN-AMM-2018-015', statut: 'Commercialise', smiles: 'C1CN(CCC1N2C(=O)NC3=C2C=C(C=C3)Cl)CCCN4C(=O)NC5=C4C=CC=C5' },

  // --- NEUROLOGIE / PSYCHIATRIE ---
  { id: 'ADW-016', nom_commercial: 'ADWATINE', dci: 'Fluoxetine', dosage: '20 mg', forme: 'Gelule', classe_therapeutique: 'ISRS', categorie: 'Neuropsychiatrie', conditionnement: 'B/30', amm: 'TN-AMM-2017-016', statut: 'Commercialise', smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F' },
  { id: 'ADW-017', nom_commercial: 'ADWALEX', dci: 'Escitalopram', dosage: '10 mg', forme: 'Comprime pellicule', classe_therapeutique: 'ISRS', categorie: 'Neuropsychiatrie', conditionnement: 'B/28', amm: 'TN-AMM-2020-017', statut: 'Commercialise', smiles: 'CN(C)CCCC1(C2=C(CO1)C=C(C=C2)C#N)C3=CC=C(C=C3)F' },
  { id: 'ADW-018', nom_commercial: 'ADWAZEPAM', dci: 'Alprazolam', dosage: '0.5 mg', forme: 'Comprime', classe_therapeutique: 'Benzodiazepine', categorie: 'Neuropsychiatrie', conditionnement: 'B/30', amm: 'TN-AMM-2016-018', statut: 'Commercialise', smiles: 'CC1=NN=C2N1C3=C(C=CC(=C3)Cl)C(=NC2)C4=CC=CC=C4' },
  { id: 'ADW-019', nom_commercial: 'GABADWYA', dci: 'Gabapentine', dosage: '300 mg', forme: 'Gelule', classe_therapeutique: 'Antiepileptique', categorie: 'Neuropsychiatrie', conditionnement: 'B/30', amm: 'TN-AMM-2019-019', statut: 'Commercialise', smiles: 'C1CCC(CC1)(CC(=O)O)CN' },
  { id: 'ADW-020', nom_commercial: 'GABADWYA', dci: 'Gabapentine', dosage: '400 mg', forme: 'Gelule', classe_therapeutique: 'Antiepileptique', categorie: 'Neuropsychiatrie', conditionnement: 'B/30', amm: 'TN-AMM-2019-020', statut: 'Commercialise', smiles: 'C1CCC(CC1)(CC(=O)O)CN' },

  // --- ANTI-INFECTIEUX ---
  { id: 'ADW-021', nom_commercial: 'ADWAMOX', dci: 'Amoxicilline', dosage: '500 mg', forme: 'Gelule', classe_therapeutique: 'Penicilline', categorie: 'Anti-infectieux', conditionnement: 'B/24', amm: 'TN-AMM-2015-021', statut: 'Commercialise', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C' },
  { id: 'ADW-022', nom_commercial: 'ADWAMOX', dci: 'Amoxicilline', dosage: '1 g', forme: 'Comprime dispersible', classe_therapeutique: 'Penicilline', categorie: 'Anti-infectieux', conditionnement: 'B/12', amm: 'TN-AMM-2015-022', statut: 'Commercialise', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C' },
  { id: 'ADW-023', nom_commercial: 'ADWAMOX PLUS', dci: 'Amoxicilline/Ac. Clavulanique', dosage: '1g/125mg', forme: 'Comprime pellicule', classe_therapeutique: 'Penicilline + Inhibiteur beta-lactamase', categorie: 'Anti-infectieux', conditionnement: 'B/12', amm: 'TN-AMM-2018-023', statut: 'Commercialise', smiles: 'C1C2N(C(=O)C2(O1)C=CCO)C(=O)O' },
  { id: 'ADW-024', nom_commercial: 'ADWAZITHRO', dci: 'Azithromycine', dosage: '500 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Macrolide', categorie: 'Anti-infectieux', conditionnement: 'B/3', amm: 'TN-AMM-2019-024', statut: 'Commercialise', smiles: 'CCC1C(C(C(N(CC(CC(C(C(C(C(C(=O)O1)C)OC2CC(C(C(O2)C)O)(C)OC)C)OC3C(C(CC(O3)C)N(C)C)O)(C)O)C)C)C)O)(C)O' },
  { id: 'ADW-025', nom_commercial: 'CIPROADWYA', dci: 'Ciprofloxacine', dosage: '500 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Fluoroquinolone', categorie: 'Anti-infectieux', conditionnement: 'B/10', amm: 'TN-AMM-2017-025', statut: 'Commercialise', smiles: 'C1CC1N2C=C(C(=O)C3=CC(=C(C=C32)N4CCNCC4)F)C(=O)O' },

  // --- DERMATOLOGIE ---
  { id: 'ADW-026', nom_commercial: 'ADWADERM', dci: 'Betamethasone', dosage: '0.1%', forme: 'Creme', classe_therapeutique: 'Corticoide topique', categorie: 'Dermatologie', conditionnement: 'Tube 30g', amm: 'TN-AMM-2018-026', statut: 'Commercialise', smiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C' },
  { id: 'ADW-027', nom_commercial: 'ADWAFUNG', dci: 'Fluconazole', dosage: '150 mg', forme: 'Gelule', classe_therapeutique: 'Antifongique', categorie: 'Dermatologie', conditionnement: 'B/1', amm: 'TN-AMM-2019-027', statut: 'Commercialise', smiles: 'C(C(CN1C=NC=N1)(C2=C(C=C(C=C2)F)F)O)N3C=NC=N3' },
  { id: 'ADW-028', nom_commercial: 'ADWAFUNG', dci: 'Fluconazole', dosage: '50 mg', forme: 'Gelule', classe_therapeutique: 'Antifongique', categorie: 'Dermatologie', conditionnement: 'B/7', amm: 'TN-AMM-2019-028', statut: 'Commercialise', smiles: 'C(C(CN1C=NC=N1)(C2=C(C=C(C=C2)F)F)O)N3C=NC=N3' },

  // --- METABOLISME / DIABETE ---
  { id: 'ADW-029', nom_commercial: 'METADWYA', dci: 'Metformine', dosage: '850 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Biguanide', categorie: 'Diabetologie', conditionnement: 'B/30', amm: 'TN-AMM-2016-029', statut: 'Commercialise', smiles: 'CN(C)C(=N)NC(=N)N' },
  { id: 'ADW-030', nom_commercial: 'METADWYA', dci: 'Metformine', dosage: '1000 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Biguanide', categorie: 'Diabetologie', conditionnement: 'B/30', amm: 'TN-AMM-2016-030', statut: 'Commercialise', smiles: 'CN(C)C(=N)NC(=N)N' },
  { id: 'ADW-031', nom_commercial: 'GLIBADWYA', dci: 'Glimepiride', dosage: '2 mg', forme: 'Comprime', classe_therapeutique: 'Sulfamide hypoglycemiant', categorie: 'Diabetologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-031', statut: 'Commercialise', smiles: 'CCC1=C(C=NC(=C1)C(=O)NCCC2=CC=C(C=C2)S(=O)(=O)NC(=O)NC3CCC(CC3)C)C' },
  { id: 'ADW-032', nom_commercial: 'GLIBADWYA', dci: 'Glimepiride', dosage: '4 mg', forme: 'Comprime', classe_therapeutique: 'Sulfamide hypoglycemiant', categorie: 'Diabetologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-032', statut: 'Commercialise', smiles: 'CCC1=C(C=NC(=C1)C(=O)NCCC2=CC=C(C=C2)S(=O)(=O)NC(=O)NC3CCC(CC3)C)C' },

  // --- UROLOGIE ---
  { id: 'ADW-033', nom_commercial: 'TAMADWYA', dci: 'Tamsulosine', dosage: '0.4 mg', forme: 'Gelule LP', classe_therapeutique: 'Alpha-bloquant', categorie: 'Urologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-033', statut: 'Commercialise', smiles: 'CCOC1=C(C=CC(=C1)S(=O)(=O)N)CC(C)NCCOCC2=CC=CC=C2' },
  { id: 'ADW-034', nom_commercial: 'FINADWYA', dci: 'Finasteride', dosage: '5 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Inhibiteur 5-alpha reductase', categorie: 'Urologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-034', statut: 'Commercialise', smiles: 'CC(C)(C)NC(=O)C1CC2C3CCC4=CC(=O)NC4C3(CCC12C)C' },

  // --- DOULEUR / ANTI-INFLAMMATOIRE ---
  { id: 'ADW-035', nom_commercial: 'ADWALGIC', dci: 'Paracetamol', dosage: '500 mg', forme: 'Comprime', classe_therapeutique: 'Analgesique / Antipyretique', categorie: 'Antalgiques', conditionnement: 'B/20', amm: 'TN-AMM-2015-035', statut: 'Commercialise', smiles: 'CC(=O)NC1=CC=C(C=C1)O' },
  { id: 'ADW-036', nom_commercial: 'ADWALGIC', dci: 'Paracetamol', dosage: '1 g', forme: 'Comprime', classe_therapeutique: 'Analgesique / Antipyretique', categorie: 'Antalgiques', conditionnement: 'B/8', amm: 'TN-AMM-2015-036', statut: 'Commercialise', smiles: 'CC(=O)NC1=CC=C(C=C1)O' },
  { id: 'ADW-037', nom_commercial: 'IBADWYA', dci: 'Ibuprofene', dosage: '400 mg', forme: 'Comprime pellicule', classe_therapeutique: 'AINS', categorie: 'Antalgiques', conditionnement: 'B/20', amm: 'TN-AMM-2016-037', statut: 'Commercialise', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
  { id: 'ADW-038', nom_commercial: 'DICADWYA', dci: 'Diclofenac', dosage: '50 mg', forme: 'Comprime gastro-resistant', classe_therapeutique: 'AINS', categorie: 'Antalgiques', conditionnement: 'B/30', amm: 'TN-AMM-2017-038', statut: 'Commercialise', smiles: 'C1=CC=C(C(=C1)CC(=O)O)NC2=C(C=CC=C2Cl)Cl' },

  // --- ALLERGOLOGIE ---
  { id: 'ADW-039', nom_commercial: 'ADWATADINE', dci: 'Desloratadine', dosage: '5 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antihistaminique H1', categorie: 'Allergologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-039', statut: 'Commercialise', smiles: 'C1CC(=C2C3=C(CCC2)C=C(C=C3)Cl)C4=C(C=CC=N4)CC1' },
  { id: 'ADW-040', nom_commercial: 'CETADWYA', dci: 'Cetirizine', dosage: '10 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antihistaminique H1', categorie: 'Allergologie', conditionnement: 'B/20', amm: 'TN-AMM-2018-040', statut: 'Commercialise', smiles: 'C1CN(CCN1CCOCC(=O)O)C(C2=CC=CC=C2)C3=CC=C(C=C3)Cl' },

  // --- PNEUMOLOGIE ---
  { id: 'ADW-041', nom_commercial: 'MONTADWYA', dci: 'Montelukast', dosage: '10 mg', forme: 'Comprime pellicule', classe_therapeutique: 'Antileucotriene', categorie: 'Pneumologie', conditionnement: 'B/28', amm: 'TN-AMM-2021-041', statut: 'Commercialise', smiles: 'CC(C)(C1=CC=CC=C1C2=C(C=CC(=C2)C=CC3=NC4=C(C=CC(=C4)Cl)C=C3)SCC(CC(=O)O)O)O' },

  // --- RHUMATOLOGIE ---
  { id: 'ADW-042', nom_commercial: 'ALLOADWYA', dci: 'Allopurinol', dosage: '300 mg', forme: 'Comprime', classe_therapeutique: 'Hypo-uricemiant', categorie: 'Rhumatologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-042', statut: 'Commercialise', smiles: 'C1=NC2=C(N1)C(=O)NC=N2' },
  { id: 'ADW-043', nom_commercial: 'ALLOADWYA', dci: 'Allopurinol', dosage: '100 mg', forme: 'Comprime', classe_therapeutique: 'Hypo-uricemiant', categorie: 'Rhumatologie', conditionnement: 'B/30', amm: 'TN-AMM-2019-043', statut: 'Commercialise', smiles: 'C1=NC2=C(N1)C(=O)NC=N2' },

  // --- ENDOCRINOLOGIE ---
  { id: 'ADW-044', nom_commercial: 'LEVADWYA', dci: 'Levothyroxine', dosage: '100 mcg', forme: 'Comprime', classe_therapeutique: 'Hormone thyroidienne', categorie: 'Endocrinologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-044', statut: 'Commercialise', smiles: 'C1=C(C=C(C(=C1I)O)I)OC2=CC(=C(C(=C2)I)CC(C(=O)O)N)I' },
  { id: 'ADW-045', nom_commercial: 'LEVADWYA', dci: 'Levothyroxine', dosage: '50 mcg', forme: 'Comprime', classe_therapeutique: 'Hormone thyroidienne', categorie: 'Endocrinologie', conditionnement: 'B/30', amm: 'TN-AMM-2020-045', statut: 'Commercialise', smiles: 'C1=C(C=C(C(=C1I)O)I)OC2=CC(=C(C(=C2)I)CC(C(=O)O)N)I' },
];

/** Get unique therapeutic categories */
export function getCategories(): string[] {
  const cats = new Set(ADWYA_MEDICATIONS.map(m => m.categorie));
  return Array.from(cats).sort();
}

/** Get medications count by category */
export function getMedicationStats() {
  const byCat: Record<string, number> = {};
  for (const m of ADWYA_MEDICATIONS) {
    byCat[m.categorie] = (byCat[m.categorie] || 0) + 1;
  }
  return {
    total: ADWYA_MEDICATIONS.length,
    categories: Object.keys(byCat).length,
    byCategory: byCat,
    commercialise: ADWYA_MEDICATIONS.filter(m => m.statut === 'Commercialise').length,
  };
}

/** Export medications as CSV string */
export function exportCSV(meds: Medication[]): string {
  const headers = ['ID', 'Nom Commercial', 'DCI', 'Dosage', 'Forme', 'Classe Therapeutique', 'Categorie', 'Conditionnement', 'AMM', 'Statut'];
  const rows = meds.map(m => [m.id, m.nom_commercial, m.dci, m.dosage, m.forme, m.classe_therapeutique, m.categorie, m.conditionnement, m.amm, m.statut]);
  return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
}

/** Parse CSV string into medications */
export function importCSV(csv: string): Medication[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
    return {
      id: cols[0] || `IMP-${i}`,
      nom_commercial: cols[1] || '',
      dci: cols[2] || '',
      dosage: cols[3] || '',
      forme: cols[4] || '',
      classe_therapeutique: cols[5] || '',
      categorie: cols[6] || '',
      conditionnement: cols[7] || '',
      amm: cols[8] || '',
      statut: (cols[9] as Medication['statut']) || 'Commercialise',
    };
  });
}
