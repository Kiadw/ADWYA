'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Search,
    Bell,
    HelpCircle,
    X,
    FlaskConical,
    User,
    LogOut,
    Moon,
    Globe,
    Clock,
    BrainCircuit,
    FileBarChart,
    ChevronRight,
    CheckCircle2,
    AlertTriangle,
    Settings,
} from 'lucide-react';
import { INGREDIENTS } from '@/lib/data';

// ---- Notifications (mock) ----
const NOTIFICATIONS = [
    { id: 1, icon: BrainCircuit, text: 'Classification batch terminee : 12 composants analyses', time: 'Il y a 5 min', read: false, color: 'var(--accent-primary)' },
    { id: 2, icon: AlertTriangle, text: 'Revue de risque requise : Morphine sulfate', time: 'Il y a 2h', read: false, color: 'var(--accent-rose)' },
    { id: 3, icon: CheckCircle2, text: 'Export CSV termine avec succes', time: 'Il y a 3h', read: true, color: 'var(--accent-primary)' },
    { id: 4, icon: FileBarChart, text: 'Nouveau rapport mensuel disponible', time: 'Hier', read: true, color: 'var(--accent-secondary)' },
];

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof INGREDIENTS>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const userName = user?.user_metadata?.full_name || 'Utilisateur';
    const userRole = user?.user_metadata?.role || 'Membre';
    const userDept = user?.user_metadata?.department || 'Equipe ADWYA';
    const initials = getInitials(userName);

    // Live search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length >= 2) {
            const q = query.toLowerCase();
            const results = INGREDIENTS.filter(i =>
                i.name.toLowerCase().includes(q) ||
                i.casNumber.includes(q) ||
                i.formula.toLowerCase().includes(q) ||
                i.subCategory.toLowerCase().includes(q)
            ).slice(0, 6);
            setSearchResults(results);
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <>
            <header className="header">
                {/* Search */}
                <div ref={searchRef} style={{ position: 'relative' }}>
                    <div className="header-search">
                        <Search size={16} className="header-search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un ingredient, une formulation..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex' }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {showSearch && searchResults.length > 0 && (
                        <div className="dropdown" style={{ left: 0, right: 'auto', minWidth: 360 }}>
                            <div className="dropdown-header" style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                                {searchResults.length} resultat{searchResults.length > 1 ? 's' : ''}
                            </div>
                            {searchResults.map(ing => (
                                <div
                                    key={ing.id}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setShowSearch(false);
                                        setSearchQuery('');
                                        router.push('/ingredients');
                                    }}
                                >
                                    <FlaskConical size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--font-sm)' }}>{ing.name}</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                                            {ing.category} — {ing.subCategory}
                                        </div>
                                    </div>
                                    <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {showSearch && searchResults.length === 0 && searchQuery.length >= 2 && (
                        <div className="dropdown" style={{ left: 0, right: 'auto', minWidth: 300 }}>
                            <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                                Aucun resultat pour &quot;{searchQuery}&quot;
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-actions">
                    {/* Help */}
                    <button className="header-btn" title="Aide" onClick={() => setShowHelp(true)}>
                        <HelpCircle size={18} />
                    </button>

                    {/* Notifications */}
                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button
                            className="header-btn"
                            title="Notifications"
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        >
                            <Bell size={18} />
                            {NOTIFICATIONS.some(n => !n.read) && <span className="header-btn-badge" />}
                        </button>

                        {showNotifications && (
                            <div className="dropdown">
                                <div className="dropdown-header">
                                    <div style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>Notifications</div>
                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                        {NOTIFICATIONS.filter(n => !n.read).length} non lue{NOTIFICATIONS.filter(n => !n.read).length > 1 ? 's' : ''}
                                    </div>
                                </div>
                                {NOTIFICATIONS.map(notif => {
                                    const Icon = notif.icon;
                                    return (
                                        <div key={notif.id} className="dropdown-item" style={{ opacity: notif.read ? 0.6 : 1 }}>
                                            <Icon size={16} style={{ color: notif.color, flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-primary)', lineHeight: 1.4 }}>{notif.text}</div>
                                                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={10} /> {notif.time}
                                                </div>
                                            </div>
                                            {!notif.read && (
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div ref={profileRef} style={{ position: 'relative' }}>
                        <div
                            className="header-avatar"
                            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        >
                            {initials}
                        </div>

                        {showProfile && (
                            <div className="dropdown" style={{ minWidth: 240 }}>
                                <div className="dropdown-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-full)',
                                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, color: 'white', flexShrink: 0,
                                    }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{userName}</div>
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{userDept}</div>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={() => { setShowProfile(false); router.push('/settings'); }}>
                                    <User size={16} /> Mon profil
                                </div>
                                <div className="dropdown-item" onClick={() => { setShowProfile(false); router.push('/settings'); }}>
                                    <Settings size={16} /> Parametres
                                </div>
                                <div className="dropdown-item">
                                    <Globe size={16} /> Langue : Francais
                                </div>
                                <div className="dropdown-item">
                                    <Moon size={16} /> Theme sombre
                                </div>
                                <div className="dropdown-divider" />
                                <div className="dropdown-item" style={{ color: 'var(--accent-rose)' }} onClick={handleLogout}>
                                    <LogOut size={16} /> Deconnexion
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Help Modal */}
            {showHelp && (
                <div className="modal-overlay" onClick={() => setShowHelp(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h2 className="modal-title" style={{ margin: 0 }}>Centre d&apos;aide</h2>
                            <button className="detail-panel-close" onClick={() => setShowHelp(false)}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="modal-section">
                            <h3 className="modal-section-title">A propos d&apos;ADWYA Analytics</h3>
                            <p>
                                Plateforme d&apos;analyse et de classification des donnees pharmaceutiques.
                                Developpee pour faciliter la gestion des ingredients, principes actifs et
                                formulations au sein des equipes techniques et scientifiques.
                            </p>
                        </div>

                        <div className="modal-section">
                            <h3 className="modal-section-title">Fonctionnalites principales</h3>
                            <p>
                                - Tableau de bord avec indicateurs en temps reel<br />
                                - Base de donnees de 45+ ingredients pharmaceutiques<br />
                                - Moteur de classification IA avec scoring de confiance<br />
                                - Gestion des formulations avec composition detaillee<br />
                                - Rapports et export de donnees (CSV, JSON)
                            </p>
                        </div>

                        <div className="modal-section">
                            <h3 className="modal-section-title">Raccourcis</h3>
                            <p>
                                - Utilisez la barre de recherche pour trouver rapidement un ingredient<br />
                                - Cliquez sur &quot;Visite guidee&quot; dans la sidebar pour decouvrir les fonctionnalites<br />
                                - Exportez vos donnees depuis les pages Ingredients et Rapports
                            </p>
                        </div>

                        <div style={{ marginTop: 'var(--space-lg)' }}>
                            <button className="btn btn-primary" onClick={() => setShowHelp(false)}>
                                Compris
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
