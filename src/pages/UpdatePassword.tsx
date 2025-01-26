import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { updatePassword } from '../services/auth';
import { supabase } from '../supabaseClient';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

//   useEffect(() => {
//     supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event == "PASSWORD_RECOVERY") {
//         const newPassword = prompt("What would you like your new password to be?");
//         const { data, error } = await supabase.auth
//           .updateUser({ password: newPassword! })
 
//         if (data) alert("Password updated successfully!")
//         if (error) alert("There was an error updating your password.")
//       }
//     })
//   }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      setMessage('Password updated successfully');
      setTimeout(() => setLocation('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="hero flex-1">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Update Password</h1>
          <p className="py-6">Enter your new password</p>
        </div>
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="new password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <button className="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
