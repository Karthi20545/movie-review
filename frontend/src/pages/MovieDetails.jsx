import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiStar } from 'react-icons/fi';

const MovieDetails = () => {
    // We now use imdbID from the URL
    const { id: imdbID } = useParams();
    const { user } = useContext(AuthContext);
    
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    
    // Modal states
    const [activeModal, setActiveModal] = useState(null);
    const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

    useEffect(() => {
        fetchMovieData();
    }, [imdbID]);

    const fetchMovieData = async () => {
        try {
            // Fetch movie details from our backend (which queries OMDB and aggregates local ratings)
            const movieRes = await axios.get(`https://movie-review-0bv9.onrender.com/api/movies/${imdbID}`);
            setMovie(movieRes.data);
            
            // Fetch reviews from our backend
            const reviewRes = await axios.get(`https://movie-review-0bv9.onrender.com/api/reviews/${imdbID}`);
            setReviews(reviewRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            
            // Send external ID and metadata so backend can create local movie if it doesn't exist
            await axios.post('https://movie-review-0bv9.onrender.com/api/reviews', {
                imdbID: movie.imdbID,
                title: movie.Title,
                posterUrl: movie.Poster !== 'N/A' ? movie.Poster : '',
                year: movie.Year,
                rating,
                comment
            }, config);
            
            // Refetch after posting
            await fetchMovieData();
            
            setComment('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting review');
        }
    };

    if (!movie) return <div className="container py-8"><p>Loading global movie data...</p></div>;

    return (
        <div style={{ 
            backgroundColor: 'var(--bg-primary)', 
            color: 'var(--text-primary)', 
            minHeight: '100vh', 
            paddingBottom: '4rem',
            backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.98)), url(${movie.Poster !== 'N/A' ? movie.Poster : ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Header Section */}
            <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '400', margin: '0 0 0.5rem 0', lineHeight: '1.1' }}>{movie.Title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            <span>{movie.Year}</span>
                            {movie.Certification !== 'N/A' && (
                                <>
                                    <span>•</span>
                                    <span>{movie.Certification}</span>
                                </>
                            )}
                            {movie.Runtime !== 'N/A' && (
                                <>
                                    <span>•</span>
                                    <span>{movie.Runtime}</span>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                        {/* IMDb Rating */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 'bold' }}>IMDb RATING</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <FiStar fill="#f5c518" color="#f5c518" size={24} />
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{movie.imdbRating}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/10</span></span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Local Rating */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 'bold' }}>YOUR RATING</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: '#5799ef' }}>
                                <FiStar size={24} />
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Rate</span>
                            </div>
                        </div>

                        {/* Popularity */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 'bold' }}>POPULARITY</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <div style={{ color: '#2dd36f', border: '1px solid #2dd36f', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '14px' }}>↑</span>
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{movie.Popularity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Local Styles for Grid */}
            <style>
                {`
                .imdb-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 8px;
                    min-height: 400px;
                }
                .imdb-poster-wrapper {
                    display: flex;
                    justify-content: center;
                }
                .imdb-poster {
                    width: 100%;
                    max-width: 350px;
                    height: auto;
                    object-fit: contain;
                }
                .imdb-trailer {
                    min-height: 350px;
                    background-color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .imdb-gallery {
                    display: none;
                }
                @media (min-width: 768px) {
                    .imdb-grid {
                        grid-template-columns: 1fr 2fr;
                    }
                    .imdb-poster {
                        height: 100%;
                        object-fit: cover;
                    }
                }
                @media (min-width: 1024px) {
                    .imdb-grid {
                        grid-template-columns: 2fr 5fr 2fr;
                    }
                    .imdb-gallery {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                }
                `}
            </style>

            {/* Media Grid Section */}
            <div className="container mb-6">
                <div className="imdb-grid">
                    {/* Poster */}
                    <div className="imdb-poster-wrapper">
                        <img 
                            src={movie.Poster !== 'N/A' && movie.Poster ? movie.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&h=450&fit=crop'} 
                            alt={movie.Title}
                            className="imdb-poster"
                            style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
                        />
                    </div>
                    
                    {/* Trailer */}
                    <div className="imdb-trailer" style={{ position: 'relative' }}>
                        {movie.TrailerKey ? (
                            <iframe 
                                src={`https://www.youtube.com/embed/${movie.TrailerKey}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            ></iframe>
                        ) : (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${movie.Photos && movie.Photos.length > 0 ? movie.Photos[0] : (movie.Poster !== 'N/A' ? movie.Poster : '')})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 'bold' }}>Trailer not available yet</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Side Gallery */}
                    <div className="imdb-gallery">
                        <div onClick={() => setActiveModal('videos')} style={{ backgroundColor: 'var(--bg-card)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderTopRightRadius: '4px' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM12 14.5V5.5L18 10L12 14.5Z"/></svg>
                            <span style={{ marginTop: '0.5rem', fontSize: '0.875rem', letterSpacing: '2px', fontWeight: 'bold' }}>{movie.Videos?.length || 0} VIDEOS</span>
                        </div>
                        <div onClick={() => setActiveModal('photos')} style={{ backgroundColor: 'var(--bg-card)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderBottomRightRadius: '4px' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M22 16V4C22 2.9 21.1 2 20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16ZM11 12L13.03 14.71L16 11L20 16H8L11 12ZM4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z"/></svg>
                            <span style={{ marginTop: '0.5rem', fontSize: '0.875rem', letterSpacing: '2px', fontWeight: 'bold' }}>{movie.Photos?.length || 0} PHOTOS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Left Main Details */}
                <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
                    {/* Genres */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        {movie.Genre.split(',').map((g, idx) => (
                            <span key={idx} style={{ border: '1px solid #ffffff50', borderRadius: '16px', padding: '0.2rem 1rem', fontSize: '0.95rem', color: 'var(--text-primary)', cursor: 'pointer' }} className="hover:bg-white hover:text-black transition">
                                {g.trim()}
                            </span>
                        ))}
                    </div>
                    
                    {/* Plot */}
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#eee' }}>
                        {movie.Plot}
                    </p>

                    {/* Cast & Crew Table */}
                    <div style={{ borderTop: '1px solid #ffffff30', padding: '1rem 0', display: 'flex' }}>
                        <span style={{ fontWeight: 'bold', width: '100px', color: 'var(--text-primary)' }}>Director</span>
                        <span style={{ color: '#5799ef', cursor: 'pointer' }} className="hover:underline">{movie.Director}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #ffffff30', padding: '1rem 0', display: 'flex' }}>
                        <span style={{ fontWeight: 'bold', width: '100px', color: 'var(--text-primary)' }}>Writers</span>
                        <span style={{ color: '#5799ef', cursor: 'pointer' }} className="hover:underline">{movie.Writers}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #ffffff30', borderBottom: '1px solid #ffffff30', padding: '1rem 0', display: 'flex' }}>
                        <span style={{ fontWeight: 'bold', width: '100px', color: 'var(--text-primary)' }}>Stars</span>
                        <span style={{ color: '#5799ef', cursor: 'pointer' }} className="hover:underline">
                            {movie.Actors.split(',').map((actor, idx, arr) => (
                                <span key={idx}>{actor.trim()}{idx < arr.length - 1 ? ' • ' : ''}</span>
                            ))}
                        </span>
                    </div>

                    {/* IMDB Pro */}
                    <div className="mt-4 flex items-center gap-2">
                        <span style={{ fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1px' }}>IMDbPro</span>
                        <span style={{ color: '#5799ef', cursor: 'pointer', fontWeight: 'bold' }} className="hover:underline">See production info at IMDbPro</span>
                    </div>
                </div>

                {/* Right Sidebar (Watchlist & Netflix) */}
                <div style={{ width: '100%', maxWidth: '350px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#f5c518', fontWeight: 'bold', letterSpacing: '1px' }}>STREAMING</span>
                        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#E50914', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px', fontFamily: 'Arial, sans-serif' }}>NETFLIX</span>
                        </div>
                    </div>

                    <button style={{ backgroundColor: '#f5c518', color: '#000', width: '100%', padding: '0.8rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: '400' }}>+</span> 
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span>Add to Watchlist</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Added by 98K users</span>
                        </div>
                    </button>
                    
                    <button style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ffffff50', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }} className="hover:bg-gray-800 transition">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        Mark as watched
                    </button>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ffffff30', fontSize: '0.9rem' }}>
                        <div><span style={{ fontWeight: 'bold' }}>{movie.localNumReviews}</span> User reviews</div>
                        <div><span style={{ fontWeight: 'bold' }}>25</span> Critic reviews</div>
                    </div>
                </div>
            </div>

            {/* Our Custom Database Reviews Section Below */}
            <div className="container mt-12 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 style={{ color: '#f5c518', borderLeft: '4px solid #f5c518', paddingLeft: '0.5rem' }}>User Reviews (Database)</h2>
                        {reviews.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No local reviews yet. Be the first to review!</p>
                        ) : (
                            <div className="flex flex-col gap-4 mt-4">
                                {reviews.map(review => (
                                    <div key={review._id} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 style={{ margin: 0, fontWeight: 'bold' }}>{review.user?.name || 'Anonymous'}</h4>
                                            <div className="flex items-center gap-1" style={{ color: '#f5c518' }}>
                                                {[...Array(review.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, color: '#ddd' }}>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 style={{ color: '#f5c518', borderLeft: '4px solid #f5c518', paddingLeft: '0.5rem' }}>Write a Review</h2>
                        {!user ? (
                            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
                                <p>Please <Link to="/login" style={{ color: '#5799ef', fontWeight: 'bold' }}>log in</Link> to write a review.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitReview} style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
                                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>{error}</div>}
                                
                                <div className="input-group mb-4">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>RATING (1-10)</label>
                                    <select 
                                        className="input-field"
                                        style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                
                                <div className="input-group mb-4">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>YOUR REVIEW</label>
                                    <textarea 
                                        className="input-field"
                                        style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        placeholder="What did you think of the movie?"
                                    ></textarea>
                                </div>
                                
                                <button type="submit" style={{ backgroundColor: '#f5c518', color: '#000', width: '100%', padding: '0.8rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} className="hover:bg-yellow-500 transition">Submit Review</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'photos' && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', overflow: 'hidden' }}>
                    <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '30px', color: 'var(--text-primary)', fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }}>&times;</button>
                    <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '2rem' }}>Photos</h2>
                    {movie.Photos && movie.Photos.length > 0 ? (
                        <div style={{ display: 'flex', overflowX: 'auto', gap: '2rem', padding: '1rem', width: '90%', height: '70vh', alignItems: 'center' }}>
                            {movie.Photos.map((photo, i) => (
                                <img key={i} src={photo} alt={`Scene ${i+1}`} style={{ height: '100%', maxHeight: '600px', objectFit: 'contain', flexShrink: 0 }} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', marginTop: '20vh' }}>No photos available for this movie.</p>
                    )}
                </div>
            )}
            
            {activeModal === 'videos' && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => { setActiveModal(null); setCurrentVideoIdx(0); }} style={{ position: 'absolute', top: '20px', right: '30px', color: 'var(--text-primary)', fontSize: '3rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1001 }}>&times;</button>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>Videos</h2>
                    {movie.Videos && movie.Videos.length > 0 ? (
                        <div style={{ width: '90%', maxWidth: '900px' }}>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                                <iframe 
                                    src={`https://www.youtube.com/embed/${movie.Videos[currentVideoIdx]}`} 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                <button 
                                    disabled={currentVideoIdx === 0} 
                                    onClick={() => setCurrentVideoIdx(p => p - 1)} 
                                    style={{ padding: '0.8rem 1.5rem', background: currentVideoIdx === 0 ? '#333' : '#f5c518', color: currentVideoIdx === 0 ? '#666' : '#000', border: 'none', borderRadius: '4px', cursor: currentVideoIdx === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                >
                                    Previous
                                </button>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', letterSpacing: '2px' }}>
                                    {currentVideoIdx + 1} OF {movie.Videos.length}
                                </span>
                                <button 
                                    disabled={currentVideoIdx === movie.Videos.length - 1} 
                                    onClick={() => setCurrentVideoIdx(p => p + 1)} 
                                    style={{ padding: '0.8rem 1.5rem', background: currentVideoIdx === movie.Videos.length - 1 ? '#333' : '#f5c518', color: currentVideoIdx === movie.Videos.length - 1 ? '#666' : '#000', border: 'none', borderRadius: '4px', cursor: currentVideoIdx === movie.Videos.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No videos available for this movie.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
