const trimMultipleWhiteSpaces = (inputString: string) => {
    return inputString.trim().replace(/\s+/g, ' ');
};

export { trimMultipleWhiteSpaces };
