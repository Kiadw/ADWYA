'use client';

import { useState } from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, CheckCircle2, HelpCircle, Clock, Zap, Cpu } from 'lucide-react';
import { classifyIngredient, type ClassificationResult } from '@/lib/classifier';
import { getCategoryBadgeClass, getRiskBadgeClass } from '@/lib/data';

interface OpenAIResult {
    name: string;
    category?: string;
    subCategory?: string;
    riskClass?: string;
    pharmacologicalAction?: string;
    description?: string;
    interactions?: string[];
    contraindications?: string[];
    dosageRange?: string;
    storageConditions?: string;
    source?: string;
    error?: string;
    fallback?: boolean;
}

export default function ClassificationPage() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<ClassificationResult[]>([]);
    const [openaiResults, setOpenaiResults] = useState<Record<string, OpenAIResult>>({});
    const [openaiLoading, setOpenaiLoading] = useState<Record<string, boolean>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchOpenAIAnalysis = async (ingredientName: string) => {
        setOpenaiLoading(prev => ({ ...prev, [ingredientName]: true }));
        try {
            const res = await fetch('/api/openai-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'classify', data: { ingredientName } }),
            });
            const data = await res.json();
            setOpenaiResults(prev => ({ ...prev, [ingredientName]: { name: ingredientName, ...data } }));
        } catch {
            setOpenaiResults(prev => ({ ...prev, [ingredientName]: { name: ingredientName, error: 'Connexion échouée' } }));
        }
        setOpenaiLoading(prev => ({ ...prev, [ingredientName]: false }));
    };

    const handleClassify = () => {
        if (!input.trim()) return;
        setIsProcessing(true);
        const name = input.trim();

        // Rule-based classification
        setTimeout(() => {
            const result = classifyIngredient(name);
            setResults(prev => [result, ...prev]);
            setInput('');
            setIsProcessing(false);
        }, 800);

        // Parallel OpenAI deep analysis
        fetchOpenAIAnalysis(name);
    };

    const handleBatchClassify = () => {
        const examples = [
            'Paracétamol', 'Ibuprofène', 'Amoxicilline', 'Lactose',
            'Oméprazole', 'Cellulose microcristalline', 'Stéarate de magnésium',
            'Ciprofloxacine', 'Eau purifiée PPI', 'Méthylparaben',
            'Vitamine C', 'Prednisolone',
        ];
        setIsProcessing(true);
        setTimeout(() => {
            const batch = examples.map(name => classifyIngredient(name));
            setResults(prev => [...batch, ...prev]);
            setIsProcessing(false);
        }, 1500);
    };

    const getConfidenceColor = (c: number) => {
        if (c >= 0.85) return 'var(--accent-primary)';
        if (c >= 0.6) return 'var(--accent-warm)';
        return 'var(--accent-rose)';
    };

    const getConfidenceIcon = (c: number) => {
        if (c >= 0.85) return <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)' }} />;
        if (c >= 0.6) return <AlertTriangle size={18} style={{ color: 'var(--accent-warm)' }} />;
        return <HelpCircle size={18} style={{ color: 'var(--accent-rose)' }} />;
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Classification IA</h1>
                <p className="page-subtitle">
                    Moteur de classification pharmacologique automatique par règles et analyse de nomenclature DCI
                </p>
            </div>

            {/* Input area */}
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card-header">
                    <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BrainCircuit size={18} style={{ color: 'var(--accent-primary)' }} />
                        Analyser un ingrédient
                    </span>
                    <button className="btn btn-secondary" onClick={handleBatchClassify} disabled={isProcessing}>
                        <Sparkles size={16} />
                        Classification batch (12 exemples)
                    </button>
                </div>

                <div className="classify-input-area">
                    <input
                        type="text"
                        placeholder="Entrer un nom d'ingrédient pharmaceutique (ex: Paracétamol, Lactose, Oméprazole...)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleClassify()}
                        disabled={isProcessing}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleClassify}
                        disabled={isProcessing || !input.trim()}
                        style={{ minWidth: 140 }}
                    >
                        {isProcessing ? (
                            <span className="loading-pulse">Analyse...</span>
                        ) : (
                            <>
                                <BrainCircuit size={16} />
                                Classifier
                            </>
                        )}
                    </button>
                </div>

                {/* Quick suggestions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginRight: 4 }}>Suggestions :</span>
                    {['Aspirine', 'Metformine', 'Doxycycline', 'Povidone', 'Glycérol', 'Tramadol', 'Diazépam'].map(s => (
                        <button
                            key={s}
                            className="btn btn-ghost"
                            style={{ fontSize: 'var(--font-xs)', padding: '2px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-primary)' }}
                            onClick={() => { setInput(s); }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {results.length === 0 ? (
                <div className="empty-state">
                    <BrainCircuit size={64} className="empty-state-icon" />
                    <h3 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>Aucune classification</h3>
                    <p style={{ fontSize: 'var(--font-sm)' }}>
                        Saisissez un nom d&apos;ingrédient ou lancez une classification batch pour commencer.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                            <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                            {results.length} classification{results.length > 1 ? 's' : ''} effectuée{results.length > 1 ? 's' : ''}
                        </span>
                        <button className="btn btn-ghost" style={{ fontSize: 'var(--font-xs)' }} onClick={() => setResults([])}>
                            Effacer l&apos;historique
                        </button>
                    </div>

                    {results.map((result, idx) => (
                        <div className="classification-result" key={`${result.name}-${idx}`}>
                            <div className="result-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    {getConfidenceIcon(result.confidence)}
                                    <span className="result-name">{result.name}</span>
                                    <span className={`badge ${getCategoryBadgeClass(result.category)}`}>{result.category}</span>
                                </div>
                                <span className={`badge ${getRiskBadgeClass(result.riskClass)}`}>Risque : {result.riskClass}</span>
                            </div>

                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', marginBottom: 4 }}>
                                    <span style={{ color: 'var(--text-tertiary)' }}>Confiance</span>
                                    <span style={{ color: getConfidenceColor(result.confidence), fontWeight: 700 }}>
                                        {(result.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="confidence-bar">
                                    <div
                                        className="confidence-fill"
                                        style={{
                                            width: `${result.confidence * 100}%`,
                                            background: `linear-gradient(90deg, ${getConfidenceColor(result.confidence)}, ${getConfidenceColor(result.confidence)}dd)`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="result-details">
                                <div className="result-detail-item">
                                    <span className="result-detail-label">Sous-catégorie</span>
                                    <span className="result-detail-value">{result.subCategory}</span>
                                </div>
                                <div className="result-detail-item">
                                    <span className="result-detail-label">Action pharmacologique</span>
                                    <span className="result-detail-value">{result.pharmacologicalAction}</span>
                                </div>
                                <div className="result-detail-item">
                                    <span className="result-detail-label">Description</span>
                                    <span className="result-detail-value" style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{result.description}</span>
                                </div>
                                {result.commonUses.length > 0 && (
                                    <div className="result-detail-item">
                                        <span className="result-detail-label">Utilisations</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                            {result.commonUses.map((u, i) => (
                                                <span key={i} className="badge badge-gray">{u}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* OpenAI Deep Analysis Panel */}
                            <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(27, 117, 188, 0.04)', border: '1px solid rgba(27, 117, 188, 0.12)' }}>
                                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Zap size={12} /> Analyse approfondie — OpenAI GPT
                                </div>
                                {openaiLoading[result.name] ? (
                                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Cpu size={14} style={{ animation: 'pulse 1.5s infinite' }} /> Analyse GPT en cours…
                                    </div>
                                ) : openaiResults[result.name] ? (
                                    openaiResults[result.name].error || openaiResults[result.name].fallback ? (
                                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                                            Analyse GPT non disponible (clé API non configurée)
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                                            {openaiResults[result.name].interactions && openaiResults[result.name].interactions!.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>INTERACTIONS</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                        {openaiResults[result.name].interactions!.slice(0, 4).map((it, i) => (
                                                            <span key={i} className="badge badge-amber" style={{ fontSize: 10 }}>{it}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {openaiResults[result.name].contraindications && openaiResults[result.name].contraindications!.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>CONTRE-INDICATIONS</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                        {openaiResults[result.name].contraindications!.slice(0, 4).map((c, i) => (
                                                            <span key={i} className="badge badge-rose" style={{ fontSize: 10 }}>{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {openaiResults[result.name].dosageRange && (
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>POSOLOGIE</div>
                                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{openaiResults[result.name].dosageRange}</div>
                                                </div>
                                            )}
                                            {openaiResults[result.name].storageConditions && (
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4 }}>CONSERVATION</div>
                                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{openaiResults[result.name].storageConditions}</div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>En attente…</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
