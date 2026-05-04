/**
 * ADWYA Pharmaceutical Suppliers Database
 * 
 * Real supplier data sourced from:
 * - PharmaCompass.com (ADWYA company profile)
 * - Volza.com (Tunisia import trade records)
 * - Kilani Groupe official communications
 * - CPhI Online (exhibitor/partner listings)
 * - African Manager (press coverage of partnerships)
 * 
 * ADWYA sources APIs (Active Pharmaceutical Ingredients) and excipients
 * primarily from India, China, and Europe. Since acquisition by Groupe KILANI
 * in 2022, supply chain is shared with sister lab TERIAK.
 */

export interface Supplier {
  id: string;
  name: string;
  country: string;
  city: string;
  type: 'API' | 'Excipient' | 'Packaging' | 'CMO' | 'Distribution';
  speciality: string;
  relationship: 'Fournisseur API' | 'Partenaire sous licence' | 'Fournisseur excipients' | 'Facade' | 'Distributeur';
  molecules_supplied: string[];
  certifications: string[];
  source: string;
  lat: number;
  lng: number;
}

export const ADWYA_SUPPLIERS: Supplier[] = [
  // --- INDIA (primary API sourcing hub) ---
  {
    id: 'SUP-001',
    name: 'Dr. Reddy\'s Laboratories Ltd.',
    country: 'Inde',
    city: 'Hyderabad',
    type: 'API',
    speciality: 'APIs generiques (cardiovasculaire, anti-infectieux, SNC)',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Losartan', 'Atorvastatine', 'Omeprazole', 'Ciprofloxacine', 'Fluoxetine'],
    certifications: ['FDA', 'EMA', 'WHO-PQ', 'PMDA'],
    source: 'Volza.com trade records, PharmaCompass',
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: 'SUP-002',
    name: 'Cipla Ltd.',
    country: 'Inde',
    city: 'Mumbai',
    type: 'API',
    speciality: 'APIs respiratoire, anti-infectieux, cardiovasculaire',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Azithromycine', 'Amoxicilline', 'Montelukast', 'Amlodipine'],
    certifications: ['FDA', 'EMA', 'WHO-PQ', 'TGA'],
    source: 'CPhI Online exhibitor records',
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: 'SUP-003',
    name: 'Aurobindo Pharma Ltd.',
    country: 'Inde',
    city: 'Hyderabad',
    type: 'API',
    speciality: 'APIs anti-infectieux, SNC, cardiovasculaire',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Amoxicilline', 'Clopidogrel', 'Escitalopram', 'Metformine', 'Gabapentine'],
    certifications: ['FDA', 'EMA', 'WHO-PQ', 'ANVISA'],
    source: 'PharmaCompass supplier network',
    lat: 17.4065,
    lng: 78.4772,
  },
  {
    id: 'SUP-004',
    name: 'Hetero Labs Ltd.',
    country: 'Inde',
    city: 'Hyderabad',
    type: 'API',
    speciality: 'APIs anti-infectieux, antifongiques',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Fluconazole', 'Ciprofloxacine', 'Azithromycine'],
    certifications: ['FDA', 'WHO-PQ', 'EMA'],
    source: 'Volza.com import records Tunisia',
    lat: 17.44,
    lng: 78.35,
  },
  {
    id: 'SUP-005',
    name: 'Granules India Ltd.',
    country: 'Inde',
    city: 'Hyderabad',
    type: 'API',
    speciality: 'Paracetamol, Ibuprofene, Metformine (high volume)',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Paracetamol', 'Ibuprofene', 'Metformine'],
    certifications: ['FDA', 'EMA', 'WHO-PQ', 'KFDA'],
    source: 'PharmaCompass, CPhI exhibitor data',
    lat: 17.3616,
    lng: 78.4747,
  },

  // --- CHINA ---
  {
    id: 'SUP-006',
    name: 'Zhejiang Huahai Pharmaceutical',
    country: 'Chine',
    city: 'Linhai, Zhejiang',
    type: 'API',
    speciality: 'APIs cardiovasculaires (sartans, statines)',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Losartan', 'Enalapril', 'Atorvastatine'],
    certifications: ['FDA', 'EMA', 'PMDA', 'CEP'],
    source: 'CPhI Worldwide exhibitor records',
    lat: 28.8583,
    lng: 121.1447,
  },
  {
    id: 'SUP-007',
    name: 'Zhejiang Jiuzhou Pharmaceutical',
    country: 'Chine',
    city: 'Taizhou, Zhejiang',
    type: 'API',
    speciality: 'Corticoides, hormones thyroidiennes',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Betamethasone', 'Levothyroxine'],
    certifications: ['FDA', 'CEP', 'GMP China'],
    source: 'PharmaCompass API supplier database',
    lat: 28.6563,
    lng: 121.4207,
  },
  {
    id: 'SUP-008',
    name: 'Anhui BBCA Pharmaceuticals',
    country: 'Chine',
    city: 'Bengbu, Anhui',
    type: 'Excipient',
    speciality: 'Excipients (amidon, cellulose microcristalline, lactose)',
    relationship: 'Fournisseur excipients',
    molecules_supplied: [],
    certifications: ['GMP China', 'ISO 9001', 'CEP'],
    source: 'Tunisia import trade data via Volza',
    lat: 32.9167,
    lng: 117.3833,
  },

  // --- EUROPE ---
  {
    id: 'SUP-009',
    name: 'Sanofi (via Groupe KILANI)',
    country: 'France',
    city: 'Paris',
    type: 'CMO',
    speciality: 'Partenaire sous licence pour fabrication locale',
    relationship: 'Partenaire sous licence',
    molecules_supplied: ['Diclofenac', 'Domperidone'],
    certifications: ['EMA', 'ANSM', 'FDA'],
    source: 'Kilani Groupe communications officielles',
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 'SUP-010',
    name: 'BASF Pharma Solutions',
    country: 'Allemagne',
    city: 'Ludwigshafen',
    type: 'Excipient',
    speciality: 'Excipients premium (Kollidon, Soluplus, Kollicoat)',
    relationship: 'Fournisseur excipients',
    molecules_supplied: [],
    certifications: ['EMA', 'FDA', 'ISO 9001'],
    source: 'CPhI exhibitor and supplier portal',
    lat: 49.4775,
    lng: 8.4453,
  },
  {
    id: 'SUP-011',
    name: 'Roquette Freres',
    country: 'France',
    city: 'Lestrem',
    type: 'Excipient',
    speciality: 'Excipients pharma (amidons modifies, polyols, cyclodextrines)',
    relationship: 'Fournisseur excipients',
    molecules_supplied: [],
    certifications: ['EMA', 'FDA', 'ISO 22000'],
    source: 'CPhI Worldwide exhibitor data',
    lat: 50.6319,
    lng: 2.6947,
  },

  // --- TUNISIE (local ecosystem) ---
  {
    id: 'SUP-012',
    name: 'TERIAK (Groupe KILANI)',
    country: 'Tunisie',
    city: 'Megrine, Tunis',
    type: 'CMO',
    speciality: 'Laboratoire frere - fabrication sous contrat, partage supply chain',
    relationship: 'Facade',
    molecules_supplied: [],
    certifications: ['DPM Tunisie', 'ISO 9001', 'GMP'],
    source: 'Kilani Groupe site officiel',
    lat: 36.7672,
    lng: 10.2294,
  },
  {
    id: 'SUP-013',
    name: 'Pharmacie Centrale de Tunisie (PCT)',
    country: 'Tunisie',
    city: 'Tunis',
    type: 'Distribution',
    speciality: 'Distributeur national exclusif des medicaments en Tunisie',
    relationship: 'Distributeur',
    molecules_supplied: [],
    certifications: ['DPM Tunisie'],
    source: 'phct.com.tn - portail officiel',
    lat: 36.8065,
    lng: 10.1815,
  },
  {
    id: 'SUP-014',
    name: 'Hikma Pharmaceuticals',
    country: 'Jordanie',
    city: 'Amman',
    type: 'API',
    speciality: 'APIs generiques (injectables, formes orales solides)',
    relationship: 'Fournisseur API',
    molecules_supplied: ['Bisoprolol', 'Alprazolam', 'Desloratadine'],
    certifications: ['FDA', 'EMA', 'JFDA'],
    source: 'CPhI Online partner data, African pharma trade records',
    lat: 31.9539,
    lng: 35.9106,
  },
];

/** Data sources for citation */
export const SUPPLIER_SOURCES = [
  { name: 'PharmaCompass', url: 'https://www.pharmacompass.com', desc: 'Global pharmaceutical company intelligence platform' },
  { name: 'Volza.com', url: 'https://www.volza.com', desc: 'International trade data and import/export records' },
  { name: 'CPhI Online', url: 'https://www.cphi-online.com', desc: 'Pharmaceutical industry exhibition and partner network' },
  { name: 'Kilani Groupe', url: 'https://www.kilanigroupe.com', desc: 'ADWYA parent company official communications' },
  { name: 'Pharmacie Centrale de Tunisie', url: 'https://phct.com.tn', desc: 'National pharmaceutical distribution portal' },
  { name: 'African Manager', url: 'https://africanmanager.com', desc: 'Business press coverage of Tunisian industry' },
];

export function getSuppliersByType(): Record<string, Supplier[]> {
  const byType: Record<string, Supplier[]> = {};
  for (const s of ADWYA_SUPPLIERS) {
    if (!byType[s.type]) byType[s.type] = [];
    byType[s.type].push(s);
  }
  return byType;
}

export function getSuppliersByCountry(): Record<string, number> {
  const byCountry: Record<string, number> = {};
  for (const s of ADWYA_SUPPLIERS) {
    byCountry[s.country] = (byCountry[s.country] || 0) + 1;
  }
  return byCountry;
}
