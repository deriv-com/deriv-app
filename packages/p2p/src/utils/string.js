export const toSentenceCase = string => {
    if (!string) {
        return '';
    }
    return string[0].toUpperCase() + string.slice(1);
};

export const countDecimalPlaces = value => {
    return ((value.toString().split('.') || [])[1] || []).length;
};
