import React, { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiVideo, FiInfo, FiSearch, FiFilter, FiPlay, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewReleases = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popularity'); // popularity, date, title
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchNewReleases = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/movies/new-releases');
                setMovies(response.data);
                setFilteredMovies(response.data);
            } catch (err) {
                console.error("Error fetching new releases:", err);
                setError('Failed to fetch new releases');
            } finally {
                setLoading(false);
            }
        };

        fetchNewReleases();
    }, []);

    // Handle Search and Sort
    useEffect(() => {
        let result = [...movies];
        
        // Search filter
        if (searchTerm) {
            result = result.filter(movie => 
                movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        if (sortBy === 'title') {
            result.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (sortBy === 'date') {
            // Sort by year descending
            result.sort((a, b) => {
                if (a.Year === 'N/A') return 1;
                if (b.Year === 'N/A') return -1;
                return b.Year.localeCompare(a.Year);
            });
        }
        
        setFilteredMovies(result);
    }, [searchTerm, sortBy, movies]);

    // Auto-scroll logic
    useEffect(() => {
        const container = scrollRef.current;
        if (!container || filteredMovies.length === 0) return;
        
        let animationId;
        const scroll = () => {
            // Because we duplicated the list, scrollWidth / 2 is the exact middle
            if (container.scrollLeft >= container.scrollWidth / 2) {
                container.scrollLeft = 0;
            } else {
                container.scrollLeft += 1;
            }
            animationId = requestAnimationFrame(scroll);
        };
        
        animationId = requestAnimationFrame(scroll);
        
        const handleMouseEnter = () => cancelAnimationFrame(animationId);
        const handleMouseLeave = () => {
            animationId = requestAnimationFrame(scroll);
        };
        
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        }
    }, [filteredMovies]);

    const featuredMovie = selectedMovie || (filteredMovies.length > 0 ? filteredMovies[0] : null);

    // Render list twice for a seamless infinite scroll loop
    const displayMovies = [...filteredMovies, ...filteredMovies];

    return (
        <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'var(--text-primary)', overflowX: 'hidden' }}>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-primary)' }}>
                    <h2>Loading new releases...</h2>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#e50914' }}>
                    <h2>{error}</h2>
                </div>
            ) : filteredMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <h2>No movies found matching your search.</h2>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    {featuredMovie && (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '80vh',
                            minHeight: '600px',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'var(--bg-primary)',
                            overflow: 'hidden'
                        }}>
                            {/* Background Image Layer */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: (featuredMovie.Backdrop && featuredMovie.Backdrop !== 'N/A') ? '100%' : '60%',
                                backgroundImage: `url(${featuredMovie.Backdrop && featuredMovie.Backdrop !== 'N/A' ? featuredMovie.Backdrop : featuredMovie.Poster})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center top',
                            }}>
                                {/* Gradient overlays for cinematic effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: (featuredMovie.Backdrop && featuredMovie.Backdrop !== 'N/A')
                                        ? 'linear-gradient(to right, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.2) 50%, transparent 100%)'
                                        : 'linear-gradient(to right, rgba(15,15,15,1) 0%, rgba(15,15,15,0.7) 40%, transparent 100%)'
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 20%)'
                                }}></div>
                            </div>

                            {/* Hero Content */}
                            <div style={{ position: 'relative', zIndex: 2, padding: '0 4rem', maxWidth: '800px' }}>
                                <h1 style={{ 
                                    fontSize: '3.5rem', 
                                    fontWeight: '900', 
                                    marginBottom: '0.5rem',
                                    lineHeight: '1.1',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.6)'
                                }}>
                                    {featuredMovie.Title}
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '1rem', fontWeight: 'bold' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>A Tamil Original Film</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>•</span>
                                    <span style={{ color: '#2dd36f' }}>98% Match</span>
                                    <span style={{ color: 'var(--text-primary)', marginLeft: '5px' }}>{featuredMovie.Year}</span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button 
                                        onClick={() => navigate(`/movie/${featuredMovie.imdbID}`)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: '#6100E0', /* Disney+ Purple */
                                            color: 'var(--text-primary)',
                                            border: 'none',
                                            padding: '14px 60px',
                                            borderRadius: '30px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            transition: 'transform 0.2s, background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = '#7415F1'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#6100E0'; }}
                                    >
                                        <FiPlay size={18} fill="#fff" /> PLAY
                                    </button>
                                    
                                    <button 
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '46px',
                                            height: '46px',
                                            backgroundColor: 'transparent',
                                            color: 'var(--text-primary)',
                                            border: '2px solid rgba(255,255,255,0.5)',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, border-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = '#fff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; }}
                                    >
                                        <FiPlus size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div style={{ padding: '0 4rem', position: 'relative', zIndex: 3, marginTop: '-50px' }}>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '1.5rem',
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>NEW RELEASES</h2>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '5px 15px' }}>
                                    <FiSearch color="#aaa" />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', paddingLeft: '10px', width: '150px' }}
                                    />
                                </div>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', padding: '5px 15px', borderRadius: '20px', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="popularity" style={{ color: '#000' }}>Popular</option>
                                    <option value="date" style={{ color: '#000' }}>Latest</option>
                                    <option value="title" style={{ color: '#000' }}>A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Horizontal Scrolling List */}
                        <div 
                        ref={scrollRef}
                        style={{ 
                            display: 'flex', 
                            overflowX: 'hidden', 
                            gap: '15px', 
                            paddingBottom: '30px',
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none'
                        }}
                        className="hide-scrollbar"
                        >
                            <style>{`
                                .hide-scrollbar::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            
                            {displayMovies.map((movie, index) => (
                                <div key={movie.imdbID + '-' + index} style={{
                                    minWidth: '220px',
                                    width: '220px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, border 0.3s ease',
                                    border: '3px solid transparent',
                                    position: 'relative'
                                }}
                                onClick={() => {
                                    setSelectedMovie(movie);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.border = '3px solid rgba(255,255,255,0.8)';
                                    e.currentTarget.style.zIndex = '10';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.border = '3px solid transparent';
                                    e.currentTarget.style.zIndex = '1';
                                }}>
                                    <img 
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/500x750/222/FFF?text=No+Poster'} 
                                        alt={movie.Title} 
                                        style={{ width: '100%', height: '330px', objectFit: 'cover', display: 'block', borderRadius: '4px' }} 
                                    />
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </>
            )}
        </div>
    );
};

export default NewReleases;
