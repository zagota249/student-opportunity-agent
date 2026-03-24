import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/tinyfishapi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        linkedinEmail: '',
        linkedinPassword: '',
        indeedEmail: '',
        indeedPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            console.log('Sending registration data:', formData);
            const response = await register(formData);
            console.log('Registration response:', response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response);
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Make sure backend is running on port 5000';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#6366f1' }}>Create Account</h2>
            {error && <p style={{ color: 'red', textAlign: 'center', padding: '10px', background: '#fee', borderRadius: '5px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        required
                        minLength={8}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Confirm Password *</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Optional: Add your job platform credentials for auto-apply</p>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>LinkedIn Email</label>
                    <input
                        type="email"
                        name="linkedinEmail"
                        value={formData.linkedinEmail}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>LinkedIn Password</label>
                    <input
                        type="password"
                        name="linkedinPassword"
                        value={formData.linkedinPassword}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Indeed Email</label>
                    <input
                        type="email"
                        name="indeedEmail"
                        value={formData.indeedEmail}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Indeed Password</label>
                    <input
                        type="password"
                        name="indeedPassword"
                        value={formData.indeedPassword}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account? <a href="/login" style={{ color: '#6366f1' }}>Login</a>
            </p>
        </div>
    );
};

export default Register;
