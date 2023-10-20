import mongoose from 'mongoose';

const main = async function () {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Database connection successful');
};

export default main;
