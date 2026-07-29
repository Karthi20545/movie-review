import React, { useState, useEffect } from 'react';
import { FiStar, FiMessageSquare, FiVideo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrailersReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/recent');
                setReviews(response.data);
            } catch (err) {
                console.error("Error fetching recent reviews:", err);
                setError('Failed to fetch recent reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FiStar 
                key={index} 
                fill={index < rating ? "#f5c518" : "none"} 
                color={index < rating ? "#f5c518" : "#555"} 
                style={{ marginRight: '2px' }}
            />
        ));
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 2rem', color: 'var(--text-primary)' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <FiMessageSquare size={36} color="#e50914" />
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
                        Community Reviews & Trailers
                    </h1>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    See what the community is saying about the latest Tamil movies, and watch their trailers!
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-primary)' }}>
                        <h2>Loading recent reviews...</h2>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#e50914' }}>
                        <h2>{error}</h2>
                    </div>
                ) : reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <h2>No reviews found yet. Be the first to review a movie!</h2>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {reviews.map(review => (
                            <div key={review._id} style={{ 
                                backgroundColor: 'var(--bg-card)', 
                                borderRadius: '12px', 
                                overflow: 'hidden',
                                display: 'flex',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s'
                            }}
                            onClick={() => navigate(`/movie/${review.movie.imdbID}`)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <img 
                                    src={review.movie.posterUrl !== 'N/A' ? review.movie.posterUrl : 'https://placehold.co/200x300/222/FFF?text=No+Poster'} 
                                    alt={review.movie.title} 
                                    style={{ width: '120px', objectFit: 'cover' }} 
                                />
                                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                        {review.movie.title}
                                    </h3>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {review.movie.year}
                                    </p>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        {renderStars(review.rating)}
                                    </div>
                                    
                                    <p style={{ 
                                        color: 'var(--text-secondary)', 
                                        fontSize: '0.95rem', 
                                        margin: '0 0 15px 0',
                                        fontStyle: 'italic',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        "{review.comment}"
                                    </p>
                                    
                                    <div style={{ 
                                        marginTop: 'auto', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        borderTop: '1px solid var(--border-color)',
                                        paddingTop: '10px'
                                    }}>
                                        <span style={{ fontSize: '0.85rem', color: '#e50914', fontWeight: 'bold' }}>
                                            - {review.user?.name || 'Anonymous'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            <FiVideo /> Watch Trailer
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrailersReviews;
