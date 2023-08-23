import { template } from '_common/utility';
import { getPreBuildDVRs } from '@deriv/shared';
import Error from './errors';
import { TCoreStores } from '@deriv/stores/types';

interface Rule {
    name: string;
    options: {
        message?: string;
        condition?: (store: TCoreStores) => boolean;
        min?: number;
        max?: number;
        name1?: string;
        name2?: string;
        [key: string]: string | number | boolean | ((store: TCoreStores) => boolean) | undefined;
    };
    validator?: ValidatorFunction;
}

interface Rules {
    [key: string]: Rule[];
}

type ValidatorFunction = (
    input: string,
    options: Rule['options'],
    store: TCoreStores,
    inputObject: Record<string, string>
) => boolean;

type RuleObject = {
    name: string;
    options: Rule['options'];
    validator?: ValidatorFunction;
};

type TRuleString = string | [string, any];

type ValidationResult = {
    is_ok: boolean;
    message?: string;
};

class Validator {
    input: { [key: string]: string };
    rules: Rules;
    store: TCoreStores;
    errors: Error;
    error_count: number;

    constructor(input: { [key: string]: any }, rules: Rules, store: TCoreStores) {
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
    addFailure(attribute: string, rule: Rule, error_message?: string): void {
        let message = error_message || rule.options.message || getPreBuildDVRs()[rule.name].message();
        if (rule.name === 'length') {
            message = template(message, [
                rule.options.min === rule.options.max ? rule.options.min : `${rule.options.min}-${rule.options.max}`,
            ]);
        } else if (rule.name === 'min') {
            message = template(message, [rule.options.min]);
        } else if (rule.name === 'not_equal') {
            message = template(message, [rule.options.name1, rule.options.name2]);
        }
        this.errors.add(attribute, message);
        this.error_count++;
    }

    /**
     * Runs validator
     *
     * @return {boolean} Whether it passes; true = passes, false = fails
     */
    check(): boolean {
        Object.keys(this.input).forEach((attribute: string) => {
            if (!Object.prototype.hasOwnProperty.call(this.rules, attribute)) {
                return;
            }

            this.rules[attribute].forEach((rule: Rule) => {
                const ruleObject = Validator.getRuleObject(rule as unknown as TRuleString);

                if (!ruleObject.validator || typeof ruleObject.validator !== 'function') {
                    return;
                }

                if (ruleObject.options.condition && !ruleObject.options.condition(this.store)) {
                    return;
                }

                if (this.input[attribute] === '' && ruleObject.name !== 'req') {
                    return;
                }

                let is_valid: boolean;
                let error_message = '';
                if (ruleObject.name === 'number') {
                    const { is_ok, message } = ruleObject.validator(
                        this.input[attribute],
                        ruleObject.options,
                        this.store,
                        this.input
                    ) as unknown as ValidationResult;
                    is_valid = is_ok;
                    error_message = message || '';
                } else {
                    is_valid = ruleObject.validator(this.input[attribute], ruleObject.options, this.store, this.input);
                }

                if (!is_valid) {
                    this.addFailure(attribute, ruleObject, error_message);
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
    isPassed(): boolean {
        return this.check();
    }

    /**
     * Converts the rule array to an object
     *
     * @param {array} rule
     * @return {object}
     */
    static getRuleObject(rule: TRuleString): RuleObject {
        const is_rule_string = typeof rule === 'string';
        const rule_object: RuleObject = {
            name: is_rule_string ? rule : rule[0],
            options: is_rule_string ? {} : rule[1] || {},
        };

        rule_object.validator = rule_object.name === 'custom' ? rule[1].func : getPreBuildDVRs()[rule_object.name].func;

        return rule_object;
    }
}

export default Validator;
