import React, { useState, useEffect } from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const featuredMovies = [
    {
        id: 1,
        imdbID: "tmdb_1075794", // Leo
        title: "Leo",
        description: "A cafe owner becomes a local hero, which draws the attention of a drug cartel that suspects he is their former associate.",
        poster: "https://img.youtube.com/vi/Po3jStA673E/maxresdefault.jpg",
        year: "2023",
        rating: "8.5"
    },
    {
        id: 2,
        imdbID: "tmdb_743563", // Vikram
        title: "Vikram",
        description: "A special investigator discovers a case of serial killings is not what it seems to be, leading down a path to war.",
        poster: "https://img.youtube.com/vi/OKBMCL-frPU/maxresdefault.jpg",
        year: "2022",
        rating: "9.0"
    },
    {
        id: 3,
        imdbID: "tmdb_937020", // Jailer
        title: "Jailer",
        description: "A retired jailer goes on a manhunt to find his son's killers. The journey leads him to face his past.",
        poster: "https://img.youtube.com/vi/ugzPkXEqff4/maxresdefault.jpg",
        year: "2023",
        rating: "8.9"
    },
    {
        id: 4,
        imdbID: "tmdb_962074", // Captain Miller
        title: "Captain Miller",
        description: "A former British soldier led by a rebel captain defends a hidden treasure from the British army in the 1930s.",
        poster: "https://img.youtube.com/vi/ujhWbKP1rKA/maxresdefault.jpg",
        year: "2024",
        rating: "8.6"
    },
    {
        id: 5,
        imdbID: "tmdb_660046", // Ponniyin Selvan
        title: "Ponniyin Selvan: Part I",
        description: "Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince Aditha Karikalan.",
        poster: "https://img.youtube.com/vi/D4qAQYlgZQs/maxresdefault.jpg",
        year: "2022",
        rating: "8.7"
    }
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTrailer, setActiveTrailer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
        }, 6000); // Change every 6 seconds

        return () => clearInterval(timer);
    }, []);

    const handleWatchTrailer = (posterUrl) => {
        try {
            const videoId = posterUrl.split('vi/')[1]?.split('/')[0];
            if (videoId) setActiveTrailer(videoId);
        } catch(err) {
            console.error("No trailer ID found");
        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '75vh',
            minHeight: '500px',
            maxHeight: '800px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
            marginBottom: '2rem'
        }}>
            {featuredMovies.map((movie, index) => (
                <div
                    key={movie.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        zIndex: index === currentIndex ? 1 : 0,
                        backgroundImage: `url(${movie.poster})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 15%', // Aligned towards the top so heads are not chopped off
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Dark gradient overlay for text readability so it doesn't look flat */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to right, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.7) 45%, rgba(18,18,18,0.1) 100%), linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0) 25%)',
                        zIndex: 2
                    }} />

                    {/* Content */}
                    <div className="container" style={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 3
                    }}>
                        {/* Text Content */}
                        <div style={{
                            maxWidth: '700px',
                            padding: '2rem',
                            transform: index === currentIndex ? 'translateY(0)' : 'translateY(20px)',
                            opacity: index === currentIndex ? 1 : 0,
                            transition: 'all 0.8s ease-out 0.3s'
                        }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
                                <span style={{ padding: '6px 14px', backgroundColor: '#f5c518', color: '#000', fontWeight: 'bold', borderRadius: '4px', fontSize: '0.95rem' }}>
                                    {movie.year}
                                </span>
                                <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', backdropFilter: 'blur(4px)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                    ⭐ {movie.rating}
                                </span>
                            </div>
                            <h1 style={{
                                fontSize: 'clamp(3rem, 5.5vw, 4.8rem)',
                                fontWeight: 900,
                                marginBottom: '1rem',
                                color: 'var(--text-primary)',
                                lineHeight: 1.1,
                                textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                            }}>
                                {movie.title}
                            </h1>
                            <p style={{
                                fontSize: '1.2rem',
                                color: '#e5e7eb',
                                marginBottom: '2.5rem',
                                lineHeight: 1.6,
                                textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
                            }}>
                                {movie.description}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button 
                                    onClick={() => handleWatchTrailer(movie.poster)}
                                    style={{ 
                                        display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 1.8rem', 
                                        fontSize: '1.1rem', backgroundColor: '#f5c518', color: '#000', border: 'none', 
                                        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease',
                                        flex: '1 1 auto', whiteSpace: 'nowrap'
                                    }}
                                >
                                    <FaPlay /> Watch Trailer
                                </button>
                                <button 
                                    onClick={() => navigate(`/movie/${movie.imdbID}`)}
                                    style={{ 
                                        display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', 
                                        color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)',
                                        padding: '0.9rem 1.8rem', fontSize: '1.1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease',
                                        flex: '1 1 auto', whiteSpace: 'nowrap'
                                    }}
                                >
                                    <FaInfoCircle /> More Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Carousel Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                zIndex: 10
            }}>
                {featuredMovies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '35px' : '12px',
                            height: '12px',
                            borderRadius: '6px',
                            backgroundColor: idx === currentIndex ? '#f5c518' : 'rgba(255,255,255,0.4)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Trailer Modal */}
            {activeTrailer && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => setActiveTrailer(null)} style={{ position: 'absolute', top: '20px', right: '30px', color: 'var(--text-primary)', fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }}>&times;</button>
                    <div style={{ width: '90%', maxWidth: '900px' }}>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                            <iframe 
                                src={`https://www.youtube.com/embed/${activeTrailer}?autoplay=1`} 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;
