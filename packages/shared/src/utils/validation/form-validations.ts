import fromEntries from 'object.fromentries';
import { getPreBuildDVRs, TInitPreBuildDVRs, TOptions } from './declarative-validation-rules';

type TConfig = {
    default_value: string;
    supported_in: string[];
    rules: Array<(TOptions & string)[]>;
    values: Record<string, string | boolean>;
};
type TSchema = { [key: string]: TConfig };

/**
 * Prepare default field and names for form.
 * @param {string} landing_company
 * @param {object} schema
 */
export const getDefaultFields = (landing_company: string, schema: TSchema) => {
    const output: { [key: string]: string } = {};
    Object.entries(filterByLandingCompany(landing_company, schema)).forEach(([field_name, opts]) => {
        output[field_name] = opts.default_value;
    });
    return output;
};

export const filterByLandingCompany = (landing_company: string, schema: TSchema) =>
    fromEntries(Object.entries(schema).filter(([, opts]) => opts.supported_in.includes(landing_company)));

/**
 * Generate validation function for the landing_company
 * @param landing_company
 * @param schema
 * @return {function(*=): {}}
 */
export const generateValidationFunction = (landing_company: string, schema: TSchema) => {
    const rules_schema = filterByLandingCompany(landing_company, schema);
    const rules: { [key: string]: TConfig['rules'] } = {};
    Object.entries(rules_schema).forEach(([key, opts]) => {
        rules[key] = opts.rules;
    });

    return (values: { [key: string]: string }) => {
        const errors: { [key: string]: string | string[] } = {};

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

type TCheckForErrors = {
    field_name: string;
    value: string;
    rule: string;
    options: TOptions;
    values: Record<string, string | boolean>;
};
/**
 * Returns true if the rule has error, false otherwise.
 * @param value
 * @param rule
 * @param options
 * @return {boolean}
 */
const checkForErrors = ({ value, rule, options, values }: TCheckForErrors) => {
    const validate = getValidationFunction(rule);
    return !validate(value, options, values);
};

/**
 * Get validation function from rules array
 * @param rule
 * @throws Error when validation rule not found
 * @return {function(*=): *}
 */
export const getValidationFunction = (rule: string) => {
    const func = getPreBuildDVRs()[rule as keyof TInitPreBuildDVRs]?.func ?? rule;
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
    return (value: string, options: TOptions, values: Record<string, string | boolean>) =>
        !!func(value, options, values);
};
