const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productCategory = document.getElementById('productCategory');
const productPrice = document.getElementById('productPrice');
const productStock = document.getElementById('productStock');

const productNameError = document.getElementById('productNameError');
const productDescriptionError = document.getElementById('productDescriptionError');
const productCategoryError = document.getElementById('productCategoryError');
const productPriceError = document.getElementById('productPriceError');
const productStockError = document.getElementById('productStockError');

const form = document.querySelector('form');

const descriptionRegExPattern = new RegExp('^[a-zA-Z0-9\.\-\_\(\)\ ]{3,100}$');

productName.addEventListener('input', (event) => {
    if (productName.validity.valid) {
        productNameError.textContent = 'Looks Good'; // Reset the content of the message
        productName.className = 'form-control is-valid';
        productNameError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showProductNameError();
    }
});

productDescription.addEventListener('input', (event) => {
    if (
        productDescription.validity.valid &&
        descriptionRegExPattern.test(productDescription.value)
    ) {
        productDescriptionError.textContent = 'Looks Good'; // Reset the content of the message
        productDescription.className = 'form-control is-valid';
        productDescriptionError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showProductDescriptionError();
    }
});

productCategory.addEventListener('change', (event) => {    
    if (productCategory.validity.valid && productCategory.value != 'choose') {
        productCategoryError.textContent = 'Looks Good'; // Reset the content of the message
        productCategory.className = 'form-control is-valid';
        productCategoryError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showProductCategoryError();
    }
});

productPrice.addEventListener('input', (event) => {    
    if (productPrice.validity.valid) {
        productPriceError.textContent = 'Looks Good'; // Reset the content of the message
        productPrice.className = 'form-control is-valid';
        productPriceError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showProductPriceError();
    }
});

productStock.addEventListener('input', (event) => {
    if (productStock.validity.valid) {
        productStockError.textContent = 'Looks Good'; // Reset the content of the message
        productStock.className = 'form-control is-valid';
        productStockError.className = 'valid-feedback'; // Reset the visual state of the message
    } else {
        // If there is still an error, show the correct error
        showProductStockError();
    }
});

function showProductNameError() {
    if (productName.validity.valueMissing) {
        productNameError.textContent = 'You need to enter a product name.';
    } else if (productName.validity.tooShort) {
        productNameError.textContent = `Product name should be at least ${productName.minLength} characters; you entered ${productName.value.length}.`;
    } else if (productName.validity.patternMismatch) {
        productNameError.textContent = `Can only use alphabets, numerals, and these special chars - . _ ( )`;
    }

    // Set the styling appropriately
    productName.className = 'form-control is-invalid';
    productNameError.className = 'invalid-feedback';
};

function showProductDescriptionError() {
    if (productDescription.validity.valueMissing) {
        productDescriptionError.textContent = 'You need to enter a product name.';
    } else if (productDescription.validity.tooShort) {
        productDescriptionError.textContent = `Product description should be at least ${productDescription.minLength} characters; you entered ${productDescription.value.length}.`;
    } else if (productDescription.validity.tooLong) {
        productDescriptionError.textContent = `Product description should be less than ${productDescription.maxLength} characters; you entered ${productDescription.value.length}.`;
    } else if (descriptionRegExPattern.test(productDescription.value) === false) {
        productDescriptionError.textContent = `Can only use alphabets, numerals, and these special chars - . _ ( )`;
    }

    // Set the styling appropriately
    productDescription.className = 'form-control is-invalid';
    productDescriptionError.className = 'invalid-feedback';
};

function showProductCategoryError() {
    if(productCategory.value == 'choose'){
        productCategoryError.textContent = `Please select a category for the product!`;
    }

    // Set the styling appropriately
    productCategory.className = 'form-control is-invalid';
    productCategoryError.className = 'invalid-feedback';
}

function showProductPriceError() {
    if (productPrice.validity.valueMissing) {
        productPriceError.textContent = 'You need to enter a product price.';
    } else if (productPrice.validity.badInput) {
        productPriceError.textContent = `Product price should only contain numbers.`;
    } else if (productPrice.validity.rangeUnderflow) {
        productPriceError.textContent = `Product price should be 0 or greater.`;
    } else if (productPrice.validity.stepMismatch) {
        productPriceError.textContent = `Product price should up to two decimal places.`;
    }

    // Set the styling appropriately
    productPrice.className = 'form-control is-invalid';
    productPriceError.className = 'invalid-feedback';
}

function showProductStockError() {
    if (productStock.validity.valueMissing) {
        productStockError.textContent = 'You need to enter product stock.';
    } else if (productStock.validity.badInput) {
        productStockError.textContent = `Product stock should only contain numbers.`;
    } else if (productStock.validity.rangeUnderflow) {
        productStockError.textContent = `Product stock should be 0 or greater.`;
    } else if (productStock.validity.stepMismatch) {
        productStockError.textContent = `Product stock should an integer, no decimals allowed.`;
    }
    
    // Set the styling appropriately
    productStock.className = 'form-control is-invalid';
    productStockError.className = 'invalid-feedback';
}