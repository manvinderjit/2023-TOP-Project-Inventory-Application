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
}

export { validateEmail, validatePassword };
