'use client';

import { useState, useMemo } from 'react';
import { Search, X, ExternalLink, Download } from 'lucide-react';
import {
    INGREDIENTS,
    getCategoryBadgeClass,
    getRiskBadgeClass,
    getStatusBadgeClass,
    type Ingredient,
} from '@/lib/data';

const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['Tous', ...Array.from(new Set(INGREDIENTS.map(i => i.category)))];
const RISKS = ['Tous', ...Array.from(new Set(INGREDIENTS.map(i => i.riskClass)))];

export default function IngredientsPage() {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Tous');
    const [riskFilter, setRiskFilter] = useState('Tous');
    const [page, setPage] = useState(1);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

    const filtered = useMemo(() => {
        return INGREDIENTS.filter(i => {
            const matchSearch = !search ||
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                i.casNumber.includes(search) ||
                i.formula.toLowerCase().includes(search.toLowerCase());
            const matchCat = catFilter === 'Tous' || i.category === catFilter;
            const matchRisk = riskFilter === 'Tous' || i.riskClass === riskFilter;
            return matchSearch && matchCat && matchRisk;
        });
    }, [search, catFilter, riskFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleExportCSV = () => {
        const headers = ['ID', 'Nom', 'CAS', 'Formule', 'Masse molaire', 'Catégorie', 'Sous-catégorie', 'Risque', 'Solubilité', 'Fournisseur', 'Statut'];
        const rows = filtered.map(i => [i.id, i.name, i.casNumber, i.formula, i.molarMass, i.category, i.subCategory, i.riskClass, i.solubility, i.supplier, i.status]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adwya_ingredients.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Base de données Ingrédients</h1>
                    <p className="page-subtitle">{filtered.length} ingrédients trouvés</p>
                </div>
                <button className="btn btn-secondary" onClick={handleExportCSV} style={{ marginTop: 4 }}>
                    <Download size={16} />
                    Exporter CSV
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="header-search" style={{ minWidth: 280 }}>
                    <Search size={16} className="header-search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, CAS, formule..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select className="filter-select" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c === 'Tous' ? 'Toutes categories' : c}</option>)}
                </select>
                <select className="filter-select" value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}>
                    {RISKS.map(r => <option key={r} value={r}>{r === 'Tous' ? 'Tous risques' : r}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>CAS</th>
                                <th>Formule</th>
                                <th>Catégorie</th>
                                <th>Sous-catégorie</th>
                                <th>Risque</th>
                                <th>Fournisseur</th>
                                <th>Statut</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((ing) => (
                                <tr key={ing.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ing.name}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{ing.casNumber}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{ing.formula}</td>
                                    <td><span className={`badge ${getCategoryBadgeClass(ing.category)}`}>{ing.category}</span></td>
                                    <td style={{ fontSize: 'var(--font-xs)' }}>{ing.subCategory}</td>
                                    <td><span className={`badge ${getRiskBadgeClass(ing.riskClass)}`}>{ing.riskClass}</span></td>
                                    <td style={{ fontSize: 'var(--font-xs)' }}>{ing.supplier}</td>
                                    <td><span className={`badge ${getStatusBadgeClass(ing.status)}`}>{ing.status}</span></td>
                                    <td>
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => setSelectedIngredient(ing)}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button className="pagination-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
            )}

            {/* Detail Panel */}
            {selectedIngredient && (
                <>
                    <div className="detail-panel-overlay" onClick={() => setSelectedIngredient(null)} />
                    <div className="detail-panel">
                        <div className="detail-panel-header">
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>{selectedIngredient.name}</h2>
                            <button className="detail-panel-close" onClick={() => setSelectedIngredient(null)}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="detail-section">
                            <div className="detail-section-title">Identification</div>
                            <div className="detail-field">
                                <span className="detail-field-label">ID</span>
                                <span className="detail-field-value">{selectedIngredient.id}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Numéro CAS</span>
                                <span className="detail-field-value" style={{ fontFamily: 'monospace' }}>{selectedIngredient.casNumber}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Formule</span>
                                <span className="detail-field-value" style={{ fontFamily: 'monospace' }}>{selectedIngredient.formula}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Masse molaire</span>
                                <span className="detail-field-value">{selectedIngredient.molarMass ? `${selectedIngredient.molarMass} g/mol` : 'Polymère'}</span>
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="detail-section-title">Classification</div>
                            <div className="detail-field">
                                <span className="detail-field-label">Catégorie</span>
                                <span className={`badge ${getCategoryBadgeClass(selectedIngredient.category)}`}>{selectedIngredient.category}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Sous-catégorie</span>
                                <span className="detail-field-value">{selectedIngredient.subCategory}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Classe de risque</span>
                                <span className={`badge ${getRiskBadgeClass(selectedIngredient.riskClass)}`}>{selectedIngredient.riskClass}</span>
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="detail-section-title">Propriétés</div>
                            <div className="detail-field">
                                <span className="detail-field-label">Solubilité</span>
                                <span className="detail-field-value">{selectedIngredient.solubility}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Fournisseur</span>
                                <span className="detail-field-value">{selectedIngredient.supplier}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Statut</span>
                                <span className={`badge ${getStatusBadgeClass(selectedIngredient.status)}`}>{selectedIngredient.status}</span>
                            </div>
                            <div className="detail-field">
                                <span className="detail-field-label">Date d&apos;ajout</span>
                                <span className="detail-field-value">{selectedIngredient.dateAdded}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
