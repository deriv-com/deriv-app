import { EMPLOYMENT_VALUES } from '../../constants';
import { shouldHideOccupationField } from '../form-validations';

describe('shouldHideOccupationField', () => {
    it('should return false when employment_status is "Employed"', () => {
        expect(shouldHideOccupationField(EMPLOYMENT_VALUES.EMPLOYED)).toBeFalsy();
    });

    it('should return true when employment_status is "Unemployed"', () => {
        expect(shouldHideOccupationField(EMPLOYMENT_VALUES.UNEMPLOYED)).toBeTruthy();
    });

    it('should return true when employment_status is "Self employed"', () => {
        expect(shouldHideOccupationField(EMPLOYMENT_VALUES.SELF_EMPLOYED)).toBeFalsy();
    });

    it('should return false when employment_status is empty sting', () => {
        expect(shouldHideOccupationField('')).toBeFalsy();
    });
});
