const PATTERN_SIZE = 5;

export const recurringNumberRegex = document_number => document_number.match(/([0-9])\1{4,}/g);

const createDocumentPatterns = () => {
    const ID_PATTERN = '0123456789';
    const STEPS = 5; // Steps start at 0
    const reverse_pattern = ID_PATTERN.split('').reverse().join('');
    const pattern_array = [];

    for (let step = 0; step < STEPS; step++) {
        const pattern_end = PATTERN_SIZE + step;
        pattern_array.push(ID_PATTERN.substring(step, pattern_end));

        // Reverse version of the pattern, example: 9876543210
        pattern_array.push(reverse_pattern.substring(step, pattern_end));
    }

    return pattern_array;
};

export const sequentialNumberCheck = document_number => {
    const pattern_results = [];

    if (document_number.length >= PATTERN_SIZE) {
        createDocumentPatterns().forEach(pattern => {
            pattern_results.push(document_number.includes(pattern));
        });
    }

    return pattern_results;
};
