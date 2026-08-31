import { execFile } from 'node:child_process';
import path from 'node:path';
const PY = process.env.RDKIT_PYTHON || 'python3';
const DIR = path.join(process.cwd(), 'python');
export async function GET() {
  return new Promise<Response>((resolve) => {
    execFile(PY, [path.join(DIR, 'chemspace.py')], { timeout: 20000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Calcul indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); } catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
