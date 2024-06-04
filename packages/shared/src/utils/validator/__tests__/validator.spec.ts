import { TFormErrorMessagesTypes } from '../../validation/form-error-messages-types';
import { initFormErrorMessages } from '../../validation';
import Validator, { template } from '../validator';

describe('validator.ts', () => {
    const amount_required_error = 'Amount is a required field.';
    const should_be_valid_number_error = 'Should be a valid number.';
    const only_99_characters_error = 'Only 99 characters, please.';
    const min_value_error = 'The value must be equal or greater than 1';

    beforeAll(() => {
        initFormErrorMessages({ number: () => should_be_valid_number_error } as TFormErrorMessagesTypes);
    });

    describe('template', () => {
        it('should return a string where variables in brackets are replaced with respective items from content array', () => {
            expect(template('abc [_1] abc', ['2'])).toBe('abc 2 abc');
            expect(template('[_1] [_2]', ['1', '2'])).toBe('1 2');
            expect(template('[_1] [_1]', ['1'])).toBe('1 1');
        });
        it('should replace variables in brackets with items from content array only once, not twice', () => {
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).toBe('[_2] abc');
        });
        it('should replace the 1st variable with provided content if content is a string instead of an array', () => {
            expect(template('[_1]', 'abc')).toBe('abc');
            expect(template('[_1] [_2]', 'abc')).toBe('abc undefined');
        });
        it('should replace the variable in brackets with undefined if content is not provided', () => {
            expect(template('[_1]', '')).toBe('undefined');
        });
    });

    describe('Validator', () => {
        const store = {
            is_vanilla: false,
            amount: 10,
            barrier_1: '+1.16',
            barrier_2: '',
            barrier_count: 1,
            contract_start_type: 'spot',
            currency: 'USD',
            expiry_date: '2023-12-20',
            expiry_time: '20:05',
            form_components: ['duration', 'amount', 'barrier'],
            has_stop_loss: false,
            has_take_profit: false,
            sessions: [],
            start_date: 0,
            start_time: null,
            stop_loss: '10',
            take_profit: '32',
        };
        const amount_rule_options = { min: 0, type: 'float' };
        const amount_validation_rules = {
            amount: [
                ['req', { message: amount_required_error }],
                ['number', amount_rule_options],
            ],
        };

        it('should pass amount validation', () => {
            const inputs = {
                amount: 10,
            } as Pick<typeof store, keyof typeof store>;
            const validator = new Validator(inputs, amount_validation_rules, store);
            expect(validator.input).toMatchObject(inputs);
            expect(validator.rules).toMatchObject(amount_validation_rules);
            expect(validator.errors).toMatchObject({});
            expect(validator.error_count).toBe(0);
            const addFailure = jest.spyOn(validator, 'addFailure');
            const check = jest.spyOn(validator, 'check');
            expect(validator.isPassed()).toBe(true);
            expect(check).toHaveBeenCalled();
            expect(addFailure).not.toHaveBeenCalled();
        });
        it('should fail amount validation with an error from amount rules', () => {
            const inputs = { amount: '' } as Pick<typeof store, keyof typeof store> & { amount: string };
            const validator = new Validator(inputs, amount_validation_rules, store);
            const addFailure = jest.spyOn(validator, 'addFailure');
            const check = jest.spyOn(validator, 'check');
            expect(validator.isPassed()).toBe(false);
            expect(check).toHaveBeenCalled();
            expect(addFailure).toHaveBeenCalledWith(
                'amount',
                expect.objectContaining({
                    name: 'req',
                    options: {
                        message: amount_required_error,
                    },
                })
            );
            expect(validator.errors).toMatchObject({
                errors: {
                    amount: [amount_required_error],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('should fail number validation with an invalid number error', () => {
            const inputs = { amount: NaN } as Pick<typeof store, keyof typeof store>;
            const validator = new Validator(inputs, amount_validation_rules, store);
            const addFailure = jest.spyOn(validator, 'addFailure');
            const check = jest.spyOn(validator, 'check');
            expect(validator.isPassed()).toBe(false);
            expect(check).toHaveBeenCalled();
            expect(addFailure).toHaveBeenCalledWith(
                'amount',
                expect.objectContaining({ name: 'number', options: amount_rule_options }),
                should_be_valid_number_error
            );
            expect(validator.errors).toMatchObject({
                errors: {
                    amount: [should_be_valid_number_error],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('should fail length validation with 99 chars limit error', () => {
            const options = { message: only_99_characters_error, max: 99 };
            const address_city_rules = {
                address_city: [['length', options]],
            };
            const validator = new Validator(
                {
                    address_city:
                        'Krung Thep Mahanakhon Amon Rattanakosin Mahinthara Yuthaya Mahadilok Phop Noppharat Ratchathani Burirom Udomratchaniwet Mahasathan Amon Piman Awatan Sathit Sakkathattiya Witsanukam Prasit',
                },
                address_city_rules,
                { address_city: '' }
            );
            const addFailure = jest.spyOn(validator, 'addFailure');
            const check = jest.spyOn(validator, 'check');
            expect(validator.isPassed()).toBe(false);
            expect(check).toHaveBeenCalled();
            expect(addFailure).toHaveBeenCalledWith(
                'address_city',
                expect.objectContaining({ name: 'length', options })
            );
            expect(validator.errors).toMatchObject({
                errors: {
                    address_city: [only_99_characters_error],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('should fail min value validation', () => {
            const options = { message: min_value_error, min: 1 };
            const size_rules = {
                size: [['min', options]],
            };
            const validator = new Validator({ size: 0 }, size_rules, { size: 10 });
            validator.addFailure('size', { name: 'min', options });
            expect(validator.errors).toMatchObject({
                errors: {
                    size: [min_value_error],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('getRuleObject should return an object', () => {
            const rule_object = Validator.getRuleObject(amount_validation_rules.amount[0]);
            expect(rule_object).toHaveProperty('name', 'req');
            expect(rule_object).toHaveProperty('options', {
                message: amount_required_error,
            });
            expect(rule_object).toHaveProperty('validator');
        });
    });
});
