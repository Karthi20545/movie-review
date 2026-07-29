const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews/recent
// @desc    Get the most recent reviews across all movies
router.get('/recent', async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name')
            .populate('movie', 'title posterUrl imdbID year');
            
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/reviews/:imdbID
// @desc    Get reviews for a specific movie (using global imdbID)
router.get('/:imdbID', async (req, res) => {
    try {
        const movie = await Movie.findOne({ imdbID: req.params.imdbID });
        if (!movie) {
            return res.json([]); // No local reviews yet
        }
        const reviews = await Review.find({ movie: movie._id }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/reviews
// @desc    Add a review and update movie rating (creates local movie if needed)
router.post('/', protect, async (req, res) => {
    try {
        const { imdbID, title, posterUrl, year, rating, comment } = req.body;
        
        // 1. Ensure the movie exists in our local DB
        let movie = await Movie.findOne({ imdbID });
        
        if (!movie) {
            movie = new Movie({
                imdbID,
                title,
                posterUrl,
                year
            });
            await movie.save();
        }

        // 2. Check if user already reviewed this movie
        const alreadyReviewed = await Review.findOne({ user: req.user._id, movie: movie._id });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this movie' });
        }

        // 3. Create the review
        const review = new Review({
            user: req.user._id,
            movie: movie._id,
            rating: Number(rating),
            comment
        });
        
        await review.save();

        // 4. Update local movie average rating
        const allReviews = await Review.find({ movie: movie._id });
        const numReviews = allReviews.length;
        const averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;
        
        await Movie.findByIdAndUpdate(movie._id, { numReviews, averageRating });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/reviews/admin/stats
// @desc    Get overall stats for admin dashboard
router.get('/admin/stats', protect, require('../middleware/auth').admin, async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalUsers = await require('../models/User').countDocuments();
        
        res.json({ totalUsers, totalMovies, totalReviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
