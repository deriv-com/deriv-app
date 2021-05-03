/**
 * Takes validation result of a form, sets warnings on component's state and pass errors down to the form
 *
 * @param {object} values - object containing form field values and validations
 * @return {object} object containing errors and warnings
 */
function splitValidationResultTypes(values) {
    const warnings = {};
    const errors = {};
    Object.keys(values).forEach(field => {
        const item = values[field];
        if (Array.isArray(item)) {
            if (item[0] === 'warn') {
                warnings[field] = item[1];
            } else if (item[0] === 'error') {
                errors[field] = item[1];
            }
        }
    });
    return { warnings, errors };
}

export { splitValidationResultTypes };
