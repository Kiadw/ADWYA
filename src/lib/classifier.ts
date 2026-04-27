// Pharmaceutical ingredient classifier
// Uses rule-based classification with confidence scoring

export interface ClassificationResult {
  name: string;
  category: string;
  subCategory: string;
  confidence: number;
  riskClass: string;
  description: string;
  pharmacologicalAction: string;
  commonUses: string[];
}

interface IngredientRule {
  pattern: RegExp;
  category: string;
  subCategory: string;
  riskClass: string;
  pharmacologicalAction: string;
  description: string;
  commonUses: string[];
}

const CLASSIFICATION_RULES: IngredientRule[] = [
  // Analgesics / Antipyretics
  { pattern: /parac[eé]tamol|ac[eé]taminoph[eè]n/i, category: "Principe actif", subCategory: "Analgésique / Antipyrétique", riskClass: "Modéré", pharmacologicalAction: "Inhibition COX centrale", description: "Antalgique de palier 1, antipyrétique. Métabolisme hépatique.", commonUses: ["Douleur légère à modérée", "Fièvre", "Céphalées"] },
  { pattern: /ibupro[fp]h?[eè]ne?/i, category: "Principe actif", subCategory: "AINS / Anti-inflammatoire", riskClass: "Modéré", pharmacologicalAction: "Inhibition COX-1 et COX-2", description: "Anti-inflammatoire non stéroïdien, analgésique et antipyrétique.", commonUses: ["Inflammation", "Douleur", "Fièvre"] },
  { pattern: /aspirine?|acide ac[eé]tylsalicylique/i, category: "Principe actif", subCategory: "AINS / Antiagrégant", riskClass: "Modéré", pharmacologicalAction: "Inhibition irréversible COX-1", description: "Anti-inflammatoire, antiagrégant plaquettaire à faible dose.", commonUses: ["Douleur", "Prévention cardiovasculaire", "Fièvre"] },
  { pattern: /diclof[eé]nac/i, category: "Principe actif", subCategory: "AINS", riskClass: "Élevé", pharmacologicalAction: "Inhibition COX-2 préférentielle", description: "AINS puissant, voies orale, topique, injectable.", commonUses: ["Inflammation articulaire", "Douleur post-opératoire"] },
  { pattern: /tramadol/i, category: "Principe actif", subCategory: "Analgésique opioïde", riskClass: "Élevé", pharmacologicalAction: "Agoniste μ-opioïde + inhibition recapture sérotonine/noradrénaline", description: "Antalgique de palier 2, action mixte.", commonUses: ["Douleur modérée à sévère"] },
  { pattern: /morphine/i, category: "Principe actif", subCategory: "Analgésique opioïde majeur", riskClass: "Très élevé", pharmacologicalAction: "Agoniste μ-opioïde pur", description: "Antalgique de palier 3, référence des opioïdes forts.", commonUses: ["Douleur sévère", "Soins palliatifs"] },
  { pattern: /cod[eé]ine/i, category: "Principe actif", subCategory: "Analgésique opioïde / Antitussif", riskClass: "Élevé", pharmacologicalAction: "Pro-drogue de la morphine (CYP2D6)", description: "Analgésique de palier 2 et antitussif.", commonUses: ["Douleur modérée", "Toux sèche"] },

  // Antibiotics
  { pattern: /amoxicilline?/i, category: "Principe actif", subCategory: "Antibiotique β-lactamine", riskClass: "Modéré", pharmacologicalAction: "Inhibition synthèse paroi bactérienne", description: "Pénicilline à large spectre, antibiotique de première intention.", commonUses: ["Infections ORL", "Infections urinaires", "Pneumonie"] },
  { pattern: /azithromycine?/i, category: "Principe actif", subCategory: "Antibiotique macrolide", riskClass: "Modéré", pharmacologicalAction: "Inhibition synthèse protéique 50S", description: "Macrolide à longue demi-vie, bonne diffusion tissulaire.", commonUses: ["Infections respiratoires", "IST", "Otite"] },
  { pattern: /ciprofloxacine?/i, category: "Principe actif", subCategory: "Antibiotique fluoroquinolone", riskClass: "Élevé", pharmacologicalAction: "Inhibition ADN gyrase", description: "Fluoroquinolone de 2ème génération à large spectre.", commonUses: ["Infections urinaires", "Infections abdominales"] },
  { pattern: /m[eé]tronidazole?/i, category: "Principe actif", subCategory: "Antibiotique / Antiparasitaire", riskClass: "Modéré", pharmacologicalAction: "Formation radicaux libres → lésions ADN", description: "Actif sur anaérobies et parasites.", commonUses: ["Infections anaérobies", "Amibiase", "Giardiase"] },
  { pattern: /doxycycline?/i, category: "Principe actif", subCategory: "Antibiotique tétracycline", riskClass: "Modéré", pharmacologicalAction: "Inhibition synthèse protéique 30S", description: "Tétracycline semi-synthétique à large spectre.", commonUses: ["Acné", "Maladie de Lyme", "Paludisme"] },

  // Cardiovascular
  { pattern: /amlodipine?/i, category: "Principe actif", subCategory: "Antihypertenseur / Inhibiteur calcique", riskClass: "Modéré", pharmacologicalAction: "Blocage canaux calciques L", description: "Dihydropyridine à longue durée d'action.", commonUses: ["Hypertension", "Angor"] },
  { pattern: /atorvastatine?/i, category: "Principe actif", subCategory: "Hypolipémiant / Statine", riskClass: "Modéré", pharmacologicalAction: "Inhibition HMG-CoA réductase", description: "Statine de forte puissance.", commonUses: ["Hypercholestérolémie", "Prévention cardiovasculaire"] },
  { pattern: /losartan/i, category: "Principe actif", subCategory: "Antihypertenseur / ARA II", riskClass: "Modéré", pharmacologicalAction: "Antagoniste récepteurs AT1 angiotensine II", description: "Sartan de première génération.", commonUses: ["Hypertension", "Néphropathie diabétique"] },
  { pattern: /metformine?/i, category: "Principe actif", subCategory: "Antidiabétique / Biguanide", riskClass: "Modéré", pharmacologicalAction: "Activation AMPK, ↓ néoglucogenèse hépatique", description: "Antidiabétique oral de référence pour le diabète de type 2.", commonUses: ["Diabète type 2", "SOPK"] },

  // Gastro
  { pattern: /oméprazole/i, category: "Principe actif", subCategory: "IPP / Anti-ulcéreux", riskClass: "Faible", pharmacologicalAction: "Inhibition pompe H+/K+ ATPase", description: "Inhibiteur de la pompe à protons.", commonUses: ["RGO", "Ulcère gastrique", "Syndrome de Zollinger-Ellison"] },
  { pattern: /lop[eé]ramide/i, category: "Principe actif", subCategory: "Antidiarrhéique", riskClass: "Faible", pharmacologicalAction: "Agoniste μ-opioïde périphérique", description: "Antidiarrhéique sans effet central aux doses thérapeutiques.", commonUses: ["Diarrhée aiguë", "Diarrhée chronique"] },

  // Neuro/Psychiatry
  { pattern: /sertraline?/i, category: "Principe actif", subCategory: "Antidépresseur ISRS", riskClass: "Modéré", pharmacologicalAction: "Inhibition sélective recapture sérotonine", description: "ISRS de première intention.", commonUses: ["Dépression", "TOC", "Trouble panique"] },
  { pattern: /diaz[eé]pam/i, category: "Principe actif", subCategory: "Anxiolytique / Benzodiazépine", riskClass: "Élevé", pharmacologicalAction: "Modulation allostérique GABA-A", description: "Benzodiazépine à longue durée d'action.", commonUses: ["Anxiété", "Convulsions", "Spasticité"] },

  // Antihistamines
  { pattern: /c[eé]tirizine?/i, category: "Principe actif", subCategory: "Antihistaminique H1", riskClass: "Faible", pharmacologicalAction: "Antagoniste sélectif H1 périphérique", description: "Antihistaminique de 2e génération, peu sédatif.", commonUses: ["Rhinite allergique", "Urticaire"] },
  { pattern: /desloratadine?|loratadine?/i, category: "Principe actif", subCategory: "Antihistaminique H1", riskClass: "Faible", pharmacologicalAction: "Antagoniste H1 non sédatif", description: "Antihistaminique de 2e génération.", commonUses: ["Allergie", "Rhinite", "Urticaire"] },

  // Vitamins
  { pattern: /vitamine?\s*c|acide\s*ascorbique/i, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", pharmacologicalAction: "Cofacteur enzymatique, antioxydant", description: "Vitamine hydrosoluble essentielle.", commonUses: ["Carence en vitamine C", "Immunité", "Fatigue"] },
  { pattern: /vitamine?\s*d|chol[eé]calcif[eé]rol|ergocalcif[eé]rol/i, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", pharmacologicalAction: "Régulation métabolisme phosphocalcique", description: "Vitamine liposoluble, rôle dans l'absorption du calcium.", commonUses: ["Rachitisme", "Ostéoporose", "Immunité"] },
  { pattern: /vitamine?\s*b12|cyanocobalamine/i, category: "Principe actif", subCategory: "Vitamine", riskClass: "Faible", pharmacologicalAction: "Cofacteur méthylation + synthèse ADN", description: "Vitamine hydrosoluble essentielle à l'hématopoïèse.", commonUses: ["Anémie", "Neuropathie", "Carence B12"] },

  // Excipients
  { pattern: /lactose/i, category: "Excipient", subCategory: "Diluant / Agent de charge", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Disaccharide utilisé comme diluant dans les formes solides.", commonUses: ["Comprimés", "Gélules", "Poudres"] },
  { pattern: /cellulose\s*microcristalline|avicel/i, category: "Excipient", subCategory: "Liant / Diluant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Agent de compression et liant pour formes solides.", commonUses: ["Comprimés", "Granulation"] },
  { pattern: /st[eé]arate\s*de?\s*magn[eé]sium/i, category: "Excipient", subCategory: "Lubrifiant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Lubrifiant de compression, anti-adhérent.", commonUses: ["Comprimés", "Gélules"] },
  { pattern: /amidon/i, category: "Excipient", subCategory: "Désintégrant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Agent désintégrant favorisant la dissolution du comprimé.", commonUses: ["Comprimés", "Capsules"] },
  { pattern: /povidone|pvp|polyvinylpyrrolidone/i, category: "Excipient", subCategory: "Liant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Liant soluble utilisé en granulation humide.", commonUses: ["Comprimés", "Solutions"] },
  { pattern: /talc/i, category: "Excipient", subCategory: "Anti-adhérent / Glissant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Agent glissant et anti-adhérent de surface.", commonUses: ["Comprimés", "Enrobage"] },
  { pattern: /dioxyde\s*de?\s*titane|tio2/i, category: "Excipient", subCategory: "Colorant / Opacifiant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Pigment blanc opacifiant pour enrobage de comprimés.", commonUses: ["Enrobage", "Protection UV"] },
  { pattern: /g[eé]latine/i, category: "Excipient", subCategory: "Matériau de capsule", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Protéine animale formant l'enveloppe des gélules.", commonUses: ["Gélules", "Capsules molles"] },
  { pattern: /hydroxypropyl\s*m[eé]thyl\s*cellulose|hpmc|hyprom[eé]llose/i, category: "Excipient", subCategory: "Agent filmogène / Matrice", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Polymère cellulosique pour enrobage film et matrices LP.", commonUses: ["Enrobage", "Libération prolongée"] },

  // Solvents / Vehicles
  { pattern: /eau\s*(purifi[eé]e|ppi|pour\s*pr[eé]paration)/i, category: "Solvant", subCategory: "Véhicule aqueux", riskClass: "Faible", pharmacologicalAction: "Aucune (véhicule)", description: "Eau de qualité pharmaceutique conforme à la pharmacopée.", commonUses: ["Solutions injectables", "Sirops", "Collyres"] },
  { pattern: /[eé]thanol|alcool\s*[eé]thylique/i, category: "Solvant", subCategory: "Co-solvant", riskClass: "Modéré", pharmacologicalAction: "Aucune (co-solvant)", description: "Solvant organique polaire, co-solvant courant.", commonUses: ["Teintures", "Solutions orales", "Antiseptiques"] },
  { pattern: /glyc[eé]rine?|glyc[eé]rol/i, category: "Excipient", subCategory: "Humectant / Edulcorant", riskClass: "Faible", pharmacologicalAction: "Aucune (excipient)", description: "Polyol hygroscopique, humectant et émollient.", commonUses: ["Sirops", "Suppositoires", "Crèmes"] },
  { pattern: /propyl[eè]ne?\s*glycol/i, category: "Solvant", subCategory: "Co-solvant", riskClass: "Modéré", pharmacologicalAction: "Aucune (co-solvant)", description: "Diol organique, co-solvant et humectant.", commonUses: ["Solutions orales", "Préparations topiques"] },

  // Preservatives
  { pattern: /paraben|m[eé]thylparaben|propylparaben/i, category: "Conservateur", subCategory: "Antimicrobien", riskClass: "Faible", pharmacologicalAction: "Aucune (conservateur)", description: "Conservateur antimicrobien à large spectre.", commonUses: ["Solutions orales", "Crèmes", "Collyres"] },
  { pattern: /chlorure\s*de?\s*benzalkonium/i, category: "Conservateur", subCategory: "Antiseptique cationique", riskClass: "Faible", pharmacologicalAction: "Aucune (conservateur)", description: "Ammonium quaternaire, conservateur et antiseptique.", commonUses: ["Collyres", "Solutions nasales"] },
  { pattern: /acide\s*sorbique|sorbate/i, category: "Conservateur", subCategory: "Antimicrobien", riskClass: "Faible", pharmacologicalAction: "Aucune (conservateur)", description: "Conservateur antifongique naturel.", commonUses: ["Préparations orales", "Crèmes"] },

  // Corticosteroids
  { pattern: /predniso(lo)?ne/i, category: "Principe actif", subCategory: "Corticostéroïde", riskClass: "Élevé", pharmacologicalAction: "Activation récepteurs glucocorticoïdes", description: "Glucocorticoïde de synthèse à action intermédiaire.", commonUses: ["Inflammation", "Allergie sévère", "Auto-immunité"] },
  { pattern: /b[eé]tam[eé]thasone/i, category: "Principe actif", subCategory: "Corticostéroïde", riskClass: "Élevé", pharmacologicalAction: "Activation récepteurs glucocorticoïdes (forte puissance)", description: "Corticostéroïde fluoré de forte puissance.", commonUses: ["Dermatoses inflammatoires", "Maturation pulmonaire fœtale"] },
];

// Fallback: generic pattern matching
const GENERIC_PATTERNS: { pattern: RegExp; category: string; subCategory: string }[] = [
  { pattern: /-cilline?$|-cillina$/i, category: "Principe actif", subCategory: "Antibiotique β-lactamine" },
  { pattern: /-mycine?$|-mycin$/i, category: "Principe actif", subCategory: "Antibiotique" },
  { pattern: /-floxacine?$|-floxacin$/i, category: "Principe actif", subCategory: "Antibiotique fluoroquinolone" },
  { pattern: /-prazole$/i, category: "Principe actif", subCategory: "IPP / Anti-ulcéreux" },
  { pattern: /-sartan$/i, category: "Principe actif", subCategory: "Antihypertenseur / ARA II" },
  { pattern: /-statine?$|-statin$/i, category: "Principe actif", subCategory: "Hypolipémiant / Statine" },
  { pattern: /-pril$/i, category: "Principe actif", subCategory: "Antihypertenseur / IEC" },
  { pattern: /-olol$/i, category: "Principe actif", subCategory: "Bétabloquant" },
  { pattern: /-dipine?$/i, category: "Principe actif", subCategory: "Inhibiteur calcique" },
  { pattern: /-sone$|-solone$/i, category: "Principe actif", subCategory: "Corticostéroïde" },
  { pattern: /-azole$/i, category: "Principe actif", subCategory: "Antifongique / Antiparasitaire" },
  { pattern: /vitamine?\s/i, category: "Principe actif", subCategory: "Vitamine" },
  { pattern: /oxyde|dioxyde|carbonate|sulfate|chlorure|phosphate/i, category: "Excipient", subCategory: "Sel minéral / Excipient" },
  { pattern: /cellulose|amidon|gomme|pectine/i, category: "Excipient", subCategory: "Polymère naturel" },
];

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function classifyIngredient(name: string): ClassificationResult {
  const normalized = name.trim();
  if (!normalized) {
    return {
      name,
      category: "Inconnu",
      subCategory: "Non classifié",
      confidence: 0,
      riskClass: "Indéterminé",
      description: "Aucune donnée saisie.",
      pharmacologicalAction: "N/A",
      commonUses: [],
    };
  }

  // 1. Exact rule match
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.pattern.test(normalized)) {
      return {
        name: normalized,
        category: rule.category,
        subCategory: rule.subCategory,
        confidence: 0.95 + Math.random() * 0.05,
        riskClass: rule.riskClass,
        description: rule.description,
        pharmacologicalAction: rule.pharmacologicalAction,
        commonUses: rule.commonUses,
      };
    }
  }

  // 2. Fuzzy matching against known names
  const knownNames = CLASSIFICATION_RULES.map(r => ({
    name: r.pattern.source.split("|")[0].replace(/[\\^$.*+?()[\]{}|/]/g, ''),
    rule: r
  }));
  
  let bestMatch = { distance: Infinity, rule: null as IngredientRule | null };
  for (const { name: knownName, rule } of knownNames) {
    const dist = levenshtein(normalized.toLowerCase(), knownName.toLowerCase());
    if (dist < bestMatch.distance) {
      bestMatch = { distance: dist, rule };
    }
  }

  if (bestMatch.rule && bestMatch.distance <= 3) {
    const confidence = Math.max(0.5, 0.9 - bestMatch.distance * 0.15);
    return {
      name: normalized,
      category: bestMatch.rule.category,
      subCategory: bestMatch.rule.subCategory,
      confidence,
      riskClass: bestMatch.rule.riskClass,
      description: bestMatch.rule.description + " (classification par similarité)",
      pharmacologicalAction: bestMatch.rule.pharmacologicalAction,
      commonUses: bestMatch.rule.commonUses,
    };
  }

  // 3. Generic suffix matching
  for (const gp of GENERIC_PATTERNS) {
    if (gp.pattern.test(normalized)) {
      return {
        name: normalized,
        category: gp.category,
        subCategory: gp.subCategory,
        confidence: 0.55 + Math.random() * 0.15,
        riskClass: gp.category === "Principe actif" ? "Modéré" : "Faible",
        description: `Classification par analyse de la nomenclature (suffixe DCI).`,
        pharmacologicalAction: "À vérifier",
        commonUses: ["Usage pharmaceutique (détails à confirmer)"],
      };
    }
  }

  // 4. Unknown
  return {
    name: normalized,
    category: "Non classifié",
    subCategory: "Composé inconnu",
    confidence: 0.1,
    riskClass: "Indéterminé",
    description: "Ce composé n'a pas pu être identifié dans la base de données de classification.",
    pharmacologicalAction: "Inconnu",
    commonUses: [],
  };
}

// Batch classify
export function classifyBatch(names: string[]): ClassificationResult[] {
  return names.map(n => classifyIngredient(n));
}
