import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import HeroCarousel from '../components/HeroCarousel';

const staticTamilMovies = [
    {
        imdbID: "tamil_1",
        Title: "Garudan",
        Year: "2024",
        Poster: "https://upload.wikimedia.org/wikipedia/en/8/8b/Garudan_2024_poster.jpg",
        Plot: "Thriller about land dispute and revenge",
        category: "Thriller"
    },
    {
        imdbID: "tamil_2",
        Title: "Kanguva",
        Year: "2024",
        Poster: "https://m.media-amazon.com/images/M/MV5BYTQyMzQ3ZTQtNTFlZS00ZmVmLWEzYjMtZTFhZjU1NjYxZDVjXkEyXkFqcGc@._V1_SX300.jpg",
        Plot: "Period action fantasy with multiple timelines",
        category: "Action"
    },
    {
        imdbID: "tamil_3",
        Title: "Aranmanai 4",
        Year: "2024",
        Poster: "https://m.media-amazon.com/images/M/MV5BMmNjMGEyMWEtZTUyZi00MWJkLWJlNTMtNDQ3YjRlNDhlNWMyXkEyXkFqcGc@._V1_SX300.jpg",
        Plot: "Horror comedy with family elements",
        category: "Comedy"
    },
    {
        imdbID: "tamil_4",
        Title: "Takkar",
        Year: "2024",
        Poster: "https://m.media-amazon.com/images/M/MV5BYzlkZjE0ZjAtYTFmOS00ZTNjLTgyYjAtNWIwMWViZDljNjZlXkEyXkFqcGc@._V1_SX300.jpg",
        Plot: "Action drama about urban youth",
        category: "Action"
    },
    {
        imdbID: "tamil_5",
        Title: "Lal Salaam",
        Year: "2024",
        Poster: "https://m.media-amazon.com/images/M/MV5BMzhmYjMwNjYtMjI1NS00NmY2LTkyMWItODdhOTc5NWRkYmI5XkEyXkFqcGc@._V1_SX300.jpg",
        Plot: "Sports drama with social message",
        category: "Sports"
    },
    {
        imdbID: "tamil_6",
        Title: "Ayalan",
        Year: "2024",
        Poster: "https://m.media-amazon.com/images/M/MV5BMDcwMjFlNWYtNGFiYy00YmNmLTllZWUtNDM3ZjQ3YjhhZTg0XkEyXkFqcGc@._V1_SX300.jpg",
        Plot: "Action adventure with fantasy elements",
        category: "Action"
    }
];

const movieCategories = ['All', 'Action', 'Thriller', 'Comedy', 'Sports'];

const Home = () => {
    const [movies, setMovies] = useState(staticTamilMovies);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        if (searchQuery) {
            fetchMovies(searchQuery);
        } else {
            // Fetch default 12 trending from database instead of static list
            fetchMovies('');
        }
    }, [searchQuery]); // Removed activeCategory from dependency to avoid extra renders for now

    const fetchMovies = async (query) => {
        try {
            setLoading(true);
            const url = query ? `http://localhost:5000/api/movies/search?keyword=${query}` : `http://localhost:5000/api/movies/search`;
            const res = await axios.get(url);
            if (Array.isArray(res.data)) {
                setMovies(res.data);
            } else if (res.data && res.data.Search) {
                setMovies(res.data.Search);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error('Error fetching movies', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            {!searchQuery && movies.length > 0 && <HeroCarousel movies={movies} />}
            <div className="container" style={{ maxWidth: '1400px' }}>
                <h2 style={{ marginBottom: '1.5rem', marginTop: searchQuery ? '2rem' : '0' }}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : "Trending Movies"}
                </h2>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading movies...</div>
                    ) : movies.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No movies found. Try another search.</div>
                    ) : (
                        movies.map(movie => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
