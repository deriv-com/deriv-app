/**
 * Takes validation result of a form, sets warnings on component's state and pass errors down to the form
 *
 * @param {object} values - object containing form field values and validations
 * @return {object} object containing errors and warnings
 */
function splitValidationResultTypes(values) {
    const warnings = {};
    Object.keys(values).forEach(field => {
        const item = values[field];
        if (Array.isArray(item) && item[0] === 'warn') {
            warnings[field] = item[1];
            delete values[field];
        } else if (!Array.isArray(item)) {
            delete values[field];
        }
    });
    const errors = {};
    Object.keys(values).forEach(error => (errors[error] = values[error][1]));
    return { warnings, errors };
}

export { splitValidationResultTypes };
