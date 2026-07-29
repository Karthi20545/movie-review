import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroSection = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!movies || movies.length === 0) return null;

    const featuredMovie = movies[currentIndex];
    
    // Fallback high-res image if the poster is standard size
    const bannerImage = featuredMovie.Poster !== 'N/A' ? featuredMovie.Poster : 'https://via.placeholder.com/1200x600?text=No+Banner';

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    return (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', height: '450px' }}>
            {/* Left Main Banner */}
            <div style={{ 
                flex: '1', 
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: 'var(--bg-primary)' 
            }}>
                <img 
                    src={bannerImage} 
                    alt={featuredMovie.Title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                />
                
                {/* Banner Overlays */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)' }} />
                
                <div style={{ position: 'absolute', bottom: '20%', left: '10%', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {featuredMovie.Title}
                    </h1>
                </div>

                {/* Navigation Arrows */}
                <button onClick={prevSlide} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '2rem', cursor: 'pointer', opacity: 0.7 }}>
                    <FiChevronLeft />
                </button>
                <button onClick={nextSlide} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '2rem', cursor: 'pointer', opacity: 0.7 }}>
                    <FiChevronRight />
                </button>

                {/* Pagination Dots */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                    {movies.slice(0, 5).map((_, idx) => (
                        <div key={idx} style={{ 
                            width: idx === currentIndex ? '30px' : '10px', 
                            height: '4px', 
                            background: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                            transition: 'width 0.3s'
                        }} />
                    ))}
                </div>
            </div>

            {/* Right Side List */}
            <div style={{ 
                width: '320px', 
                height: '100%', 
                overflowY: 'auto', 
                backgroundColor: '#1c1c1c', 
                borderRadius: '12px',
                padding: '1rem' 
            }}>
                {movies.map((movie, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        style={{ 
                            display: 'flex', 
                            gap: '1rem', 
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: idx === currentIndex ? 'rgba(255,255,255,0.1)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <img 
                            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/60x90'} 
                            alt={movie.Title} 
                            style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {movie.Title.length > 20 ? movie.Title.substring(0, 20) + '...' : movie.Title}
                            </h4>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                Watch the trailer and delve into the fantastical world.
                            </p>
                            <div className="flex gap-2">
                                <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>👍 {Math.floor(Math.random() * 100)}</span>
                                <span style={{ color: 'var(--heart-color)', fontSize: '0.8rem' }}>❤️ {Math.floor(Math.random() * 50)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
