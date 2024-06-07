import { ValidationConstants } from '@deriv-com/utils';
import { addressDetailValidations } from '../validations';

describe('validations', () => {
    const maxCharsMessage = 'Only 70 characters, please.';
    const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

    it('validates addressLine1 correctly without svg flag', async () => {
        const { addressLine1 } = addressDetailValidations('id', false);

        await expect(addressLine1.validate('123 Main St')).resolves.toBe('123 Main St');
        await expect(addressLine1.validate('')).rejects.toThrow('First line of address is required');
        await expect(addressLine1.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(addressLine1.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(addressLine1.validate('P.O. Box 121')).resolves.toBe('P.O. Box 121');
    });

    it('validates addressLine1 correctly with svg flag', async () => {
        const { addressLine1 } = addressDetailValidations('id', true);

        await expect(addressLine1.validate('123 Main St1')).resolves.toBe('123 Main St1');
        await expect(addressLine1.validate('')).rejects.toThrow('First line of address is required');
        await expect(addressLine1.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(addressLine1.validate('P.O. Box 123')).rejects.toThrow('P.O. Box is not accepted in address');
    });

    it('validates addressLine2 correctly', async () => {
        const { addressLine2 } = addressDetailValidations('id', false);

        await expect(addressLine2.validate('Apt 4B')).resolves.toBe('Apt 4B');
        await expect(addressLine2.validate('a$^&')).rejects.toThrow(
            `Use only the following special characters: ${addressPermittedSpecialCharacters}`
        );
        await expect(addressLine2.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(addressLine2.validate('P.O. Box 120')).resolves.toBe('P.O. Box 120');
    });

    it('validates addressLine2 correctly with svg flag', async () => {
        const { addressLine2 } = addressDetailValidations('id', true);

        await expect(addressLine2.validate('Apt 4B')).resolves.toBe('Apt 4B');
        await expect(addressLine2.validate('a'.repeat(71))).rejects.toThrow(maxCharsMessage);
        await expect(addressLine2.validate('P.O. Box 122')).rejects.toThrow('P.O. Box is not accepted in address');
    });

    it('validates addressPostcode correctly with country id', async () => {
        const { addressPostcode } = addressDetailValidations('id', false);
        await expect(addressPostcode.validate('12345')).resolves.toBe('12345');
        await expect(addressPostcode.validate('$%&')).rejects.toThrow(
            'Only letters, numbers, space and hyphen are allowed.'
        );
        await expect(addressPostcode.validate('a'.repeat(21))).rejects.toThrow(
            'Please enter a postal/ZIP code under 20 characters.'
        );
        await expect(addressPostcode.validate('JE1 1AA')).resolves.toBe('JE1 1AA');
    });

    it('validates addressState correctly', async () => {
        const { addressState } = addressDetailValidations('id', false);

        await expect(addressState.validate('NY')).resolves.toBe('NY');
        await expect(addressState.validate('')).rejects.toThrow('State is required');
        await expect(addressState.validate('a'.repeat(102))).rejects.toThrow('State is not in a proper format');

        await expect(addressState.validate('%_ASD')).rejects.toThrow('State is not in a proper format');
    });

    it('validates addressCity correctly', async () => {
        const { addressCity } = addressDetailValidations('id', false);

        await expect(addressCity.validate('New York')).resolves.toBe('New York');
        await expect(addressCity.validate('')).rejects.toThrow('City is required');
        await expect(addressCity.validate('a'.repeat(102))).rejects.toThrow('Only 99 characters, please.');
        await expect(addressCity.validate('%_ASD')).rejects.toThrow(
            'Only letters, periods, hyphens, apostrophes, and spaces, please.'
        );
    });
});
