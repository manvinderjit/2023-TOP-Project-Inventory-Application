import { validateDescription, validateEmail, validateIsMongoObjectId, validateIsNumber, validateName, validatePassword } from "../../../src/utilities/validation";

describe("Validate Email", () => {
    it('should return true when a valid email is provided', () => {
        const validEmail = 'test@example.com';
        const result = validateEmail(validEmail);
        expect(result).toBe(true);
    });

    it('should return false when an empty string is provided', () => {
        const emptyEmail = '';
        const result = validateEmail(emptyEmail);
        expect(result).toBe(false);
    });

    it('should trim leading and trailing spaces and validate email correctly', () => {
        const emailWithSpaces = '  test@example.com  ';
        const result = validateEmail(emailWithSpaces);
        expect(result).toBe(true);
    });

    it('should return true for email with special characters', () => {
        const email = 'user+mailbox/department=shipping@example.com';
        const result = validateEmail(email);
        expect(result).toBe(true);
    });

    // Email addresses with multiple '@' symbols should return false
    it(`should return false when email has multiple '@' symbols`, () => {
        const invalidEmail = 'test@@example.com';
        const result = validateEmail(invalidEmail);
        expect(result).toBe(false);
    });

    it(`should return false when email has consecutive '.' symbols`, () => {
        const invalidEmail = 'test@example..com';
        const result = validateEmail(invalidEmail);
        expect(result).toBe(false);
    });

    it('should return true when a valid email with subdomain is provided', () => {
        const validEmail = 'test@sub.example.com';
        const result = validateEmail(validEmail);
        expect(result).toBe(true);
    });

    // Email addresses with missing username should return false
    it('should return false when email is missing username', () => {
        const invalidEmail = '@example.com';
        const result = validateEmail(invalidEmail);
        expect(result).toBe(false);
    });

    // Email addresses with missing domain should return false
    it('should return false when email is missing domain', () => {
        const email = 'test@';
        const result = validateEmail(email);
        expect(result).toBe(false);
    });
});

describe("Validate Password", () => {
    it('should return true when the password is valid', () => {
        const validPassword = 'admiN1';
        const result = validatePassword(validPassword);
        expect(result).toBe(true);
    });

    it('should return false when the password is empty', () => {
        const invalidPassword = '';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should trim leading and trailing spaces from the password and evaluate accordingly', () => {
        const invalidPassword = '  Admin1 ';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(true);
    });

    it('should trim leading and trailing spaces from the password and evaluate accordingly', () => {
        const invalidPassword = '  ad min1 ';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should trim leading and trailing spaces from the password and evaluate accordingly', () => {
        const invalidPassword = '  Ad min1 ';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should trim leading and trailing spaces from the password and evaluate accordingly', () => {
        const invalidPassword = '  Adm in1 ';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should return false when an uppercase character is not present', () => {
        const invalidPassword = 'password';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should return false when a lowercase character is not present', () => {
        const invalidPassword = 'PASSWORD';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should return false when password length is less than 5', () => {
        const invalidPassword = 'pAss';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });

    it('should return false when password contains special chars', () => {
        const invalidPassword = 'pAss1&';
        const result = validatePassword(invalidPassword);
        expect(result).toBe(false);
    });
    
    it('should return false when password contains non-ASCII characters', () => {
        const password = 'Passwórd123';
        const result = validatePassword(password);
        expect(result).toBe(false);
    });
});

describe("Validate Name", () => {
    it('should return true for a name with valid characters', () => {
        const result = validateName('GamingKeyboard');
        expect(result).toBe(true);
    });

    it('should trim spaces and validate the name', () => {
        const result = validateName('  GamingKeyboard  ');
        expect(result).toBe(true);
    });

    it('should return true for a name with spaces', () => {
        const result = validateName(' AOC Monitor ');
        expect(result).toBe(true);
    });

    it('should return true for a name with a length of 3 chars minimum', () => {
        const result = validateName(' AOC ');
        expect(result).toBe(true);
    });
    it('should return true for a name with a length of 30 chars maximum', () => {
        const result = validateName('UltraSharp 32-Inch QHD Display');
        expect(result).toBe(true);
    });

    it('should trim leading and trailing spaces and return true for a name with a length of 30 chars maximum', () => {
        const result = validateName('UltraSharp 32-Inch QHD Display');
        expect(result).toBe(true);
    });

    it('should return false for a name with a length less than 3 chars', () => {
        const result = validateName(' AO ');
        expect(result).toBe(false);
    });

    it('should return false for a name with a length greater than 30 chars maximum', () => {
        const result = validateName('UltraSharp 32-Inch QHD Display!');
        expect(result).toBe(false);
    });

    it('should return false for an empty name', () => {
        const result = validateName('');
        expect(result).toBe(false);
    });

    it('should return false for an empty name with spaces', () => {
        const result = validateName('    ');
        expect(result).toBe(false);
    });

    it('should return false for names with invalid special characters', () => {
        const result = validateName('ABC!DEF');
        expect(result).toBe(false);
    });
});

describe("Validate Description", () => {
    it('should return true for valid description with alphanumeric characters and spaces', () => {
        const description = 'Valid Description 123';
        const result = validateDescription(description);
        expect(result).toBe(true);
    });

    it('should return true for description with leading and trailing spaces after trimming', () => {
        const description = '   Valid Description 123   ';
        const result = validateDescription(description);
        expect(result).toBe(true);
    });

    it('should return true for description exactly 5 characters long', () => {
        const description = 'Valid';
        const result = validateDescription(description);
        expect(result).toBe(true);
    });

    it('should return true for description exactly 100 characters long', () => {
        const description =
            'Experience vibrant visuals and stunning clarity with this 27-inch Full HD monitor perfect for gaming';
        const result = validateDescription(description);
        expect(result).toBe(true);
    });

    it('should return true after trimming leading and trailing spaces for description exactly 100 characters long', () => {
        const description =
            '  Experience vibrant visuals and stunning clarity with this 27-inch Full HD monitor perfect for gaming  ';
        const result = validateDescription(description);
        expect(result).toBe(true);
    });

    it('should return false for description shorter than 5 characters', () => {
        const description = 'Shor';
        const result = validateDescription(description);
        expect(result).toBe(false);
    });

    it('should return false for description longer than 100 characters', () => {
        const longDescription =
            'Experience vibrant visuals and stunning clarity with this 27-inch Full HD monitor perfect for gaming!';
        const result = validateDescription(longDescription);
        expect(result).toBe(false);
    });

    it('should return false for empty description', () => {
        const longDescription = '';
        const result = validateDescription(longDescription);
        expect(result).toBe(false);
    });

    it('should return false for empty description with spaces', () => {
        const longDescription = '                ';
        const result = validateDescription(longDescription);
        expect(result).toBe(false);
    });

    it('should return false for empty description with tabs', () => {
        const longDescription = '           ';
        const result = validateDescription(longDescription);
        expect(result).toBe(false);
    });

    it('should return false for description with invalid special characters', () => {
        const description = 'Invalid Description $%^&';
        const result = validateDescription(description);
        expect(result).toBe(false);
    });
});

describe("Validate MongoDB Object Id", () => {
    it('should return true for a valid MongoDB Object Id', () => {
        const validObjectId = '507f1f77bcf86cd799439011';
        const result = validateIsMongoObjectId(validObjectId);
        expect(result).toBe(true);
    });

    it('should return false when an empty string is provided', () => {
        const emptyString = '';
        const result = validateIsMongoObjectId(emptyString);
        expect(result).toBe(false);
    });

    it('should return false when an invalid MongoDB ObjectId is provided', () => {
        const invalidObjectId = 'invalid_id';
        const result = validateIsMongoObjectId(invalidObjectId);
        expect(result).toBe(false);
    });

    it('should return false when ObjectId with extra characters is provided', () => {
        const invalidObjectId = '507f1f77bcf86cd799439011extra';
        const result = validateIsMongoObjectId(invalidObjectId);
        expect(result).toBe(false);
    });

    it('should return false when ObjectId has missing characters', () => {
        const invalidObjectId = '507f1f77bcf86cd79943901'; // Missing one character
        const result = validateIsMongoObjectId(invalidObjectId);
        expect(result).toBe(false);
    });

    it('should return false when input contains special characters', () => {
        const specialCharsId = '507f1f77bcf86cd799439011$';
        const result = validateIsMongoObjectId(specialCharsId);
        expect(result).toBe(false);
    });
});

describe('Validate Number', () => {
    it('should return true when the string contains only digits', () => {
        const result = validateIsNumber('12345');
        expect(result).toBe(true);
    });

    it('should return true when the string contains only digits and has leading and trailing spaces', () => {
        const result = validateIsNumber('  12345  ');
        expect(result).toBe(true);
    });

    it('should return false when the string is empty', () => {
        const result = validateIsNumber('');
        expect(result).toBe(false);
    });

    it('should return false when the string has chars and numbers', () => {
        const result = validateIsNumber('123a');
        expect(result).toBe(false);
    });

    it('should return false when the string has only chars', () => {
        const result = validateIsNumber('abc');
        expect(result).toBe(false);
    });

    it('should return false when the string has space chars', () => {
        const result = validateIsNumber('12 34');
        expect(result).toBe(false);
    });

    it('should return false when the string has only space chars', () => {
        const result = validateIsNumber('   ');
        expect(result).toBe(false);
    });

    it('should return false when the string has special chars', () => {
        const result = validateIsNumber('123$4');
        expect(result).toBe(false);
    });
});
