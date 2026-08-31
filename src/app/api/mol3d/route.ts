import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import path from 'node:path';

// Génération de coordonnées 3D (RDKit : ETKDG + optimisation MMFF) pour la visualisation moléculaire.
const PY = process.env.RDKIT_PYTHON || 'python3';
const DIR = path.join(process.cwd(), 'python');

export async function POST(req: NextRequest) {
  const { smiles } = await req.json();
  if (!smiles) return Response.json({ error: 'SMILES manquant' }, { status: 400 });
  return new Promise<Response>((resolve) => {
    execFile(PY, [path.join(DIR, 'mol3d.py'), smiles], { timeout: 20000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Génération 3D indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); }
      catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
