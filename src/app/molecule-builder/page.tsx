import React from 'react';

export default function MoleculeBuilderPage() {
    return (
        <div style={{ height: 'calc(100vh - 100px)', padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-primary)', fontWeight: '600' }}>Éditeur de Molécules (Ketcher)</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Dessinez vos structures 2D et prévisualisez-les en 3D. Outil propulsé par EPAM Ketcher.</p>
                </div>
                <div>
                    <button className="btn btn-primary">Enregistrer la formulation</button>
                </div>
            </div>
            
            <div style={{ 
                width: '100%', 
                height: 'calc(100% - 80px)', 
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
    );
}
