import { descriptionValidator } from '../validators';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';

describe('descriptionValidator', () => {
    const context = {
        createError: ({ message }: { message: string }) => message,
    };

    it('should return an error if the value is not valid', () => {
        const values = ['Hello!', 'Hello?', 'Hello@', 'Hello~', 'Hello/'];

        values.forEach(value => {
            const result = descriptionValidator(value, context as unknown as Yup.TestContext<AnyObject>);
            expect(result).toBe('Please enter a valid description.');
        });
    });

    it('should not return an error if the value is valid', () => {
        const values = ['Hello.', 'Hello,', 'Hello-', "Hello'", 'Hello'];

        values.forEach(value => {
            const result = descriptionValidator(value, context as unknown as Yup.TestContext<AnyObject>);
            expect(result).toBe(true);
        });
    });
});
