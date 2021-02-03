import fromEntries from 'object.fromentries';
import { getPreBuildDVRs } from './declarative-validation-rules';

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
    fromEntries(Object.entries(schema).filter(([, opts]) => opts.supported_in.includes(landing_company)));

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
            if (field_name in rules) {
                rules[field_name].some(([rule, message, options]) => {
                    if (
                        checkForErrors({
                            field_name,
                            value,
                            rule,
                            options,
                            values,
                        })
                    ) {
                        errors[field_name] = typeof message === 'string' ? ['error', message] : message;
                        return true;
                    }

                    return false;
                });
            }
        });

        return errors;
    };
};

/**
 * Returns true if the rule has error, false otherwise.
 * @param value
 * @param rule
 * @param options
 * @param values
 * @return {boolean}
 */
const checkForErrors = ({ value, rule, options, values }) => {
    const validate = getValidationFunction(rule);

    return !validate(value, options, values);
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
    return (value, options, values) => !!func(value, options, values);
};
