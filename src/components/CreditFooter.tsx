'use client';

/**
 * Pied de page de crédit — « Développé par Skander ZOUHIR » → soteria.tn.
 *
 * La SOURCE DE VÉRITÉ est la table Supabase `platform_credits` (lecture
 * autorisée au rôle `anon` par la policy `platform_credits_read`). Le crédit
 * doit survivre à un rebuild du front : la valeur codée ci-dessous n'est
 * qu'un repli d'AFFICHAGE, servi tant que la requête n'a pas répondu ou si
 * Supabase est injoignable — le crédit reste donc visible en permanence.
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Credit {
  label: string;
  url: string;
  link_text: string;
}

const FALLBACK: Credit = {
  label: 'Développé par Skander ZOUHIR',
  url: 'https://soteria.tn',
  link_text: 'soteria.tn',
};

export default function CreditFooter() {
  const [credit, setCredit] = useState<Credit>(FALLBACK);

  useEffect(() => {
    let alive = true;
    supabase
      .from('platform_credits')
      .select('label,url,link_text,app,sort_order')
      .eq('active', true)
      .in('app', ['biomed', '*'])
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (!alive || !data?.length) return;
        // Un crédit spécifique à « biomed » prime sur le crédit global « * ».
        const row = data.find((d) => d.app === 'biomed') ?? data[0];
        if (row?.label && row?.url) {
          setCredit({ label: row.label, url: row.url, link_text: row.link_text || row.url });
        }
      });
    return () => { alive = false; };
  }, []);

  return (
    <footer
      style={{
        position: 'fixed',
        right: 12,
        bottom: 8,
        zIndex: 40,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(0,0,0,0.08)',
        fontSize: 11,
        lineHeight: 1.4,
        color: '#64748b',
      }}
    >
      <span>{credit.label}</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <a
        href={credit.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0b6bcb', fontWeight: 600, textDecoration: 'none' }}
      >
        {credit.link_text}
      </a>
    </footer>
  );
}
