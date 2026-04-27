'use client';

import { useEffect, useRef } from 'react';
import {
  FlaskConical,
  Pill,
  Beaker,
  BrainCircuit,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { INGREDIENTS, FORMULATIONS, ACTIVITIES } from '@/lib/data';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// KPI calculations
const totalIngredients = INGREDIENTS.length;
const activeIngredients = INGREDIENTS.filter(i => i.category === 'Principe actif').length;
const totalFormulations = FORMULATIONS.length;
const classifications = 128; // simulated

// Category distribution for doughnut
const categoryCount: Record<string, number> = {};
INGREDIENTS.forEach(i => {
  categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
});

const doughnutData = {
  labels: Object.keys(categoryCount),
  datasets: [{
    data: Object.values(categoryCount),
    backgroundColor: [
      'rgba(96, 178, 70, 0.8)',
      'rgba(27, 117, 188, 0.8)',
      'rgba(43, 147, 72, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 6,
  }],
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#475569',
        padding: 20,
        font: { family: 'Inter', size: 12 },
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
  },
  cutout: '65%',
};

// Sub-category distribution for bar chart
const subCategoryCount: Record<string, number> = {};
INGREDIENTS.forEach(i => {
  subCategoryCount[i.subCategory] = (subCategoryCount[i.subCategory] || 0) + 1;
});
const sortedSub = Object.entries(subCategoryCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

const barData = {
  labels: sortedSub.map(s => s[0].length > 20 ? s[0].slice(0, 18) + '…' : s[0]),
  datasets: [{
    label: 'Nombre',
    data: sortedSub.map(s => s[1]),
    backgroundColor: 'rgba(96, 178, 70, 0.6)',
    borderColor: 'rgba(96, 178, 70, 1)',
    borderWidth: 1,
    borderRadius: 6,
    barThickness: 20,
  }],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0, 0, 0, 0.06)' },
      ticks: { color: '#475569', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#475569', font: { family: 'Inter', size: 11 } },
    },
  },
};

const KPI_DATA = [
  { label: 'Total Ingrédients', value: totalIngredients, trend: '+3', icon: FlaskConical },
  { label: 'Principes Actifs', value: activeIngredients, trend: '+2', icon: Beaker },
  { label: 'Formulations', value: totalFormulations, trend: '+1', icon: Pill },
  { label: 'Classifications IA', value: classifications, trend: '+12', icon: BrainCircuit },
];

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d&apos;ensemble de la plateforme pharmaceutique ADWYA</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div className="kpi-card" key={kpi.label}>
              <div className="kpi-card-top">
                <div className="kpi-card-icon">
                  <Icon size={22} />
                </div>
                <span className="kpi-card-trend up">↑ {kpi.trend}</span>
              </div>
              <div className="kpi-card-value">{kpi.value}</div>
              <div className="kpi-card-label">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Répartition par catégorie</span>
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Top 10 sous-catégories</span>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity + Risk Overview */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Activité récente</span>
          </div>
          <div className="activity-list">
            {ACTIVITIES.map((act) => (
              <div className="activity-item" key={act.id}>
                <div className="activity-dot" style={{ background: act.color }} />
                <span className="activity-text">
                  <strong>{act.action}</strong> — {act.target}
                  <span style={{ color: 'var(--text-tertiary)', marginLeft: 8, fontSize: 'var(--font-xs)' }}>
                    par {act.user}
                  </span>
                </span>
                <span className="activity-time">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Distribution par niveau de risque</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-md) 0' }}>
            {['Faible', 'Modéré', 'Élevé', 'Très élevé'].map((risk) => {
              const count = INGREDIENTS.filter(i => i.riskClass === risk).length;
              const pct = Math.round((count / totalIngredients) * 100);
              const colors: Record<string, string> = {
                'Faible': 'var(--accent-primary)',
                'Modéré': 'var(--accent-warm)',
                'Élevé': 'var(--accent-rose)',
                'Très élevé': '#dc2626',
              };
              return (
                <div key={risk}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'var(--font-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{risk}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${pct}%`, background: colors[risk] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
