import { getPersonalDetailsInitialValues, getPersonalDetailsValidationSchema } from '../validation';

describe('getPersonalDetailsValidationSchema', () => {
    const nonEuValidData = {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        addressCity: 'Kuala Lumpur',
        addressLine1: 'Kuala Lumpur',
        citizen: 'Malaysian',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+123456789',
    };
    const euValidData = {
        addressCity: 'Kuala Lumpur',
        addressLine1: 'Kuala Lumpur',
        citizen: 'Malaysian',
        employmentStatus: 'Employed',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+123456789',
        taxIdentificationNumber: '123123123',
        taxResidence: 'Germany',
    };
    const nonEuInvalidData = {
        addressCity: '',
        addressLine1: '',
        citizen: '',
        firstName: 'John',
        lastName: 'Doe123',
        phone: 'wrong',
    };
    const nonEu = false;
    const isEu = true;

    it('should validate a valid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(nonEu);
        const isValid = await validationSchema.isValid(nonEuValidData);
        expect(isValid).toBe(true);
    });

    it('should not validate an invalid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(nonEu);
        try {
            await validationSchema.isValid(nonEuInvalidData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            expect(error.errors.length).toBeGreaterThan(0);
        }
    });

    it('should validate a valid input for eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(isEu);
        const isValid = await validationSchema.isValid(euValidData);
        expect(isValid).toBe(true);
    });

    it('should not validate a non-eu input for eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(isEu);
        const isValid = await validationSchema.isValid(nonEuValidData);
        expect(isValid).toBe(false);
    });
});

describe('getPersonalDetailsInitialValues', () => {
    it('should return correct initial values', () => {
        const accountSettings = {
            address_state: 'state_test',
            first_name: 'John',
            last_name: 'Doe',
            place_of_birth: 'US',
        };
        const mockResidenceList = [
            { text: 'United Kingdom', value: 'UK' },
            { text: 'United States', value: 'US' },
        ];
        const mockStateList = [
            {
                text: 'State Test',
                value: 'state_test',
            },
        ];

        const initialValues = getPersonalDetailsInitialValues(accountSettings, mockResidenceList, mockStateList);

        expect(initialValues.firstName).toBe('John');
        expect(initialValues.lastName).toBe('Doe');
        expect(initialValues.placeOfBirth).toBe('United States');
        expect(initialValues.addressState).toBe('State Test');
    });
});
