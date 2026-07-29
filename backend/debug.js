require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        const user = await User.create({ name: 'kannan2', email: 'kannan2@gmail.com', password: 'password123' });
        console.log('Created:', user);
        mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        mongoose.disconnect();
    }
}

test();
