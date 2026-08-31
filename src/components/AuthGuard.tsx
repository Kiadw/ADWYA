'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

// Garde d'authentification RÉELLE : vérifie la session et redirige vers /login si absente.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ok'>('checking');

  useEffect(() => {
    if (getSession()) setState('ok');
    else router.replace('/login');
  }, [router]);

  if (state === 'checking') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6B73' }}>
        Vérification de la session…
      </div>
    );
  }
  return <>{children}</>;
}
