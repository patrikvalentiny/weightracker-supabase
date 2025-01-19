import { useState } from 'react';
import { useUserDetails } from '../contexts/UserDetailsContext';

export default function UserDetails() {
    const { details, loading, error: contextError, updateDetails } = useUserDetails();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        try {
            await updateDetails(details || {});
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
                                value={details?.first_name ?? ''}
                                onChange={(e) => updateDetails({ ...details, first_name: e.target.value })} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={details?.last_name ?? ''}
                                onChange={(e) => updateDetails({ ...details, last_name: e.target.value })} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Height (cm)</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered"
                                value={details?.height_cm ?? 0}
                                onChange={(e) => updateDetails({ ...details, height_cm: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Target Weight (kg)</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                className="input input-bordered"
                                value={details?.target_weight ?? ''}
                                onChange={(e) => updateDetails({ ...details, target_weight: parseFloat(e.target.value) || null })} />
                        </div>
                        {(error || contextError) && <div className="text-error text-sm mt-1">{error || contextError}</div>}
                        {message && <div className="text-success text-sm mt-1">{message}</div>}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
