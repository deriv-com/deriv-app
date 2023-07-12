const unFormatLocaleString = (input: string, locale: Intl.LocalesArgument) => {
    const parts = (12345.6789).toLocaleString(locale).match(/(\D+)/g);

    if (parts && parts.length > 1) {
        const is_reverse = parts[parts.length - 1] !== '.';
        const decimal = parts[parts.length - 1];
        const thousand = parts[0];

        if (is_reverse) return input.replaceAll(decimal, 'temp').replaceAll(thousand, '').replaceAll('temp', '.');

        return input.replaceAll(thousand, '');
    }

    return input;
};

export default unFormatLocaleString;
