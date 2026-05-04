import React from 'react';

export default function GuidePage() {
    return (
        <div style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--font-2xl)', color: 'var(--text-primary)', fontWeight: '600', marginBottom: 'var(--space-lg)' }}>
                Guide d'Utilisation - ADWYA PharmaTech Hub
            </h1>

            <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-lg)', color: 'var(--accent-primary)', marginBottom: 'var(--space-md)' }}>1. Laboratoire In Silico (Éditeur de Molécules)</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-sm)' }}>
                    L'Éditeur de Molécules (propulsé par Ketcher) permet aux bio-ingénieurs de dessiner et de concevoir des molécules en 2D avec une prévisualisation 3D en temps réel.
                </p>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: 'var(--space-lg)' }}>
                    <li><strong>Dessin:</strong> Utilisez la barre d'outils à gauche pour ajouter des atomes, des liaisons et des cycles.</li>
                    <li><strong>Aperçu 3D:</strong> Cliquez sur l'icône 3D dans Ketcher pour afficher la structure spatiale.</li>
                    <li><strong>Test et Scoring:</strong> Une fois la molécule conçue, vous pouvez l'envoyer au moteur de scoring d'interface pour évaluer la viabilité avec différents excipients.</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-lg)', color: 'var(--accent-primary)', marginBottom: 'var(--space-md)' }}>2. Résilience Supply Chain</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-sm)' }}>
                    La section Supply Chain utilise des API externes pour croiser les données des Principes Actifs (API) avec le contexte géopolitique afin de prédire les risques de rupture.
                </p>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: 'var(--space-lg)' }}>
                    <li>Consultez la base de données d'ingrédients pour voir les fournisseurs alternatifs suggérés.</li>
                    <li>Les risques sont calculés de "Faible" à "Critique" en fonction des signaux du marché en temps réel.</li>
                </ul>
            </section>

            <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-lg)', color: 'var(--accent-primary)', marginBottom: 'var(--space-md)' }}>3. Conformité & Sécurité (21 CFR Part 11)</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-sm)' }}>
                    Chaque action critique, comme la recherche de données moléculaires via ChEMBL ou PubChem, est routée à travers notre backend sécurisé. 
                    Un Audit Trail inaltérable enregistre l'utilisateur, l'action, et l'horodatage pour garantir une traçabilité parfaite en vue d'audits FDA / GMP.
                </p>
            </section>
        </div>
    );
}
