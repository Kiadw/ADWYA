import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import path from 'node:path';
const PY = process.env.RDKIT_PYTHON || '/private/tmp/claude-501/-Users-skander/6cf8fb91-4608-4a66-b554-82b81dc2480e/scratchpad/rdkit-venv/bin/python';
const DIR = path.join(process.cwd(), 'python');
export async function POST(req: NextRequest) {
  const { smiles } = await req.json();
  if (!smiles) return Response.json({ error: 'SMILES manquant' }, { status: 400 });
  return new Promise((resolve) => {
    execFile(PY, [path.join(DIR, 'qsar_predict.py'), smiles], { timeout: 20000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'QSAR indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); } catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
