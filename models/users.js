import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'A username is required!'],
            unique: true,
            trim: true,
            minLength: [5, 'Username must be atleast 5 characters long'],
        },
        password: {
            type: String,
            required: [true, 'A password is required!'],
            unique: true,
            trim: true,
            minLength: [5, 'Password must be atleast 5 characters long'],
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);

export default User;
