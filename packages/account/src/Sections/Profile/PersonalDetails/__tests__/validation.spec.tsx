import { ResidenceList } from '@deriv/api-types';
import { getPersonalDetailsInitialValues, getPersonalDetailsValidationSchema } from '../validation';

describe('getPersonalDetailsValidationSchema', () => {
    const valid_data = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+123456789',
        address_line_1: 'Kuala Lumpur',
        address_city: 'Kuala Lumpur',
        citizen: 'Malaysian',
        tax_identification_number: '123123123',
        tax_residence: 'Germany',
        employment_status: 'Employed',
    };
    const invalid_data = {
        first_name: 'John',
        last_name: 'Doe123',
        phone: 'wrong',
        address_line_1: '',
        address_city: '',
        citizen: '',
    };
    const non_eu = false;
    const is_eu = true;

    const mock_residence_list = [] as ResidenceList;

    it('should validate a valid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(mock_residence_list, non_eu);
        const isValid = await validationSchema.isValid(valid_data);
        expect(isValid).toBe(true);
    });

    it('should not validate an invalid input for non-eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(mock_residence_list, non_eu);
        try {
            await validationSchema.isValid(invalid_data);
        } catch (error) {
            // @ts-expect-error [TODO]: Fix type for error
            expect(error.errors.length).toBeGreaterThan(0);
        }
    });

    it('should validate a valid input for eu users', async () => {
        const validationSchema = getPersonalDetailsValidationSchema(mock_residence_list, is_eu);
        const isValid = await validationSchema.isValid(valid_data);
        expect(isValid).toBe(true);
    });
});

describe('getPersonalDetailsInitialValues', () => {
    it('should return correct initial values', () => {
        const account_settings = {
            first_name: 'John',
            last_name: 'Doe',
            place_of_birth: 'US',
            address_state: 'state_test',
        };
        const mock_residence_list = [
            { value: 'UK', text: 'United Kingdom' },
            { value: 'US', text: 'United States' },
        ];
        const mock_state_list = [
            {
                text: 'State Test',
                value: 'state_test',
            },
        ];

        const initial_values = getPersonalDetailsInitialValues(account_settings, mock_residence_list, mock_state_list);

        expect(initial_values.first_name).toBe('John');
        expect(initial_values.last_name).toBe('Doe');
        expect(initial_values.place_of_birth).toBe('United States');
        expect(initial_values.address_state).toBe('State Test');
    });
});
