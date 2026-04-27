'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    LayoutDashboard,
    FlaskConical,
    Pill,
    BrainCircuit,
    FileBarChart,
    Settings,
    ShieldCheck,
    Compass,
    X,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';

const NAV_SECTIONS = [
    {
        title: 'Principal',
        links: [
            { href: '/', label: 'Dashboard', icon: LayoutDashboard, id: 'nav-dashboard' },
            { href: '/ingredients', label: 'Ingredients', icon: FlaskConical, badge: '45', id: 'nav-ingredients' },
            { href: '/formulations', label: 'Formulations', icon: Pill, id: 'nav-formulations' },
        ],
    },
    {
        title: 'Intelligence Artificielle',
        links: [
            { href: '/classification', label: 'Classification IA', icon: BrainCircuit, id: 'nav-classification' },
        ],
    },
    {
        title: 'Analyse',
        links: [
            { href: '/reports', label: 'Rapports', icon: FileBarChart, id: 'nav-reports' },
        ],
    },
];

const TOUR_STEPS = [
    {
        targetId: 'nav-dashboard',
        title: 'Tableau de bord',
        desc: 'Vue d\'ensemble de la plateforme : indicateurs cles (KPI), repartition des ingredients par categorie, activite recente et distribution des niveaux de risque.',
    },
    {
        targetId: 'nav-ingredients',
        title: 'Base de donnees Ingredients',
        desc: 'Consultez et recherchez parmi 45 ingredients pharmaceutiques. Filtrez par categorie, niveau de risque, et exportez les donnees en CSV.',
    },
    {
        targetId: 'nav-formulations',
        title: 'Formulations',
        desc: 'Explorez les formulations pharmaceutiques avec leur composition detaillee, les dosages et les roles de chaque ingredient.',
    },
    {
        targetId: 'nav-classification',
        title: 'Classification IA',
        desc: 'Moteur de classification automatique : saisissez un nom d\'ingredient et obtenez instantanement sa categorie, son action pharmacologique et un score de confiance.',
    },
    {
        targetId: 'nav-reports',
        title: 'Rapports & Analytiques',
        desc: 'Statistiques agregees, tendances mensuelles, repartition par fournisseur et export du rapport complet en JSON.',
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [tourActive, setTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [spotlightPos, setSpotlightPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const positionTooltip = useCallback((step: number) => {
        const el = document.getElementById(TOUR_STEPS[step].targetId);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setSpotlightPos({
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
        });
        setTooltipPos({
            top: rect.top,
            left: rect.right + 16,
        });
    }, []);

    useEffect(() => {
        if (tourActive) {
            positionTooltip(tourStep);
        }
    }, [tourActive, tourStep, positionTooltip]);

    const startTour = () => {
        setTourStep(0);
        setTourActive(true);
    };

    const nextStep = () => {
        if (tourStep < TOUR_STEPS.length - 1) {
            setTourStep(s => s + 1);
        } else {
            setTourActive(false);
        }
    };

    const prevStep = () => {
        if (tourStep > 0) setTourStep(s => s - 1);
    };

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Image
                        src="/logo-adwya.png"
                        alt="ADWYA"
                        width={36}
                        height={36}
                        className="sidebar-logo-img"
                    />
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name">ADWYA</span>
                        <span className="sidebar-brand-subtitle">Pharma Analytics</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <div className="sidebar-section-title">{section.title}</div>
                            {section.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        id={link.id}
                                        className={`sidebar-link ${isActive ? 'active' : ''}`}
                                    >
                                        <Icon size={20} className="sidebar-link-icon" />
                                        <span>{link.label}</span>
                                        {link.badge && <span className="sidebar-badge">{link.badge}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid var(--border-primary)' }}>
                    {/* Guided Tour button */}
                    <div
                        className="sidebar-link"
                        style={{ cursor: 'pointer', marginBottom: 'var(--space-xs)' }}
                        onClick={startTour}
                    >
                        <Compass size={20} className="sidebar-link-icon" />
                        <span>Visite guidee</span>
                    </div>

                    <Link href="/settings" className={`sidebar-link ${pathname === '/settings' ? 'active' : ''}`}>
                        <Settings size={20} className="sidebar-link-icon" />
                        <span>Parametres</span>
                    </Link>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                        padding: 'var(--space-md)', marginTop: 'var(--space-sm)',
                        borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
                    }}>
                        <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>v2.4.1</div>
                            Licence Pro
                        </div>
                    </div>
                </div>
            </aside>

            {/* Guided Tour Overlay */}
            {tourActive && (
                <>
                    <div className="tour-overlay" onClick={() => setTourActive(false)} />
                    <div
                        className="tour-spotlight"
                        style={{
                            top: spotlightPos.top,
                            left: spotlightPos.left,
                            width: spotlightPos.width,
                            height: spotlightPos.height,
                        }}
                    />
                    <div
                        className="tour-tooltip"
                        style={{ top: tooltipPos.top, left: tooltipPos.left }}
                    >
                        <div className="tour-tooltip-title">{TOUR_STEPS[tourStep].title}</div>
                        <div className="tour-tooltip-desc">{TOUR_STEPS[tourStep].desc}</div>
                        <div className="tour-tooltip-footer">
                            <span className="tour-step-indicator">
                                {tourStep + 1} / {TOUR_STEPS.length}
                            </span>
                            <div className="tour-tooltip-actions">
                                {tourStep > 0 && (
                                    <button className="btn btn-ghost" onClick={prevStep} style={{ padding: '4px 10px' }}>
                                        <ChevronLeft size={14} />
                                        Precedent
                                    </button>
                                )}
                                <button className="btn btn-primary" onClick={nextStep} style={{ padding: '4px 14px' }}>
                                    {tourStep < TOUR_STEPS.length - 1 ? (
                                        <>Suivant <ChevronRight size={14} /></>
                                    ) : (
                                        'Terminer'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
