import React, { useState, useEffect } from 'react';
import { FiStar, FiClock, FiFilm, FiInfo, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KollywoodMovies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters and Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('rating'); // rating, title, year
    const [decade, setDecade] = useState('All'); // All, 2020s, 2010s, 2000s
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKollywoodClassics = async () => {
            try {
                const response = await axios.get('https://movie-review-0bv9.onrender.com/api/movies/kollywood-classics');
                setMovies(response.data);
                setFilteredMovies(response.data);
            } catch (err) {
                console.error("Error fetching Kollywood classics:", err);
                setError('Failed to fetch movies');
            } finally {
                setLoading(false);
            }
        };

        fetchKollywoodClassics();
    }, []);

    // Handle Search, Sort, and Decade Filter
    useEffect(() => {
        let result = [...movies];
        
        // Search filter
        if (searchTerm) {
            result = result.filter(movie => 
                movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Decade filter
        if (decade !== 'All') {
            result = result.filter(movie => {
                if (movie.Year === 'N/A') return false;
                const yearNum = parseInt(movie.Year, 10);
                if (decade === '2020s') return yearNum >= 2020;
                if (decade === '2010s') return yearNum >= 2010 && yearNum < 2020;
                if (decade === '2000s') return yearNum >= 2000 && yearNum < 2010;
                if (decade === 'Older') return yearNum < 2000;
                return true;
            });
        }

        // Sorting
        if (sortBy === 'title') {
            result.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (sortBy === 'year') {
            result.sort((a, b) => {
                if (a.Year === 'N/A') return 1;
                if (b.Year === 'N/A') return -1;
                return parseInt(b.Year) - parseInt(a.Year);
            });
        } else if (sortBy === 'rating') {
            // TMDB returns strings for rating e.g., "8.5"
            result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        }
        
        setFilteredMovies(result);
    }, [searchTerm, sortBy, decade, movies]);

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 2rem', color: 'var(--text-primary)' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <FiFilm size={36} color="#f5c518" />
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
                        Kollywood Highlights
                    </h1>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Discover the highest-rated Tamil movies, critics' choices, and all-time classics.
                </p>

                {/* Useful Features: Search, Sort, and Filter Toolbar */}
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    backgroundColor: 'var(--bg-card)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '3rem',
                    gap: '1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.5rem 1rem', flex: '1 1 250px' }}>
                        <FiSearch color="#888" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search classics..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--text-primary)', 
                                padding: '0.5rem', 
                                width: '100%',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                        {/* Decade Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Era:</span>
                            <select 
                                value={decade}
                                onChange={(e) => setDecade(e.target.value)}
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="All">All Time</option>
                                <option value="2020s">2020s</option>
                                <option value="2010s">2010s</option>
                                <option value="2000s">2000s</option>
                                <option value="Older">Pre-2000s</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiFilter color="#f5c518" size={20} />
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Sort By:</span>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="rating">Highest Rated</option>
                                <option value="year">Release Year</option>
                                <option value="title">Title (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-primary)' }}>
                        <h2>Loading movies...</h2>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#e50914' }}>
                        <h2>{error}</h2>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <h2>No movies found matching your filters.</h2>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '2.5rem' 
                    }}>
                        {filteredMovies.map((movie) => (
                            <div 
                                key={movie.imdbID} 
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%' // Ensures all cards are same height
                                }}
                                onClick={() => navigate(`/movie/${movie.imdbID}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(245, 197, 24, 0.2)'; // Gold shadow
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/500x750/222/FFF?text=No+Poster'} 
                                        alt={movie.Title} 
                                        style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        backdropFilter: 'blur(5px)',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        color: '#f5c518',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                        border: '1px solid rgba(245, 197, 24, 0.3)' // Subtle gold border
                                    }}>
                                        <FiStar fill="#f5c518" /> {movie.rating}
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ 
                                        fontSize: '1.4rem', 
                                        margin: '0 0 15px 0', 
                                        color: 'var(--text-primary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis' 
                                    }}>
                                        {movie.Title}
                                    </h3>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        marginTop: 'auto', 
                                        paddingTop: '15px', 
                                        borderTop: '1px solid var(--border-color)' 
                                    }}>
                                        <span style={{ 
                                            color: '#f5c518', 
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <FiInfo /> Details
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                            <FiClock /> {movie.Year}
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

export default KollywoodMovies;
