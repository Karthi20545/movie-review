const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
    console.error("ERROR: TMDB_API_KEY is missing in your .env file.");
    console.error("Please create an account at https://www.themoviedb.org, get an API key, and add it to backend/.env");
    process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

async function fetchMoviesForYear(year) {
    let page = 1;
    let totalPages = 1;
    let moviesCount = 0;

    console.log(`\nFetching Tamil movies for the year ${year}...`);

    while (page <= totalPages && page <= 50) { // Safety limit 50 pages per year
        try {
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=ta&primary_release_year=${year}&page=${page}&sort_by=popularity.desc`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`TMDB API Error: ${response.status} - ${response.statusText}`);
                break;
            }
            
            const data = await response.json();
            totalPages = data.total_pages;

            if (data.results && data.results.length > 0) {
                for (const movie of data.results) {
                    // Only save movies that have a poster to ensure UI looks good
                    if (!movie.poster_path) continue;

                    const imdbID = `tmdb_${movie.id}`;
                    
                    try {
                        await Movie.findOneAndUpdate(
                            { imdbID },
                            {
                                imdbID,
                                title: movie.title,
                                year: year.toString(),
                                posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                                // We can use plot later if we add it to schema
                            },
                            { upsert: true, new: true }
                        );
                        moviesCount++;
                    } catch (dbErr) {
                        console.error(`Error saving movie ${movie.title}:`, dbErr.message);
                    }
                }
            }
            
            // Respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 300));
            page++;
        } catch (error) {
            console.error(`Error fetching year ${year}, page ${page}:`, error.message);
            break;
        }
    }
    console.log(`Finished year ${year}. Seeded ${moviesCount} movies.`);
}

async function runSeeder() {
    console.log("Starting Tamil Movies Seeding Process (2000-2026)...");
    
    // Seed backwards from 2026 down to 2000 to get newest first
    for (let year = 2026; year >= 2000; year--) {
        await fetchMoviesForYear(year);
    }

    console.log("\nSeeding Complete!");
    process.exit(0);
}

runSeeder();
