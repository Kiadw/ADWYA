'use client';
import { Deck, Slide, FlexBox, Text } from 'spectacle';
import Link from 'next/link';
import {
    ArrowLeft, ArrowRight, FileSpreadsheet, FolderX, SearchX,
    KeyRound, Eye, ScrollText, Rocket, GraduationCap
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Charte ADWYA (brand_assets/BRAND.md)
// ---------------------------------------------------------------------------
const BLUE = '#006BA6';
const GREEN = '#62BD19';
const INK = '#1A2B33';
const MUTED = '#5A6B73';
const BORDER = '#E3E8EB';
const SURFACE = '#F7F9FA';
const BLUE_TINT = '#E8F2F8';
const GREEN_TINT = '#EFF8E6';
const FONT = 'system-ui, -apple-system, sans-serif';

const theme = {
    colors: {
        primary: INK,
        secondary: GREEN,
        tertiary: '#ffffff',
        quaternary: BLUE,
        quinary: MUTED
    },
    fonts: { header: FONT, text: FONT }
};

// Pagination (template conservé)
const renderTemplate = ({ slideNumber, numberOfSlides }: { slideNumber: number, numberOfSlides: number }) => (
    <FlexBox
        justifyContent="flex-end"
        position="absolute"
        bottom={0}
        right={0}
        width="100%"
        padding="15px 30px"
        zIndex={1}
    >
        <Text fontSize="1rem" color="quinary" margin="0px" style={{ fontWeight: 500 }}>
            Skander ZOUHIR - Stagiaire ADWYA • {slideNumber} / {numberOfSlides}
        </Text>
    </FlexBox>
);

// ---------------------------------------------------------------------------
// Briques minimalistes
// ---------------------------------------------------------------------------
function Body({ children, gap = 26 }: { children: ReactNode, gap?: number }) {
    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap,
            fontFamily: FONT, paddingBottom: 46
        }}>
            {children}
        </div>
    );
}

function Kicker({ children, color = BLUE, bg = BLUE_TINT }: { children: ReactNode, color?: string, bg?: string }) {
    return (
        <div style={{
            padding: '7px 20px', borderRadius: 999, background: bg, color,
            fontWeight: 700, fontSize: 15, letterSpacing: 0.4
        }}>
            {children}
        </div>
    );
}

function H({ children, size = 48 }: { children: ReactNode, size?: number }) {
    return (
        <h2 style={{
            margin: 0, fontSize: size, fontWeight: 800, color: INK,
            textAlign: 'center', letterSpacing: -1, lineHeight: 1.12
        }}>
            {children}
        </h2>
    );
}

function Sub({ children, size = 21 }: { children: ReactNode, size?: number }) {
    return (
        <p style={{ margin: 0, fontSize: size, color: MUTED, textAlign: 'center', lineHeight: 1.5 }}>
            {children}
        </p>
    );
}

function Chips({ items }: { items: { label: string, dot: string }[] }) {
    return (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {items.map(({ label, dot }) => (
                <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '9px 20px', borderRadius: 999, background: SURFACE,
                    border: `1px solid ${BORDER}`, color: INK, fontSize: 17, fontWeight: 600
                }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: dot }} />
                    {label}
                </span>
            ))}
        </div>
    );
}

const frame: CSSProperties = {
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    boxShadow: '0 20px 45px rgba(26,43,51,0.10)'
};

// Grande capture qui occupe tout l’espace restant, sans déformation
function Hero({ children }: { children: ReactNode }) {
    return (
        <div style={{
            flex: 1, minHeight: 0, width: '100%', display: 'flex',
            justifyContent: 'center', alignItems: 'center', gap: 28
        }}>
            {children}
        </div>
    );
}

function Shot({ src, alt, maxWidth = '88%' }: { src: string, alt: string, maxWidth?: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            style={{ maxHeight: '100%', maxWidth, width: 'auto', height: 'auto', objectFit: 'contain', ...frame }}
        />
    );
}

function Card({ icon, title, line, tint }: { icon: ReactNode, title: string, line: string, tint: string }) {
    return (
        <div style={{
            flex: 1, maxWidth: 350, padding: '36px 30px', borderRadius: 18,
            background: SURFACE, border: `1px solid ${BORDER}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
        }}>
            <div style={{
                width: 62, height: 62, borderRadius: 16, background: tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div style={{ fontSize: 23, fontWeight: 700, color: INK, textAlign: 'center' }}>{title}</div>
            <div style={{ fontSize: 17, color: MUTED, textAlign: 'center', lineHeight: 1.45 }}>{line}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Le deck
// ---------------------------------------------------------------------------
export default function PitchDeckPage() {
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Nav overlay (conservée) */}
            <div style={{
                position: 'absolute', top: 20, left: 20, zIndex: 100,
                background: 'rgba(255,255,255,0.9)', padding: '10px 20px',
                borderRadius: 30, boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', gap: 10
            }}>
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: INK, textDecoration: 'none', fontWeight: 600,
                    fontSize: 14, paddingRight: 10, borderRight: `1px solid ${BORDER}`
                }}>
                    <ArrowLeft size={16} /> Retour
                </Link>
                <button
                    onClick={() => {
                        window.location.search = '?exportMode=true';
                        setTimeout(() => window.print(), 1000);
                    }}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: BLUE, fontWeight: 600, fontSize: 14,
                        display: 'flex', alignItems: 'center', gap: 8
                    }}
                >
                    Exporter PDF
                </button>
            </div>

            <Deck theme={theme} template={renderTemplate}>

                {/* 1 — Titre */}
                <Slide backgroundColor="tertiary">
                    <div style={{ position: 'absolute', top: 34, right: 44, display: 'flex', alignItems: 'center', gap: 20, zIndex: 10 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo-insa.svg" width="96" style={{ objectFit: 'contain' }} alt="INSA Lyon" />
                    </div>
                    <Body gap={30}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/adwya_logo_full.png" width="230" style={{ objectFit: 'contain' }} alt="ADWYA" />
                        <H size={58}>La transformation digitale<br />des métiers d’ADWYA</H>
                        <Sub size={23}>Un portail, une connexion, quatre outils métiers.</Sub>
                    </Body>
                </Slide>

                {/* 2 — Le problème */}
                <Slide backgroundColor="tertiary">
                    <Body gap={40}>
                        <Kicker>Le point de départ</Kicker>
                        <H>Aujourd’hui, tout est manuel.</H>
                        <div style={{ display: 'flex', gap: 26, width: '92%', justifyContent: 'center' }}>
                            <Card
                                icon={<FileSpreadsheet size={30} color={BLUE} />}
                                tint={BLUE_TINT}
                                title="Papier & Excel"
                                line="Chaque service gère ses propres fichiers."
                            />
                            <Card
                                icon={<FolderX size={30} color={BLUE} />}
                                tint={BLUE_TINT}
                                title="Données éparpillées"
                                line="Aucune source d’information commune."
                            />
                            <Card
                                icon={<SearchX size={30} color={BLUE} />}
                                tint={BLUE_TINT}
                                title="Aucun suivi"
                                line="Pas d’historique, pas de mesure."
                            />
                        </div>
                    </Body>
                </Slide>

                {/* 3 — La solution */}
                <Slide backgroundColor="tertiary">
                    <Body>
                        <Kicker color={GREEN} bg={GREEN_TINT}>La solution</Kicker>
                        <H>Un portail. Une connexion. Quatre outils.</H>
                        <Hero>
                            <Shot src="/screenshots/v3/portal_dock.png" alt="Portail ADWYA — dock des applications" />
                        </Hero>
                    </Body>
                </Slide>

                {/* 4 — IA-CoA */}
                <Slide backgroundColor="tertiary">
                    <Body gap={22}>
                        <Kicker>IA-CoA — Qualité</Kicker>
                        <H>La qualité fournisseurs, mesurée.</H>
                        <Chips items={[
                            { label: 'Lecture automatique (OCR)', dot: BLUE },
                            { label: 'Statistiques SPC — Cp / Cpk', dot: GREEN },
                            { label: 'Rapport PDF en un clic', dot: BLUE }
                        ]} />
                        <Hero>
                            <Shot src="/screenshots/v3/coa_spc.png" alt="IA-CoA — cartes de contrôle SPC" />
                        </Hero>
                    </Body>
                </Slide>

                {/* 5 — Compétences */}
                <Slide backgroundColor="tertiary">
                    <Body gap={22}>
                        <Kicker color={GREEN} bg={GREEN_TINT}>Compétences — RH</Kicker>
                        <H>Bilans & entretiens annuels.</H>
                        <Sub>Le manager évalue&nbsp;→&nbsp;le HBU valide&nbsp;→&nbsp;le bilan est archivé.</Sub>
                        <Hero>
                            <Shot src="/screenshots/v3/comp_dashboard.png" alt="Compétences — tableau de bord des campagnes" />
                        </Hero>
                    </Body>
                </Slide>

                {/* 6 — La matrice, en un coup d’œil */}
                <Slide backgroundColor="tertiary">
                    <Body gap={22}>
                        <Hero>
                            <Shot src="/screenshots/v3/comp_matrice.png" alt="Matrice des compétences" maxWidth="92%" />
                        </Hero>
                        <div style={{ fontSize: 24, fontWeight: 700, color: INK, textAlign: 'center' }}>
                            88 collaborateurs × 69 compétences<span style={{ color: GREEN }}>.</span>
                        </div>
                    </Body>
                </Slide>

                {/* 7 — VAD */}
                <Slide backgroundColor="tertiary">
                    <Body gap={22}>
                        <Kicker>VAD — Terrain</Kicker>
                        <H>Le coaching terrain, même sans réseau.</H>
                        <Chips items={[
                            { label: 'Fonctionne hors connexion', dot: GREEN },
                            { label: '30 critères d’évaluation', dot: BLUE },
                            { label: 'Mobile & bureau', dot: GREEN }
                        ]} />
                        <Hero>
                            <Shot src="/screenshots/v3/vad_dashboard.png" alt="VAD — tableau de bord (bureau)" maxWidth="66%" />
                            <Shot src="/screenshots/v3/vad_mobile.png" alt="VAD — version mobile" maxWidth="20%" />
                        </Hero>
                    </Body>
                </Slide>

                {/* 8 — Planning */}
                <Slide backgroundColor="tertiary">
                    <Body gap={22}>
                        <Kicker color={GREEN} bg={GREEN_TINT}>Planning — Délégués</Kicker>
                        <H>Un planning validé par la hiérarchie.</H>
                        <Chips items={[
                            { label: 'Calendrier interactif', dot: BLUE },
                            { label: 'Validation N+1', dot: GREEN },
                            { label: 'Vue semestrielle', dot: BLUE }
                        ]} />
                        <Hero>
                            <Shot src="/screenshots/v3/dpm_calendrier_collab.png" alt="Planning — calendrier d’un collaborateur" />
                        </Hero>
                    </Body>
                </Slide>

                {/* 9 — Architecture */}
                <Slide backgroundColor="tertiary">
                    <Body gap={44}>
                        <Kicker>Architecture</Kicker>
                        <H>Trois briques, une plateforme.</H>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                            {[
                                { name: 'React', role: 'L’interface', color: BLUE },
                                { name: 'FastAPI', role: 'Les calculs', color: GREEN },
                                { name: 'Supabase', role: 'Les données', color: BLUE }
                            ].map((b, i) => (
                                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                                    {i > 0 && <ArrowRight size={30} color={MUTED} />}
                                    <div style={{
                                        width: 250, padding: '38px 20px', borderRadius: 18,
                                        background: SURFACE, border: `1px solid ${BORDER}`,
                                        borderTop: `4px solid ${b.color}`, textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: 34, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>{b.name}</div>
                                        <div style={{ fontSize: 18, color: MUTED, marginTop: 10 }}>{b.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Sub>Une seule base de données, partagée par les cinq applications.</Sub>
                    </Body>
                </Slide>

                {/* 10 — Sécurité & gouvernance */}
                <Slide backgroundColor="tertiary">
                    <Body gap={40}>
                        <Kicker>Sécurité & gouvernance</Kicker>
                        <H>Un accès simple, un contrôle total.</H>
                        <div style={{ display: 'flex', gap: 26, width: '92%', justifyContent: 'center' }}>
                            <Card
                                icon={<KeyRound size={30} color={GREEN} />}
                                tint={GREEN_TINT}
                                title="Une seule connexion"
                                line="Un identifiant unique pour tout l’écosystème (SSO)."
                            />
                            <Card
                                icon={<Eye size={30} color={GREEN} />}
                                tint={GREEN_TINT}
                                title="Des accès par rôle"
                                line="Chacun ne voit que ce qui le concerne."
                            />
                            <Card
                                icon={<ScrollText size={30} color={GREEN} />}
                                tint={GREEN_TINT}
                                title="Tout est tracé"
                                line="Chaque action est enregistrée (audit)."
                            />
                        </div>
                    </Body>
                </Slide>

                {/* 11 — Clôture */}
                <Slide backgroundColor="tertiary">
                    <Body gap={28}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/adwya_monogram.png" width="92" style={{ objectFit: 'contain' }} alt="Monogramme ADWYA" />
                        <H size={54}>Objectif Santé<span style={{ color: GREEN }}>.</span></H>
                        <div style={{
                            fontSize: 14, fontWeight: 700, letterSpacing: 2,
                            textTransform: 'uppercase', color: MUTED, marginTop: 10
                        }}>
                            Prochaines étapes
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '12px 24px', borderRadius: 999, background: SURFACE,
                                border: `1px solid ${BORDER}`, color: INK, fontSize: 19, fontWeight: 600
                            }}>
                                <Rocket size={20} color={BLUE} /> Déployer en production
                            </span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '12px 24px', borderRadius: 999, background: SURFACE,
                                border: `1px solid ${BORDER}`, color: INK, fontSize: 19, fontWeight: 600
                            }}>
                                <GraduationCap size={20} color={GREEN} /> Former les équipes
                            </span>
                        </div>
                    </Body>
                </Slide>

            </Deck>
        </div>
    );
}
