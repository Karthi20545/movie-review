async function run() {
    const urls = [
        'https://wallpapercave.com/wp/wp10777552.jpg',
        'https://wallpapercave.com/wp/wp8345908.jpg',
        'https://wallpaperaccess.com/full/8642000.jpg'
    ];
    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) console.log(`[OK] ${url}`);
            else console.log(`[FAIL] ${url}`);
        } catch (e) {}
    }
}
run();
