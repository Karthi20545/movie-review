async function checkUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
            console.log(`[OK] ${url}`);
        } else {
            console.log(`[FAIL] ${url} (Status: ${res.status})`);
        }
    } catch (e) {
        console.log(`[ERROR] ${url}`);
    }
}

async function run() {
    await checkUrl('https://wallpapercave.com/wp/wp12822442.jpg');
    await checkUrl('https://wallpapercave.com/wp/wp12822448.jpg');
    await checkUrl('https://wallpapercave.com/wp/wp13145887.jpg'); 
    await checkUrl('https://wallpapercave.com/wp/wp12480614.jpg'); 
    await checkUrl('https://wallpapercave.com/wp/wp10777550.jpg'); 
    await checkUrl('https://wallpapercave.com/wp/wp14342121.jpg'); 
}
run();
