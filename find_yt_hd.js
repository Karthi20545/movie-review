const fs = require('fs');

async function getValidYT(query) {
    try {
        const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        const html = await res.text();
        const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
        
        for (const match of matches) {
            const vid = match[1];
            const imgUrl = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
            const check = await fetch(imgUrl, { method: 'HEAD' });
            if (check.ok) {
                console.log(`${query} found: ${imgUrl}`);
                return;
            }
        }
        console.log(`${query}: No valid maxresdefault found`);
    } catch (e) {
        console.error(`${query}: Error`);
    }
}

async function run() {
    await getValidYT('Jailer tamil official trailer showcase rajinikanth');
    await getValidYT('Captain Miller tamil official trailer dhanush');
}
run();
