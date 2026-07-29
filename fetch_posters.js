const fs = require('fs');

const movies = ['Coolie', 'Thug Life', 'Good Bad Ugly', 'Kanguva', 'Sikandar'];
const apiKey = 'dfeb2cfb';

async function fetchPosters() {
    for (const title of movies) {
        try {
            const res = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
            const data = await res.json();
            if (data && data.Poster) {
                console.log(`${title}: ${data.Poster}`);
            } else {
                console.log(`${title}: No Poster Found`);
            }
        } catch (err) {
            console.error(`Error fetching ${title}`, err);
        }
    }
}

fetchPosters();
