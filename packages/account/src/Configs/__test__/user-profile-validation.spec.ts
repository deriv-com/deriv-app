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

    it('should throw an error if first name is invalid', () => {
        const { first_name } = getPersonalDetailsBaseValidationSchema('svg').fields;

        expect(first_name.validate('John')).resolves.toBe('John');
        expect(first_name.validate('')).rejects.toThrow('First name is required.');
        expect(first_name.validate('A')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        expect(first_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')).rejects.toThrow(
            'Enter no more than 50 characters.'
        );
    });

    it('should throw an error if last name is invalid', () => {
        const { last_name } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        expect(last_name.validate('Doe')).resolves.toBe('Doe');
        expect(last_name.validate('')).rejects.toThrow('Last name is required.');
        expect(last_name.validate('A')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        expect(last_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')).rejects.toThrow(
            'Enter no more than 50 characters.'
        );
    });

    it('should throw an error if date of birth is invalid', () => {
        const { date_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        expect(date_of_birth.validate('1990-01-01')).resolves.toBe('1990-01-01');
        expect(date_of_birth.validate('')).rejects.toThrow('Date of birth is required.');
        expect(date_of_birth.validate('2021-01-01')).rejects.toThrow('You must be 18 years old and above.');
    });

    it('should throw an error if phone number is invalid', () => {
        const { phone } = getPersonalDetailsBaseValidationSchema('svg').fields;

        expect(phone.validate('+1234567890')).resolves.toBe('+1234567890');
        expect(phone.validate('')).rejects.toThrow('Phone is required.');
        expect(phone.validate('1234567890')).rejects.toThrow('Please enter a valid phone number (e.g. +15417541234).');
        expect(phone.validate('1234567890'.repeat(4))).rejects.toThrow('You should enter 9-35 characters.');
    });

    it('should throw an error if place of birth is invalid', () => {
        const { place_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        expect(place_of_birth.validate('Germany')).resolves.toBe('Germany');
        expect(place_of_birth.validate('')).rejects.toThrow('Place of birth is required.');
    });

    it('should throw an error if account opening reason is invalid', () => {
        const { account_opening_reason } = getPersonalDetailsBaseValidationSchema('svg').fields;

        expect(account_opening_reason.validate('Investment')).resolves.toBe('Investment');
        expect(account_opening_reason.validate('')).rejects.toThrow('Intended use of account is required.');
    });

    it('should throw an error if citizen is invalid', () => {
        const { citizen } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        expect(citizen.validate('Germany')).resolves.toBe('Germany');
        expect(citizen.validate('')).rejects.toThrow('Citizenship is required.');
    });
});
