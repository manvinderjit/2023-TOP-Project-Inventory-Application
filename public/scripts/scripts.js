const email = document.getElementById('email');
const emailError = document.getElementById('emailError');
const password = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const confirmPassword = document.getElementById('confirmPassword');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const form = document.querySelector('form');

email.addEventListener('input', (event) => {
    if (email.validity.valid) {        
        emailError.textContent = 'Looks Good'; // Reset the content of the message
        email.className = 'form-control is-valid';
        emailError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showEmailError();
    }
});

password.addEventListener('input', (event) => {
    if (password.validity.valid) {
        passwordError.textContent = 'Looks Good'; // Reset the content of the message
        password.className = 'form-control is-valid';
        passwordError.className = 'valid-feedback'; // Reset the visual state of the message
        
         if (
             confirmPassword !== null &&
             confirmPassword !== undefined &&
             password.value === confirmPassword.value
         ) {
             confirmPasswordError.textContent = 'Looks Good'; // Reset the content of the message
             confirmPassword.className = 'form-control is-valid';
             confirmPasswordError.className = 'valid-feedback'; // Reset the visual state of the message
         }
    } else {
        // If there is still an error, show the correct error
        showPasswordError();
    }
});

if (confirmPassword !== null && confirmPassword !== undefined) {

    confirmPassword.addEventListener('input', (event) => {
        if (
            confirmPassword.validity.valid &&
            password.value === confirmPassword.value
        ) {
            passwordError.textContent = 'Looks Good'; // Reset the content of the message
            password.className = 'form-control is-valid';
            passwordError.className = 'valid-feedback'; // Reset the visual state of the message
            confirmPasswordError.textContent = 'Looks Good'; // Reset the content of the message
            confirmPassword.className = 'form-control is-valid';
            confirmPasswordError.className = 'valid-feedback'; // Reset the visual state of the message
        } else {
            // If there is still an error, show the correct error
            showConfirmPasswordError();
        }
    });
}

function showEmailError() {    
    if (email.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        emailError.textContent = 'You need to enter an email address.';
    } else if (email.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        emailError.textContent = 'Entered value needs to be an email address.';
    } else if (email.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        emailError.textContent = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
    } 

    // Set the styling appropriately
    emailError.className = 'invalid-feedback';
    email.className = 'form-control is-invalid';
}

function showPasswordError() {
    if (password.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        passwordError.textContent = 'You need to enter a password';
    } else if (password.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        passwordError.textContent = 'Entered value needs to be a valid password';
    } else if (password.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        passwordError.textContent = `Password should be at least ${password.minLength} characters; you entered ${password.value.length}.`;
    } else if (password.validity.patternMismatch) {
        // If the password is not valid,
        // display the following error message.
        passwordError.textContent = `Must contain at least one  number and one uppercase and lowercase letter, and at least 5 or more characters`;
    } else if (
            (confirmPassword !== null && confirmPassword !== undefined) &&
            (password.value !== confirmPassword.value) 
        ) 
    {
        // Set the styling appropriately
        passwordError.textContent = `Password and Confirm Password fields must match.`;
        confirmPasswordError.textContent = `Password and Confirm Password fields must match.`;
        confirmPasswordError.className = 'invalid-feedback';
        confirmPassword.className = 'form-control is-invalid';
    } 

    // Set the styling appropriately
    passwordError.className = 'invalid-feedback';
    password.className = 'form-control is-invalid';
}

function showConfirmPasswordError() {
    if (confirmPassword.validity.valueMissing) {
        // If the field is empty,
        // display the following error message.
        confirmPasswordError.textContent = 'You need to enter a password';
    } else if (confirmPassword.validity.typeMismatch) {
        // If the field doesn't contain an email address,
        // display the following error message.
        confirmPasswordError.textContent =
            'Entered value needs to be a valid password';
    } else if (confirmPassword.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        confirmPasswordError.textContent = `Password should be at least ${password.minLength} characters; you entered ${password.value.length}.`;
    } else if (confirmPassword.validity.patternMismatch) {
        // If the password is not valid,
        // display the following error message.
        confirmPasswordError.textContent = `Must contain at least one  number and one uppercase and lowercase letter, and at least 5 or more characters`;
    } else if (password.value !== confirmPassword.value) {
        passwordError.textContent = `Password and Confirm Password fields must match.`;
        confirmPasswordError.textContent = `Password and Confirm Password fields must match.`;

        // Set the styling appropriately
        passwordError.className = 'invalid-feedback';
        password.className = 'form-control is-invalid';
    }

    // Set the styling appropriately
    confirmPasswordError.className = 'invalid-feedback';
    confirmPassword.className = 'form-control is-invalid';
}

form.addEventListener('submit', (event) => {
    // if the email field is valid, we let the form submit
    if (!email.validity.valid) {
        // If it isn't, we display an appropriate error message
        showEmailError();
        // Then we prevent the form from being sent by canceling the event
        event.preventDefault();
    }
    if (!password.validity.valid) {
        // If it isn't, we display an appropriate error message
        showPasswordError();
        // Then we prevent the form from being sent by canceling the event
        event.preventDefault();
    }    
    if(confirmPassword !== null && confirmPassword !== undefined){
        if (!confirmPassword.validity.valid) {
            // If it isn't, we display an appropriate error message
            showConfirmPasswordError();
            // Then we prevent the form from being sent by canceling the event
            event.preventDefault();
        }
        if(password.value !== confirmPassword.value){
            showPasswordError();
            showConfirmPasswordError();
            event.preventDefault();
        }
    }
});
