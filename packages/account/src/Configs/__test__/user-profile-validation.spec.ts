import * as Yup from 'yup';
import {
    getAddressDetailValidationSchema,
    getEmploymentAndTaxValidationSchema,
    getPersonalDetailsBaseValidationSchema,
} from '../user-profile-validation-config';
import { TinValidations } from '@deriv/api/types';
import { ValidationConstants } from '@deriv-com/utils';

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
            citizen: 'Germany',
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
        await expect(first_name.validate('A1')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            first_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });

    it('should throw an error if last name is invalid', async () => {
        const { last_name } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        await expect(last_name.validate('Doe')).resolves.toBe('Doe');
        await expect(last_name.validate('')).rejects.toThrow('Last name is required.');
        await expect(last_name.validate('A2')).rejects.toThrow('Letters, spaces, periods, hyphens, apostrophes only.');
        await expect(
            last_name.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKL')
        ).rejects.toThrow('Enter no more than 50 characters.');
    });

    it('should throw an error if date of birth is invalid', async () => {
        const { date_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(date_of_birth.validate('1990-01-01')).resolves.toBe('1990-01-01');
        await expect(date_of_birth.validate('')).rejects.toThrow('Date of birth is required.');
        await expect(date_of_birth.validate('2021-01-01')).rejects.toThrow('You must be 18 years old and above.');
    });

    it('should throw an error if phone number is invalid', async () => {
        const { phone } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(phone.validate('+1234567890')).resolves.toBe('+1234567890');
        await expect(phone.validate('')).rejects.toThrow('Phone is required.');
        await expect(phone.validate('1234567890')).rejects.toThrow(
            'Please enter a valid phone number (e.g. +15417541234).'
        );
        await expect(phone.validate('1234567890'.repeat(4))).rejects.toThrow('You should enter 9-20 numbers.');
    });

    it('should throw You should enter 5-15 numbers. error if phone number is invalid when isCountryCodeDropdownEnabled is true', async () => {
        const isCountryCodeDropdownEnabled = true;
        const { phone } = getPersonalDetailsBaseValidationSchema('svg', isCountryCodeDropdownEnabled).fields;

        await expect(phone.validate('12345')).resolves.toBe('12345');
        await expect(phone.validate('')).rejects.toThrow('Phone is required.');
        await expect(phone.validate('1234')).rejects.toThrow('You should enter 5-15 numbers.');
        await expect(phone.validate('1234567890'.repeat(4))).rejects.toThrow('You should enter 5-15 numbers.');
    });

    it('should throw an error if place of birth is invalid', async () => {
        const { place_of_birth } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(place_of_birth.validate('Germany')).resolves.toBe('Germany');
        await expect(place_of_birth.validate('')).rejects.toThrow('Place of birth is required.');
    });

    it('should throw an error if account opening reason is invalid', async () => {
        const { account_opening_reason } = getPersonalDetailsBaseValidationSchema('svg').fields;

        await expect(account_opening_reason.validate('Investment')).resolves.toBe('Investment');
        await expect(account_opening_reason.validate('')).rejects.toThrow('Account opening reason is required.');
    });

    it('should throw an error if citizen is invalid', async () => {
        const { citizen } = getPersonalDetailsBaseValidationSchema('maltainvest').fields;

        await expect(citizen.validate('Germany')).resolves.toBe('Germany');
        await expect(citizen.validate('')).rejects.toThrow('Citizenship is required.');
    });
});

describe('getEmploymentAndTaxValidationSchema', () => {
    let validation_schema: ReturnType<typeof getEmploymentAndTaxValidationSchema>;

    const tin_config: TinValidations = {
        tin_employment_status_bypass: ['Student'],
        tin_format: ['^\\d{5}$'],
        is_tin_mandatory: false,
    };

    beforeAll(() => {
        validation_schema = getEmploymentAndTaxValidationSchema({ tin_config });
    });

    it('should validate employment and tax details when valid values are provided', () => {
        const valid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should throw employment status required error when employment status is not provided', () => {
        const invalid_values = {
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(Yup.ValidationError);
            expect((error as Yup.ValidationError).message).toBe('Employment status is required.');
        }
    });

    it('should ensure tax details are confirmed when tax identification number and tax residence is provided', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: false,
            tax_identification_number: '12345',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(Yup.ValidationError);
            expect((error as Yup.ValidationError).message).toBe(
                'tax_identification_confirm must be one of the following values: true'
            );
        }
    });

    it('should ensure tax identification number is not longer than 25 characters', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '12345678901234567890123456',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe(
                "Tax identification number can't be longer than 25 characters."
            );
        }
    });

    it('should ensure tax identification number is properly formatted', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Tax identification number is not properly formatted.');
        }
    });

    it('should ensure tax identification number starts with a letter or number', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '-1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Tax identification number is not properly formatted.');
        }
    });

    it('should ensure tax residence is provided when tax identification number is provided', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: '',
            tin_skipped: 0,
            tax_identification_confirm: true,
            tax_identification_number: '1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Please fill in tax residence.');
        }
    });

    it('should not validate tax details when tin_skipped is true', () => {
        const valid_values = {
            employment_status: 'Student',
            tin_skipped: 1,
            tax_residence: 'Germany',
        };
        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });
});

describe('getAddressDetailValidationSchema', () => {
    const maxCharsMessage = 'Only 70 characters, please.';
    const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

    const poBoxAddresses = [
        // English variations
        'P.O. Box 121',
        'P O Box 456',
        'PO Box 789',
        'PBox 123',
        'PBag 456',
        'Private Bag 789',
        'Post Office Box 321',

        // Spanish variations
        'Apartado Postal 123',
        'Casilla Postal 456',
        'Casilla de Correo 789',

        // Portuguese variations
        'Caixa Postal 123',
        'Caixa de Correio 456',
        'Cx Postal 789',

        // French
        'Boîte Postale 123',
        'Boite Postale 456',
        'B.P. 789',
        'B P 321',
        'BP 654',

        // German
        'Postfach 123',
        'POSTFACH 456',

        // Italian
        'Casella Postale 123',
        'C.P. 456',
        'C P 789',
        'CP 321',

        // Dutch
        'Postbus 123',
        'POSTBUS 456',

        // Russian
        'Абонентский ящик 123',
        'абонентский ящик 456',
        'А/Я 789',
        'а/я 321',
        'А Я 654',
        'а я 987',

        // Polish
        'Skrytka pocztowa 123',

        // Swedish
        'Postbox 123',

        // Japanese
        '私書箱 123',
        '私書箱123',

        // Chinese
        '邮政信箱 456',
        '邮政信箱456',
    ];

    it('validates address_line_1 correctly without svg flag', async () => {
        const { address_line_1 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_1.validate('123 Main St')).resolves.toBe('123 Main St');
        await expect(address_line_1.validate('')).rejects.toThrow('First line of address is required');
        await expect(address_line_1.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_1.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
    });

    it('rejects P.O. Box addresses in all supported languages when SVG flag is false', async () => {
        const { address_line_1, address_line_2 } = getAddressDetailValidationSchema(false).fields;

        await Promise.all(
            poBoxAddresses.map(address =>
                expect(address_line_1.validate(address)).rejects.toThrow('P.O. Box is not accepted in address')
            )
        );
        await Promise.all(
            poBoxAddresses.map(address =>
                expect(address_line_2.validate(address)).rejects.toThrow('P.O. Box is not accepted in address')
            )
        );
    });

    it('allows P.O. Box addresses in all supported languages when SVG flag is true', async () => {
        const { address_line_1, address_line_2 } = getAddressDetailValidationSchema(true).fields;

        await Promise.all(
            poBoxAddresses.map(address => expect(address_line_1.validate(address)).resolves.toBe(address))
        );
        await Promise.all(
            poBoxAddresses.map(address => expect(address_line_2.validate(address)).resolves.toBe(address))
        );
    });

    it('validates address_line_2 correctly', async () => {
        const { address_line_2 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_2.validate('Apt 4B')).resolves.toBe('Apt 4B');
        await expect(address_line_2.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_2.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
    });

    it('validates address_postcode correctly with country id', async () => {
        const { address_postcode } = getAddressDetailValidationSchema(false).fields;
        await expect(address_postcode.validate('12345')).resolves.toBe('12345');
        await expect(address_postcode.validate('$%&')).rejects.toThrow(
            'Only letters, numbers, space and hyphen are allowed.'
        );
        await expect(address_postcode.validate('a'.repeat(21))).rejects.toThrow(
            'Please enter a postal/ZIP code under 20 characters.'
        );
        await expect(address_postcode.validate('JE1 1AA')).resolves.toBe('JE1 1AA');
    });

    it('validates address_state correctly', async () => {
        const { address_state } = getAddressDetailValidationSchema(false).fields;

        await expect(address_state.validate('NY')).resolves.toBe('NY');
        await expect(address_state.validate('a'.repeat(102))).rejects.toThrow('State is not in a proper format');

        await expect(address_state.validate('%_ASD')).resolves.toBe('%_ASD');
    });

    it('validates address_city correctly', async () => {
        const { address_city } = getAddressDetailValidationSchema(false).fields;

        await expect(address_city.validate('New York')).resolves.toBe('New York');
        await expect(address_city.validate('')).rejects.toThrow('City is required');
        await expect(address_city.validate('a'.repeat(102))).rejects.toThrow('Only 99 characters, please.');
        await expect(address_city.validate('%_ASD')).rejects.toThrow(
            'Only letters, periods, hyphens, apostrophes, and spaces, please.'
        );
    });

    it('validates address_state with special characters', async () => {
        const { address_state } = getAddressDetailValidationSchema(false).fields;
        await expect(address_state.validate('Z̧ufār')).resolves.toBe('Z̧ufār');
    });
});
