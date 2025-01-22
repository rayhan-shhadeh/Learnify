export function detectCardType(number) {
    const patterns = {
        Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        MasterCard: /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/,
        Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    };
    for (const [card, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) {
            return card;
        }
    }
    return 'Unknown';
}
