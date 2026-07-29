const fs = require('fs');

async function getBackdrop(query, year) {
    try {
        const searchUrl = `https://www.themoviedb.org/search?query=${encodeURIComponent(query)}`;
        const searchRes = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const searchHtml = await searchRes.text();
        
        // Find the first movie link
        const match = searchHtml.match(/href="(\/movie\/\d+[^"]*)"/);
        if (!match) return console.log(`${query}: No movie found`);
        
        const movieUrl = `https://www.themoviedb.org${match[1]}`;
        const movieRes = await fetch(movieUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const movieHtml = await movieRes.text();
        
        // Find the backdrop image
        // Look for: https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/...
        const bgMatch = movieHtml.match(/https:\/\/image\.tmdb\.org\/t\/p\/w1920_and_h800_multi_faces\/([^"']+)/);
        if (bgMatch) {
            console.log(`${query}: ${bgMatch[0]}`);
        } else {
            console.log(`${query}: No backdrop found`);
        }
    } catch (e) {
        console.error(`${query}: Error`, e);
    }
}

async function run() {
    await getBackdrop('Leo 2023');
    await getBackdrop('Vikram 2022');
    await getBackdrop('Jailer 2023');
    await getBackdrop('Captain Miller');
    await getBackdrop('Ponniyin Selvan');
}

run();
