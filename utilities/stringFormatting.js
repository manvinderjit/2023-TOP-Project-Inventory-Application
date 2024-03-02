const trimMultipleWhiteSpaces = (inputString) => {
    return inputString.trim().replace(/\s+/g, ' ');
};

export { trimMultipleWhiteSpaces };
