'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import styles from './login.module.css';

// Lazy-load 3D to avoid SSR issues
const MoleculeParticles = dynamic(() => import('@/components/MoleculeParticles'), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- STITCH MAGNETIC DISTORTION ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    setMousePos({ x: e.clientX, y: e.clientY });

    // Magnetic tilt on form card (Stitch parallax-weighted tilt)
    if (formRef.current) {
      const formRect = formRef.current.getBoundingClientRect();
      const formCenterX = formRect.left + formRect.width / 2;
      const formCenterY = formRect.top + formRect.height / 2;
      const distX = (e.clientX - formCenterX) / formRect.width;
      const distY = (e.clientY - formCenterY) / formRect.height;
      const dist = Math.sqrt(distX * distX + distY * distY);
      
      if (dist < 1.5) {
        // Magnetic fluidity -- element leans toward cursor
        const tiltX = distY * -4;
        const tiltY = distX * 4;
        const scale = 1 + Math.max(0, 0.015 - dist * 0.01);
        formRef.current.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
        // Vibe Glow -- spotlight within bounds
        formRef.current.style.setProperty('--glow-x', `${(distX + 0.5) * 100}%`);
        formRef.current.style.setProperty('--glow-y', `${(distY + 0.5) * 100}%`);
        formRef.current.style.setProperty('--glow-opacity', `${Math.max(0, 1 - dist)}` );
      } else {
        formRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
        formRef.current.style.setProperty('--glow-opacity', '0');
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (formRef.current) {
      formRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
      formRef.current.style.setProperty('--glow-opacity', '0');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
      {/* Stitch Grid Background */}
      <div className={styles.gridPattern}>
        <div className={styles.gridGlow} />
      </div>

      {/* Pointille molecule particles (replaces 3D building) */}
      <div className={styles.modelWrapper}>
        <MoleculeParticles />
      </div>

      {/* Custom cursor aura */}
      <div className={styles.cursorAura} style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Brand */}
      <div className={styles.brandTop}>
        <h2 className={styles.brandName}>ADWYA</h2>
        <p className={styles.brandSub}>PharmaTech Hub</p>
      </div>

      <div className={styles.footerText}>
        <p>Plateforme securisee d&apos;analyse, structuration et classification des donnees pharmaceutiques.</p>
      </div>

      {/* Molecule labels floating */}
      <div className={styles.moleculeLabels}>
        {['Losartan', 'Paracetamol', 'Metformine', 'Amoxicilline', 'Fluoxetine', 'Ibuprofene'].map((name, i) => (
          <span key={name} className={styles.moleculeTag} style={{ animationDelay: `${i * 0.8}s` }}>{name}</span>
        ))}
      </div>

      {/* Form with Stitch magnetic tilt + vibe glow */}
      <div ref={formRef} className={styles.formCard}>
        {/* Inner glow spotlight (Stitch "Design Agent Aura") */}
        <div className={styles.formGlow} />
        
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Connexion</h1>
          <p className={styles.formSubtitle}>Acces securise au reseau ADWYA</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className={styles.errorBox}>{error}</div>
          )}
          
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

          <button 
            ref={btnRef}
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
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
