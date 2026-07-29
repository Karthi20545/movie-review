import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieCard = ({ movie }) => {
    // Generate a consistent pseudo-random initial count based on imdbID so it doesn't change on every render
    const generateInitialCount = (id, max) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = (id.charCodeAt(i) * (i + 1)) + ((hash << 5) - hash);
        }
        return Math.abs(hash * 37) % max + 15; // Base value + 15
    };

    const initialLikes = generateInitialCount(movie.imdbID, 200);
    const initialHearts = generateInitialCount(movie.imdbID + "heart", 100);

    // Load saved local user interaction from localStorage
    const savedState = JSON.parse(localStorage.getItem(`movie_interaction_${movie.imdbID}`)) || {
        isLiked: false,
        isHearted: false
    };

    const [isLiked, setIsLiked] = useState(savedState.isLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isHearted, setIsHearted] = useState(savedState.isHearted);
    const [heartsCount, setHeartsCount] = useState(initialHearts);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the true global count from the backend on mount
    useEffect(() => {
        const fetchInteractions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/interactions/${movie.imdbID}`);
                if (res.data) {
                    setLikesCount(res.data.likes);
                    setHeartsCount(res.data.hearts);
                }
            } catch (err) {
                console.error('Failed to fetch interactions', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInteractions();
    }, [movie.imdbID]);

    // Save user's personal interacted state to localStorage
    useEffect(() => {
        localStorage.setItem(`movie_interaction_${movie.imdbID}`, JSON.stringify({
            isLiked,
            isHearted
        }));
    }, [isLiked, isHearted, movie.imdbID]);

    const handleLikeClick = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling
        
        // Optimistic UI update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            const action = newIsLiked ? 'increment' : 'decrement';
            const res = await axios.post(`http://localhost:5000/api/interactions/${movie.imdbID}/like`, { action });
            setLikesCount(res.data.likes);
        } catch (err) {
            console.error('Failed to update likes', err);
            // Revert on failure
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleHeartClick = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling
        
        // Optimistic UI update
        const newIsHearted = !isHearted;
        setIsHearted(newIsHearted);
        setHeartsCount(prev => newIsHearted ? prev + 1 : prev - 1);

        try {
            const action = newIsHearted ? 'increment' : 'decrement';
            const res = await axios.post(`http://localhost:5000/api/interactions/${movie.imdbID}/heart`, { action });
            setHeartsCount(res.data.hearts);
        } catch (err) {
            console.error('Failed to update hearts', err);
            // Revert on failure
            setIsHearted(!newIsHearted);
            setHeartsCount(prev => !newIsHearted ? prev + 1 : prev - 1);
        }
    };

    // Shorten title if it's too long
    const title = movie.Title.length > 25 ? movie.Title.substring(0, 25) + '...' : movie.Title;

    return (
        <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', display: 'flex', height: '100%' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1c1c1c', border: 'none', borderRadius: '12px', overflow: 'hidden' }}>
                <img 
                    src={movie.Poster !== 'N/A' && movie.Poster ? movie.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&h=450&fit=crop'} 
                    alt={movie.Title} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&h=450&fit=crop'; }}
                    style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                        {title} ({movie.Year})
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#e0e0e0', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {movie.Plot || "Action thriller with intense drama"}
                    </p>
                    
                    <div className="flex gap-4 mt-auto">
                        <button 
                            onClick={handleLikeClick}
                            className="pill-btn"
                            style={{ 
                                backgroundColor: isLiked ? '#f5c518' : 'rgba(255, 255, 255, 0.1)',
                                color: isLiked ? '#000' : '#fff',
                                transition: 'all 0.3s ease',
                                border: 'none'
                            }}
                        >
                            👍 {likesCount}
                        </button>
                        <button 
                            onClick={handleHeartClick}
                            className="pill-btn"
                            style={{ 
                                backgroundColor: isHearted ? '#ff4d6d' : 'rgba(255, 255, 255, 0.1)',
                                color: isHearted ? '#fff' : '#fff',
                                transition: 'all 0.3s ease',
                                border: 'none'
                            }}
                        >
                            ❤️ {heartsCount}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
