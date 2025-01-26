import { useState } from 'react';
import { useLocation } from 'wouter';
import { resetPassword } from '../services/auth';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Check your email for password reset instructions');
      setTimeout(() => setLocation('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="hero h-dvh">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Reset Password</h1>
          <p className="py-6">Enter your email to receive password reset instructions</p>
        </div>
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {message && (
              <div className="text-success text-sm mt-1">
                {message}
              </div>
            )}
            {error && (
              <div className="text-error text-sm mt-1">
                {error}
              </div>
            )}
            <div className="form-control mt-6">
              <button className="btn btn-primary">Reset Password</button>
            </div>
            <div className="text-center mt-4">
              <a href="/login" className="link link-hover">Back to Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
