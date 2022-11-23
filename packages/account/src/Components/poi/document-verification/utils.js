const ID_PATTERN = '0123456789';
const STEPS = 5; // Steps start at 0
const PATTERN_SIZE = 5;
const pattern_array = [];

const createDocumentPatterns = () => {
    let pattern_end = PATTERN_SIZE;

    for (let step = 0; step < STEPS; step++) {
        pattern_end = PATTERN_SIZE + step;
        pattern_array.push(ID_PATTERN.substring(step, pattern_end));

        // Reverse version of the pattern, example: 09876543210
        pattern_array.push(ID_PATTERN.split('').reverse().join('').substring(step, pattern_end));
    }

    return pattern_array;
};

export const verifyDocument = document_number => {
    const pattern_results = [];

    if (document_number.length >= PATTERN_SIZE) {
        createDocumentPatterns().forEach(pattern => {
            if (document_number.includes(pattern)) {
                pattern_results.push(true);
            } else {
                pattern_results.push(false);
            }
        });
    }

    return pattern_results;
};
