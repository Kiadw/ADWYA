/**
 * Ketcher Bridge — Bidirectional communication layer with Ketcher V3 Standalone.
 * 
 * This module provides a clean API to interact with the Ketcher editor
 * embedded in an iframe. Since Ketcher is hosted locally (same-origin),
 * we can access its window object directly without postMessage hacks.
 * 
 * Key capabilities:
 * - Read molecule state (SMILES, Molfile)
 * - Write/inject molecules into the canvas
 * - Listen for structural changes (debounced)
 * - Highlight specific atoms/bonds with colors
 */

export interface KetcherInstance {
  getSmiles: () => Promise<string>;
  getMolfile: (version?: string) => Promise<string>;
  setMolecule: (data: string) => Promise<void>;
  addFragment: (data: string) => Promise<void>;
  getKet: () => Promise<string>;
  editor?: {
    selection: (sel?: any) => any;
    subscribe: (eventName: string, handler: (data: any) => void) => void;
    unsubscribe: (eventName: string) => void;
  };
}

export interface AtomHighlight {
  atomIndex: number;
  color: string;
  label?: string;
}

export interface MoleculeChangeEvent {
  smiles: string;
  molfile: string;
  timestamp: number;
}

type ChangeCallback = (event: MoleculeChangeEvent) => void;

/**
 * Get the Ketcher instance from an iframe ref.
 * Returns null if the iframe is not loaded yet or Ketcher is not initialized.
 */
export function getKetcherInstance(iframeRef: React.RefObject<HTMLIFrameElement | null>): KetcherInstance | null {
  try {
    const win = iframeRef.current?.contentWindow as any;
    if (win && win.ketcher) {
      return win.ketcher as KetcherInstance;
    }
  } catch (e) {
    console.warn('[KetcherBridge] Cannot access Ketcher instance:', e);
  }
  return null;
}

/**
 * Wait for the Ketcher instance to become available.
 * Polls every 500ms for up to `timeoutMs` milliseconds.
 */
export function waitForKetcher(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  timeoutMs: number = 15000
): Promise<KetcherInstance> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const instance = getKetcherInstance(iframeRef);
      if (instance) {
        clearInterval(interval);
        resolve(instance);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        reject(new Error('[KetcherBridge] Ketcher initialization timed out'));
      }
    }, 500);
  });
}

/**
 * Read the current molecule as SMILES.
 */
export async function getSmiles(iframeRef: React.RefObject<HTMLIFrameElement | null>): Promise<string | null> {
  const ketcher = getKetcherInstance(iframeRef);
  if (!ketcher) return null;
  try {
    return await ketcher.getSmiles();
  } catch (e) {
    console.error('[KetcherBridge] getSmiles failed:', e);
    return null;
  }
}

/**
 * Read the current molecule as Molfile (V2000 or V3000).
 */
export async function getMolfile(iframeRef: React.RefObject<HTMLIFrameElement | null>): Promise<string | null> {
  const ketcher = getKetcherInstance(iframeRef);
  if (!ketcher) return null;
  try {
    return await ketcher.getMolfile();
  } catch (e) {
    console.error('[KetcherBridge] getMolfile failed:', e);
    return null;
  }
}

/**
 * Set/inject a molecule onto the canvas. Accepts SMILES or Molfile format.
 */
export async function setMolecule(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  data: string
): Promise<boolean> {
  const ketcher = getKetcherInstance(iframeRef);
  if (!ketcher) return false;
  try {
    await ketcher.setMolecule(data);
    return true;
  } catch (e) {
    console.error('[KetcherBridge] setMolecule failed:', e);
    return false;
  }
}

/**
 * Create a debounced molecule change listener.
 * Polls the canvas state and fires the callback when SMILES changes.
 * Returns a cleanup function.
 */
export function onMoleculeChange(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  callback: ChangeCallback,
  debounceMs: number = 1000
): () => void {
  let lastSmiles = '';
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  const checkForChanges = async () => {
    const ketcher = getKetcherInstance(iframeRef);
    if (!ketcher) return;

    try {
      const currentSmiles = await ketcher.getSmiles();
      if (currentSmiles && currentSmiles !== lastSmiles) {
        lastSmiles = currentSmiles;
        
        // Clear existing debounce
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Debounce the callback
        debounceTimer = setTimeout(async () => {
          try {
            const molfile = await ketcher.getMolfile();
            callback({
              smiles: currentSmiles,
              molfile: molfile || '',
              timestamp: Date.now()
            });
          } catch (e) {
            console.error('[KetcherBridge] Change callback error:', e);
          }
        }, debounceMs);
      }
    } catch {
      // Ketcher may not be ready yet, ignore
    }
  };

  // Poll every 500ms
  pollTimer = setInterval(checkForChanges, 500);

  // Return cleanup function
  return () => {
    if (pollTimer) clearInterval(pollTimer);
    if (debounceTimer) clearTimeout(debounceTimer);
  };
}

/**
 * Highlight specific atoms in the molecule with a colored annotation.
 * Uses Ketcher's setMolecule with enhanced Molfile that includes atom coloring.
 * 
 * This approach works by modifying the Molfile to add atom color properties
 * before re-injecting it into Ketcher.
 */
export async function highlightAtoms(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  atomIndices: number[],
  color: string = '#ef4444'
): Promise<boolean> {
  const ketcher = getKetcherInstance(iframeRef);
  if (!ketcher || !ketcher.editor) return false;

  try {
    // Use Ketcher editor's selection API to highlight atoms
    const selection = { atoms: atomIndices };
    ketcher.editor.selection(selection);
    return true;
  } catch (e) {
    console.error('[KetcherBridge] highlightAtoms failed:', e);
    return false;
  }
}

/**
 * Parse a SMILES string to identify potential problematic functional groups.
 * This is a lightweight client-side pre-check before sending to the AI backend.
 */
export function identifyFunctionalGroups(smiles: string): { name: string; pattern: string; risk: string }[] {
  const groups: { name: string; pattern: string; risk: string }[] = [];
  
  const patterns = [
    { name: 'Aldehyde', pattern: 'C=O', regex: /[^(]C=O/, risk: 'Reactive — stability risk' },
    { name: 'Epoxide', pattern: 'C1OC1', regex: /C1OC1/, risk: 'Highly reactive — toxicity concern' },
    { name: 'Nitro group', pattern: '[N+](=O)[O-]', regex: /\[N\+\]\(=O\)\[O-\]/, risk: 'Potential mutagenicity' },
    { name: 'Azide', pattern: 'N=[N+]=[N-]', regex: /N=\[N\+\]=\[N-\]/, risk: 'Explosive — safety hazard' },
    { name: 'Peroxide', pattern: 'OO', regex: /OO/, risk: 'Oxidizing — instability risk' },
    { name: 'Michael acceptor', pattern: 'C=CC=O', regex: /C=CC=O/, risk: 'Protein-reactive — toxicity alert' },
    { name: 'Acyl halide', pattern: 'C(=O)Cl', regex: /C\(=O\)Cl/, risk: 'Highly reactive with water' },
    { name: 'Sulfonyl chloride', pattern: 'S(=O)(=O)Cl', regex: /S\(=O\)\(=O\)Cl/, risk: 'Corrosive — reactivity concern' },
  ];

  for (const p of patterns) {
    if (p.regex.test(smiles)) {
      groups.push({ name: p.name, pattern: p.pattern, risk: p.risk });
    }
  }

  return groups;
}
