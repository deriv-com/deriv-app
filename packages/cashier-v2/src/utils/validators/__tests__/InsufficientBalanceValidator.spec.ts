import { insufficientBalanceValidator } from '../validators';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

describe('insufficientBalanceValidator', () => {
    const context = {
        createError: ({ message }: { message: string }) => message,
    };

    it('should return an error if the value is more than balance', () => {
        const values = ['10', '20', '30'];
        const balance = 5;

        values.forEach(value => {
            const result = insufficientBalanceValidator(
                value,
                context as unknown as Yup.TestContext<AnyObject>,
                balance
            );
            expect(result).toBe('Insufficient balance.');
        });
    });

    it('should not return an error if the value is less or equal to balance', () => {
        const values = ['1', '2', '5'];
        const balance = 5;

        values.forEach(value => {
            const result = insufficientBalanceValidator(
                value,
                context as unknown as Yup.TestContext<AnyObject>,
                balance
            );
            expect(result).toBe(true);
        });
    });
});
