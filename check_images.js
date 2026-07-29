const axios = require('axios');
const fs = require('fs');

const urls = [
    "https://img.studioflicks.com/wp-content/uploads/2024/01/12181519/Captain-Miller-Movie-Poster-3.jpg",
    "https://www.cinejosh.com/newsimg/newsmainimg/maamannan-mesmerizing-movie-lovers_b_0407230114.jpg",
    "https://wallpapercave.com/wp/wp14342121.jpg",
    "https://wallpaperaccess.com/full/8642000.jpg",
    "https://wallpapercave.com/wp/wp8345908.jpg",
    "https://wallpaperaccess.com/full/8412315.jpg",
    "https://wallpaperaccess.com/full/7790494.jpg",
    "https://wallpaperaccess.com/full/8112821.jpg",
    "https://wallpapercave.com/wp/wp8225255.jpg"
];

console.log("Found URLs:");
urls.forEach(u => console.log(u));
