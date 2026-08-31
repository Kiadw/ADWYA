import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import path from 'node:path';

const PY = process.env.RDKIT_PYTHON || 'python3';
const DIR = path.join(process.cwd(), 'python');

export async function POST(req: NextRequest) {
  const { smiles } = await req.json();
  return new Promise<Response>((resolve) => {
    execFile(PY, [path.join(DIR, 'gnn_predict.py'), smiles || ''], { timeout: 20000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Erreur du modèle GNN' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); }
      catch { resolve(Response.json({ error: 'Réponse invalide du modèle' }, { status: 500 })); }
    });
  });
}
