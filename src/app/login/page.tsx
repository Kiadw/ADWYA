'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Building3D from '@/components/Building3D';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

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
    >
      {/* Google Stitch-like Full Screen Grid Background with Hover */}
      <div className={styles.gridPattern}>
        <div className={styles.gridGlow} />
      </div>

      {/* FULL SCREEN 3D Model (Transparent Background) */}
      <div className={styles.modelWrapper}>
        <Building3D />
      </div>
      
      <div className={styles.brandTop}>
        <h2 className={styles.brandName}>ADWYA</h2>
        <p className={styles.brandSub}>PharmaTech Hub</p>
      </div>
      
      <div className={styles.footerText}>
        <p>Plateforme sécurisée d&apos;analyse, structuration et classification des données pharmaceutiques.</p>
      </div>

      {/* Form Container (Floating on Right) */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Connexion</h1>
          <p className={styles.formSubtitle}>Accès sécurisé au réseau ADWYA</p>
        </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className={styles.errorBox}>
                {error}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Adresse Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@adwya.com.tn" 
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Mot de passe
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className={styles.formInput}
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" className={styles.link}>
                Oublié ?
              </a>
            </div>

            <button 
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
