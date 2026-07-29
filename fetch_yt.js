const fs = require('fs');

async function getYouTubeThumbnail(query) {
    try {
        const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const html = await res.text();
        
        const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (match) {
            console.log(`${query}: https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`);
        } else {
            console.log(`${query}: No video found`);
        }
    } catch (e) {
        console.error(`${query}: Error`);
    }
}

async function run() {
    await getYouTubeThumbnail('Leo tamil movie official trailer 2023');
    await getYouTubeThumbnail('Vikram tamil movie official trailer 2022');
    await getYouTubeThumbnail('Jailer tamil movie official trailer 2023');
    await getYouTubeThumbnail('Captain Miller tamil movie official trailer 2024');
    await getYouTubeThumbnail('Ponniyin Selvan 1 tamil movie official trailer');
}

run();
