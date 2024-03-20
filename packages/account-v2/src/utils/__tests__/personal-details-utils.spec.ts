import { getPersonalDetailsValidationSchema } from '../personal-details-utils';

describe('Personal Details Validation Schema', () => {
    let validationSchema: ReturnType<typeof getPersonalDetailsValidationSchema>;

    beforeAll(() => {
        validationSchema = getPersonalDetailsValidationSchema(false);
    });

    it('should validate a valid set of personal details for non-eu clients', async () => {
        const validData = {
            addressCity: 'Kuala Lumpur',
            addressLine1: 'Cyberjaya',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '0123456789',
        };

        await expect(validationSchema.validate(validData)).resolves.toBe(validData);
        expect(validationSchema.fields).not.toHaveProperty('employmentStatus');
        expect(validationSchema.fields).not.toHaveProperty('taxIdentificationNumber');
        expect(validationSchema.fields).not.toHaveProperty('taxResidence');
    });

    it('should throw error for invalid data', async () => {
        const invalidData = {
            addressCity: '',
            addressLine1: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
        };

        await expect(validationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should validate a valid set of personal details for eu clients', async () => {
        validationSchema = getPersonalDetailsValidationSchema(true);

        const validData = {
            addressCity: 'Kuala Lumpur',
            addressLine1: 'Cyberjaya',
            employmentStatus: 'Manager',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '0123456789',
        };

        await expect(validationSchema.validate(validData)).resolves.toBe(validData);
        expect(validationSchema.fields).toHaveProperty('employmentStatus');
        expect(validationSchema.fields).toHaveProperty('taxIdentificationNumber');
        expect(validationSchema.fields).toHaveProperty('taxResidence');
    });
});
