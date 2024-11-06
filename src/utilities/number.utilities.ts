// Round off numerical values to 2 digits
export const roundOffPrices = (value: number) =>
    parseFloat(
        new Intl.NumberFormat('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value),
    );
