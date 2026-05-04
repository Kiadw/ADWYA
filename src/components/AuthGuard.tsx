'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Exclude specific paths from protection if needed
        const isPublicPath = pathname.startsWith('/login') || pathname.startsWith('/wiki');
        
        if (!session && !isPublicPath) {
          router.replace('/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isPublicPath = pathname.startsWith('/login') || pathname.startsWith('/wiki');
      if (!session && !isPublicPath) {
        router.replace('/login');
      } else if (session && pathname.startsWith('/login')) {
        router.replace('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Optionally show a loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-primary)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
