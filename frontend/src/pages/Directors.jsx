import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const mockDirectors = [
    { id: 78747, name: 'Mani Ratnam', category: 'Legendary', image: 'https://image.tmdb.org/t/p/original/iXRdku91Hp8nHSL3uWxnInxN6TH.jpg', notable: 'Nayakan, Roja, Bombay' },
    { id: 57421, name: 'Shankar', category: 'Legendary', image: 'https://image.tmdb.org/t/p/original/jFqC1wA3zE4Jz6cQp26v91Cj6Uu.jpg', notable: 'Sivaji, Enthiran' },
    { id: 550172, name: 'Vetri Maaran', category: 'Contemporary', image: 'https://image.tmdb.org/t/p/original/dEb8XJGaIqWf2eLaj4ecUlC3b2Z.jpg', notable: 'Aadukalam, Visaranai, Viduthalai' },
    { id: 1592411, name: 'Lokesh Kanagaraj', category: 'Contemporary', image: 'https://image.tmdb.org/t/p/original/yym15SAcSzIe6xzxOWCgDWiSaZN.jpg', notable: 'Kaithi, Vikram, Leo' },
    { id: 1209903, name: 'Atlee', category: 'Contemporary', image: 'https://image.tmdb.org/t/p/original/rySt5J2RBOqQutRFXc2kmqQ1i0K.jpg', notable: 'Theri, Mersal, Jawan' },
    { id: 560061, name: 'Bala', category: 'Legendary', image: 'https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/5/53/Bala_Director_Image.jpg&w=600&h=800&fit=cover&a=top&q=85', notable: 'Sethu, Pithamagan' }
];

const categories = ['All Directors', 'Legendary', 'Contemporary'];

const Directors = () => {
    const [activeCategory, setActiveCategory] = useState('All Directors');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [personDetails, setPersonDetails] = useState(null);
    const [loadingPerson, setLoadingPerson] = useState(false);
    const navigate = useNavigate();

    const filteredDirectors = activeCategory === 'All Directors' 
        ? mockDirectors 
        : mockDirectors.filter(dir => dir.category === activeCategory);

    const handleDirectorClick = async (director) => {
        setSelectedPerson(director);
        setPersonDetails(null);
        setLoadingPerson(true);
        try {
            const res = await axios.get(`https://movie-review-0bv9.onrender.com/api/movies/person/${director.id}`);
            setPersonDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPerson(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 2rem', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px', borderLeft: '4px solid #e50914', paddingLeft: '1rem' }}>
                        Director Index
                    </h1>
                </div>
                
                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '20px',
                                border: activeCategory === cat ? '1px solid #e50914' : '1px solid #444',
                                backgroundColor: activeCategory === cat ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                                color: activeCategory === cat ? '#e50914' : '#aaa',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem',
                                fontWeight: activeCategory === cat ? '600' : '400',
                                textTransform: 'capitalize'
                            }}
                            onMouseEnter={(e) => {
                                if(activeCategory !== cat) {
                                    e.currentTarget.style.borderColor = '#888';
                                    e.currentTarget.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if(activeCategory !== cat) {
                                    e.currentTarget.style.borderColor = '#444';
                                    e.currentTarget.style.color = '#aaa';
                                }
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Director Grid - Sleek MNC Design */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                    {filteredDirectors.map(dir => (
                        <div key={dir.id} style={{ 
                            backgroundColor: 'var(--bg-secondary)', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            border: '1px solid #2a2a2a'
                        }}
                        onClick={() => handleDirectorClick(dir)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = '#444';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#2a2a2a';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                            <img 
                                src={dir.image} 
                                alt={dir.name} 
                                style={{ width: '100%', height: '260px', objectFit: 'cover', objectPosition: 'top center' }} 
                            />
                            
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
                                    {dir.name}
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ color: '#555' }}>NOTABLE FOR:</span> {dir.notable}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredDirectors.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>
                        <p style={{ fontSize: '1.1rem' }}>No profiles found in this category.</p>
                    </div>
                )}
            </div>

            {/* Person Details Modal */}
            {selectedPerson && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setSelectedPerson(null)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <FiX size={30} />
                        </button>

                        {loadingPerson || !personDetails ? (
                            <div style={{ padding: '5rem', textAlign: 'center' }}>
                                <h2>Loading Profile...</h2>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <img 
                                        src={personDetails.profile_path} 
                                        alt={personDetails.name} 
                                        style={{ width: '250px', height: '375px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} 
                                    />
                                    <div style={{ flex: '1 1 300px' }}>
                                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: '#e50914' }}>{personDetails.name}</h2>
                                        <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
                                            <span><strong>Born:</strong> {personDetails.birthday || 'N/A'}</span>
                                            <span><strong>Place of Birth:</strong> {personDetails.place_of_birth || 'N/A'}</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Biography</h4>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                                            {personDetails.biography || 'Biography not available.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', borderLeft: '3px solid #e50914', paddingLeft: '10px' }}>Directed Movies</h3>
                                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                        {personDetails.movies.map(movie => (
                                            <div 
                                                key={movie.imdbID}
                                                style={{ minWidth: '150px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                                onClick={() => navigate(`/movie/${movie.imdbID}`)}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', height: '225px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.Title}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{movie.Year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Directors;
