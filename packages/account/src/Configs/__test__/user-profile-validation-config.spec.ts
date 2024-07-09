import { TinValidations } from '@deriv/api/types';
import * as Yup from 'yup';
import {
    getEmploymentAndTaxValidationSchema,
    getAddressDetailValidationSchema,
} from '../user-profile-validation-config';
import { ValidationConstants } from '@deriv-com/utils';

describe('getEmploymentAndTaxValidationSchema', () => {
    let validation_schema: ReturnType<typeof getEmploymentAndTaxValidationSchema>;

    const tin_config: TinValidations = {
        tin_employment_status_bypass: ['Student'],
        tin_format: ['^\\d{5}$'],
        is_tin_mandatory: false,
    };

    beforeAll(() => {
        validation_schema = getEmploymentAndTaxValidationSchema(tin_config);
    });

    it('should validate employment and tax details when valid values are provided', () => {
        const valid_values = {
            employment_status: 'Employed',
            tax_residence: 'Germany',
            confirm_no_tax_details: false,
            tax_identification_confirm: true,
            tax_identification_number: '12345',
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });

    it('should throw employment status required error when employment status is not provided', () => {
        const invalid_values = {
            tax_residence: 'Germany',
            confirm_no_tax_details: false,
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
            confirm_no_tax_details: false,
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
            confirm_no_tax_details: false,
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
            confirm_no_tax_details: false,
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
            confirm_no_tax_details: false,
            tax_identification_confirm: true,
            tax_identification_number: '-1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe(
                'Should start with letter or number and may contain a hyphen, period and slash.'
            );
        }
    });

    it('should ensure tax residence is provided when tax identification number is provided', () => {
        const invalid_values = {
            employment_status: 'Employed',
            tax_residence: '',
            confirm_no_tax_details: false,
            tax_identification_confirm: true,
            tax_identification_number: '1234',
        };

        try {
            validation_schema.validateSync(invalid_values);
        } catch (error: unknown) {
            expect((error as Yup.ValidationError).message).toBe('Please fill in tax residence.');
        }
    });

    it('should not validate tax details when confirm_no_tax_details is true', () => {
        const valid_values = {
            employment_status: 'Student',
            confirm_no_tax_details: true,
        };

        expect(validation_schema.isValidSync(valid_values)).toBeTruthy();
    });
});

describe('getAddressDetailValidationSchema', () => {
    const maxCharsMessage = 'Only 70 characters, please.';
    const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

    it('validates address_line_1 correctly without svg flag', async () => {
        const { address_line_1 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_1.validate('123 Main St')).resolves.toBe('123 Main St');
        await expect(address_line_1.validate('')).rejects.toThrow('First line of address is required');
        await expect(address_line_1.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_1.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(address_line_1.validate('P.O. Box 121')).resolves.toBe('P.O. Box 121');
    });

    it("PO box shouldn't exist for SVG ", async () => {
        const { address_line_1 } = getAddressDetailValidationSchema(true).fields;
        await expect(address_line_1.validate('P.O. Box 123')).rejects.toThrow('P.O. Box is not accepted in address');
    });

    it('validates address_line_2 correctly', async () => {
        const { address_line_2 } = getAddressDetailValidationSchema(false).fields;

        await expect(address_line_2.validate('Apt 4B')).resolves.toBe('Apt 4B');
        await expect(address_line_2.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(address_line_2.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(address_line_2.validate('P.O. Box 120')).resolves.toBe('P.O. Box 120');
    });

    it('validates address_line_2 correctly with svg flag', async () => {
        const { address_line_2 } = getAddressDetailValidationSchema(true).fields;

        await expect(address_line_2.validate('P.O. Box 122')).rejects.toThrow('P.O. Box is not accepted in address');
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

        await expect(address_state.validate('%_ASD')).rejects.toThrow('State is not in a proper format');
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
});
