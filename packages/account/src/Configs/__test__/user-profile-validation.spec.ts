import * as Yup from 'yup';
import { getPersonalDetailsBaseValidationSchema } from '../user-profile-validation-config';

describe('getPersonalDetailsBaseValidationSchema', () => {
    let validation_schema: ReturnType<typeof getPersonalDetailsBaseValidationSchema>;

    it('should validate a valid set of personal details for non-eu clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('svg');
        const valid_values = {
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should validate a valid set of personal details for eu clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('maltainvest');
        const valid_values = {
            salutation: 'Mr',
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
            citizen: 'Germany',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should throw an error if salutation is not provided for maltainvest clients', () => {
        validation_schema = getPersonalDetailsBaseValidationSchema('maltainvest');
        const invalid_values = {
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            account_opening_reason: 'Investment',
            date_of_birth: '1990-01-01',
            place_of_birth: 'Germany',
            citizen: 'Germany',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Salutation is required.');
        }
    });

    it('should throw an error if first name is invalid', async () => {
        const { first_name } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(first_name.validate('John')).resolves.toBe('John');
        await expect(first_name.validate('')).rejects.toThrow('First name is required.');
        await expect(first_name.validate('A')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            first_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });

    it('should throw an error if last name is invalid', async () => {
        const { last_name } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        await expect(last_name.validate('Doe')).resolves.toBe('Doe');
        await expect(last_name.validate('')).rejects.toThrow('Last name is required.');
        await expect(last_name.validate('A')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            last_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });
});
