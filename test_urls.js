const https = require('https');
const u = "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/en/8/8b/Garudan_2024_poster.jpg";
const req = https.request(u, { method: 'HEAD' }, (res) => {
    console.log("Status:", res.statusCode);
});
req.end();
