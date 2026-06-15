import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setError('Une erreur est survenue, réessaie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Connexion</title>
      </Head>
      <div className="login-page">
        <div className="login-card fade-up">
          <h1 className="login-title">Accès privé</h1>
          <p className="login-subtitle">Entre le mot de passe pour continuer.</p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="login-input"
              autoFocus
              required
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Vérification…' : 'Entrer'}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .login-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: var(--bg);
        }
        .login-card {
          width: 100%;
          max-width: 360px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px 28px;
        }
        .login-title {
          font-family: var(--font-display);
          font-size: 24px;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .login-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .login-input {
          width: 100%;
          padding: 11px 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 15px;
          outline: none;
          transition: border-color 0.15s;
        }
        .login-input:focus {
          border-color: var(--accent);
        }
        .login-input::placeholder {
          color: var(--text-dim);
        }
        .login-error {
          font-size: 13px;
          color: var(--red);
          background: var(--red-soft);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
        }
        .login-btn {
          width: 100%;
          padding: 11px;
          background: var(--accent);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-btn:not(:disabled):hover {
          opacity: 0.88;
        }
      `}</style>
    </>
  );
}
