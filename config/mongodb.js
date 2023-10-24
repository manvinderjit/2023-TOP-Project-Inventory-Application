import mongoose from 'mongoose';

const connectDB = async function () {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Database connection successful');
};

export default connectDB;
