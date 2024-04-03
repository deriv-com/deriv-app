import { betweenMinAndMaxValidator } from '../validators';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';
import type { TCurrency } from '../../../types';
import { FormatUtils } from '@deriv-com/utils';

describe('betweenMinAndMaxValidator', () => {
    const context = {
        createError: ({ message }: { message: string }) => message,
    };

    it('should return an error if the value is not valid', () => {
        const values = ['2', '9', '200'];
        const options = {
            currency: 'USD' as TCurrency,
            limits: {
                max: 20,
                min: 10,
            },
        };

        values.forEach(value => {
            const result = betweenMinAndMaxValidator(value, context as unknown as Yup.TestContext<AnyObject>, options);
            expect(result).toBe(
                `Should be between ${FormatUtils.formatMoney(options.limits.min, {
                    currency: options.currency,
                })} and ${FormatUtils.formatMoney(Number(options.limits.max), {
                    currency: options.currency,
                })}`
            );
        });
    });

    it('should not return an error if the value is valid', () => {
        const values = ['10', '15', '20'];
        const options = {
            currency: 'USD' as TCurrency,
            limits: {
                max: 20,
                min: 10,
            },
        };

        values.forEach(value => {
            const result = betweenMinAndMaxValidator(value, context as unknown as Yup.TestContext<AnyObject>, options);
            expect(result).toBe(true);
        });
    });
});
