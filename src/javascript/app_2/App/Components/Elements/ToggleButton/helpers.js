export const isButtonSelected = (value, candidate) => {
    if (!value || !candidate) {
        return false;
    }

    if (Array.isArray(value)) {
        return value.indexOf(candidate) !==  -1;
    }

    return value === candidate;
};
