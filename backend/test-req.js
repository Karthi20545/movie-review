const axios = require('axios');
axios.post('http://localhost:5000/api/auth/register', { name: 'test', email: 'test3@test.com', password: 'password' })
  .then(res => console.log('SUCCESS:', res.data))
  .catch(err => console.log('ERROR:', err.response ? err.response.data : err.message));
