import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
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

const Customer = mongoose.model('User', customerSchema);

export default Customer;
