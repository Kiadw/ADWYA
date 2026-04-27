// Pharmaceutical data - ingredients, formulations, activities
// This acts as local data store (can later be migrated to Supabase)

export interface Ingredient {
    id: string;
    name: string;
    casNumber: string;
    formula: string;
    molarMass: number;
    category: string;
    subCategory: string;
    riskClass: string;
    solubility: string;
    supplier: string;
    status: 'Actif' | 'En révision' | 'Archivé';
    dateAdded: string;
}

export interface Formulation {
    id: string;
    name: string;
    type: string;
    indication: string;
    status: 'Production' | 'Développement' | 'Suspendu';
    ingredients: { ingredientId: string; dosage: string; unit: string; role: string }[];
}

export interface Activity {
    id: string;
    action: string;
    target: string;
    user: string;
    timestamp: string;
    color: string;
}

export const INGREDIENTS: Ingredient[] = [
    { id: "ING001", name: "Paracétamol", casNumber: "103-90-2", formula: "C₈H₉NO₂", molarMass: 151.16, category: "Principe actif", subCategory: "Analgésique / Antipyrétique", riskClass: "Modéré", solubility: "14 mg/mL (eau, 25°C)", supplier: "Granules India", status: "Actif", dateAdded: "2024-01-15" },
    { id: "ING002", name: "Ibuprofène", casNumber: "15687-27-1", formula: "C₁₃H₁₈O₂", molarMass: 206.28, category: "Principe actif", subCategory: "AINS", riskClass: "Modéré", solubility: "0.021 mg/mL", supplier: "BASF Pharma", status: "Actif", dateAdded: "2024-01-20" },
    { id: "ING003", name: "Amoxicilline", casNumber: "26787-78-0", formula: "C₁₆H₁₉N₃O₅S", molarMass: 365.40, category: "Principe actif", subCategory: "Antibiotique β-lactamine", riskClass: "Modéré", solubility: "4 mg/mL", supplier: "DSM Sinochem", status: "Actif", dateAdded: "2024-02-01" },
    { id: "ING004", name: "Oméprazole", casNumber: "73590-58-6", formula: "C₁₇H₁₉N₃O₃S", molarMass: 345.42, category: "Principe actif", subCategory: "IPP / Anti-ulcéreux", riskClass: "Faible", solubility: "0.36 mg/mL", supplier: "Hetero Drugs", status: "Actif", dateAdded: "2024-02-10" },
    { id: "ING005", name: "Metformine", casNumber: "657-24-9", formula: "C₄H₁₁N₅", molarMass: 129.16, category: "Principe actif", subCategory: "Antidiabétique / Biguanide", riskClass: "Modéré", solubility: "Soluble", supplier: "Aarti Industries", status: "Actif", dateAdded: "2024-02-15" },
    { id: "ING006", name: "Atorvastatine", casNumber: "134523-00-5", formula: "C₃₃H₃₅FN₂O₅", molarMass: 558.64, category: "Principe actif", subCategory: "Hypolipémiant / Statine", riskClass: "Modéré", solubility: "Insoluble dans l'eau", supplier: "Teva API", status: "Actif", dateAdded: "2024-03-01" },
    { id: "ING007", name: "Amlodipine", casNumber: "88150-42-9", formula: "C₂₀H₂₅ClN₂O₅", molarMass: 408.88, category: "Principe actif", subCategory: "Inhibiteur calcique", riskClass: "Modéré", solubility: "Légèrement soluble", supplier: "Cipla Ltd", status: "Actif", dateAdded: "2024-03-05" },
    { id: "ING008", name: "Azithromycine", casNumber: "83905-01-5", formula: "C₃₈H₇₂N₂O₁₂", molarMass: 748.98, category: "Principe actif", subCategory: "Antibiotique macrolide", riskClass: "Modéré", solubility: "0.01 mg/mL", supplier: "Zhejiang Pharmaceutical", status: "Actif", dateAdded: "2024-03-10" },
    { id: "ING009", name: "Cétirizine", casNumber: "83881-51-0", formula: "C₂₁H₂₅ClN₂O₃", molarMass: 388.89, category: "Principe actif", subCategory: "Antihistaminique H1", riskClass: "Faible", solubility: "Soluble", supplier: "UCB Pharma", status: "Actif", dateAdded: "2024-03-15" },
    { id: "ING010", name: "Losartan", casNumber: "114798-26-4", formula: "C₂₂H₂₃ClN₆O", molarMass: 422.91, category: "Principe actif", subCategory: "ARA II", riskClass: "Modéré", solubility: "Soluble", supplier: "Merck KGaA", status: "Actif", dateAdded: "2024-03-20" },
    { id: "ING011", name: "Sertraline", casNumber: "79617-96-2", formula: "C₁₇H₁₇Cl₂N", molarMass: 306.23, category: "Principe actif", subCategory: "Antidépresseur ISRS", riskClass: "Modéré", solubility: "Peu soluble", supplier: "Torrent Pharma", status: "Actif", dateAdded: "2024-04-01" },
    { id: "ING012", name: "Diclofénac", casNumber: "15307-86-5", formula: "C₁₄H₁₁Cl₂NO₂", molarMass: 296.15, category: "Principe actif", subCategory: "AINS", riskClass: "Élevé", solubility: "0.0024 mg/mL", supplier: "Novartis API", status: "Actif", dateAdded: "2024-04-05" },
    { id: "ING013", name: "Prednisolone", casNumber: "50-24-8", formula: "C₂₁H₂₈O₅", molarMass: 360.44, category: "Principe actif", subCategory: "Corticostéroïde", riskClass: "Élevé", solubility: "0.223 mg/mL", supplier: "Pfizer API", status: "Actif", dateAdded: "2024-04-10" },
    { id: "ING014", name: "Vitamine C", casNumber: "50-81-7", formula: "C₆H₈O₆", molarMass: 176.12, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", solubility: "330 mg/mL", supplier: "DSM Nutritional", status: "Actif", dateAdded: "2024-04-15" },
    { id: "ING015", name: "Tramadol", casNumber: "27203-92-5", formula: "C₁₆H₂₅NO₂", molarMass: 263.38, category: "Principe actif", subCategory: "Analgésique opioïde", riskClass: "Élevé", solubility: "Soluble", supplier: "Grünenthal", status: "En révision", dateAdded: "2024-04-20" },
    // Excipients
    { id: "ING016", name: "Lactose monohydrate", casNumber: "64044-51-5", formula: "C₁₂H₂₂O₁₁·H₂O", molarMass: 360.31, category: "Excipient", subCategory: "Diluant", riskClass: "Faible", solubility: "195 mg/mL", supplier: "DFE Pharma", status: "Actif", dateAdded: "2024-01-10" },
    { id: "ING017", name: "Cellulose microcristalline", casNumber: "9004-34-6", formula: "(C₆H₁₀O₅)ₙ", molarMass: 0, category: "Excipient", subCategory: "Liant / Diluant", riskClass: "Faible", solubility: "Insoluble", supplier: "FMC BioPolymer", status: "Actif", dateAdded: "2024-01-10" },
    { id: "ING018", name: "Stéarate de magnésium", casNumber: "557-04-0", formula: "C₃₆H₇₀MgO₄", molarMass: 591.27, category: "Excipient", subCategory: "Lubrifiant", riskClass: "Faible", solubility: "Insoluble", supplier: "Peter Greven", status: "Actif", dateAdded: "2024-01-10" },
    { id: "ING019", name: "Povidone K30", casNumber: "9003-39-8", formula: "(C₆H₉NO)ₙ", molarMass: 0, category: "Excipient", subCategory: "Liant", riskClass: "Faible", solubility: "Soluble", supplier: "Ashland", status: "Actif", dateAdded: "2024-01-10" },
    { id: "ING020", name: "Amidon de maïs", casNumber: "9005-25-8", formula: "(C₆H₁₀O₅)ₙ", molarMass: 0, category: "Excipient", subCategory: "Désintégrant", riskClass: "Faible", solubility: "Insoluble", supplier: "Roquette Frères", status: "Actif", dateAdded: "2024-01-10" },
    { id: "ING021", name: "Talc pharmaceutique", casNumber: "14807-96-6", formula: "Mg₃Si₄O₁₀(OH)₂", molarMass: 379.27, category: "Excipient", subCategory: "Anti-adhérent", riskClass: "Faible", solubility: "Insoluble", supplier: "Imerys", status: "Actif", dateAdded: "2024-02-01" },
    { id: "ING022", name: "Dioxyde de titane", casNumber: "13463-67-7", formula: "TiO₂", molarMass: 79.87, category: "Excipient", subCategory: "Colorant / Opacifiant", riskClass: "Faible", solubility: "Insoluble", supplier: "Kronos International", status: "En révision", dateAdded: "2024-02-01" },
    { id: "ING023", name: "Gélatine", casNumber: "9000-70-8", formula: "Protéine complexe", molarMass: 0, category: "Excipient", subCategory: "Matériau de capsule", riskClass: "Faible", solubility: "Soluble (eau chaude)", supplier: "Gelita AG", status: "Actif", dateAdded: "2024-02-01" },
    { id: "ING024", name: "HPMC (Hypromellose)", casNumber: "9004-65-3", formula: "Polymère cellulosique", molarMass: 0, category: "Excipient", subCategory: "Agent filmogène", riskClass: "Faible", solubility: "Soluble (eau froide)", supplier: "Shin-Etsu", status: "Actif", dateAdded: "2024-03-01" },
    { id: "ING025", name: "Glycérol", casNumber: "56-81-5", formula: "C₃H₈O₃", molarMass: 92.09, category: "Excipient", subCategory: "Humectant", riskClass: "Faible", solubility: "Miscible", supplier: "Oleon NV", status: "Actif", dateAdded: "2024-03-01" },
    // Solvents
    { id: "ING026", name: "Eau purifiée (PPI)", casNumber: "7732-18-5", formula: "H₂O", molarMass: 18.02, category: "Solvant", subCategory: "Véhicule aqueux", riskClass: "Faible", solubility: "N/A", supplier: "Production interne", status: "Actif", dateAdded: "2024-01-05" },
    { id: "ING027", name: "Éthanol 96%", casNumber: "64-17-5", formula: "C₂H₅OH", molarMass: 46.07, category: "Solvant", subCategory: "Co-solvant", riskClass: "Modéré", solubility: "Miscible", supplier: "Cristalco", status: "Actif", dateAdded: "2024-01-05" },
    { id: "ING028", name: "Propylène glycol", casNumber: "57-55-6", formula: "C₃H₈O₂", molarMass: 76.09, category: "Solvant", subCategory: "Co-solvant", riskClass: "Modéré", solubility: "Miscible", supplier: "Dow Chemical", status: "Actif", dateAdded: "2024-01-05" },
    // Preservatives
    { id: "ING029", name: "Méthylparaben", casNumber: "99-76-3", formula: "C₈H₈O₃", molarMass: 152.15, category: "Conservateur", subCategory: "Antimicrobien", riskClass: "Faible", solubility: "2.5 mg/mL", supplier: "Sharon Laboratories", status: "Actif", dateAdded: "2024-02-15" },
    { id: "ING030", name: "Sorbate de potassium", casNumber: "24634-61-5", formula: "C₆H₇KO₂", molarMass: 150.22, category: "Conservateur", subCategory: "Antimicrobien", riskClass: "Faible", solubility: "Soluble", supplier: "Nantong Acetic Acid", status: "Actif", dateAdded: "2024-02-15" },
    // More active ingredients
    { id: "ING031", name: "Aspirine", casNumber: "50-78-2", formula: "C₉H₈O₄", molarMass: 180.16, category: "Principe actif", subCategory: "AINS / Antiagrégant", riskClass: "Modéré", solubility: "3 mg/mL", supplier: "Rhodia", status: "Actif", dateAdded: "2024-05-01" },
    { id: "ING032", name: "Ciprofloxacine", casNumber: "85721-33-1", formula: "C₁₇H₁₈FN₃O₃", molarMass: 331.34, category: "Principe actif", subCategory: "Antibiotique fluoroquinolone", riskClass: "Élevé", solubility: "30 mg/mL (pH 5)", supplier: "Bayer API", status: "Actif", dateAdded: "2024-05-05" },
    { id: "ING033", name: "Doxycycline", casNumber: "564-25-0", formula: "C₂₂H₂₄N₂O₈", molarMass: 444.43, category: "Principe actif", subCategory: "Antibiotique tétracycline", riskClass: "Modéré", solubility: "Soluble", supplier: "Hovione", status: "Actif", dateAdded: "2024-05-10" },
    { id: "ING034", name: "Métronidazole", casNumber: "443-48-1", formula: "C₆H₉N₃O₃", molarMass: 171.15, category: "Principe actif", subCategory: "Antibiotique / Antiparasitaire", riskClass: "Modéré", solubility: "10 mg/mL", supplier: "Aarti Industries", status: "Actif", dateAdded: "2024-05-15" },
    { id: "ING035", name: "Loratadine", casNumber: "79794-75-5", formula: "C₂₂H₂₃ClN₂O₂", molarMass: 382.88, category: "Principe actif", subCategory: "Antihistaminique H1", riskClass: "Faible", solubility: "Insoluble", supplier: "Schering-Plough", status: "Actif", dateAdded: "2024-05-20" },
    { id: "ING036", name: "Diazépam", casNumber: "439-14-5", formula: "C₁₆H₁₃ClN₂O", molarMass: 284.74, category: "Principe actif", subCategory: "Benzodiazépine", riskClass: "Élevé", solubility: "0.05 mg/mL", supplier: "Roche API", status: "Actif", dateAdded: "2024-06-01" },
    { id: "ING037", name: "Morphine sulfate", casNumber: "64-31-3", formula: "C₁₇H₁₉NO₃", molarMass: 285.34, category: "Principe actif", subCategory: "Opioïde majeur", riskClass: "Très élevé", solubility: "Soluble", supplier: "Johnson Matthey", status: "En révision", dateAdded: "2024-06-05" },
    { id: "ING038", name: "Codéine phosphate", casNumber: "52-28-8", formula: "C₁₈H₂₁NO₃", molarMass: 299.36, category: "Principe actif", subCategory: "Opioïde / Antitussif", riskClass: "Élevé", solubility: "Soluble", supplier: "Francopia", status: "Actif", dateAdded: "2024-06-10" },
    { id: "ING039", name: "Lopéramide", casNumber: "53179-11-6", formula: "C₂₉H₃₃ClN₂O₂", molarMass: 477.04, category: "Principe actif", subCategory: "Antidiarrhéique", riskClass: "Faible", solubility: "Insoluble", supplier: "Janssen Pharma", status: "Actif", dateAdded: "2024-06-15" },
    { id: "ING040", name: "Vitamine D3", casNumber: "67-97-0", formula: "C₂₇H₄₄O", molarMass: 384.64, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", solubility: "Insoluble", supplier: "DSM Nutritional", status: "Actif", dateAdded: "2024-07-01" },
    { id: "ING041", name: "Bétaméthasone", casNumber: "378-44-9", formula: "C₂₂H₂₉FO₅", molarMass: 392.46, category: "Principe actif", subCategory: "Corticostéroïde", riskClass: "Élevé", solubility: "0.06 mg/mL", supplier: "MSD API", status: "Actif", dateAdded: "2024-07-05" },
    { id: "ING042", name: "Chlorure de benzalkonium", casNumber: "8001-54-5", formula: "Mélange", molarMass: 0, category: "Conservateur", subCategory: "Antiseptique cationique", riskClass: "Faible", solubility: "Soluble", supplier: "Lonza Group", status: "Actif", dateAdded: "2024-07-10" },
    { id: "ING043", name: "Croscarmellose sodique", casNumber: "74811-65-7", formula: "Polymère", molarMass: 0, category: "Excipient", subCategory: "Super-désintégrant", riskClass: "Faible", solubility: "Gonfle dans l'eau", supplier: "FMC BioPolymer", status: "Actif", dateAdded: "2024-07-15" },
    { id: "ING044", name: "Silice colloïdale", casNumber: "7631-86-9", formula: "SiO₂", molarMass: 60.08, category: "Excipient", subCategory: "Glissant / Anti-adhérent", riskClass: "Faible", solubility: "Insoluble", supplier: "Evonik", status: "Actif", dateAdded: "2024-07-20" },
    { id: "ING045", name: "Vitamine B12", casNumber: "68-19-9", formula: "C₆₃H₈₈CoN₁₄O₁₄P", molarMass: 1355.37, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", solubility: "12.5 mg/mL", supplier: "Sanofi Chimie", status: "Actif", dateAdded: "2024-08-01" },
];

export const FORMULATIONS: Formulation[] = [
    {
        id: "FORM001", name: "Doliprane 500mg", type: "Comprimé", indication: "Douleur, Fièvre", status: "Production",
        ingredients: [
            { ingredientId: "ING001", dosage: "500", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING016", dosage: "80", unit: "mg", role: "Diluant" },
            { ingredientId: "ING017", dosage: "60", unit: "mg", role: "Liant" },
            { ingredientId: "ING018", dosage: "5", unit: "mg", role: "Lubrifiant" },
            { ingredientId: "ING020", dosage: "30", unit: "mg", role: "Désintégrant" },
        ]
    },
    {
        id: "FORM002", name: "Augmentin 1g/125mg", type: "Comprimé pelliculé", indication: "Infections bactériennes", status: "Production",
        ingredients: [
            { ingredientId: "ING003", dosage: "1000", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING017", dosage: "100", unit: "mg", role: "Liant" },
            { ingredientId: "ING018", dosage: "8", unit: "mg", role: "Lubrifiant" },
            { ingredientId: "ING024", dosage: "15", unit: "mg", role: "Agent filmogène" },
            { ingredientId: "ING022", dosage: "3", unit: "mg", role: "Opacifiant" },
        ]
    },
    {
        id: "FORM003", name: "Mopral 20mg", type: "Gélule gastro-résistante", indication: "RGO, Ulcère gastrique", status: "Production",
        ingredients: [
            { ingredientId: "ING004", dosage: "20", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING016", dosage: "50", unit: "mg", role: "Remplissage" },
            { ingredientId: "ING023", dosage: "120", unit: "mg", role: "Enveloppe capsule" },
            { ingredientId: "ING024", dosage: "20", unit: "mg", role: "Enrobage gastro-résistant" },
        ]
    },
    {
        id: "FORM004", name: "Glucophage 850mg", type: "Comprimé pelliculé", indication: "Diabète type 2", status: "Production",
        ingredients: [
            { ingredientId: "ING005", dosage: "850", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING019", dosage: "40", unit: "mg", role: "Liant" },
            { ingredientId: "ING018", dosage: "6", unit: "mg", role: "Lubrifiant" },
            { ingredientId: "ING024", dosage: "10", unit: "mg", role: "Agent d'enrobage" },
        ]
    },
    {
        id: "FORM005", name: "Tahor 40mg", type: "Comprimé", indication: "Hypercholestérolémie", status: "Production",
        ingredients: [
            { ingredientId: "ING006", dosage: "40", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING016", dosage: "70", unit: "mg", role: "Diluant" },
            { ingredientId: "ING017", dosage: "50", unit: "mg", role: "Liant" },
            { ingredientId: "ING043", dosage: "15", unit: "mg", role: "Désintégrant" },
            { ingredientId: "ING018", dosage: "4", unit: "mg", role: "Lubrifiant" },
        ]
    },
    {
        id: "FORM006", name: "Zithromax 250mg", type: "Gélule", indication: "Infections respiratoires", status: "Production",
        ingredients: [
            { ingredientId: "ING008", dosage: "250", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING016", dosage: "60", unit: "mg", role: "Diluant" },
            { ingredientId: "ING023", dosage: "100", unit: "mg", role: "Enveloppe" },
            { ingredientId: "ING018", dosage: "3", unit: "mg", role: "Lubrifiant" },
        ]
    },
    {
        id: "FORM007", name: "Zyrtec 10mg", type: "Comprimé pelliculé", indication: "Allergie, Rhinite", status: "Production",
        ingredients: [
            { ingredientId: "ING009", dosage: "10", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING017", dosage: "65", unit: "mg", role: "Liant" },
            { ingredientId: "ING016", dosage: "55", unit: "mg", role: "Diluant" },
            { ingredientId: "ING018", dosage: "3", unit: "mg", role: "Lubrifiant" },
            { ingredientId: "ING024", dosage: "8", unit: "mg", role: "Enrobage film" },
        ]
    },
    {
        id: "FORM008", name: "Sérum vitaminé injectable", type: "Solution injectable", indication: "Carence vitaminique", status: "Développement",
        ingredients: [
            { ingredientId: "ING014", dosage: "500", unit: "mg", role: "Principe actif" },
            { ingredientId: "ING045", dosage: "1", unit: "mg", role: "Cofacteur" },
            { ingredientId: "ING026", dosage: "5", unit: "mL", role: "Véhicule" },
        ]
    },
];

export const ACTIVITIES: Activity[] = [
    { id: "ACT001", action: "Classification IA", target: "Paracétamol", user: "Dr. Benali", timestamp: "Il y a 5 min", color: "var(--accent-primary)" },
    { id: "ACT002", action: "Ajout ingrédient", target: "Croscarmellose sodique", user: "Dr. Khelifi", timestamp: "Il y a 15 min", color: "var(--accent-secondary)" },
    { id: "ACT003", action: "Mise à jour formulation", target: "Doliprane 500mg", user: "Dr. Benali", timestamp: "Il y a 1h", color: "var(--accent-warm)" },
    { id: "ACT004", action: "Revue de risque", target: "Morphine sulfate", user: "Dr. Mansouri", timestamp: "Il y a 2h", color: "var(--accent-rose)" },
    { id: "ACT005", action: "Export données", target: "Rapport Q1 2024", user: "Dr. Khelifi", timestamp: "Il y a 3h", color: "var(--accent-tertiary)" },
    { id: "ACT006", action: "Classification IA batch", target: "12 composés", user: "Système", timestamp: "Il y a 5h", color: "var(--accent-primary)" },
    { id: "ACT007", action: "Archivage", target: "Dioxyde de titane", user: "Dr. Mansouri", timestamp: "Hier", color: "var(--text-tertiary)" },
];

// Helper: get ingredient by ID
export function getIngredientById(id: string): Ingredient | undefined {
    return INGREDIENTS.find(i => i.id === id);
}

// Helper: get category colors
export function getCategoryBadgeClass(category: string): string {
    switch (category) {
        case 'Principe actif': return 'badge-teal';
        case 'Excipient': return 'badge-blue';
        case 'Solvant': return 'badge-purple';
        case 'Conservateur': return 'badge-amber';
        default: return 'badge-gray';
    }
}

export function getRiskBadgeClass(risk: string): string {
    switch (risk) {
        case 'Faible': return 'badge-green';
        case 'Modéré': return 'badge-amber';
        case 'Élevé': return 'badge-rose';
        case 'Très élevé': return 'badge-rose';
        default: return 'badge-gray';
    }
}

export function getStatusBadgeClass(status: string): string {
    switch (status) {
        case 'Actif':
        case 'Production': return 'badge-green';
        case 'En révision':
        case 'Développement': return 'badge-amber';
        case 'Archivé':
        case 'Suspendu': return 'badge-gray';
        default: return 'badge-gray';
    }
}
