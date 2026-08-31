import { execFile } from 'node:child_process';
import path from 'node:path';
const PY = process.env.RDKIT_PYTHON || '/private/tmp/claude-501/-Users-skander/6cf8fb91-4608-4a66-b554-82b81dc2480e/scratchpad/rdkit-venv/bin/python';
const DIR = path.join(process.cwd(), 'python');
export async function GET() {
  return new Promise((resolve) => {
    execFile(PY, [path.join(DIR, 'chemspace.py')], { timeout: 20000 }, (err, stdout) => {
      if (err && !stdout) { resolve(Response.json({ error: 'Calcul indisponible' }, { status: 500 })); return; }
      try { resolve(Response.json(JSON.parse(stdout))); } catch { resolve(Response.json({ error: 'Réponse illisible' }, { status: 500 })); }
    });
  });
}
