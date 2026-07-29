const fs = require('fs');

async function getOmdbPoster(title) {
    try {
        const apiKey = 'dfeb2cfb';
        const res = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
        const data = await res.json();
        if (data && data.Poster) {
            console.log(`${title}: ${data.Poster.replace('SX300', 'SX1000')}`);
        } else {
            console.log(`${title}: No Poster Found`);
        }
    } catch (err) {
        console.error(`Error fetching ${title}`, err);
    }
}

async function run() {
    await getOmdbPoster('Leo');
    await getOmdbPoster('Vikram');
    await getOmdbPoster('Jailer');
    await getOmdbPoster('Captain Miller');
    await getOmdbPoster('Ponniyin Selvan: Part I');
}

run();
