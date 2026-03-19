const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.create({
            name: "Ali",
            email: "ali@test.com",
            password: "12345678",
            confirmPassword: "12345678"
        });
        
        console.log(' User created:', user.email);
        
        const users = await User.find();
        console.log(' Total users:', users.length);
        process.exit(0);

    } catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
};

test();