import { useState } from 'react';
import { useLocation } from 'wouter';
import { signIn } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      setLocation('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="hero h-dvh">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">Welcome back! Please login to continue</p>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label">
                <a href="/reset-password" className="label-text-alt link link-hover">
                  Forgot Password?
                </a>
              </label>
            </div>
            {error && (
              <div className="text-error text-sm mt-1">
                {error}
              </div>
            )}
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
            <div className="divider">or</div>
            <div className="text-center">
              <a href="/signup" className="link link-primary">
                Don't have an account? Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
