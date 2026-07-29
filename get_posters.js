const https = require('https');

const urls = [
    "https://www.themoviedb.org/movie/1186312-garudan",
    "https://www.themoviedb.org/movie/994143-kanguva",
    "https://www.themoviedb.org/movie/1090330-aranmanai-4",
    "https://www.themoviedb.org/movie/667362-takkar",
    "https://www.themoviedb.org/movie/1044439-lal-salaam",
    "https://www.themoviedb.org/movie/500057-ayalaan"
];

async function fetchPoster(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<meta property="og:image" content="([^"]+)"/);
                if (match) {
                    resolve(match[1]);
                } else {
                    resolve("Not found for " + url);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    for (let u of urls) {
        const poster = await fetchPoster(u);
        console.log(poster);
    }
}
run();
