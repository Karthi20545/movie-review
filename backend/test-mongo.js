const mongoose = require('mongoose');
const uri = 'mongodb://karthi:karthikeyan@ac-ci1fwbv-shard-00-00.6eoo8o7.mongodb.net:27017,ac-ci1fwbv-shard-00-01.6eoo8o7.mongodb.net:27017,ac-ci1fwbv-shard-00-02.6eoo8o7.mongodb.net:27017/movie-reviews?ssl=true&replicaSet=atlas-ci1fwbv-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
