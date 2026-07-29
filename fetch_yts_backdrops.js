const fs = require('fs');

async function getYTSBackdrop(query) {
    try {
        const url = `https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.data && data.data.movies && data.data.movies.length > 0) {
            console.log(`${query}: ${data.data.movies[0].background_image_original}`);
        } else {
            console.log(`${query}: No movie found`);
        }
    } catch (e) {
        console.error(`${query}: Error`);
    }
}

async function run() {
    await getYTSBackdrop('Leo 2023');
    await getYTSBackdrop('Vikram 2022');
    await getYTSBackdrop('Jailer');
    await getYTSBackdrop('Captain Miller');
    await getYTSBackdrop('Ponniyin Selvan');
}

run();
