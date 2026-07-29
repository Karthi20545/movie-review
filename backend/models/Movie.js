const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    imdbID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    posterUrl: { type: String },
    year: { type: String },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
