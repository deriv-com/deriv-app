import { TOptions, getPreBuildDVRs, TInitPreBuildDVRs } from '@deriv/shared';
import Error from './errors';

type TRuleOptions = {
    func: (value: string | number, options?: TOptions, store?: any, inputs?: any) => boolean;
    condition: (store: any) => boolean;
    message: string;
};

type TRule = string | Array<string | TRuleOptions>;

const template = (string: string, content: string | Array<string>) => {
    let to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, (s, index) => to_replace[+index - 1]);
};

type TValidatorOptions = {
    input: { [key: string]: string | Array<string> };
    rules: TInitPreBuildDVRs;
    store: any;
};

class Validator {
    input: { [key: string]: string | Array<string> };
    rules: TInitPreBuildDVRs;
    store: any;
    errors: Error;
    error_count: number;

    constructor(options: TValidatorOptions) {
        const { input, rules, store } = options;
        this.input = input;
        this.rules = rules;
        this.store = store;
        this.errors = new Error();

        this.error_count = 0;
    }

    /**
     * Add failure and error message for given rule
     *
     * @param {string} attribute
     * @param {object} rule
     */
    addFailure(attribute: string, rule: { name: string; options: TOptions & { message: string } }) {
        let message = rule.options.message || getPreBuildDVRs()[rule.name].message();
        if (rule.name === 'length') {
            message = template(message, [
                rule.options.min === rule.options.max
                    ? rule.options.min!.toString()
                    : `${rule.options.min}-${rule.options.max}`,
            ]);
        } else if (rule.name === 'min') {
            message = template(message, [rule.options.min!.toString()]);
        }
        this.errors.add(attribute, message);
        this.error_count++;
    }

    /**
     * Runs validator
     *
     * @return {boolean} Whether it passes; true = passes, false = fails
     */
    check() {
        Object.keys(this.input).forEach(attribute => {
            if (!Object.prototype.hasOwnProperty.call(this.rules, attribute)) {
                return;
            }

            this.rules[attribute].forEach((rule: TRule) => {
                const ruleObject = Validator.getRuleObject(rule);

                if (!ruleObject.validator && typeof ruleObject.validator !== 'function') {
                    return;
                }

                if (ruleObject.options.condition && !ruleObject.options.condition(this.store)) {
                    return;
                }

                if (this.input[attribute] === '' && ruleObject.name !== 'req') {
                    return;
                }

                const is_valid = ruleObject.validator(
                    this.input[attribute],
                    ruleObject.options,
                    this.store,
                    this.input
                );

                if (!is_valid) {
                    this.addFailure(attribute, ruleObject);
                }
            });
        });
        return !this.error_count;
    }

    /**
     * Determine if validation passes
     *
     * @return {boolean}
     */
    isPassed() {
        return this.check();
    }

    /**
     * Converts the rule array to an object
     *
     * @param {array} rule
     * @return {object}
     */
    static getRuleObject(rule: TRule) {
        const is_rule_string = typeof rule === 'string';
        const rule_object_name = (is_rule_string ? rule : rule[0]) as string;
        const rule_object_options = (is_rule_string ? {} : rule[1] || {}) as TRuleOptions;
        return {
            name: rule_object_name,
            options: rule_object_options,
            validator:
                rule_object_name === 'custom' ? rule_object_options.func : getPreBuildDVRs()[rule_object_name].func,
        };
    }
}

export default Validator;
