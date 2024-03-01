import { numberValidator } from '../validators';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

describe('numberValidator', () => {
    const context = {
        createError: ({ message }: { message: string }) => message,
    };

    it('should return an error if the value is not valid', () => {
        const invalidValues = ['22.', '22,', '22,2', 'text', '-22', '!'];

        invalidValues.forEach(value => {
            const result = numberValidator(value, context as unknown as Yup.TestContext<AnyObject>);
            expect(result).toBe('Should be a valid number.');
        });
    });

    it('should not return an error if the value is valid', () => {
        const validValues = ['22', '22.22', '0'];

        validValues.forEach(value => {
            const result = numberValidator(value, context as unknown as Yup.TestContext<AnyObject>);
            expect(result).toBe(true);
        });
    });
});
