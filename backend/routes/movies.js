const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movie');
const ytSearch = require('yt-search');

const OMDB_URL = 'http://www.omdbapi.com/';

// @route   GET /api/movies/search
// @desc    Search movies using TMDB for high quality images
router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        let movies = [];
        const TMDB_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';

        if (!keyword) {
            // Fetch default trending Tamil movies if no keyword
            const [page1, page2] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=ta&sort_by=popularity.desc&primary_release_date.gte=2022-01-01&primary_release_date.lte=2026-12-31&page=1`),
                axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=ta&sort_by=popularity.desc&primary_release_date.gte=2022-01-01&primary_release_date.lte=2026-12-31&page=2`)
            ]);
            movies = [...(page1.data.results || []), ...(page2.data.results || [])];
        } else {
            // Search TMDB
            const [page1, page2] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(keyword)}&page=1`),
                axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(keyword)}&page=2`)
            ]);
            movies = [...(page1.data.results || []), ...(page2.data.results || [])];
        }

        // Limit exactly to 30 results as requested
        movies = movies.slice(0, 30);

        // Map to format expected by frontend (Title, Year, Poster, imdbID, Plot, category)
        const formattedMovies = movies.map(movie => {
            // Check if we already have this movie in our local DB to preserve interactions
            // But we do it asynchronously later or just rely on the frontend fetching interactions by ID
            return {
                Title: movie.title || movie.original_title,
                Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
                imdbID: `tmdb_${movie.id}`,
                Plot: movie.overview || 'Tamil Movie',
                category: 'All'
            };
        });

        res.json(formattedMovies);
    } catch (error) {
        console.error("TMDB API Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/movies/new-releases
// @desc    Get new Tamil movie releases
router.get('/new-releases', async (req, res) => {
    try {
        const TMDB_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
        const date = new Date();
        const maxDate = date.toISOString().split('T')[0];
        date.setMonth(date.getMonth() - 2);
        const minDate = date.toISOString().split('T')[0];

        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=ta&sort_by=popularity.desc&primary_release_date.gte=${minDate}&primary_release_date.lte=${maxDate}&page=1`);
        
        const formattedMovies = tmdbRes.data.results.map(movie => ({
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
            Backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'N/A',
            imdbID: `tmdb_${movie.id}`,
            Plot: movie.overview || 'Tamil Movie',
            category: 'New Release'
        }));
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/movies/kollywood-classics
// @desc    Get top rated Tamil movies
router.get('/kollywood-classics', async (req, res) => {
    try {
        const TMDB_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
        // Get movies sorted by vote_average with a minimum vote count
        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=100&page=1`);
        
        const formattedMovies = tmdbRes.data.results.map(movie => ({
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
            imdbID: `tmdb_${movie.id}`,
            Plot: movie.overview || 'Tamil Movie',
            rating: movie.vote_average.toFixed(1),
            genre: 'Classic'
        }));
        res.json(formattedMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/movies/person/:id
// @desc    Get person (actor/director) details and their movies
router.get('/person/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const TMDB_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
        
        // Fetch person details and combined credits in parallel
        const [personRes, creditsRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_KEY}`),
            axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${TMDB_KEY}&language=en-US`)
        ]);

        const p = personRes.data;
        const credits = creditsRes.data;

        // Filter Tamil movies they were known for
        let knownFor = credits.cast
            .filter(c => c.original_language === 'ta' && c.poster_path)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 10);
            
        // If they are primarily a director, check crew instead
        if (p.known_for_department === 'Directing') {
            knownFor = credits.crew
                .filter(c => c.original_language === 'ta' && c.job === 'Director' && c.poster_path)
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 10);
        }

        const formattedKnownFor = knownFor.map(movie => ({
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            imdbID: `tmdb_${movie.id}`
        }));

        const personData = {
            id: p.id,
            name: p.name,
            biography: p.biography,
            birthday: p.birthday,
            place_of_birth: p.place_of_birth,
            profile_path: p.profile_path ? `https://image.tmdb.org/t/p/w500${p.profile_path}` : 'https://placehold.co/500x750/222/FFF?text='+p.name,
            known_for_department: p.known_for_department,
            movies: formattedKnownFor
        };

        res.json(personData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/movies/:imdbID
// @desc    Get movie details by ID
router.get('/:imdbID', async (req, res) => {
    try {
        const { imdbID } = req.params;
        let movieData = {};
        const TMDB_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
        
        // Handle TMDB IDs from our seeded database or search
        if (imdbID.startsWith('tmdb_')) {
            const tmdbIdNum = imdbID.split('_')[1];
            
            try {
                // Fetch full details
                const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbIdNum}?api_key=${TMDB_KEY}`);
                const data = tmdbRes.data;
                
                // Fetch videos for trailer and gallery
                let trailerKey = null;
                let allVideos = [];
                try {
                    const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbIdNum}/videos?api_key=${TMDB_KEY}`);
                    if (videoRes.data && videoRes.data.results) {
                        allVideos = videoRes.data.results.filter(v => v.site === 'YouTube').map(v => v.key);
                        const trailer = videoRes.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                        if (trailer) trailerKey = trailer.key;
                        else if (videoRes.data.results.length > 0) trailerKey = videoRes.data.results[0].key;
                    }
                } catch (vidErr) {
                    console.log("Could not fetch trailer", vidErr.message);
                }

                // If no trailer was found on TMDB, search YouTube dynamically as a fallback
                if (!trailerKey) {
                    try {
                        const searchQuery = (data.title || "Tamil Movie") + (data.release_date ? " " + data.release_date.split('-')[0] : "") + " official trailer";
                        const ytResult = await ytSearch(searchQuery);
                        if (ytResult && ytResult.videos && ytResult.videos.length > 0) {
                            trailerKey = ytResult.videos[0].videoId;
                            // Add it to allVideos as well so the video gallery works
                            if (allVideos.length === 0) {
                                allVideos = [trailerKey];
                            }
                        }
                    } catch (ytErr) {
                        console.log("YouTube Search Fallback failed:", ytErr.message);
                    }
                }

                // Format runtime
                let formattedRuntime = 'N/A';
                if (data.runtime) {
                    const hours = Math.floor(data.runtime / 60);
                    const minutes = data.runtime % 60;
                    formattedRuntime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                }

                movieData = {
                    Title: data.title,
                    Year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
                    Poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'N/A',
                    Plot: data.overview || 'Tamil Movie',
                    Genre: data.genres ? data.genres.map(g => g.name).join(', ') : 'Unknown',
                    Released: data.release_date,
                    imdbID: imdbID,
                    imdbRating: data.vote_average ? data.vote_average.toString() : 'N/A',
                    TrailerKey: trailerKey,
                    Director: 'N/A',
                    Actors: 'N/A',
                    Runtime: formattedRuntime,
                    Popularity: data.popularity ? Math.round(data.popularity * 10).toLocaleString() : 'N/A',
                    Writers: 'N/A',
                    Certification: 'N/A',
                    Videos: allVideos,
                    Photos: []
                };
                
                // Try fetching cast, crew, certification, and images
                try {
                    const [creditsRes, releaseDatesRes, imagesRes] = await Promise.all([
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbIdNum}/credits?api_key=${TMDB_KEY}`),
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbIdNum}/release_dates?api_key=${TMDB_KEY}`),
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbIdNum}/images?api_key=${TMDB_KEY}`)
                    ]);

                    const cast = creditsRes.data.cast.slice(0, 4).map(c => c.name).join(', ');
                    const director = creditsRes.data.crew.find(c => c.job === 'Director');
                    
                    // Extract Writers
                    const writers = creditsRes.data.crew
                        .filter(c => c.department === 'Writing' || c.job === 'Screenplay' || c.job === 'Writer')
                        .map(c => c.name);
                    const uniqueWriters = [...new Set(writers)].slice(0, 3).join(' • ');

                    if (cast) movieData.Actors = cast;
                    if (director) movieData.Director = director.name;
                    if (uniqueWriters) movieData.Writers = uniqueWriters;

                    // Extract Certification (US or IN)
                    const results = releaseDatesRes.data.results;
                    const usRelease = results.find(r => r.iso_3166_1 === 'US');
                    const inRelease = results.find(r => r.iso_3166_1 === 'IN');
                    let cert = '';
                    if (usRelease && usRelease.release_dates[0].certification) {
                        cert = usRelease.release_dates[0].certification;
                    } else if (inRelease && inRelease.release_dates[0].certification) {
                        cert = inRelease.release_dates[0].certification;
                    }
                    if (cert) movieData.Certification = cert;

                    // Extract Images (up to 5 backdrops or posters)
                    const backdrops = imagesRes.data.backdrops || [];
                    const imagePaths = backdrops.slice(0, 5).map(img => `https://image.tmdb.org/t/p/w780${img.file_path}`);
                    movieData.Photos = imagePaths;

                } catch (err) {
                    console.log("Error fetching extra credits/cert/images", err.message);
                }

            } catch (e) {
                // Fallback to local if TMDB fetch fails
                const localMovie = await Movie.findOne({ imdbID });
                if (!localMovie) return res.status(404).json({ message: 'Movie not found' });
                
                movieData = {
                    Title: localMovie.title,
                    Year: localMovie.year,
                    Poster: localMovie.posterUrl || 'N/A',
                    imdbID: localMovie.imdbID,
                    Plot: 'Tamil Movie'
                };
            }
        } else {
            // Handle OMDB IDs
            let response;
            try {
                response = await axios.get(`${OMDB_URL}?i=${imdbID}&apikey=${process.env.MOVIE_API_KEY}`);
            } catch (err) {
                return res.status(404).json({ message: 'Movie not found globally or API key invalid' });
            }
            if (response.data.Error) {
                return res.status(404).json({ message: 'Movie not found globally' });
            }
            movieData = response.data;
        }

        // Fetch local ratings if the movie has been reviewed before
        const localMovieDb = await Movie.findOne({ imdbID });
        
        if (localMovieDb) {
            movieData.localAverageRating = localMovieDb.averageRating;
            movieData.localNumReviews = localMovieDb.numReviews;
            movieData._localId = localMovieDb._id;
        } else {
            movieData.localAverageRating = 0;
            movieData.localNumReviews = 0;
            movieData._localId = null;
        }

        res.json(movieData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
