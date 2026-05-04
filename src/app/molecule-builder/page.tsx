'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Map, ClipboardList } from 'lucide-react';
import { onMoleculeChange, highlightAtoms, waitForKetcher } from '@/lib/ketcher-bridge';
import AISidebar from '@/components/AISidebar';
import SupplierTable from '@/components/SupplierTable';

// Leaflet must be loaded client-side only
const SupplierMap = dynamic(() => import('@/components/SupplierMap'), { ssr: false });

const SUPABASE_URL = 'https://pzgslazhagijlnrxkihc.supabase.co/functions/v1';

interface ScoringResult {
  score: number;
  viability: string;
  molecular_formula?: string;
  molecular_weight?: number;
  iupac_name?: string;
  structural_issues?: any[];
  lipinski_violations?: string[];
  lipinski_compliant?: boolean;
  admet?: Record<string, any>;
  confidence_interval?: string;
  ml_model_version?: string;
  data_sources?: string[];
  smiles?: string;
  cid?: number;
}

interface Supplier {
  name: string;
  country: string;
  lat: number;
  lng: number;
  availability: string;
  price_usd_per_kg?: number;
  lead_time_days?: number;
  source: string;
}

interface SupplyData {
  suppliers: Supplier[];
  risk_level: string;
  fda_shortage_alerts: any[];
  compound: string;
}

type Tab = 'map' | 'table';

export default function MoleculeBuilderPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ketcherReady, setKetcherReady] = useState(false);
  const [currentSmiles, setCurrentSmiles] = useState('');

  // AI scoring state
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [scoringLoading, setScoringLoading] = useState(false);

  // Supply chain state
  const [supplyData, setSupplyData] = useState<SupplyData | null>(null);
  const [supplyLoading, setSupplyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('map');

  // Wait for Ketcher to initialize
  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const onLoad = () => {
      waitForKetcher(iframeRef, 20000)
        .then(() => setKetcherReady(true))
        .catch((err) => console.warn('Ketcher init:', err));
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, []);

  // Run AI scoring
  const runScoring = useCallback(async (smiles: string) => {
    if (!smiles || smiles.length < 2) return;
    setScoringLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/ai-scoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles })
      });
      const data: ScoringResult = await res.json();
      setScoringResult(data);

      // Highlight problematic atoms if issues found
      if (data.structural_issues && data.structural_issues.length > 0) {
        const atomIndices = data.structural_issues.map((_, i) => i);
        highlightAtoms(iframeRef, atomIndices);
      }
    } catch (err) {
      console.error('AI scoring failed:', err);
    } finally {
      setScoringLoading(false);
    }
  }, []);

  // Fetch supplier data
  const fetchSuppliers = useCallback(async (smiles: string) => {
    if (!smiles || smiles.length < 2) return;
    setSupplyLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/supply-chain-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles })
      });
      const data = await res.json();
      setSupplyData(data);
    } catch (err) {
      console.error('Supply chain fetch failed:', err);
    } finally {
      setSupplyLoading(false);
    }
  }, []);

  // Subscribe to molecule changes — live analysis
  useEffect(() => {
    if (!ketcherReady) return;
    const cleanup = onMoleculeChange(iframeRef, (event) => {
      setCurrentSmiles(event.smiles);
      runScoring(event.smiles);
      fetchSuppliers(event.smiles);
    }, 1500);
    return cleanup;
  }, [ketcherReady, runScoring, fetchSuppliers]);

  return (
    <div style={{ height: 'calc(100vh - 80px)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
            Éditeur de Molécules (Ketcher V3)
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: 'var(--font-sm)' }}>
            Analyse IA en temps réel · Fournisseurs mondiaux · Annotations visuelles
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {ketcherReady ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#10b981' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Ketcher connecté
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#f59e0b' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Initialisation Ketcher…
            </span>
          )}
          {currentSmiles && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentSmiles}
            </span>
          )}
        </div>
      </div>

      {/* Main layout: Ketcher + AI Sidebar */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', flex: 1, minHeight: 0 }}>
        {/* Ketcher editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 'var(--radius-lg)',
            overflow: 'hidden', border: '1px solid var(--border-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,.05)'
          }}>
            <iframe
              ref={iframeRef}
              src="/ketcher/standalone/index.html"
              width="100%" height="100%"
              style={{ border: 'none' }}
              title="Ketcher Standalone"
            />
          </div>

          {/* Supplier section below Ketcher */}
          {(supplyData || supplyLoading) && (
            <div style={{
              marginTop: 'var(--space-md)', background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)',
              overflow: 'hidden'
            }}>
              {/* Tab bar */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)' }}>
                <TabBtn active={activeTab === 'map'} onClick={() => setActiveTab('map')}>
                  <Map size={14} style={{ display: 'inline' }} /> Carte Fournisseurs {supplyData ? `(${supplyData.suppliers.length})` : ''}
                </TabBtn>
                <TabBtn active={activeTab === 'table'} onClick={() => setActiveTab('table')}>
                  <ClipboardList size={14} style={{ display: 'inline' }} /> Tableau Comparatif
                </TabBtn>
                {supplyData?.risk_level && (
                  <div style={{ marginLeft: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    Risque: <span style={{
                      padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                      background: supplyData.risk_level === 'Low' ? 'rgba(16,185,129,.1)' : supplyData.risk_level === 'Elevated' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.1)',
                      color: supplyData.risk_level === 'Low' ? '#10b981' : supplyData.risk_level === 'Elevated' ? '#ef4444' : '#f59e0b'
                    }}>{supplyData.risk_level}</span>
                  </div>
                )}
              </div>

              {/* Tab content */}
              <div style={{ height: 280 }}>
                {activeTab === 'map' ? (
                  <SupplierMap suppliers={supplyData?.suppliers || []} />
                ) : (
                  <SupplierTable suppliers={supplyData?.suppliers || []} loading={supplyLoading} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Sidebar */}
        <AISidebar result={scoringResult} loading={scoringLoading} />
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
        fontSize: 'var(--font-sm)', fontWeight: active ? 600 : 400,
        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
        borderBottom: active ? '2px solid var(--accent-primary, #6366f1)' : '2px solid transparent',
        transition: 'all .2s'
      }}
    >
      {children}
    </button>
  );
}
