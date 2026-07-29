const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    imdbID: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);
