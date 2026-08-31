import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import path from 'node:path';

// Recherche de sous-structure par motif SMARTS (RDKit) sur le catalogue standardisé.
const PY = process.env.RDKIT_PYTHON || 'python3';
const DIR = path.join(process.cwd(), 'python');

export async function POST(req: NextRequest) {
  const { smarts } = await req.json();
  if (!smarts) return Response.json({ error: 'SMARTS manquant' }, { status: 400 });
  return new Promise<Response>((resolve) => {
    execFile(PY, [path.join(DIR, 'substructure.py'), smarts], { timeout: 15000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Calcul RDKit indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); }
      catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
