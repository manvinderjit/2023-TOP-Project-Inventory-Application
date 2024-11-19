import User from '../../models/apiUserModel.js';
import bcrypt from 'bcrypt';

export const fetchUserByEmail = async (userEmail: string) => {
    const user = await User.findOne({ email: userEmail }).exec();
    return user;
};

export const registerUser = async (userEmail: string, userPassword: string) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    
    const registeredUser = await User.create({ email: userEmail, password: hashedPassword });
    return registeredUser;
};

export const fetchUserEmailFromId = async(userId: string) => {
    const userEmail = await User.findById(userId).select({ email: 1, id: -1 }).exec();
    return userEmail?.email;
};
