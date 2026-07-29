async function checkUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) console.log(`[OK] ${url}`);
        else console.log(`[FAIL] ${url}`);
    } catch(e) {}
}

async function run() {
    // Jailer videos
    await checkUrl('https://img.youtube.com/vi/xen9MhLw7jA/maxresdefault.jpg'); // Jailer showcase
    await checkUrl('https://img.youtube.com/vi/a_2EwX7H-3s/maxresdefault.jpg');
    await checkUrl('https://img.youtube.com/vi/vWvVlZ8z_mI/maxresdefault.jpg'); // Glimpse
    // Ponniyin Selvan
    await checkUrl('https://img.youtube.com/vi/D4qAQYlgZQs/maxresdefault.jpg'); // PS1 trailer
    // Leo
    await checkUrl('https://img.youtube.com/vi/Po3jStA673E/maxresdefault.jpg'); 
    // Vikram
    await checkUrl('https://img.youtube.com/vi/OKBMCL-frPU/maxresdefault.jpg'); 
}
run();
