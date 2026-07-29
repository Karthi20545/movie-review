const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');

// Generate a consistent pseudo-random initial count based on imdbID
const generateInitialCount = (id, max) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (id.charCodeAt(i) * (i + 1)) + ((hash << 5) - hash);
    }
    return Math.abs(hash * 37) % max + 15;
};

// Get interactions for a movie
router.get('/:imdbID', async (req, res) => {
    try {
        const { imdbID } = req.params;
        let interaction = await Interaction.findOne({ imdbID });

        if (!interaction) {
            // Initialize with the pseudo-random counts so it matches what we had before
            const initialLikes = generateInitialCount(imdbID, 200);
            const initialHearts = generateInitialCount(imdbID + "heart", 100);
            
            interaction = new Interaction({
                imdbID,
                likes: initialLikes,
                hearts: initialHearts
            });
            await interaction.save();
        }

        res.json({
            likes: interaction.likes,
            hearts: interaction.hearts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle Like
router.post('/:imdbID/like', async (req, res) => {
    try {
        const { imdbID } = req.params;
        const { action } = req.body; // 'increment' or 'decrement'
        
        let interaction = await Interaction.findOne({ imdbID });
        if (!interaction) {
             const initialLikes = generateInitialCount(imdbID, 200);
             const initialHearts = generateInitialCount(imdbID + "heart", 100);
             interaction = new Interaction({ imdbID, likes: initialLikes, hearts: initialHearts });
        }

        if (action === 'increment') {
            interaction.likes += 1;
        } else if (action === 'decrement' && interaction.likes > 0) {
            interaction.likes -= 1;
        }
        
        await interaction.save();
        res.json({ likes: interaction.likes, hearts: interaction.hearts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle Heart
router.post('/:imdbID/heart', async (req, res) => {
    try {
        const { imdbID } = req.params;
        const { action } = req.body; // 'increment' or 'decrement'
        
        let interaction = await Interaction.findOne({ imdbID });
        if (!interaction) {
             const initialLikes = generateInitialCount(imdbID, 200);
             const initialHearts = generateInitialCount(imdbID + "heart", 100);
             interaction = new Interaction({ imdbID, likes: initialLikes, hearts: initialHearts });
        }

        if (action === 'increment') {
            interaction.hearts += 1;
        } else if (action === 'decrement' && interaction.hearts > 0) {
            interaction.hearts -= 1;
        }
        
        await interaction.save();
        res.json({ likes: interaction.likes, hearts: interaction.hearts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
