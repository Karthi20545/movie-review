const fs = require('fs');

async function getWikiImage(title) {
    try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1200&format=json`);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].thumbnail) {
            console.log(`${title}: ${pages[pageId].thumbnail.source}`);
        } else {
            console.log(`${title}: No image found`);
        }
    } catch (e) {
        console.error(`${title}: Error`);
    }
}

async function run() {
    await getWikiImage('Leo (2023 Indian film)');
    await getWikiImage('Vikram (2022 film)');
    await getWikiImage('Jailer (film)');
    await getWikiImage('Captain Miller (film)');
    await getWikiImage('Ponniyin Selvan: I');
}

run();
