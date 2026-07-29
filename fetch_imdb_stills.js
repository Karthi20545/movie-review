const fs = require('fs');

async function getImdbLandscape(imdbId, title) {
    try {
        const res = await fetch(`https://www.imdb.com/title/${imdbId}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await res.text();
        
        // Match image URLs in the page that are likely landscape stills
        // IMDB image URLs look like: https://m.media-amazon.com/images/M/MV5B..._V1_QL75_UX1000_CR0,0,1000,563_.jpg (landscape ratio)
        // Let's just find all large images and print them
        const matches = [...html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/M\/[^"']*_V1_[^"']*\.jpg/g)];
        let found = false;
        for (const match of matches) {
            const url = match[0];
            // Look for ones that are wider than they are tall, or just print a few unique ones
            if (url.includes('1000') || url.includes('1920')) {
                console.log(`${title}: ${url}`);
                found = true;
                break;
            }
        }
        if (!found && matches.length > 0) {
            console.log(`${title} (fallback): ${matches[0][0]}`);
        } else if (!found) {
             console.log(`${title}: No images found`);
        }
    } catch (e) {
        console.error(`${title}: Error`);
    }
}

async function run() {
    // IMDB IDs for the movies
    await getImdbLandscape('tt15654328', 'Leo');
    await getImdbLandscape('tt9179430', 'Vikram');
    await getImdbLandscape('tt11663228', 'Jailer');
    await getImdbLandscape('tt26757124', 'Captain Miller');
    await getImdbLandscape('tt10701074', 'Ponniyin Selvan');
}

run();
