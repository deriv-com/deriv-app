import { EMPLOYMENT_VALUES } from '@deriv/shared';
import { getFormattedOccupationList, getOccupationList } from '../financial-details-config';

describe('getFormattedOccupationList', () => {
    const occupation_list = getOccupationList();

    it('should return all Occupations when Employment status is Unemployed', () => {
        const employment_status = EMPLOYMENT_VALUES.UNEMPLOYED;
        expect(getFormattedOccupationList(employment_status)).toHaveLength(occupation_list.length);
    });

    it('should not return Unemployed as Occupations when Employment status is Self-Employed', () => {
        const employment_status = EMPLOYMENT_VALUES.SELF_EMPLOYED;
        const formatted_list = getFormattedOccupationList(employment_status);

        expect(formatted_list).toHaveLength(occupation_list.length - 1);

        expect(formatted_list).not.toContain(occupation_list.find(item => item.value === EMPLOYMENT_VALUES.UNEMPLOYED));
    });

    it('should not return Unemployed as Occupations when Employment status is Employed', () => {
        const employment_status = EMPLOYMENT_VALUES.EMPLOYED;
        const formatted_list = getFormattedOccupationList(employment_status);

        expect(formatted_list).toHaveLength(occupation_list.length - 1);

        expect(formatted_list).not.toContain(occupation_list.find(item => item.value === EMPLOYMENT_VALUES.UNEMPLOYED));
    });
});
