const fs = require('fs');

async function getOgImage(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = await res.text();
        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (match) {
            console.log(`${url}: ${match[1]}`);
        } else {
            console.log(`${url}: No og:image found`);
        }
    } catch (e) {
        console.error(`${url}: Error`);
    }
}

async function run() {
    await getOgImage('https://www.imdb.com/title/tt15654328/'); // Leo
    await getOgImage('https://www.imdb.com/title/tt9179430/'); // Vikram
    await getOgImage('https://www.imdb.com/title/tt11663228/'); // Jailer
    await getOgImage('https://www.imdb.com/title/tt26757124/'); // Captain Miller
    await getOgImage('https://www.imdb.com/title/tt10701074/'); // PS1
}

run();
