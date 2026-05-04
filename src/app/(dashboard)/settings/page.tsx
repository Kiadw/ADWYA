'use client';

import { useState } from 'react';
import {
    User,
    Shield,
    Bell,
    Globe,
    Moon,
    Database,
    Key,
    Save,
    CheckCircle2,
} from 'lucide-react';

interface SettingSection {
    id: string;
    title: string;
    icon: typeof User;
}

const SECTIONS: SettingSection[] = [
    { id: 'profile', title: 'Profil utilisateur', icon: User },
    { id: 'security', title: 'Securite', icon: Shield },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'display', title: 'Affichage', icon: Moon },
    { id: 'data', title: 'Donnees & Base', icon: Database },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Parametres</h1>
                <p className="page-subtitle">Configuration de la plateforme et preferences utilisateur</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-xl)' }}>
                {/* Section nav */}
                <div className="card" style={{ padding: 'var(--space-md)', height: 'fit-content' }}>
                    {SECTIONS.map(sec => {
                        const Icon = sec.icon;
                        return (
                            <div
                                key={sec.id}
                                className={`sidebar-link ${activeSection === sec.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(sec.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Icon size={18} className="sidebar-link-icon" />
                                <span>{sec.title}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="card">
                    {activeSection === 'profile' && (
                        <>
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                                Profil utilisateur
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Nom complet
                                    </label>
                                    <input className="filter-input" defaultValue="Dr. Skander Benali" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Email
                                    </label>
                                    <input className="filter-input" defaultValue="s.benali@adwya.com.tn" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Departement
                                    </label>
                                    <input className="filter-input" defaultValue="Recherche & Developpement" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Role
                                    </label>
                                    <select className="filter-select" defaultValue="admin" style={{ width: '100%' }}>
                                        <option value="admin">Administrateur</option>
                                        <option value="scientist">Scientifique</option>
                                        <option value="viewer">Consultant</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'security' && (
                        <>
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                                Securite
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Cle API Supabase
                                    </label>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <input className="filter-input" type="password" defaultValue="sb-xxxx-xxxx-xxxx" style={{ flex: 1 }} />
                                        <button className="btn btn-secondary"><Key size={14} /> Regenerer</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-lg)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>Authentification a deux facteurs</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>Protegez votre compte avec un second facteur</div>
                                    </div>
                                    <button className="btn btn-secondary">Activer</button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'notifications' && (
                        <>
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                                Notifications
                            </h2>
                            {[
                                { label: 'Classifications IA terminees', desc: 'Notification lorsqu\'une classification batch est terminee', on: true },
                                { label: 'Revues de risque', desc: 'Alertes pour les ingredients a risque eleve', on: true },
                                { label: 'Exports de donnees', desc: 'Confirmation apres chaque export CSV ou JSON', on: false },
                                { label: 'Mises a jour systeme', desc: 'Notifications de maintenance et mises a jour', on: true },
                            ].map((notif, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-primary)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>{notif.label}</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{notif.desc}</div>
                                    </div>
                                    <div style={{
                                        width: 44, height: 24, borderRadius: 'var(--radius-full)',
                                        background: notif.on ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                                    }}>
                                        <div style={{
                                            width: 18, height: 18, borderRadius: '50%', background: 'white',
                                            position: 'absolute', top: 3,
                                            left: notif.on ? 23 : 3,
                                            transition: 'left 0.2s',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {activeSection === 'display' && (
                        <>
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                                Affichage
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Langue
                                    </label>
                                    <select className="filter-select" defaultValue="fr" style={{ width: '100%', maxWidth: 300 }}>
                                        <option value="fr">Francais</option>
                                        <option value="en">English</option>
                                        <option value="ar">Arabe</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Theme
                                    </label>
                                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                        {[
                                            { label: 'Sombre', active: true },
                                            { label: 'Clair', active: false },
                                            { label: 'Systeme', active: false },
                                        ].map(t => (
                                            <div key={t.label} style={{
                                                padding: 'var(--space-md) var(--space-xl)',
                                                borderRadius: 'var(--radius-md)',
                                                border: `1px solid ${t.active ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                                                background: t.active ? 'rgba(96, 178, 70, 0.08)' : 'var(--bg-tertiary)',
                                                color: t.active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                cursor: 'pointer', fontWeight: 600, fontSize: 'var(--font-sm)',
                                            }}>
                                                {t.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--space-sm)' }}>
                                        Elements par page
                                    </label>
                                    <select className="filter-select" defaultValue="12" style={{ width: '100%', maxWidth: 300 }}>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'data' && (
                        <>
                            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                                Donnees & Base
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-lg)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Base de donnees Supabase</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                            Projet : ADWYA Pharma Platform | Region : eu-west-1
                                        </div>
                                    </div>
                                    <span className="badge badge-green">
                                        <CheckCircle2 size={12} style={{ marginRight: 4 }} /> Connecte
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                    <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>45</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Ingredients</div>
                                    </div>
                                    <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>8</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Formulations</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Save button */}
                    <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
                        {saved && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--accent-primary)', fontSize: 'var(--font-sm)', fontWeight: 600, animation: 'fadeIn 0.3s ease-out' }}>
                                <CheckCircle2 size={16} /> Parametres sauvegardes
                            </div>
                        )}
                        <button className="btn btn-primary" onClick={handleSave}>
                            <Save size={16} /> Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
