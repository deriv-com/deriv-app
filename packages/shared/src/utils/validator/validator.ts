import { getPreBuildDVRs, TRuleOptions } from '../validation/declarative-validation-rules';
import Errors from './errors';

type TRule<T extends object> = string | Array<string | TRuleOptions<T>>;

export const template = (string: string, content: string | Array<string>) => {
    let to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, (s, index) => to_replace[+index - 1]);
};

class Validator<T extends object, S extends object> {
    input: Pick<S, keyof S>;
    rules: T;
    store: S;
    errors: Errors;
    error_count: number;

    constructor(input: Pick<S, keyof S>, rules: T, store: S) {
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
    addFailure(attribute: string, rule: { name: string; options: TRuleOptions<S> }, error_message?: string) {
        let message =
            error_message ||
            rule.options.message ||
            (getPreBuildDVRs() as unknown as { [key: string]: { message: () => string } })[rule.name].message();
        if (rule.name === 'length') {
            message = template(message, [
                rule.options.min === rule.options.max
                    ? rule.options.min?.toString() ?? ''
                    : `${rule.options.min}-${rule.options.max}`,
            ]);
        } else if (rule.name === 'min') {
            message = template(message, [rule.options.min?.toString() ?? '']);
        } else if (rule.name === 'not_equal') {
            message = template(message, [rule.options.name1 ?? '', rule.options.name2 ?? '']);
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

            (this.rules as { [key: string]: Array<TRule<S>> })[attribute].forEach((rule: TRule<S>) => {
                const ruleObject = Validator.getRuleObject<S>(rule);

                if (!ruleObject.validator && typeof ruleObject.validator !== 'function') {
                    return;
                }

                if (ruleObject.options.condition && !ruleObject.options.condition(this.store)) {
                    return;
                }

                if (this.input[attribute as keyof S] === '' && ruleObject.name !== 'req') {
                    return;
                }

                const result = ruleObject.validator(
                    this.input[attribute as keyof S] as string,
                    ruleObject.options,
                    this.store,
                    this.input
                );
                if (typeof result === 'boolean' && !result) {
                    this.addFailure(attribute, ruleObject);
                } else if (typeof result === 'object') {
                    const { is_ok, message } = result;
                    if (!is_ok) {
                        this.addFailure(attribute, ruleObject, message);
                    }
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
    static getRuleObject<S extends object>(rule: TRule<S>) {
        const is_rule_string = typeof rule === 'string';
        const rule_object_name = (is_rule_string ? rule : rule[0]) as string;
        const rule_object_options = (is_rule_string ? {} : rule[1] || {}) as TRuleOptions<S>;
        return {
            name: rule_object_name,
            options: rule_object_options,
            validator:
                rule_object_name === 'custom'
                    ? rule_object_options.func
                    : (
                          getPreBuildDVRs() as {
                              [key: string]: {
                                  func: TRuleOptions<S>['func'];
                              };
                          }
                      )[rule_object_name].func,
        };
    }
}

export default Validator;
