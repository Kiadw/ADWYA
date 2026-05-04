'use client';

import React, { useState } from 'react';

export default function MoleculeBuilderPage() {
    const [scoringResult, setScoringResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTestFormulation = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://pzgslazhagijlnrxkihc.supabase.co/functions/v1/ai-scoring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ moleculeData: 'ketcher_data_mock' })
            });
            const data = await response.json();
            setScoringResult(data);
        } catch (error) {
            console.error('Scoring failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', padding: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: '600' }}>Éditeur de Molécules (Ketcher)</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Dessinez vos structures 2D et prévisualisez-les en 3D. Outil propulsé par EPAM Ketcher.</p>
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={handleTestFormulation} disabled={loading}>
                            {loading ? 'Analyse en cours...' : 'Tester via AI Scoring'}
                        </button>
                    </div>
                </div>
                
                <div style={{ 
                    width: '100%', 
                    flex: 1,
                    background: '#fff', 
                    borderRadius: 'var(--radius-lg)', 
                    overflow: 'hidden',
                    border: '1px solid var(--border-primary)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <iframe 
                        src="https://lifescience.opensource.epam.com/ketcher/demo.html" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none' }}
                        title="Ketcher Molecule Builder"
                    />
                </div>
            </div>

            {scoringResult && (
                <div style={{ 
                    width: '300px', 
                    background: 'var(--bg-secondary)', 
                    padding: 'var(--space-lg)', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-primary)' 
                }}>
                    <h3 style={{ fontSize: 'var(--font-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>Résultats de l'Analyse IA</h3>
                    
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Score de Viabilité</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: scoringResult.score > 80 ? 'var(--success-color, #10b981)' : 'var(--warning-color, #f59e0b)' }}>
                            {scoringResult.score}/100
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Classification</div>
                        <div style={{ fontWeight: '500' }}>{scoringResult.viability}</div>
                    </div>

                    {scoringResult.predicted_incompatibilities?.length > 0 && (
                        <div>
                            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Incompatibilités Prédites</div>
                            <ul style={{ paddingLeft: 'var(--space-md)', color: 'var(--error-color, #ef4444)' }}>
                                {scoringResult.predicted_incompatibilities.map((inc: string) => (
                                    <li key={inc}>{inc}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div style={{ marginTop: 'var(--space-xl)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Modèle: {scoringResult.ml_model_version} <br/>
                        Confiance: {scoringResult.confidence_interval}
                    </div>
                </div>
            )}
        </div>
    );
}
