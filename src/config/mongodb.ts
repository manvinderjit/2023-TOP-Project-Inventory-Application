import mongoose from 'mongoose';

const connectDB = async function () {
    return await mongoose.connect(process.env.CONNECTION_STRING as string);
};

export default connectDB;
