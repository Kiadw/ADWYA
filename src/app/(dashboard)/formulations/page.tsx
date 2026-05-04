'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Pill } from 'lucide-react';
import {
    FORMULATIONS,
    INGREDIENTS,
    getIngredientById,
    getStatusBadgeClass,
    getCategoryBadgeClass,
} from '@/lib/data';

const COMPOSITION_COLORS = [
    'rgba(96, 178, 70, 0.8)',
    'rgba(27, 117, 188, 0.8)',
    'rgba(43, 147, 72, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(168, 85, 247, 0.8)',
];

export default function FormulationsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Formulations</h1>
                <p className="page-subtitle">Composition détaillée des formulations pharmaceutiques</p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                {FORMULATIONS.map((form) => {
                    const isExpanded = expandedId === form.id;
                    // Calculate total mass for composition bar
                    const totalDosage = form.ingredients.reduce((sum, fi) => {
                        const dosageNum = parseFloat(fi.dosage) || 0;
                        return sum + dosageNum;
                    }, 0);

                    return (
                        <div className="card" key={form.id} style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Header */}
                            <div
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: 'var(--space-xl)', cursor: 'pointer',
                                }}
                                onClick={() => setExpandedId(isExpanded ? null : form.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                        background: 'rgba(96, 178, 70, 0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--accent-primary)',
                                    }}>
                                        <Pill size={22} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>{form.name}</div>
                                        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', gap: 12, marginTop: 2 }}>
                                            <span>{form.type}</span>
                                            <span>•</span>
                                            <span>{form.indication}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <span className="badge badge-teal">{form.ingredients.length} ingrédients</span>
                                    <span className={`badge ${getStatusBadgeClass(form.status)}`}>{form.status}</span>
                                    {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-tertiary)' }} />}
                                </div>
                            </div>

                            {/* Composition bar (always visible) */}
                            <div style={{ padding: '0 var(--space-xl) var(--space-lg)' }}>
                                <div className="composition-bar">
                                    {form.ingredients.map((fi, idx) => {
                                        const pct = totalDosage > 0 ? (parseFloat(fi.dosage) / totalDosage) * 100 : 0;
                                        return (
                                            <div
                                                key={fi.ingredientId}
                                                className="composition-segment"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: COMPOSITION_COLORS[idx % COMPOSITION_COLORS.length],
                                                }}
                                                title={`${getIngredientById(fi.ingredientId)?.name}: ${fi.dosage} ${fi.unit}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div style={{
                                    borderTop: '1px solid var(--border-primary)',
                                    padding: 'var(--space-xl)',
                                    animation: 'slideUp 0.3s ease-out',
                                }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Ingrédient</th>
                                                <th>Catégorie</th>
                                                <th>Rôle</th>
                                                <th>Dosage</th>
                                                <th>% Composition</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {form.ingredients.map((fi, idx) => {
                                                const ingredient = getIngredientById(fi.ingredientId);
                                                const pct = totalDosage > 0 ? ((parseFloat(fi.dosage) / totalDosage) * 100).toFixed(1) : '—';
                                                return (
                                                    <tr key={fi.ingredientId}>
                                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{
                                                                    width: 10, height: 10, borderRadius: '50%',
                                                                    background: COMPOSITION_COLORS[idx % COMPOSITION_COLORS.length],
                                                                    flexShrink: 0,
                                                                }} />
                                                                {ingredient?.name || fi.ingredientId}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getCategoryBadgeClass(ingredient?.category || '')}`}>
                                                                {ingredient?.category || '—'}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: 'var(--font-sm)' }}>{fi.role}</td>
                                                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fi.dosage} {fi.unit}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ flex: 1, maxWidth: 80 }}>
                                                                    <div className="confidence-bar" style={{ height: 6 }}>
                                                                        <div
                                                                            className="confidence-fill"
                                                                            style={{
                                                                                width: `${pct}%`,
                                                                                background: COMPOSITION_COLORS[idx % COMPOSITION_COLORS.length],
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, minWidth: 40 }}>{pct}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
