import User from '../../models/apiUserModel.js';

export const fetchUserByEmail = async (userEmail: string) => {
    const user = await User.findOne({ email: userEmail }).exec();
    return user;
};

