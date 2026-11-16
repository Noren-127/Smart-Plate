import React, { useState } from 'react';
import { ChefHat, UserRound, AlertCircle, CheckCircle2, ArrowLeft, KeyRound, Lock, Mail, User } from 'lucide-react';
import { INITIAL_CHEF_USER, INITIAL_CUSTOMER_USER, findAccountByEmail, registerNewAccount, RegisteredAccount } from '../store/storage';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthenticated: (profile: UserProfile) => void;
  onBackToHome?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated, onBackToHome }) => {
  const [mode, setMode] = useState<'customer' | 'chef'>('customer');
  const [signup, setSignup] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chefCode, setChefCode] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleModeChange = (newMode: 'customer' | 'chef') => {
    setMode(newMode);
    setError('');
    setInfoMessage('');
  };

  const handleSwitchToSignup = () => {
    setSignup(true);
    setError('');
    setInfoMessage('');
  };

  const handleSwitchToSignin = () => {
    setSignup(false);
    setError('');
    setInfoMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    // --- CHEF AUTHENTICATION VIA ACCESS CODE ---
    if (mode === 'chef') {
      const code = chefCode.trim().toLowerCase();
      if (!code) {
        setError('Please enter the Chef access code.');
        return;
      }
      if (code !== 'chef2026') {
        setError('Invalid Chef access code.');
        return;
      }

      // Valid Chef Code -> Authenticate directly as Chef
      localStorage.setItem('nutrichef_auth', 'chef');
      onAuthenticated(INITIAL_CHEF_USER);
      return;
    }

    // --- CUSTOMER AUTHENTICATION (CHECK IF ACCOUNT AVAILABLE, IF NOT SIGN UP) ---
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    // 1. Customer Sign In Flow
    if (!signup) {
      let existingAccount = findAccountByEmail(cleanEmail);
      let authenticatedRemotely = false;
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        if (response.ok) {
          existingAccount = await response.json() as RegisteredAccount;
          registerNewAccount(existingAccount);
          authenticatedRemotely = true;
        } else if (response.status === 401) {
          // Keep the account-exists decision separate from password validation;
          // the users endpoint intentionally omits passwords.
          const accountsResponse = await fetch('http://localhost:3001/api/users');
          if (accountsResponse.ok) {
            const accounts = await accountsResponse.json() as RegisteredAccount[];
            existingAccount = accounts.find(account => account.email.toLowerCase() === cleanEmail) || existingAccount;
          }
        }
      } catch { /* local fallback */ }

      // Check if account exists -> if not, automatically switch to sign up!
      if (!existingAccount) {
        setSignup(true);
        setInfoMessage(`No account found for "${cleanEmail}". Enter your full name below to complete your registration.`);
        if (!name) {
          setName(cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        }
        return;
      }

      // Passwords are validated by the MongoDB API. Local-only accounts retain
      // the legacy comparison as a fallback when the API is unavailable.
      if (!authenticatedRemotely && (!existingAccount.password || existingAccount.password !== password)) {
        setError('Incorrect password. Please verify your credentials and try again.');
        return;
      }

      // Successful customer sign in
      localStorage.setItem('nutrichef_auth', 'customer');
      onAuthenticated(existingAccount.profile);
      return;
    }

    // 2. Customer Sign Up Flow
    if (signup) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      let existingAccount = findAccountByEmail(cleanEmail);
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (response.ok) {
          const remoteAccounts = await response.json() as RegisteredAccount[];
          existingAccount = remoteAccounts.find(account => account.email.toLowerCase() === cleanEmail) || existingAccount;
        }
      } catch { /* local fallback */ }
      if (existingAccount) {
        setSignup(false);
        setInfoMessage(`An account for "${cleanEmail}" already exists! Please enter your password to sign in.`);
        return;
      }

      const newId = `cust-${Date.now()}`;
      const newProfile: UserProfile = {
        ...INITIAL_CUSTOMER_USER,
        id: newId,
        name: name.trim(),
        role: 'customer'
      };

      const newAccount: RegisteredAccount = {
        id: newId,
        email: cleanEmail,
        password,
        name: name.trim(),
        role: 'customer',
        profile: newProfile
      };

      registerNewAccount(newAccount);
      fetch('http://localhost:3001/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAccount) }).catch(() => undefined);
      localStorage.setItem('nutrichef_auth', 'customer');
      onAuthenticated(newProfile);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', padding: '1.5rem' }}>
      <form className="auth-card" onSubmit={handleSubmit}>
        <style>{`
          .auth-card {
            width: 100%;
            max-width: 440px;
            background: #ffffff;
            border-radius: 20px;
            padding: 34px 36px;
            box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.05);
            box-sizing: border-box;
          }
          .auth-field {
            display: block;
            margin: 14px 0;
            color: #334155;
            font-size: 13px;
            font-weight: 700;
          }
          .auth-field input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin-top: 6px;
            padding: 12px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            color: #0f172a;
            font: inherit;
            font-size: 14px;
            font-weight: 500;
            outline: none;
            transition: all .2s ease;
          }
          .auth-field input:focus {
            background: #ffffff;
            border-color: #15803d;
            box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.15);
          }
          .chef-focus input:focus {
            border-color: #d97706 !important;
            box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15) !important;
          }
          .auth-submit {
            width: 100%;
            margin-top: 18px;
            padding: 13px;
            border: 0;
            border-radius: 10px;
            color: #fff;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            transition: transform .15s, opacity .15s;
          }
          .auth-submit:hover {
            opacity: 0.95;
            transform: translateY(-1px);
          }
          .auth-switch {
            width: 100%;
            margin-top: 14px;
            border: 0;
            background: none;
            color: #15803d;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
          }
          .auth-switch:hover {
            text-decoration: underline;
          }
        `}</style>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 16 }}
          >
            <ArrowLeft size={15} /> Back to Homepage
          </button>
        )}

        <div style={{ marginBottom: 18 }}>
              <h1 style={{ margin: 0, color: '#0f172a', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>SmartPlate</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0 0' }}>
            {mode === 'chef'
              ? 'Chef Studio portal & cohort management'
              : signup
              ? 'Create your customer account'
              : 'Sign in to access your precision meal plans'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px 0' }}>
          <button
            type="button"
            onClick={() => handleModeChange('customer')}
            style={{
              flex: 1,
              padding: '11px 12px',
              borderRadius: 10,
              border: `2px solid ${mode === 'customer' ? '#16a34a' : '#e2e8f0'}`,
              background: mode === 'customer' ? '#dcfce7' : '#fff',
              color: mode === 'customer' ? '#14532d' : '#64748b',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <UserRound size={16} /> Customer
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('chef')}
            style={{
              flex: 1,
              padding: '11px 12px',
              borderRadius: 10,
              border: `2px solid ${mode === 'chef' ? '#d97706' : '#e2e8f0'}`,
              background: mode === 'chef' ? '#fef3c7' : '#fff',
              color: mode === 'chef' ? '#92400e' : '#64748b',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <ChefHat size={16} /> Chef Portal
          </button>
        </div>

        {/* Informational Message (e.g. Account not found -> redirected to sign up) */}
        {infoMessage && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 10, padding: '10px 12px', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
            <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 10, padding: '10px 12px', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* CHEF LOGIN: Code Only */}
        {mode === 'chef' && (
          <div>
            <label className="auth-field chef-focus">
              Chef Access Code
              <input
                value={chefCode}
                onChange={e => setChefCode(e.target.value)}
                placeholder="Enter your access code"
                type="password"
                autoFocus
              />
            </label>
          </div>
        )}

        {/* CUSTOMER LOGIN & SIGN UP */}
        {mode === 'customer' && (
          <div>
            {signup && (
              <label className="auth-field">
                Full Name
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ko Min Thant"
                  autoFocus
                />
              </label>
            )}

            <label className="auth-field">
              Email Address
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </label>

            <label className="auth-field">
              Password
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                type="password"
              />
            </label>
          </div>
        )}

        <button
          className="auth-submit"
          type="submit"
          style={{ background: mode === 'chef' ? '#d97706' : '#15803d' }}
        >
          {mode === 'chef'
            ? 'Enter Chef Studio'
            : signup
            ? 'Create Customer Account'
            : 'Sign In'}
        </button>

        {mode === 'customer' && (
          <button
            className="auth-switch"
            type="button"
            onClick={signup ? handleSwitchToSignin : handleSwitchToSignup}
          >
            {signup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        )}
      </form>
    </div>
  );
};
