'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Download, TrendingUp, Shield, AlertTriangle, Package } from 'lucide-react';
import { INGREDIENTS, FORMULATIONS } from '@/lib/data';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// Stats
const totalIngredients = INGREDIENTS.length;
const activeIngredients = INGREDIENTS.filter(i => i.category === 'Principe actif').length;
const excipients = INGREDIENTS.filter(i => i.category === 'Excipient').length;
const solvents = INGREDIENTS.filter(i => i.category === 'Solvant').length;
const preservatives = INGREDIENTS.filter(i => i.category === 'Conservateur').length;
const highRisk = INGREDIENTS.filter(i => i.riskClass === 'Élevé' || i.riskClass === 'Très élevé').length;
const avgMolarMass = Math.round(INGREDIENTS.filter(i => i.molarMass > 0).reduce((s, i) => s + i.molarMass, 0) / INGREDIENTS.filter(i => i.molarMass > 0).length);

// Supplier distribution
const supplierCount: Record<string, number> = {};
INGREDIENTS.forEach(i => { supplierCount[i.supplier] = (supplierCount[i.supplier] || 0) + 1; });
const topSuppliers = Object.entries(supplierCount).sort((a, b) => b[1] - a[1]).slice(0, 8);

const supplierBarData = {
    labels: topSuppliers.map(s => s[0].length > 18 ? s[0].slice(0, 16) + '…' : s[0]),
    datasets: [{
        label: 'Ingrédients fournis',
        data: topSuppliers.map(s => s[1]),
        backgroundColor: 'rgba(27, 117, 188, 0.6)',
        borderColor: 'rgba(27, 117, 188, 1)',
        borderWidth: 1,
        borderRadius: 6,
    }],
};

// Monthly additions (simulated)
const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
const monthlyData = {
    labels: months,
    datasets: [{
        label: 'Ingrédients ajoutés',
        data: [8, 5, 7, 6, 6, 4, 5, 4],
        fill: true,
        backgroundColor: 'rgba(96, 178, 70, 0.1)',
        borderColor: 'rgba(96, 178, 70, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(96, 178, 70, 1)',
        pointRadius: 4,
        tension: 0.4,
    }],
};

// Risk distribution doughnut
const riskDist: Record<string, number> = {};
INGREDIENTS.forEach(i => { riskDist[i.riskClass] = (riskDist[i.riskClass] || 0) + 1; });

const riskDoughnut = {
    labels: Object.keys(riskDist),
    datasets: [{
        data: Object.values(riskDist),
        backgroundColor: [
            'rgba(96, 178, 70, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(220, 38, 38, 0.8)',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
    }],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: { color: '#475569', font: { family: 'Inter', size: 11 }, usePointStyle: true, padding: 16 },
        },
    },
};

const barOptions = {
    ...chartOptions,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#475569', font: { family: 'Inter', size: 11 } } },
        y: { grid: { display: false }, ticks: { color: '#475569', font: { family: 'Inter', size: 11 } } },
    },
};

const lineOptions = {
    ...chartOptions,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#475569', font: { family: 'Inter', size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#475569', font: { family: 'Inter', size: 11 } }, beginAtZero: true },
    },
};

const STAT_CARDS = [
    { label: 'Total Ingrédients', value: totalIngredients, icon: Package, color: 'var(--accent-primary)' },
    { label: 'Principes Actifs', value: activeIngredients, icon: TrendingUp, color: 'var(--accent-secondary)' },
    { label: 'Excipients', value: excipients, icon: Package, color: 'var(--accent-tertiary)' },
    { label: 'Risque Élevé / Très Élevé', value: highRisk, icon: AlertTriangle, color: 'var(--accent-rose)' },
    { label: 'Formulations', value: FORMULATIONS.length, icon: Shield, color: 'var(--accent-warm)' },
    { label: 'Masse molaire moy.', value: `${avgMolarMass} g/mol`, icon: TrendingUp, color: 'var(--accent-primary)' },
];

export default function ReportsPage() {
    const handleExportAll = () => {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalIngredients,
                activeIngredients,
                excipients,
                solvents,
                preservatives,
                highRisk,
                formulations: FORMULATIONS.length,
                avgMolarMass,
            },
            ingredients: INGREDIENTS,
            formulations: FORMULATIONS,
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adwya_rapport_complet.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Rapports & Analytiques</h1>
                    <p className="page-subtitle">Statistiques agrégées et indicateurs de la plateforme</p>
                </div>
                <button className="btn btn-primary" onClick={handleExportAll}>
                    <Download size={16} />
                    Export rapport complet
                </button>
            </div>

            {/* Stat cards */}
            <div className="stats-grid">
                {STAT_CARDS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div className="card" key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                background: `${stat.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: stat.color, flexShrink: 0,
                            }}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>{stat.value}</div>
                                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Évolution mensuelle des ajouts</span>
                    </div>
                    <div className="chart-container">
                        <Line data={monthlyData} options={lineOptions} />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Répartition par niveau de risque</span>
                    </div>
                    <div className="chart-container">
                        <Doughnut data={riskDoughnut} options={{ ...chartOptions, cutout: '60%' }} />
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginTop: 'var(--space-lg)' }}>
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Top fournisseurs</span>
                    </div>
                    <div className="chart-container">
                        <Bar data={supplierBarData} options={barOptions} />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Indicateurs clés</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-md) 0' }}>
                        {[
                            { label: 'Taux de couverture IA', value: '92%', bar: 92 },
                            { label: 'Ingrédients avec CAS valide', value: '100%', bar: 100 },
                            { label: 'Formulations en production', value: `${FORMULATIONS.filter(f => f.status === 'Production').length}/${FORMULATIONS.length}`, bar: (FORMULATIONS.filter(f => f.status === 'Production').length / FORMULATIONS.length) * 100 },
                            { label: 'Fournisseurs actifs', value: String(Object.keys(supplierCount).length), bar: 85 },
                            { label: 'Excipients / Total', value: `${Math.round((excipients / totalIngredients) * 100)}%`, bar: (excipients / totalIngredients) * 100 },
                        ].map((kpi) => (
                            <div key={kpi.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'var(--font-sm)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{kpi.label}</span>
                                    <span style={{ fontWeight: 700 }}>{kpi.value}</span>
                                </div>
                                <div className="confidence-bar">
                                    <div className="confidence-fill" style={{ width: `${kpi.bar}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
