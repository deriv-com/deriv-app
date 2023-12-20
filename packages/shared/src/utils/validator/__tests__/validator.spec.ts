import { TFormErrorMessagesTypes } from '../../validation/form-error-messages-types';
import { initFormErrorMessages } from '../../validation';
import Validator, { template } from '../validator';

describe('validator', () => {
    beforeAll(() => {
        initFormErrorMessages({ number: () => 'Should be a valid number.' } as TFormErrorMessagesTypes);
    });
    describe('.template()', () => {
        it('should return a string where variables in brackets are replaced with respective items from content array', () => {
            expect(template('abc [_1] abc', ['2'])).toBe('abc 2 abc');
            expect(template('[_1] [_2]', ['1', '2'])).toBe('1 2');
            expect(template('[_1] [_1]', ['1'])).toBe('1 1');
        });
        it('should replace variables in brackets with items from content array only once, not twice', () => {
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).toBe('[_2] abc');
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).not.toBe('abc abc');
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
            initial_barriers: {
                barrier_1: '',
                barrier_2: '',
            },
            is_vanilla: false,
            amount: 10,
            barrier_1: '+1.16',
            barrier_2: '',
            barrier_count: 1,
            contract_start_type: 'spot',
            currency: 'USD',
            duration_min_max: {
                daily: {
                    min: 86400,
                    max: 31536000,
                },
                intraday: {
                    min: 15,
                    max: 86400,
                },
                tick: {
                    min: 5,
                    max: 10,
                },
            },
            duration_unit: 'm',
            duration_units_list: [
                {
                    text: 'Ticks',
                    value: 't',
                },
                {
                    text: 'Seconds',
                    value: 's',
                },
                {
                    text: 'Minutes',
                    value: 'm',
                },
                {
                    text: 'Hours',
                    value: 'h',
                },
                {
                    text: 'Days',
                    value: 'd',
                },
            ],
            duration: 15,
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
        const amount_validation_rules = {
            amount: [
                [
                    'req',
                    {
                        message: 'Amount is a required field.',
                    },
                ],
                [
                    'number',
                    {
                        min: 0,
                        type: 'float',
                    },
                ],
            ],
        };

        it('should pass validation', () => {
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
        it('should fail validation with an error from rules', () => {
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
                        message: 'Amount is a required field.',
                    },
                })
            );
            expect(validator.errors).toMatchObject({
                errors: {
                    amount: ['Amount is a required field.'],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('should fail validation with an incorrect number error', () => {
            const inputs = { amount: NaN } as Pick<typeof store, keyof typeof store>;
            const validator = new Validator(inputs, amount_validation_rules, store);
            const addFailure = jest.spyOn(validator, 'addFailure');
            const check = jest.spyOn(validator, 'check');
            expect(validator.isPassed()).toBe(false);
            expect(check).toHaveBeenCalled();
            expect(addFailure).toHaveBeenCalledWith(
                'amount',
                expect.objectContaining({
                    name: 'number',
                    options: {
                        min: 0,
                        type: 'float',
                    },
                }),
                'Should be a valid number.'
            );
            expect(validator.errors).toMatchObject({
                errors: {
                    amount: ['Should be a valid number.'],
                },
            });
            expect(validator.error_count).toBe(1);
        });
        it('getRuleObject should return an object', () => {
            const rule_object = Validator.getRuleObject(amount_validation_rules.amount[0]);
            expect(rule_object).toHaveProperty('name', 'req');
            expect(rule_object).toHaveProperty('options', {
                message: 'Amount is a required field.',
            });
            expect(rule_object).toHaveProperty('validator');
        });
    });
});
