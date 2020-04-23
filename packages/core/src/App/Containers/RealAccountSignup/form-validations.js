import { getPreBuildDVRs } from 'Utils/Validator/declarative-validation-rules';

/**
 * Prepare default field and names for form.
 * @param {string} landing_company
 * @param {object} schema
 */
export const getDefaultFields = (landing_company, schema) => {
    const output = {};
    Object.entries(filterByLandingCompany(landing_company, schema)).forEach(([field_name, opts]) => {
        output[field_name] = opts.default_value;
    });

    return output;
};

export const filterByLandingCompany = (landing_company, schema) =>
    Object.fromEntries(Object.entries(schema).filter(([, opts]) => opts.supported_in.includes(landing_company)));

/**
 * Generate validation function for the landing_company
 * @param landing_company
 * @param schema
 * @return {function(*=): {}}
 */
export const generateValidationFunction = (landing_company, schema) => {
    const rules_schema = filterByLandingCompany(landing_company, schema);
    const rules = {};
    Object.entries(rules_schema).forEach(([key, opts]) => {
        rules[key] = opts.rules;
    });

    return values => {
        const errors = {};
        Object.entries(values).forEach(([field_name, value]) => {
            rules[field_name].some(([rule, message, options]) =>
                hasError({
                    errors,
                    field_name,
                    value,
                    rule,
                    message,
                    options,
                })
            );
        });

        return errors;
    };
};

const hasError = ({ errors, field_name, value, rule, message, options }) => {
    try {
        const validate = getValidationFunction(rule);
        if (validate(value, options)) {
            return false;
        }
        errors[field_name] = message;
        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return true;
    }
};

/**
 * Get validation function from rules array
 * @param rule
 * @throws Error when validation rule not found
 * @return {function(*=): *}
 */
export const getValidationFunction = rule => {
    const func = getPreBuildDVRs()[rule]?.func ?? rule;
    if (typeof func !== 'function') {
        throw new Error(
            `validation rule ${rule} not found. Available validations are: ${JSON.stringify(
                Object.keys(getPreBuildDVRs())
            )}`
        );
    }

    /**
     * Generated validation function from the DVRs.
     */
    return (value, options) => !!func(value, options);
};
