import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiFilm, FiMessageSquare } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({ totalUsers: 0, totalMovies: 0, totalReviews: 0 });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('https://movie-review-0bv9.onrender.com/api/reviews/admin/stats', config);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };

        fetchStats();
    }, [user, navigate]);


    if (!user || user.role !== 'admin') return null;

    return (
        <div>
            <h1 className="mb-8">Admin Dashboard</h1>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Note: Movies are now globally synced with an external Movie API (OMDB). 
                The system automatically registers a movie in your local database when a user leaves the first review.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                        <FiUsers size={32} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Users</p>
                        <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalUsers}</h2>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
                        <FiFilm size={32} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Movies (Reviewed)</p>
                        <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalMovies}</h2>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: '#f59e0b' }}>
                        <FiMessageSquare size={32} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reviews</p>
                        <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalReviews}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
