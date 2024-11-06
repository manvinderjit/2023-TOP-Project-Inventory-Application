import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const validateEmail = (email: string) => {
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let enteredEmail = email.trim();
    return emailRegex.test(enteredEmail);
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9]{5,}$/;
    let enteredPassword = password.trim();
    return passwordRegex.test(enteredPassword);
};

const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z0-9.\-_\(\) ]{3,30}$/;
    let enteredName = name.trim();
    return nameRegex.test(enteredName);
};

const validateDescription = (description:string) => {
    const descriptionRegex = /^[a-zA-Z0-9.\-_\(\) ]{5,100}$/;
    let enteredDescription = description.trim();
    return descriptionRegex.test(enteredDescription);
};

const validateIsMongoObjectId = (id:string) => {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
    }
    return false;
};

const validateIsNumber = (value:string) => {
    if(value.trim() === '' || value.trim() === undefined || value.trim() === null) return false;
    return !isNaN(Number(value.trim())) && typeof Number(value.trim()) === 'number';
};

const validateQuery = (query: string | null | undefined) => {
    if (query && query !== null && query !== undefined && query.trim() !== '')
        return true;
    else return false;
};

const validateDate = (dateValue: any): boolean => {
    const date = new Date(dateValue);
    // Check if the value is an instance of Date
    if (!(date instanceof Date)) {
        return false;
    }
    // Check if the date is valid
    return !isNaN(date.getTime());
};

const validateFieldsMissingOrEmpty = (
    fields: string[],
    reqBody: { [x: string]: string },
): string[] => {
    const missingFields: string[] = [];
    fields.forEach((field) => {
        if (
            !reqBody[field] ||
            reqBody[field] === null ||
            reqBody[field] === undefined ||
            reqBody[field].trim() === ''
        )
            missingFields.push(' ' + field);
    });
    return missingFields;
};

const validateEnums = (enumArray: string[], value: string): boolean => enumArray.includes(value.toLowerCase());

const validateFieldValues = (
    fieldsAndValidators: {
        field: string;
        value: string;
        validator: (name: string) => boolean;
    }[],
): string[] => {
    const invalidFields: string[] = [];
    fieldsAndValidators.forEach((fieldAndValidator) => {
        if (!fieldAndValidator.validator(fieldAndValidator.value)) {
            invalidFields.push(` ` + fieldAndValidator.field);
        }
    });
    return invalidFields;
};

const validateRequiredFieldsInBody = (
    fieldsAndValidators: {
        field: string;
        value: string;
        validator: (name: string) => boolean;
        label: string;
    }[],
    reqBody: { [x: string]: string },
): string[] => {
    const invalidFields: string[] = [];
    fieldsAndValidators.forEach((fieldAndValidator) => {
        if (
            !reqBody[fieldAndValidator.field] ||
            reqBody[fieldAndValidator.field] === null ||
            reqBody[fieldAndValidator.field] === undefined ||
            reqBody[fieldAndValidator.field].trim() === '' ||
            !fieldAndValidator.validator(fieldAndValidator.value)
        )
            invalidFields.push(' ' + fieldAndValidator.label);
    });
    return invalidFields;
};

export {
    validateEmail,
    validatePassword,
    validateName,
    validateDescription,
    validateIsMongoObjectId,
    validateIsNumber,
    validateQuery,
    validateFieldsMissingOrEmpty,
    validateEnums,
    validateFieldValues,
    validateDate,
    validateRequiredFieldsInBody,
};
