'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

/** Real SMILES from ADWYA medications database */
const FLOATING_SMILES = [
  { name: 'Losartan', smiles: 'CCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NN=N[NH]4)CO)Cl' },
  { name: 'Paracetamol', smiles: 'CC(=O)NC1=CC=C(C=C1)O' },
  { name: 'Metformine', smiles: 'CN(C)C(=N)NC(=N)N' },
  { name: 'Amoxicilline', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C' },
  { name: 'Fluoxetine', smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F' },
  { name: 'Ibuprofene', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
  { name: 'Omeprazole', smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=CC=CC=C3N2' },
  { name: 'Amlodipine', smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN' },
  { name: 'Enalapril', smiles: 'CCOC(=O)C(CCC1=CC=CC=C1)NC(C)C(=O)N1CCCC1C(=O)O' },
  { name: 'Atorvastatine', smiles: 'CC(C)C1=C(C(=CC=C1)C2=CC=CC=C2)N3C=C(C(C3=O)O)CC(CC(=O)O)O' },
];

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Stitch magnetic tilt on form card
    if (formRef.current) {
      const formRect = formRef.current.getBoundingClientRect();
      const cx = formRect.left + formRect.width / 2;
      const cy = formRect.top + formRect.height / 2;
      const dx = (e.clientX - cx) / formRect.width;
      const dy = (e.clientY - cy) / formRect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1.5) {
        const tiltX = dy * -3;
        const tiltY = dx * 3;
        formRef.current.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        formRef.current.style.setProperty('--glow-x', `${(dx + 0.5) * 100}%`);
        formRef.current.style.setProperty('--glow-y', `${(dy + 0.5) * 100}%`);
        formRef.current.style.setProperty('--glow-opacity', `${Math.max(0, 0.6 - dist * 0.4)}`);
      } else {
        formRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        formRef.current.style.setProperty('--glow-opacity', '0');
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (formRef.current) {
      formRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      formRef.current.style.setProperty('--glow-opacity', '0');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.loginContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid background with cursor glow */}
      <div className={styles.gridPattern}>
        <div className={styles.gridGlow} />
      </div>

      {/* Floating SMILES strings */}
      <div className={styles.smilesLayer}>
        {FLOATING_SMILES.map((mol, i) => (
          <div key={mol.name} className={styles.smilesItem} style={{ animationDelay: `${i * 2.1}s` }}>
            <span className={styles.smilesString}>{mol.smiles}</span>
            <span className={styles.smilesLabel}>{mol.name}</span>
          </div>
        ))}
      </div>

      {/* Brand top-left */}
      <div className={styles.brandTop}>
        <h2 className={styles.brandName}>ADWYA</h2>
        <p className={styles.brandSub}>PharmaTech Hub</p>
      </div>

      <div className={styles.footerText}>
        <p>Plateforme securisee d&apos;analyse, structuration et classification des donnees pharmaceutiques.</p>
      </div>

      {/* Form card */}
      <div ref={formRef} className={styles.formCard}>
        <div className={styles.formGlow} />

        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Connexion</h1>
          <p className={styles.formSubtitle}>Acces securise au reseau ADWYA</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Adresse Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@adwya.com.tn"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mot de passe</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" className={styles.link}>Oublie ?</a>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <div className={styles.addressFooter}>
          <p>Route de la Marsa, GP 9, Km 14</p>
          <p>2070 La Marsa, Tunis, Tunisie</p>
        </div>
      </div>
    </div>
  );
}
