import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
}

// POST: Upload training file and create fine-tuning job
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const action = formData.get('action') as string;

    if (action === 'upload') {
      // Upload a JSONL file to OpenAI for fine-tuning
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Validate file extension
      if (!file.name.endsWith('.jsonl')) {
        return NextResponse.json(
          { error: 'Le fichier doit être au format JSONL (.jsonl)' },
          { status: 400 }
        );
      }

      // Read file content and validate JSONL format
      const content = await file.text();
      const lines = content.trim().split('\n');
      
      // Validate each line is valid JSON with the right structure
      const errors: string[] = [];
      lines.forEach((line, idx) => {
        try {
          const obj = JSON.parse(line);
          if (!obj.messages || !Array.isArray(obj.messages)) {
            errors.push(`Ligne ${idx + 1}: doit contenir un champ "messages" (array)`);
          } else {
            const roles = obj.messages.map((m: any) => m.role);
            if (!roles.includes('user') || !roles.includes('assistant')) {
              errors.push(`Ligne ${idx + 1}: doit contenir au minimum un message "user" et un "assistant"`);
            }
          }
        } catch {
          errors.push(`Ligne ${idx + 1}: JSON invalide`);
        }
      });

      if (errors.length > 0) {
        return NextResponse.json({
          error: 'Erreurs de validation JSONL',
          details: errors.slice(0, 10),
          totalErrors: errors.length,
        }, { status: 400 });
      }

      if (lines.length < 10) {
        return NextResponse.json({
          error: `Minimum 10 exemples requis (${lines.length} fournis). OpenAI recommande 50-100+ exemples pour des résultats optimaux.`,
        }, { status: 400 });
      }

      // Upload to OpenAI
      const blob = new Blob([content], { type: 'application/jsonl' });
      const uploadFile = new File([blob], file.name, { type: 'application/jsonl' });

      const uploadedFile = await getOpenAI().files.create({
        file: uploadFile,
        purpose: 'fine-tune',
      });

      return NextResponse.json({
        fileId: uploadedFile.id,
        filename: uploadedFile.filename,
        bytes: uploadedFile.bytes,
        status: uploadedFile.status,
        lineCount: lines.length,
        message: `Fichier uploadé avec succès (${lines.length} exemples d'entraînement)`,
      });

    } else if (action === 'start-training') {
      // Start a fine-tuning job
      const fileId = formData.get('fileId') as string;
      const suffix = formData.get('suffix') as string || 'adwya-pharma';
      const model = formData.get('model') as string || 'gpt-4o-mini';
      const epochs = parseInt(formData.get('epochs') as string || '3');

      if (!fileId) {
        return NextResponse.json({ error: 'fileId required' }, { status: 400 });
      }

      const job = await getOpenAI().fineTuning.jobs.create({
        training_file: fileId,
        model: model,
        suffix: suffix,
        hyperparameters: {
          n_epochs: epochs,
        },
      });

      return NextResponse.json({
        jobId: job.id,
        status: job.status,
        model: job.model,
        createdAt: job.created_at,
        message: 'Entraînement lancé avec succès',
      });

    } else if (action === 'list-jobs') {
      // List fine-tuning jobs
      const jobs = await getOpenAI().fineTuning.jobs.list({ limit: 20 });

      return NextResponse.json({
        jobs: jobs.data.map((job) => ({
          id: job.id,
          status: job.status,
          model: job.model,
          fineTunedModel: job.fine_tuned_model,
          createdAt: job.created_at,
          finishedAt: job.finished_at,
          trainedTokens: job.trained_tokens,
          error: job.error,
        })),
      });

    } else if (action === 'job-status') {
      // Get status of a specific job
      const jobId = formData.get('jobId') as string;
      if (!jobId) {
        return NextResponse.json({ error: 'jobId required' }, { status: 400 });
      }

      const client = getOpenAI();
      const job = await client.fineTuning.jobs.retrieve(jobId);
      const events = await client.fineTuning.jobs.listEvents(jobId, { limit: 20 });

      return NextResponse.json({
        id: job.id,
        status: job.status,
        model: job.model,
        fineTunedModel: job.fine_tuned_model,
        createdAt: job.created_at,
        finishedAt: job.finished_at,
        trainedTokens: job.trained_tokens,
        error: job.error,
        events: events.data.map((e) => ({
          message: e.message,
          createdAt: e.created_at,
          level: e.level,
        })),
      });

    } else if (action === 'cancel-job') {
      const jobId = formData.get('jobId') as string;
      if (!jobId) {
        return NextResponse.json({ error: 'jobId required' }, { status: 400 });
      }

      const job = await getOpenAI().fineTuning.jobs.cancel(jobId);
      return NextResponse.json({
        id: job.id,
        status: job.status,
        message: 'Entraînement annulé',
      });

    } else if (action === 'list-files') {
      // List uploaded training files
      const files = await getOpenAI().files.list();
      const trainingFiles = files.data
        .filter((f) => f.purpose === 'fine-tune')
        .map((f) => ({
          id: f.id,
          filename: f.filename,
          bytes: f.bytes,
          createdAt: f.created_at,
          status: f.status,
        }));

      return NextResponse.json({ files: trainingFiles });

    } else if (action === 'generate-sample') {
      // Generate sample JSONL data for pharmaceutical training
      const domain = formData.get('domain') as string || 'classification';
      
      const samples: Record<string, object[]> = {
        classification: [
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Paracétamol" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Analgésique / Antipyrétique\nRisque: Modéré\nAction: Inhibition COX centrale\nUsages: Douleur légère, fièvre, céphalées" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Amoxicilline" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Antibiotique β-lactamine\nRisque: Modéré\nAction: Inhibition synthèse paroi bactérienne\nUsages: Infections ORL, infections urinaires, pneumonie" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Lactose" }, { role: "assistant", content: "Catégorie: Excipient\nSous-catégorie: Diluant / Agent de charge\nRisque: Faible\nAction: Aucune (excipient)\nUsages: Comprimés, gélules, poudres" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Oméprazole" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: IPP / Anti-ulcéreux\nRisque: Faible\nAction: Inhibition pompe H+/K+ ATPase\nUsages: RGO, ulcère gastrique, Zollinger-Ellison" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Stéarate de magnésium" }, { role: "assistant", content: "Catégorie: Excipient\nSous-catégorie: Lubrifiant\nRisque: Faible\nAction: Aucune (excipient)\nUsages: Comprimés, gélules — lubrifiant de compression" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Ciprofloxacine" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Antibiotique fluoroquinolone\nRisque: Élevé\nAction: Inhibition ADN gyrase\nUsages: Infections urinaires, infections abdominales" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Morphine" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Analgésique opioïde majeur\nRisque: Très élevé\nAction: Agoniste μ-opioïde pur\nUsages: Douleur sévère, soins palliatifs" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Eau purifiée PPI" }, { role: "assistant", content: "Catégorie: Solvant\nSous-catégorie: Véhicule aqueux\nRisque: Faible\nAction: Aucune (véhicule)\nUsages: Solutions injectables, sirops, collyres" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Prednisolone" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Corticostéroïde\nRisque: Élevé\nAction: Activation récepteurs glucocorticoïdes\nUsages: Inflammation, allergie sévère, auto-immunité" }] },
          { messages: [{ role: "system", content: "Tu es un expert en classification pharmaceutique ADWYA. Classifie les ingrédients avec précision." }, { role: "user", content: "Classifie: Metformine" }, { role: "assistant", content: "Catégorie: Principe actif\nSous-catégorie: Antidiabétique / Biguanide\nRisque: Modéré\nAction: Activation AMPK, diminution néoglucogenèse hépatique\nUsages: Diabète type 2, SOPK" }] },
        ],
        formulation: [
          { messages: [{ role: "system", content: "Tu es un expert en formulation galénique ADWYA." }, { role: "user", content: "Vérifie la compatibilité: Paracétamol + Lactose + Stéarate de magnésium" }, { role: "assistant", content: "Compatibilité: Excellente (95/100)\nLe paracétamol est stable avec le lactose comme diluant et le stéarate de magnésium comme lubrifiant. C'est une combinaison standard pour comprimés." }] },
          { messages: [{ role: "system", content: "Tu es un expert en formulation galénique ADWYA." }, { role: "user", content: "Vérifie la compatibilité: Ibuprofène + Cellulose microcristalline" }, { role: "assistant", content: "Compatibilité: Bonne (88/100)\nL'ibuprofène se comprime bien avec la cellulose microcristalline. Attention à l'humidité qui peut affecter la stabilité." }] },
        ],
      };

      const sampleLines = (samples[domain] || samples.classification)
        .map((s) => JSON.stringify(s))
        .join('\n');

      return NextResponse.json({
        content: sampleLines,
        lineCount: (samples[domain] || samples.classification).length,
        domain,
      });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error: any) {
    console.error('Training API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// GET: List fine-tuning jobs and files status
export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured', configured: false },
        { status: 200 }
      );
    }

    const client = getOpenAI();
    const [jobs, files] = await Promise.all([
      client.fineTuning.jobs.list({ limit: 10 }),
      client.files.list(),
    ]);

    const trainingFiles = files.data
      .filter((f) => f.purpose === 'fine-tune')
      .map((f) => ({
        id: f.id,
        filename: f.filename,
        bytes: f.bytes,
        createdAt: f.created_at,
        status: f.status,
      }));

    return NextResponse.json({
      configured: true,
      jobs: jobs.data.map((job) => ({
        id: job.id,
        status: job.status,
        model: job.model,
        fineTunedModel: job.fine_tuned_model,
        createdAt: job.created_at,
        finishedAt: job.finished_at,
      })),
      files: trainingFiles,
    });
  } catch (error: any) {
    console.error("OpenAI GET error:", error.message);
    return NextResponse.json(
      { error: error.message, configured: !!process.env.OPENAI_API_KEY },
      { status: 200 }
    );
  }
}
