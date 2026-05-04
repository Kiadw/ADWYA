'use client';

import React, { useState } from 'react';
import { Truck, MapPin, Award, Search, ExternalLink, Globe, Filter } from 'lucide-react';
import { ADWYA_SUPPLIERS, SUPPLIER_SOURCES, getSuppliersByCountry, type Supplier } from '@/lib/suppliers';

const TYPE_COLORS: Record<string, string> = {
  API: '#6366f1',
  Excipient: '#10b981',
  CMO: '#f59e0b',
  Distribution: '#3b82f6',
  Packaging: '#8b5cf6',
};

export default function FournisseursPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const countryStats = getSuppliersByCountry();
  const types = [...new Set(ADWYA_SUPPLIERS.map(s => s.type))];

  const filtered = ADWYA_SUPPLIERS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.speciality.toLowerCase().includes(q);
    const matchType = !typeFilter || s.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: 1100, margin: '0 auto', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Fournisseurs ADWYA</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', margin: '4px 0 var(--space-md)' }}>
          {filtered.length} fournisseurs . {Object.keys(countryStats).length} pays . Donnees reelles
        </p>

        {/* Country badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
          {Object.entries(countryStats).map(([country, count]) => (
            <span key={country} style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, background: 'rgba(99,102,241,.06)', color: '#6366f1', border: '1px solid rgba(99,102,241,.15)' }}>
              <MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {country} ({count})
            </span>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Rechercher par nom, pays ou specialite..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              style={{ padding: '8px 10px 8px 30px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontSize: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Tous les types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Supplier list - SCROLLABLE */}
      <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
        {filtered.map(sup => (
          <div key={sup.id} style={{ borderBottom: '1px solid var(--border-secondary, rgba(0,0,0,.04))' }}>
            <div onClick={() => setExpanded(expanded === sup.id ? null : sup.id)}
              style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.015)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <Truck size={18} color={TYPE_COLORS[sup.type] || '#6366f1'} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-sm)' }}>{sup.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', gap: 8, marginTop: 2 }}>
                  <span><MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {sup.city}, {sup.country}</span>
                  <span style={{ padding: '1px 6px', borderRadius: 8, background: `${TYPE_COLORS[sup.type] || '#6366f1'}15`, color: TYPE_COLORS[sup.type] || '#6366f1', fontSize: 10 }}>{sup.type}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {sup.certifications.slice(0, 3).map(c => (
                  <span key={c} style={{ padding: '2px 6px', borderRadius: 6, fontSize: 9, background: 'rgba(16,185,129,.08)', color: '#10b981', fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            </div>

            {expanded === sup.id && (
              <div style={{ padding: '0 16px 14px 46px', fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Relation: </span><strong>{sup.relationship}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Specialite: </span>{sup.speciality}</div>
                </div>
                {sup.molecules_supplied.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Molecules fournies: </span>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                      {sup.molecules_supplied.map(m => (
                        <span key={m} style={{ padding: '2px 8px', borderRadius: 8, fontSize: 10, background: 'rgba(99,102,241,.06)', color: '#6366f1' }}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 }}>
                  <Award size={10} color="var(--text-tertiary)" />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>Certifications: {sup.certifications.join(', ')}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>Source: {sup.source}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources */}
      <div style={{ flexShrink: 0, marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Sources des donnees</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUPPLIER_SOURCES.map(src => (
            <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 10, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Globe size={9} /> {src.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
