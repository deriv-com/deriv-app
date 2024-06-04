import { decimalsValidator } from '../validators';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

describe('decimalsValidator', () => {
    const context = {
        createError: ({ message }: { message: string }) => message,
    };

    it('should return an error if the value is not valid', () => {
        const values = ['22.222', '22.2222'];
        const fractionalDigits = 2;

        values.forEach(value => {
            const result = decimalsValidator(value, context as unknown as Yup.TestContext<AnyObject>, fractionalDigits);
            expect(result).toBe(`Up to ${fractionalDigits} decimal places are allowed.`);
        });
    });

    it('should not return an error if the value is valid', () => {
        const values = ['11.11', '22.22'];
        const fractionalDigits = 2;

        values.forEach(value => {
            const result = decimalsValidator(value, context as unknown as Yup.TestContext<AnyObject>, fractionalDigits);
            expect(result).toBe(true);
        });
    });
});
