const categoryName = document.getElementById('categoryName');
const categoryNameError = document.getElementById('categoryNameError');

const categoryDescription = document.getElementById('categoryDescription');
const categoryDescriptionError = document.getElementById('categoryDescriptionError');

const form = document.querySelector('form');

categoryName.addEventListener('input', (event) => {
    if (categoryName.validity.valid) {
        categoryNameError.textContent = 'Looks Good'; // Reset the content of the message
        categoryName.className = 'form-control is-valid';
        categoryNameError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showcategoryNameError();
    }
});

categoryDescription.addEventListener('input', (event) => {
    if (categoryDescription.validity.valid) {
        categoryDescriptionError.textContent = 'Looks Good'; // Reset the content of the message
        categoryDescription.className = 'form-control is-valid';
        categoryDescriptionError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showcategoryDescriptionError();
    }
});

function showcategoryNameError() {
    if (categoryName.validity.valueMissing) {
        categoryNameError.textContent = 'You need to enter a category name.';

    } else if (categoryName.validity.tooShort) {
        categoryNameError.textContent = `Email should be at least ${categoryName.minLength} characters; you entered ${categoryName.value.length}.`;

    } else if (categoryName.validity.patternMismatch) {
        categoryNameError.textContent = `Can only use alphabets, numerals, and these special chars - . _ ( )`;

    }

    // Set the styling appropriately
    categoryName.className = 'form-control is-invalid';
    categoryNameError.className = 'invalid-feedback';
};

function showcategoryDescriptionError() {
    if (categoryDescription.validity.valueMissing) {
        categoryDescriptionError.textContent = 'You need to enter a category name.';

    } else if (categoryDescription.validity.tooShort) {
        categoryDescriptionError.textContent = `Category description should be at least ${categoryDescription.minLength} characters; you entered ${categoryDescription.value.length}.`;

    } else if (categoryDescription.validity.tooLong) {
        categoryDescriptionError.textContent = `Category description should be less than ${categoryDescription.maxLength} characters; you entered ${categoryDescription.value.length}.`;

    } else if (categoryDescription.validity.patternMismatch) {        
        categoryDescriptionError.textContent = `Can only use alphabets, numerals, and these special chars - . _ ( )`;
        
    }

    // Set the styling appropriately
    categoryDescription.className = 'form-control is-invalid';
    categoryDescriptionError.className = 'invalid-feedback';
};

form.addEventListener('submit', (event) => {
    if (!categoryName.validity.valid) {
        showcategoryNameError();
        event.preventDefault();
    }
    if(!categoryDescription.validity.valid){
        showcategoryDescriptionError();
        event.preventDefault();
    }
});
