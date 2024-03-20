import { getPersonalDetailsInitialValues } from '../utils';

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
