import { useEffect, useState } from 'react';
import { getUserDetails, updateUserDetails } from '../services/userDetails';
import { UserDetails as IUserDetails } from '../types/userDetails';

export default function UserDetails() {
  const [details, setDetails] = useState<IUserDetails>({
    user_id: '',
    height_cm: 0,
    target_weight: null
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const data = await getUserDetails();
      if (data) {
        setDetails(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      await updateUserDetails(details);
      setMessage('Details updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update details');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="hero h-full">
        <div className="hero-content flex-col">
          <div className="text-center">
              <h1 className="text-5xl font-bold">User Details</h1>
              <p className="py-6">Update your profile information</p>
          </div>
          <div className="card w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body" onSubmit={handleSubmit}>
                  <div className="form-control">
                      <label className="label">
                          <span className="label-text">First Name</span>
                      </label>
                      <input
                          type="text"
                          className="input input-bordered"
                          value={details.first_name ?? ''}
                          onChange={(e) => setDetails({ ...details, first_name: e.target.value })} />
                  </div>
                  <div className="form-control">
                      <label className="label">
                          <span className="label-text">Last Name</span>
                      </label>
                      <input
                          type="text"
                          className="input input-bordered"
                          value={details.last_name ?? ''}
                          onChange={(e) => setDetails({ ...details, last_name: e.target.value })} />
                  </div>
                  <div className="form-control">
                      <label className="label">
                          <span className="label-text">Height (cm)</span>
                      </label>
                      <input
                          type="number"
                          className="input input-bordered"
                          value={details.height_cm}
                          onChange={(e) => setDetails({ ...details, height_cm: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-control">
                      <label className="label">
                          <span className="label-text">Target Weight (kg)</span>
                      </label>
                      <input
                          type="number"
                          step="0.1"
                          className="input input-bordered"
                          value={details.target_weight ?? ''}
                          onChange={(e) => setDetails({ ...details, target_weight: parseFloat(e.target.value) || null })} />
                  </div>
                  {error && <div className="text-error text-sm mt-1">{error}</div>}
                  {message && <div className="text-success text-sm mt-1">{message}</div>}
                  <div className="form-control mt-6">
                      <button className="btn btn-primary">Save Changes</button>
                  </div>
                  <div className="divider">or</div>
                  <div className="text-center">
                      <a href="/update-password" className="link link-primary">
                          Reset Password
                      </a>
                  </div>
              </form>
          </div>
      </div>
      </div>
  );
}
