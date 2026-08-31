// Authentification de la plateforme (session locale).
// Compte de démonstration pour l'évaluation ; en production, brancher sur Supabase Auth.
'use client';

const KEY = 'pharmatech_session';
const DEMO = { email: 'demo@adwya.tn', password: 'adwya2026', name: 'Utilisateur ADWYA', role: 'Analyste R&D' };

export type Session = { email: string; name: string; role: string; ts: number };

export function login(email: string, password: string): { ok: boolean; error?: string } {
  if (email.trim().toLowerCase() === DEMO.email && password === DEMO.password) {
    const s: Session = { email: DEMO.email, name: DEMO.name, role: DEMO.role, ts: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(s));
    document.cookie = `${KEY}=1; path=/; max-age=86400; samesite=lax`;
    return { ok: true };
  }
  return { ok: false, error: 'Email ou mot de passe incorrect.' };
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

export function logout() {
  localStorage.removeItem(KEY);
  document.cookie = `${KEY}=; path=/; max-age=0`;
}

export const DEMO_HINT = `${DEMO.email} / ${DEMO.password}`;
