import { Errors, getPreBuildDVRs, template } from '@deriv/shared';

import { getValidationRules } from 'Stores/Modules/Trading/Constants/validation-rules';
import { TTradeStore } from 'Types';

type TOptions = {
    [key: string]: unknown;
    decimals?: string | number;
    is_required?: boolean;
    max?: number | string | null;
    min?: number | string | null;
    name1?: string;
    name2?: string;
    regex?: RegExp;
    type?: string;
};

type TInitPreBuildDVRs = ReturnType<typeof getValidationRules>;

export type TRuleOptions = {
    func?: <T extends string>(
        value: T,
        options?: TOptions,
        store?: TTradeStore,
        inputs?: Pick<TTradeStore, keyof TTradeStore>
    ) => boolean | { is_ok: boolean; message: string };
    condition?: (store: TTradeStore) => boolean;
    message?: string;
} & TOptions;

type TRule = string | Array<string | TRuleOptions>;

type TValidationResult = {
    is_ok: boolean;
    message: string;
};

class Validator {
    input: Pick<TTradeStore, keyof TTradeStore>;
    rules: Partial<TInitPreBuildDVRs>;
    store: TTradeStore;
    errors: Errors;
    error_count: number;

    constructor(input: Pick<TTradeStore, keyof TTradeStore>, rules: Partial<TInitPreBuildDVRs>, store: TTradeStore) {
        this.input = input;
        this.rules = rules;
        this.store = store;
        this.errors = new Errors();

        this.error_count = 0;
    }

    /**
     * Add failure and error message for given rule
     *
     * @param {string} attribute
     * @param {object} rule
     */
    addFailure(attribute: string, rule: { name: string; options: TRuleOptions }, error_message?: string) {
        let message =
            error_message ||
            rule.options.message ||
            (getPreBuildDVRs() as unknown as { [key: string]: { message: () => string } })[rule.name].message();
        if (rule.name === 'length') {
            message = template(message, [
                rule.options.min === rule.options.max
                    ? rule.options.min?.toString() || ''
                    : `${rule.options.min}-${rule.options.max}`,
            ]);
        } else if (rule.name === 'min') {
            message = template(message, [rule.options.min?.toString() || '']);
        } else if (rule.name === 'not_equal') {
            message = template(message, [rule.options.name1 || '', rule.options.name2 || '']);
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

            (this.rules as unknown as { [key: string]: Array<TRule> })[attribute].forEach((rule: TRule) => {
                const ruleObject = Validator.getRuleObject(rule);

                if (!ruleObject.validator && typeof ruleObject.validator !== 'function') {
                    return;
                }

                if (ruleObject.options.condition && !ruleObject.options.condition(this.store)) {
                    return;
                }

                if (this.input[attribute as keyof TTradeStore] === '' && ruleObject.name !== 'req') {
                    return;
                }

                let is_valid, error_message;
                if (ruleObject.name === 'number') {
                    const { is_ok, message } = ruleObject.validator(
                        this.input[attribute as keyof TTradeStore] as string,
                        ruleObject.options,
                        this.store,
                        this.input
                    ) as TValidationResult;
                    is_valid = is_ok;
                    error_message = message;
                } else {
                    is_valid = ruleObject.validator(
                        this.input[attribute as keyof TTradeStore] as string,
                        ruleObject.options,
                        this.store,
                        this.input
                    );
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
                rule_object_name === 'custom'
                    ? rule_object_options.func
                    : (
                          getPreBuildDVRs() as unknown as {
                              [key: string]: {
                                  func: TRuleOptions['func'];
                              };
                          }
                      )[rule_object_name].func,
        };
    }
}

export default Validator;
