import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-image-side">
                <div className="login-image-overlay">
                    <div className="login-image-content">
                        <h1>Discover.<br/>Review.<br/>Share.</h1>
                        <p>Join the ultimate community for movie enthusiasts and start rating your favorite films today.</p>
                    </div>
                </div>
            </div>
            
            <div className="login-form-side">
                <div className="login-form-wrapper">
                    <div className="login-card">
                        <div style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
                            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.15rem', fontWeight: '800' }}>Welcome Back</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Sign in to continue to <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>CineRate</span></p>
                        </div>
                        
                        {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '12px', textAlign: 'center', fontWeight: '500', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: '600' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    className="auth-input" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div className="input-group" style={{ marginTop: '0.5rem' }}>
                                <label className="input-label" style={{ fontWeight: '600' }}>Password</label>
                                <input 
                                    type="password" 
                                    className="auth-input" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '1.05rem', borderRadius: '12px', fontWeight: '700' }}>
                                Log In
                            </button>
                        </form>
                        
                        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Don't have an account? <Link to="/register" style={{ fontWeight: '700', color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
