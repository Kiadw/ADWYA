import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import path from 'node:path';

// Python RDKit : scripts et données versionnés dans le dépôt (dossier /python).
// L'interpréteur est fourni par la variable d'environnement RDKIT_PYTHON
// (voir python/requirements.txt pour créer le venv : python -m venv .venv && pip install -r python/requirements.txt).
const PY = process.env.RDKIT_PYTHON || 'python3';
const DIR = path.join(process.cwd(), 'python');

export async function POST(req: NextRequest) {
  const body = await req.json();
  const arg = body.smiles;
  if (!arg) return Response.json({ error: 'Paramètre manquant' }, { status: 400 });
  const args = [path.join(DIR, 'similarity.py'), path.join(DIR, 'meds.json'), arg];
  return new Promise<Response>((resolve) => {
    execFile(PY, args, { timeout: 15000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Calcul RDKit indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); }
      catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
