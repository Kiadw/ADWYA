import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured', fallback: true },
        { status: 200 }
      );
    }

    if (type === 'classify') {
      // Enhanced classification using GPT
      const { ingredientName } = data;
      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert pharmacien et chimiste. Tu dois classifier un ingrédient pharmaceutique et fournir une analyse détaillée.
Réponds UNIQUEMENT en JSON avec cette structure exacte:
{
  "category": "Principe actif|Excipient|Solvant|Conservateur",
  "subCategory": "sous-catégorie précise",
  "riskClass": "Faible|Modéré|Élevé|Très élevé",
  "pharmacologicalAction": "mécanisme d'action",
  "description": "description détaillée en français",
  "commonUses": ["usage1", "usage2"],
  "interactions": ["interaction médicamenteuse 1", "interaction 2"],
  "contraindications": ["contre-indication 1"],
  "dosageRange": "plage posologique standard",
  "storageConditions": "conditions de conservation"
}`
          },
          {
            role: 'user',
            content: `Classifie et analyse l'ingrédient pharmaceutique suivant: "${ingredientName}"`
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```/g, '').trim());

      return NextResponse.json({
        ...parsed,
        model: 'gpt-4o-mini',
        source: 'openai',
      });

    } else if (type === 'molecule-analysis') {
      // Deep molecular analysis using GPT
      const { smiles, moleculeName } = data;
      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en chimie médicinale et pharmacologie. Analyse la molécule donnée et fournis une expertise approfondie.
Réponds UNIQUEMENT en JSON:
{
  "druglikeness_score": 0-100,
  "synthetic_accessibility": "Facile|Modérée|Difficile",
  "therapeutic_potential": "description",
  "toxicity_prediction": {
    "hepatotoxicity": "Faible|Modéré|Élevé",
    "cardiotoxicity": "Faible|Modéré|Élevé",
    "mutagenicity": "Faible|Modéré|Élevé"
  },
  "metabolism": {
    "primary_enzymes": ["CYP3A4", "CYP2D6"],
    "half_life_estimate": "estimation",
    "bioavailability": "estimation %"
  },
  "formulation_suggestions": ["suggestion 1", "suggestion 2"],
  "regulatory_notes": "notes réglementaires",
  "similar_approved_drugs": ["médicament similaire approuvé"]
}`
          },
          {
            role: 'user',
            content: `Analyse cette molécule${moleculeName ? ` (${moleculeName})` : ''} avec SMILES: ${smiles}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```/g, '').trim());

      return NextResponse.json({
        ...parsed,
        model: 'gpt-4o-mini',
        source: 'openai',
      });

    } else if (type === 'formulation-check') {
      // Formulation compatibility check
      const { ingredients } = data;
      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en formulation galénique. Analyse la compatibilité des ingrédients d'une formulation pharmaceutique.
Réponds UNIQUEMENT en JSON:
{
  "compatibility_score": 0-100,
  "interactions": [
    {"pair": ["ingrédient A", "ingrédient B"], "type": "Incompatibilité|Synergie|Neutre", "detail": "explication"}
  ],
  "stability_prediction": "Stable|Instable|Conditionnelle",
  "storage_recommendation": "recommandation",
  "shelf_life_estimate": "estimation durée de conservation"
}`
          },
          {
            role: 'user',
            content: `Analyse la compatibilité de cette formulation: ${JSON.stringify(ingredients)}`
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```/g, '').trim());

      return NextResponse.json({
        ...parsed,
        model: 'gpt-4o-mini',
        source: 'openai',
      });
    }

    return NextResponse.json({ error: 'Unknown analysis type' }, { status: 400 });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: error.message, fallback: true },
      { status: 200 }
    );
  }
}
