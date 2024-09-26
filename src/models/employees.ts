import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'An email is required!'],
            unique: true,
            lowercase: true,
            trim: true,
            minLength: [5, 'Email must be atleast 5 characters long'],
            validate: {
                validator: function (email) {
                    const emailRegex =
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                    return emailRegex.test(email);
                },
                message: (props) =>
                    `${props.value} is not a valid email address!`,
            },
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

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
