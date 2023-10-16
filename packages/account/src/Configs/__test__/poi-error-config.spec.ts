import { generateIDVError } from '../poi-error-config';

describe('generateIDVError', () => {
    it('should return Name & DOB mismatch error config', () => {
        const error = generateIDVError(false, {}, { value: 'Country 1', text: 'Country 1' }, 'NameDobMismatch');
        expect(error.required_fields).toEqual(['first_name', 'last_name', 'date_of_birth']);
    });

    it('should return Name mismatch error config', () => {
        const error = generateIDVError(false, {}, { value: 'Country 1', text: 'Country 1' }, 'NameMismatch');
        expect(error.required_fields).toEqual(['first_name', 'last_name']);
    });

    it('should return DOB mismatch error config', () => {
        const error = generateIDVError(false, {}, { value: 'Country 1', text: 'Country 1' }, 'DobMismatch');
        expect(error.required_fields).toEqual(['date_of_birth']);
    });
});
