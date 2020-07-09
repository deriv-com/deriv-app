/**
 * Takes validation result of a form, sets warnings on component's state and pass errors down to the form
 *
 * @param {object} values - object containing form field values and validations
 * @return {object} errors
 */
function setWarnsFilterErrors(values) {
    const warnings = {};
    Object.keys(values).forEach(field => {
        if (values[field][0] === 'warn') {
            warnings[field] = values[field][1];
            delete values[field];
        }
    });
    this.setState({ warnings });
    const errors = {};
    Object.keys(values).forEach(error => (errors[error] = values[error][1]));
    return errors;
}

export { setWarnsFilterErrors };
