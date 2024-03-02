import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const validateEmail = (email) => {
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let enteredEmail = email.trim();
    return emailRegex.test(enteredEmail);
};

const validatePassword = (password) => {
    const passwordRegex = /(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{5,}/;
    let enteredPassword = password.trim();
    return passwordRegex.test(enteredPassword);
};

const validateName = (name) => {
    const nameRegex = /^[a-zA-Z0-9.\-_\(\) ]{3,30}$/;
    let enteredName = name.trim();
    return nameRegex.test(enteredName);
};

const validateDescription = (description) => {
    const descriptionRegex = /^[a-zA-Z0-9.\-_\(\) ]{5,100}$/;
    let enteredDescription = description.trim();
    return descriptionRegex.test(enteredDescription);
};

const validateIsMongoObjectId = (id) => {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
    }
    return false;
};

const validateIsNumber = (value) => {
    return typeof Number(value.trim()) === 'number';
};

export {
    validateEmail,
    validatePassword,
    validateName,
    validateDescription,
    validateIsMongoObjectId,
    validateIsNumber,
};
