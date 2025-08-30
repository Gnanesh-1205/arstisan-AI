
import React, { useState } from 'react';
import * as authService from '../services/authService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onExit: () => void;
}

type AuthView = 'signIn' | 'signUp';

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, onExit }) => {
  const [view, setView] = useState<AuthView>('signIn');
  const [error, setError] = useState<string | null>(null);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up fields
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'artisan'>('customer');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const user = authService.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown login error occurred.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!name || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    try {
      const newUserPayload: Omit<User, 'id'> = {
        name,
        email,
        password,
        role,
      };
      const newUser = authService.register(newUserPayload);
      if (newUser) {
        onRegister(newUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown registration error occurred.');
    }
  };

  const renderSignIn = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <h2 className="text-2xl font-semibold text-stone-800">Sign In</h2>
      <div>
        <label htmlFor="email-signin" className="block text-sm font-semibold text-stone-700 mb-1">Email</label>
        <input id="email-signin" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
      <div>
        <label htmlFor="password-signin" className="block text-sm font-semibold text-stone-700 mb-1">Password</label>
        <input id="password-signin" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
      <button type="submit" className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 transition">
        Sign In
      </button>
      <p className="text-center text-sm text-stone-600">
        New to Artisan AI?{' '}
        <button type="button" onClick={() => setView('signUp')} className="font-semibold text-amber-600 hover:underline">
          Create an account
        </button>
      </p>
    </form>
  );

  const renderSignUp = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      <h2 className="text-2xl font-semibold text-stone-800">Create Account</h2>
      <div>
        <label htmlFor="name-signup" className="block text-sm font-semibold text-stone-700 mb-1">Full Name *</label>
        <input id="name-signup" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
      <div>
        <label htmlFor="email-signup" className="block text-sm font-semibold text-stone-700 mb-1">Email *</label>
        <input id="email-signup" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
      <div>
        <label htmlFor="password-signup" className="block text-sm font-semibold text-stone-700 mb-1">Password *</label>
        <input id="password-signup" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
       <div>
        <label htmlFor="confirm-password-signup" className="block text-sm font-semibold text-stone-700 mb-1">Confirm Password *</label>
        <input id="confirm-password-signup" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500 bg-white" required />
      </div>
      <div className="pt-2">
        <p className="block text-sm font-semibold text-stone-700 mb-2">I am a... *</p>
        <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} className="form-radio text-amber-600 focus:ring-amber-500"/>
                <span className="text-stone-700">Customer</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="role" value="artisan" checked={role === 'artisan'} onChange={() => setRole('artisan')} className="form-radio text-amber-600 focus:ring-amber-500"/>
                <span className="text-stone-700">Artisan</span>
            </label>
        </div>
      </div>
      <button type="submit" className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 transition">
        Create Account
      </button>
      <p className="text-center text-sm text-stone-600">
        Already have an account?{' '}
        <button type="button" onClick={() => setView('signIn')} className="font-semibold text-amber-600 hover:underline">
          Sign In
        </button>
      </p>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4 animate-fade-in" onClick={onExit}>
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onExit}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
        {view === 'signIn' ? renderSignIn() : renderSignUp()}
      </div>
    </div>
  );
};